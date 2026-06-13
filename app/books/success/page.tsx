import { Metadata } from "next"
import Link from "next/link"
import { latestBook } from "@/lib/books"
import { SuccessConfetti } from "./success-confetti"
import { ArrowRight, Check, ChevronLeft, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
    title: "Ebook Order Confirmed",
    description: "Your ebook order is confirmed.",
    robots: {
        index: false,
        follow: false,
    },
}

const SuccessPage = () => {
    const releaseDate =
        latestBook?.status.type === "pre-order"
            ? latestBook.status.releaseDate
            : null

    return (
        <section className="editorial-page editorial-transaction mx-auto flex min-h-[calc(100svh-7rem)] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
            <SuccessConfetti />
            <div className="editorial-transaction-state border-border/65 flex w-full flex-col items-center border-y px-4 py-16">
                <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-[0.25rem]">
                    <Check className="size-7" />
                </div>
                <div className="text-primary mt-6 flex items-center gap-3 text-[0.68rem] font-bold tracking-[0.19em] uppercase">
                    <span className="bg-primary h-px w-10" />
                    <p>Ebook order confirmed</p>
                    <span className="bg-primary h-px w-10" />
                </div>
                <h1 className="text-foreground mt-5 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                    Your ebook is on its way.
                </h1>
                <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg leading-8">
                    Thank you for supporting the work. Your confirmation and any
                    digital delivery files are headed to the email used at
                    checkout.
                    {releaseDate && ` Release is scheduled for ${releaseDate}.`}
                </p>
                <Link href="/books/ebook-help" className="book-order-help-link">
                    <HelpCircle aria-hidden="true" />
                    <span>
                        <strong>Ordered an ebook?</strong>
                        Follow the illustrated guide to open your EPUB on
                        Kindle, Apple Books, or another reader.
                    </span>
                    <ArrowRight aria-hidden="true" />
                </Link>
                <Link href="/books" className="editorial-back-link mt-9">
                    <ChevronLeft />
                    Back to books
                </Link>
            </div>
        </section>
    )
}

export default SuccessPage
