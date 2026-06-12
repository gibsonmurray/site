import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"
import { books, type BookFormat } from "@/lib/books"
import { parseOrderItems, type OrderItem } from "@/lib/book-orders"
import { notificationEmail } from "@/lib/contact"
import { deliverSessionEbooks } from "@/lib/ebook-delivery"
import { getCheckoutStripe } from "@/lib/stripe-server"

const formatLabels: Record<BookFormat, string> = {
    paperback: "Paperback",
    hardback: "Hardback",
    ebook: "eBook",
    audiobook: "Audiobook",
    bundle: "Complete bundle",
}

const getItemLines = (orderItems: OrderItem[]) =>
    orderItems.map((item) => {
        const book = books.find((b) => b.slug === item.bookId)
        const title = book?.title ?? item.bookId
        return `  ${title} — ${formatLabels[item.format]} x ${item.quantity}`
    })

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
                    orderItems.length > 0 ? `Attempted items` : null,
                    ...getItemLines(orderItems),
                    orderItems.length > 0 ? `` : null,
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
        const session = event.data.object as Stripe.Checkout.Session & {
            shipping_details?: {
                name?: string | null
                address?: Stripe.Address | null
            } | null
            collected_information?: {
                shipping_details?: {
                    name?: string | null
                    address?: Stripe.Address | null
                } | null
            } | null
        }

        if (session.payment_status !== "paid") {
            return NextResponse.json({ received: true })
        }

        const orderItems = parseOrderItems(session.metadata)
        const shipping =
            session.collected_information?.shipping_details ??
            session.shipping_details
        const customer = {
            name: session.customer_details?.name,
            email: session.customer_details?.email,
            phone: session.customer_details?.phone,
        }

        if (orderItems.length === 0) {
            console.error("Missing order items", { metadata: session.metadata })
            return NextResponse.json({ error: "Missing data" }, { status: 400 })
        }

        const shippingLines = shipping?.address
            ? [
                  `Ship to`,
                  `  ${shipping.name ?? customer.name ?? "—"}`,
                  shipping.address.line1 ? `  ${shipping.address.line1}` : null,
                  shipping.address.line2 ? `  ${shipping.address.line2}` : null,
                  `  ${[
                      shipping.address.city,
                      shipping.address.state,
                      shipping.address.postal_code,
                  ]
                      .filter(Boolean)
                      .join(", ")}`,
                  `  ${shipping.address.country ?? "—"}`,
                  ``,
              ]
            : [`Ship to`, `  Digital delivery / no shipping collected`, ``]

        const itemLines = getItemLines(orderItems)
        const fulfillmentId = `stripe:${session.id}`
        const paymentIntentId =
            typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id

        const giftMessage = session.custom_fields?.find(
            (field) => field.key === "gift_message",
        )?.text?.value

        const resend = new Resend(resendApiKey)
        const { error } = await resend.emails.send(
            {
                from: "Gibson Murray <orders@gibsonmurray.com>",
                to: notificationEmail,
                subject: `New order — ${orderItems.map((item) => item.bookId).join(", ")}`,
                text: [
                    `New paid order received!`,
                    `Fulfillment ID: ${fulfillmentId}`,
                    ``,
                    `Items`,
                    ...itemLines,
                    ``,
                    `Customer`,
                    `  Name:  ${customer.name ?? "—"}`,
                    `  Email: ${customer.email ?? "—"}`,
                    `  Phone: ${customer.phone ?? "—"}`,
                    ``,
                    ...shippingLines,
                    giftMessage ? `Gift message` : null,
                    giftMessage ? `  ${giftMessage}` : null,
                    giftMessage ? `` : null,
                    ``,
                    `Stripe session: ${session.id}`,
                    paymentIntentId
                        ? `Stripe payment intent: ${paymentIntentId}`
                        : null,
                ]
                    .filter((l) => l !== null)
                    .join("\n"),
            },
            { idempotencyKey: `stripe-order-${session.id}` },
        )

        if (error) {
            console.error("Unable to send order notification", {
                eventId: event.id,
                sessionId: session.id,
                error,
            })
            return NextResponse.json(
                { error: "Unable to send order notification" },
                { status: 500 },
            )
        }

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
