import { Metadata } from "next"
import { type BookFormat } from "@/lib/books"
import { type CartItem } from "@/lib/cart-store"
import { CheckoutClient } from "./checkout-client"

export const metadata: Metadata = {
    title: "Checkout",
    description: "Complete your book order.",
    robots: {
        index: false,
        follow: false,
    },
}

type CheckoutPageProps = {
    searchParams: Promise<{
        mode?: string | string[]
        bookId?: string | string[]
        format?: string | string[]
        quantity?: string | string[]
    }>
}

const CheckoutPage = async ({ searchParams }: CheckoutPageProps) => {
    const params = await searchParams
    const directItems =
        singleValue(params.mode) === "direct"
            ? getDirectItems(params)
            : undefined

    return (
        <section className="editorial-page editorial-transaction mx-auto min-h-[calc(100svh-7rem)] max-w-5xl px-4 py-8 sm:px-6">
            <CheckoutClient directItems={directItems} />
        </section>
    )
}

const getDirectItems = (params: Awaited<CheckoutPageProps["searchParams"]>) => {
    const bookId = singleValue(params.bookId)
    const format = singleValue(params.format)
    const quantity = Number(singleValue(params.quantity))

    if (!bookId || !isBookFormat(format) || !Number.isFinite(quantity)) {
        return []
    }

    return [{ bookId, format, quantity }] satisfies CartItem[]
}

const singleValue = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value

const isBookFormat = (value: string | undefined): value is BookFormat =>
    value === "paperback" ||
    value === "ebook" ||
    value === "audiobook" ||
    value === "bundle"

export default CheckoutPage
