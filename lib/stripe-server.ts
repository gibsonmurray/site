import "server-only"
import Stripe from "stripe"
import { cache } from "react"
import { books, BookFormat, BookFormatOption } from "./books"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export type BookPrices = Partial<
    Record<string, Partial<Record<BookFormat, number>>>
>

export const fetchBookPrices = cache(async (): Promise<BookPrices> => {
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
