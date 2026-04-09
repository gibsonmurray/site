import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
    const body = await req.text()
    const sig = req.headers.get("stripe-signature")!

    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch {
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 400 },
        )
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session & {
            shipping_details?: {
                name?: string | null
                address?: Stripe.Address | null
            } | null
        }

        const bookId = session.metadata?.bookId
        const shipping = session.shipping_details
        const customer = {
            name: session.customer_details?.name,
            email: session.customer_details?.email,
            phone: session.customer_details?.phone,
        }

        if (!shipping?.address || !bookId) {
            console.error("Missing shipping or bookId", { bookId, shipping })
            return NextResponse.json({ error: "Missing data" }, { status: 400 })
        }

        const { line1, line2, city, state, postal_code, country } =
            shipping.address

        await resend.emails.send({
            from: "orders@send.gibsonmurray.com",
            to: "gibson@gibsonmurray.com",
            subject: `New pre-order — ${bookId}`,
            text: [
                `New pre-order received!`,
                ``,
                `Customer`,
                `  Name:  ${customer.name ?? "—"}`,
                `  Email: ${customer.email ?? "—"}`,
                `  Phone: ${customer.phone ?? "—"}`,
                ``,
                `Ship to`,
                `  ${shipping.name}`,
                line1 ? `  ${line1}` : null,
                line2 ? `  ${line2}` : null,
                `  ${city}, ${state} ${postal_code}`,
                `  ${country}`,
                ``,
                `Stripe session: ${session.id}`,
            ]
                .filter((l) => l !== null)
                .join("\n"),
        })
    }

    return NextResponse.json({ received: true })
}
