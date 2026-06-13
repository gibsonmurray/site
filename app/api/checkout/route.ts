import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { books } from "@/lib/books"
import { getCheckoutStripe } from "@/lib/stripe-server"

const baseUrl =
    process.env.NODE_ENV === "production"
        ? "https://gibsonmurray.com"
        : "http://localhost:3000"

export async function POST(req: NextRequest) {
    try {
        const stripe = getCheckoutStripe()
        const body = await req.json()
        const bookId = typeof body.bookId === "string" ? body.bookId : ""

        if (body.format !== "ebook") {
            return NextResponse.json(
                { error: "Direct checkout is available for ebooks only." },
                { status: 400 },
            )
        }

        const book = books.find((candidate) => candidate.slug === bookId)
        const ebook = book?.formats.ebook

        if (
            !book ||
            book.status.type === "coming-soon" ||
            !ebook?.available ||
            !ebook.productId
        ) {
            return NextResponse.json(
                { error: "This ebook is not available for direct purchase." },
                { status: 400 },
            )
        }

        const priceId =
            ebook.priceCents === undefined
                ? await getDefaultPriceId(stripe, ebook.productId)
                : null

        if (ebook.priceCents === undefined && !priceId) {
            return NextResponse.json(
                { error: "The ebook price is not configured." },
                { status: 500 },
            )
        }

        const metadata = {
            items: JSON.stringify([{ bookId, format: "ebook", quantity: 1 }]),
        }
        const lineItem =
            ebook.priceCents !== undefined
                ? {
                      price_data: {
                          currency: "usd" as const,
                          product: ebook.productId,
                          unit_amount: ebook.priceCents,
                      },
                      quantity: 1,
                  }
                : { price: priceId!, quantity: 1 }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items: [lineItem],
            allow_promotion_codes: true,
            automatic_tax: { enabled: true },
            payment_intent_data: { metadata },
            success_url: `${baseUrl}/books/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/books/${book.slug}`,
            metadata,
        })

        if (!session.url) {
            return NextResponse.json(
                { error: "Unable to create checkout session." },
                { status: 500 },
            )
        }

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to create checkout session.",
            },
            { status: 500 },
        )
    }
}

const getDefaultPriceId = async (stripe: Stripe, productId: string) => {
    const product = await stripe.products.retrieve(productId, {
        expand: ["default_price"],
    })
    const defaultPrice = product.default_price
    if (!defaultPrice || typeof defaultPrice === "string") return null
    return defaultPrice.id
}
