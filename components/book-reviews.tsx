import { BookReview } from "@/lib/books"
import Link from "next/link"
import { Quote } from "lucide-react"

export const BookReviews = ({ reviews }: { reviews: BookReview[] }) => {
    if (reviews.length === 0) return null

    return (
        <section className="py-18 lg:py-24">
            <div className="mb-10">
                <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                    Reviews
                </p>
                <h2 className="text-foreground mt-4 text-4xl font-semibold tracking-tight">
                    What readers are saying.
                </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {reviews.map((review, i) => (
                    <blockquote
                        key={i}
                        className="app-panel-muted justify-between gap-6"
                    >
                        <div>
                            <Quote className="text-primary/50 mb-5 size-5 shrink-0" />
                            <p className="text-foreground text-lg leading-8 tracking-tight">
                                {review.quote}
                            </p>
                        </div>
                        <footer className="flex items-center gap-1.5 text-sm">
                            <span className="text-foreground font-semibold">
                                {review.reviewer}
                            </span>
                            {review.source &&
                                (review.url ? (
                                    <Link
                                        href={review.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {review.source}
                                    </Link>
                                ) : (
                                    <span className="text-muted-foreground">
                                        {review.source}
                                    </span>
                                ))}
                        </footer>
                    </blockquote>
                ))}
            </div>
        </section>
    )
}
