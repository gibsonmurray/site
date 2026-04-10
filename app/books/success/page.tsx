import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { latestBook } from "@/lib/books"
import { SuccessConfetti } from "./success-confetti"
import { ClearCart } from "./clear-cart"

export const metadata: Metadata = {
    title: "Order Confirmed",
    description: "Thank you for your pre-order!",
}

const SuccessPage = () => {
    const releaseDate =
        latestBook?.status.type === "pre-order"
            ? latestBook.status.releaseDate
            : "the announced release window"

    return (
        <section className="page-shell flex flex-col items-center justify-center gap-6 py-24 text-center">
            <ClearCart />
            <SuccessConfetti />
            <div className="flex flex-col items-center gap-3">
                <div className="text-5xl mb-2 animate-bounce">🎉</div>
                <h1 className="text-foreground text-4xl font-bold tracking-tight">
                    You&apos;re in!
                </h1>
                <p className="text-muted-foreground max-w-sm text-base leading-relaxed">
                    Awesome! You&apos;ve officially claimed your spot. Your copy will land
                    in your hands <strong>{releaseDate}</strong>. I&apos;ll email you
                    all the delivery details when it&apos;s go time. 🚀
                </p>
                <p className="text-muted-foreground text-sm mt-2 italic">
                    Thanks for supporting the work — it means a lot! 💙
                </p>
            </div>
            <Button variant="outline" size="sm">
                <Link href="/books">Back to Books</Link>
            </Button>
        </section>
    )
}

export default SuccessPage
