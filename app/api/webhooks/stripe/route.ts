import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"
import { parseOrderItems } from "@/lib/book-orders"
import { notificationEmail } from "@/lib/contact"
import { deliverSessionEbooks } from "@/lib/ebook-delivery"
import { getCheckoutStripe } from "@/lib/stripe-server"

export async function POST(req: NextRequest) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    const resendApiKey = process.env.RESEND_API_KEY
    if (!webhookSecret || !resendApiKey) {
        console.error("Order webhook is missing required configuration", {
            hasWebhookSecret: Boolean(webhookSecret),
            hasResendApiKey: Boolean(resendApiKey),
        })
        return NextResponse.json(
            { error: "Webhook is not configured" },
            { status: 500 },
        )
    }

    const stripe = getCheckoutStripe()
    const body = await req.text()
    const sig = req.headers.get("stripe-signature")
    if (!sig) {
        return NextResponse.json(
            { error: "Missing signature" },
            { status: 400 },
        )
    }

    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch {
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 },
        )
    }

    if (event.type === "payment_intent.payment_failed") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const orderItems = parseOrderItems(paymentIntent.metadata)
        const paymentError = paymentIntent.last_payment_error
        const resend = new Resend(resendApiKey)
        const dashboardUrl = `https://dashboard.stripe.com/${paymentIntent.livemode ? "" : "test/"}payments/${paymentIntent.id}`
        const { error } = await resend.emails.send(
            {
                from: "Gibson Murray <orders@gibsonmurray.com>",
                to: notificationEmail,
                subject: `Payment failed${orderItems.length > 0 ? ` — ${orderItems.map((item) => item.bookId).join(", ")}` : ""}`,
                text: [
                    `A Stripe payment attempt failed.`,
                    ``,
                    `Error`,
                    `  Message: ${paymentError?.message ?? "Unknown payment error"}`,
                    `  Code: ${paymentError?.code ?? "—"}`,
                    `  Decline code: ${paymentError?.decline_code ?? "—"}`,
                    `  Type: ${paymentError?.type ?? "—"}`,
                    ``,
                    orderItems.length > 0
                        ? `Attempted ebooks: ${orderItems.map((item) => item.bookId).join(", ")}`
                        : null,
                    `Amount: ${new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: paymentIntent.currency,
                    }).format(paymentIntent.amount / 100)}`,
                    `Customer email: ${paymentIntent.receipt_email ?? "—"}`,
                    `Stripe payment intent: ${paymentIntent.id}`,
                    `Stripe dashboard: ${dashboardUrl}`,
                ]
                    .filter((line) => line !== null)
                    .join("\n"),
            },
            { idempotencyKey: `stripe-payment-failed-${event.id}` },
        )

        if (error) {
            console.error("Unable to send failed payment notification", {
                eventId: event.id,
                paymentIntentId: paymentIntent.id,
                error,
            })
            return NextResponse.json(
                { error: "Unable to send failed payment notification" },
                { status: 500 },
            )
        }
    }

    if (
        event.type === "checkout.session.completed" ||
        event.type === "checkout.session.async_payment_succeeded"
    ) {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.payment_status !== "paid") {
            return NextResponse.json({ received: true })
        }

        const resend = new Resend(resendApiKey)
        try {
            await deliverSessionEbooks({ resend, session, stripe })
        } catch (deliveryError) {
            console.error("Unable to deliver ebook order", {
                eventId: event.id,
                sessionId: session.id,
                error: deliveryError,
            })
            return NextResponse.json(
                { error: "Unable to deliver ebook order" },
                { status: 500 },
            )
        }
    }

    return NextResponse.json({ received: true })
}
