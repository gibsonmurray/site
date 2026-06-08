import "server-only"
import Stripe from "stripe"
import { cache } from "react"
import { books, BookFormat, BookFormatOption } from "./books"

const getStripe = () => {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
        throw new Error("STRIPE_SECRET_KEY is not configured")
    }

    return new Stripe(key, {
        apiVersion: "2026-04-22.dahlia",
    })
}

export const getCheckoutStripe = () => {
    const key =
        process.env.STRIPE_CHECKOUT_SECRET_KEY ??
        process.env.STRIPE_LIVE_KEY ??
        process.env.STRIPE_SECRET_KEY

    if (!key) {
        throw new Error("Stripe checkout secret key is not configured")
    }

    return new Stripe(key, {
        apiVersion: "2026-04-22.dahlia",
    })
}

export type BookPrices = Partial<
    Record<string, Partial<Record<BookFormat, number>>>
>

export const fetchBookPrices = cache(async (): Promise<BookPrices> => {
    const stripe = process.env.STRIPE_SECRET_KEY ? getStripe() : null
    const result: BookPrices = {}

    await Promise.all(
        books.map(async (book) => {
            result[book.slug] = {}
            await Promise.all(
                (
                    Object.entries(book.formats) as [
                        BookFormat,
                        BookFormatOption,
                    ][]
                ).map(async ([format, option]) => {
                    if (!option.productId || !option.available) return
                    if (option.priceCents !== undefined) {
                        result[book.slug]![format] = option.priceCents
                        return
                    }
                    if (!stripe) return

                    try {
                        const product = await stripe.products.retrieve(
                            option.productId,
                            { expand: ["default_price"] },
                        )
                        const dp = product.default_price
                        if (
                            dp &&
                            typeof dp !== "string" &&
                            dp.unit_amount !== null
                        ) {
                            result[book.slug]![format] = dp.unit_amount
                        }
                    } catch {
                        // price unavailable
                    }
                }),
            )
        }),
    )

    return result
})
