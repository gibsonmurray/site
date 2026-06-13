import { Metadata } from "next"
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
        bookId?: string | string[]
        format?: string | string[]
    }>
}

const CheckoutPage = async ({ searchParams }: CheckoutPageProps) => {
    const params = await searchParams
    const bookId = singleValue(params.bookId)
    const format = singleValue(params.format)

    return (
        <section className="editorial-page editorial-transaction mx-auto min-h-[calc(100svh-7rem)] max-w-5xl px-4 py-8 sm:px-6">
            <CheckoutClient bookId={bookId} format={format} />
        </section>
    )
}

const singleValue = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value

export default CheckoutPage
