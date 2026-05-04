import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { latestBook } from "@/lib/books"
import { SuccessConfetti } from "./success-confetti"
import { ClearCart } from "./clear-cart"
import { Check, LibraryBig } from "lucide-react"

export const metadata: Metadata = {
    title: "Order Confirmed",
    description: "Thank you for your pre-order!",
    robots: {
        index: false,
        follow: false,
    },
}

const SuccessPage = () => {
    const releaseDate =
        latestBook?.status.type === "pre-order"
            ? latestBook.status.releaseDate
            : "the announced release window"

    return (
        <section className="mx-auto flex min-h-[calc(100svh-7rem)] max-w-4xl flex-col items-center justify-center px-6 py-16 text-center sm:px-8">
            <ClearCart />
            <SuccessConfetti />
            <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-full">
                <Check className="size-7" />
            </div>
            <p className="text-primary mt-6 text-xs font-semibold tracking-[0.22em] uppercase">
                Order confirmed
            </p>
            <h1 className="text-foreground mt-5 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                Your copy is reserved.
            </h1>
            <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg leading-8">
                Thank you for supporting the work. Your copy is scheduled for{" "}
                <strong>{releaseDate}</strong>, and delivery details will arrive
                by email when it is time.
            </p>
            <Button
                variant="outline"
                className="mt-9 h-11 rounded-full px-5"
                render={<Link href="/books" />}
            >
                <LibraryBig className="size-4" />
                Back to books
            </Button>
        </section>
    )
}

export default SuccessPage
