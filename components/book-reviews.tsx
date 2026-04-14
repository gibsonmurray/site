import { BookReview } from "@/lib/books"
import Link from "next/link"
import { Quote } from "lucide-react"

export const BookReviews = ({ reviews }: { reviews: BookReview[] }) => {
    if (reviews.length === 0) return null

    return (
        <div className="border-border/50 flex flex-col gap-5 border-t pt-8">
            <h2 className="text-foreground text-sm font-semibold">
                What readers are saying
            </h2>
            <div className="flex flex-col gap-4">
                {reviews.map((review, i) => (
                    <blockquote
                        key={i}
                        className="border-primary/30 bg-muted/20 flex flex-col gap-3 rounded-xl border-l-2 px-4 py-3"
                    >
                        <Quote className="text-primary/40 size-4 shrink-0" />
                        <p className="text-foreground text-sm leading-relaxed italic">
                            {review.quote}
                        </p>
                        <footer className="flex items-center gap-1.5">
                            <span className="text-foreground text-xs font-semibold">
                                — {review.reviewer}
                            </span>
                            {review.source && (
                                <>
                                    <span className="text-muted-foreground/40 text-xs">
                                        ·
                                    </span>
                                    {review.url ? (
                                        <Link
                                            href={review.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-primary text-xs transition-colors"
                                        >
                                            {review.source}
                                        </Link>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">
                                            {review.source}
                                        </span>
                                    )}
                                </>
                            )}
                        </footer>
                    </blockquote>
                ))}
            </div>
        </div>
    )
}
