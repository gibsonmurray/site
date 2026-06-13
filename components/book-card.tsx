import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, CalendarClock } from "lucide-react"
import {
    BOOK_FORMAT_LABELS,
    Book,
    BookFormat,
    getFeaturedReviewHeadline,
} from "@/lib/books"

interface BookCardProps {
    book: Book
    priority?: boolean
}

export const BookCard = ({ book, priority = false }: BookCardProps) => {
    const isPreOrder = book.status.type === "pre-order"
    const isComingSoon = book.status.type === "coming-soon"
    const isPurchasable = book.purchasable !== false
    const releaseDate =
        book.status.type === "pre-order" ? book.status.releaseDate : null

    const availableFormats = Object.entries(book.formats)
        .filter(([, option]) => option?.available)
        .map(([format]) => BOOK_FORMAT_LABELS[format as BookFormat])
    const reviewHeadline = getFeaturedReviewHeadline(book)
    const heroImage = book.images?.[0] ?? book.coverImageSrc

    const statusCopy =
        isPreOrder && !isPurchasable
            ? "Pre-order opening soon"
            : isPreOrder
              ? "Pre-order"
              : isComingSoon
                ? book.status.label
                : "Available now"

    return (
        <article className="book-index-entry">
            <Link
                href={`/books/${book.slug}`}
                className="book-index-media group"
            >
                <Image
                    src={heroImage}
                    alt={book.coverImageAlt}
                    fill
                    sizes="(min-width: 1024px) 52vw, 100vw"
                    loading={priority ? "eager" : "lazy"}
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                />
            </Link>

            <div className="book-index-copy">
                <div className="book-index-meta">
                    <span>{statusCopy}</span>
                    {releaseDate && (
                        <span>
                            <CalendarClock aria-hidden="true" />
                            {releaseDate}
                        </span>
                    )}
                    <span>{book.genre}</span>
                </div>

                <Link href={`/books/${book.slug}`}>
                    <h2>{book.title}</h2>
                </Link>
                <p className="book-index-description">
                    {book.shortDescription}
                </p>

                {reviewHeadline && (
                    <blockquote className="book-index-quote">
                        <p>“{reviewHeadline}”</p>
                        <span>Reader praise</span>
                    </blockquote>
                )}

                <div className="book-index-offers">
                    {availableFormats.length > 0 && (
                        <div className="book-index-offer">
                            <div>
                                <span>Available formats</span>
                                <small>
                                    Choose a format, then continue with your
                                    preferred bookseller.
                                </small>
                            </div>
                            <p>{availableFormats.join(" · ")}</p>
                        </div>
                    )}
                </div>

                <div className="book-index-actions">
                    {isPurchasable && !isComingSoon && (
                        <Link
                            href={`/books/${book.slug}`}
                            className="book-index-primary-action"
                        >
                            {isPreOrder
                                ? "Pre-order options"
                                : "Purchase options"}
                            <ArrowRight aria-hidden="true" />
                        </Link>
                    )}
                    {book.slug === "walls" && (
                        <Link
                            href="/books/walls/read/chapter-1#chapter"
                            className="book-index-link"
                        >
                            <BookOpen aria-hidden="true" />
                            Read sample
                        </Link>
                    )}
                    <Link
                        href={`/books/${book.slug}`}
                        className="book-index-link"
                    >
                        Details
                        <ArrowRight aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </article>
    )
}
