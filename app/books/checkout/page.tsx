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

const CheckoutPage = () => {
    return (
        <section className="mx-auto min-h-[calc(100svh-7rem)] max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <CheckoutClient />
        </section>
    )
}

export default CheckoutPage
