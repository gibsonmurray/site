import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { books, BookFormat } from "@/lib/books"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const baseUrl =
    process.env.NODE_ENV === "production"
        ? "https://gibsonmurray.com"
        : "http://localhost:3000"

type CartItem = {
    bookId: string
    format: BookFormat
    quantity: number
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const items: CartItem[] = body.items

    if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    const lineItems: { price: string; quantity: number }[] = []

    for (const { bookId, format, quantity } of items) {
        const book = books.find((b) => b.slug === bookId)
        if (!book || book.status.type === "coming-soon") {
            return NextResponse.json(
                { error: "Book not available for purchase" },
                { status: 400 },
            )
        }

        const formatOption = book.formats[format]
        if (!formatOption?.available) {
            return NextResponse.json(
                { error: `Format "${format}" is not available` },
                { status: 400 },
            )
        }

        if (!formatOption.productId) {
            return NextResponse.json(
                { error: "Book price not configured" },
                { status: 500 },
            )
        }

        const product = await stripe.products.retrieve(formatOption.productId, {
            expand: ["default_price"],
        })
        const defaultPrice = product.default_price
        if (!defaultPrice || typeof defaultPrice === "string") {
            return NextResponse.json(
                { error: "Book price not configured in Stripe" },
                { status: 500 },
            )
        }

        const priceId = defaultPrice.id

        lineItems.push({
            price: priceId,
            quantity: Math.max(1, Math.min(99, quantity)),
        })
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        allow_promotion_codes: true,
        custom_fields: [
            {
                key: "gift_message",
                label: { type: "custom", custom: "Gift message (optional)" },
                type: "text",
                optional: true,
            },
        ],
        shipping_address_collection: {
            allowed_countries: [
                "US", "CA", "GB", "AU", "NZ",
                "DE", "FR", "IT", "ES", "NL",
                "SE", "NO", "DK", "FI", "BE",
                "CH", "AT", "JP", "SG", "BR",
            ],
        },
        phone_number_collection: { enabled: true },
        success_url: `${baseUrl}/books/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/books`,
        metadata: {
            items: JSON.stringify(
                items.map(({ bookId, format, quantity }) => ({
                    bookId,
                    format,
                    quantity,
                })),
            ),
        },
    })

    if (!session.url) {
        return NextResponse.json(
            { error: "Unable to create checkout session" },
            { status: 500 },
        )
    }

    return NextResponse.json({ url: session.url })
}
