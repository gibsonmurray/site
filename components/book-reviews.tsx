import { BookReview } from "@/lib/books"
import Link from "next/link"
import { ChevronDown, Quote, Star } from "lucide-react"

export const BookReviews = ({ reviews }: { reviews: BookReview[] }) => {
    if (reviews.length === 0) return null

    return (
        <section className="py-18 lg:py-24">
            <div className="mb-10">
                <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                    Featured reviews
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
                            <div className="mb-7 flex items-center justify-between gap-4">
                                <Quote className="text-primary/50 size-5 shrink-0" />
                                {review.rating && (
                                    <div
                                        className="flex items-center gap-1.5"
                                        aria-label={`${review.rating} out of 5 stars`}
                                    >
                                        {Array.from({ length: 5 }).map(
                                            (_, starIndex) => (
                                                <Star
                                                    key={starIndex}
                                                    className={
                                                        starIndex <
                                                        review.rating!
                                                            ? "fill-primary text-primary size-5"
                                                            : "text-muted-foreground/30 size-5"
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-foreground max-w-xl text-2xl leading-8 font-semibold tracking-tight">
                                {review.headline ?? review.quote}
                            </h3>
                            <details className="group mt-5">
                                <summary className="text-primary hover:text-primary/80 inline-flex cursor-pointer list-none items-center gap-2 text-sm font-semibold transition-colors marker:hidden">
                                    Read full review
                                    <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="mt-6 space-y-5">
                                    {review.quote
                                        .split(/\n{2,}/)
                                        .map((paragraph) => (
                                            <p
                                                key={paragraph}
                                                className="text-foreground text-lg leading-8 tracking-tight"
                                            >
                                                {paragraph}
                                            </p>
                                        ))}
                                </div>
                            </details>
                        </div>
                        <footer className="border-border/60 mt-8 flex flex-col gap-2 border-t pt-6 text-sm">
                            <span className="text-foreground text-base font-semibold">
                                {review.reviewer}
                            </span>
                            {review.source &&
                                (review.url ? (
                                    <Link
                                        href={review.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary max-w-md leading-6 whitespace-pre-line transition-colors"
                                    >
                                        {review.source}
                                    </Link>
                                ) : (
                                    <span className="text-muted-foreground max-w-md leading-6 whitespace-pre-line">
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
