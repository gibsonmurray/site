import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { books } from "@/lib/books"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const baseUrl =
    process.env.NODE_ENV === "production"
        ? "https://gibsonmurray.com"
        : "http://localhost:3000"

export async function POST(req: NextRequest) {
    const { bookId } = await req.json()

    const book = books.find((b) => b.id === bookId)
    if (!book || book.status.type !== "pre-order") {
        return NextResponse.json(
            { error: "Book not available for purchase" },
            { status: 400 }
        )
    }

    const product = await stripe.products.retrieve(book.id, {
        expand: ["default_price"],
    })

    const defaultPrice = product.default_price
    if (!defaultPrice || typeof defaultPrice === "string") {
        return NextResponse.json(
            { error: "Book price not configured in Stripe" },
            { status: 500 }
        )
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ quantity: 1, price: defaultPrice.id }],
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
        metadata: { bookId: book.id },
    })

    if (!session.url) {
        return NextResponse.json(
            { error: "Unable to create checkout session" },
            { status: 500 }
        )
    }

    return NextResponse.json({ url: session.url })
}
