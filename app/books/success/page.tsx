import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Order Confirmed",
    description: "Thank you for your pre-order!",
}

const SuccessPage = () => {
    return (
        <section className="page-shell flex flex-col items-center justify-center gap-6 py-24 text-center">
            <div className="flex flex-col items-center gap-3">
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                    You&apos;re on the list!
                </h1>
                <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                    Thank you for pre-ordering. You&apos;ll receive your copy on{" "}
                    <strong>July 1, 2026</strong> — I&apos;ll send delivery
                    details to your email closer to release.
                </p>
            </div>
            <Button variant="outline" size="sm">
                <Link href="/books">Back to Books</Link>
            </Button>
        </section>
    )
}

export default SuccessPage
