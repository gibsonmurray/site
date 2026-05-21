import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"
import { books, type BookFormat } from "@/lib/books"
import { publicContactEmail } from "@/lib/contact"
import { getStripe } from "@/lib/stripe-server"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
const resend = new Resend(process.env.RESEND_API_KEY!)

type OrderItem = {
    bookId: string
    format: BookFormat
    quantity: number
}

const formatLabels: Record<BookFormat, string> = {
    paperback: "Paperback",
    ebook: "eBook",
    audiobook: "Audiobook",
    bundle: "Complete bundle",
}

const parseOrderItems = (session: Stripe.Checkout.Session): OrderItem[] => {
    const metadataItems = session.metadata?.items
    if (!metadataItems) {
        const bookId = session.metadata?.bookId
        return bookId ? [{ bookId, format: "paperback", quantity: 1 }] : []
    }

    try {
        const items = JSON.parse(metadataItems)
        if (!Array.isArray(items)) return []

        return items.flatMap((item): OrderItem[] => {
            if (
                typeof item?.bookId !== "string" ||
                typeof item?.format !== "string" ||
                typeof item?.quantity !== "number"
            ) {
                return []
            }

            if (
                !["paperback", "ebook", "audiobook", "bundle"].includes(
                    item.format,
                )
            ) {
                return []
            }

            return [
                {
                    bookId: item.bookId,
                    format: item.format,
                    quantity: item.quantity,
                },
            ]
        })
    } catch {
        return []
    }
}

export async function POST(req: NextRequest) {
    const stripe = getStripe()
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

        const orderItems = parseOrderItems(session)
        const shipping = session.shipping_details
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

        const itemLines = orderItems.map((item) => {
            const book = books.find((b) => b.slug === item.bookId)
            const title = book?.title ?? item.bookId
            return `  ${title} — ${formatLabels[item.format]} x ${item.quantity}`
        })

        const giftMessage = session.custom_fields?.find(
            (field) => field.key === "gift_message",
        )?.text?.value

        await resend.emails.send({
            from: "orders@send.gibsonmurray.com",
            to: publicContactEmail,
            subject: `New pre-order — ${orderItems.map((item) => item.bookId).join(", ")}`,
            text: [
                `New pre-order received!`,
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
            ]
                .filter((l) => l !== null)
                .join("\n"),
        })
    }

    return NextResponse.json({ received: true })
}
