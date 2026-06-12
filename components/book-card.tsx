"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowRight,
    BookOpen,
    CalendarClock,
    Check,
    ShoppingCart,
} from "lucide-react"
import { AmazonLogo } from "@/components/amazon-logo"
import { Button } from "@/components/ui/button"
import {
    Book,
    BookFormat,
    BookFormatOption,
    getFeaturedReviewHeadline,
} from "@/lib/books"
import { usePricesStore } from "@/lib/prices-store"
import { useCartStore } from "@/lib/cart-store"

interface BookCardProps {
    book: Book
    priority?: boolean
}

const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
    }).format(cents / 100)

export const BookCard = ({ book, priority = false }: BookCardProps) => {
    const [added, setAdded] = useState(false)
    const { addItem, openCart } = useCartStore()
    const getPrice = usePricesStore((state) => state.getPrice)
    const isPreOrder = book.status.type === "pre-order"
    const isComingSoon = book.status.type === "coming-soon"
    const isPurchasable = book.purchasable !== false
    const releaseDate =
        book.status.type === "pre-order" ? book.status.releaseDate : null

    const defaultFormat = (
        Object.entries(book.formats) as [BookFormat, BookFormatOption][]
    ).find(([, option]) => option.available)?.[0]
    const defaultFormatOption = defaultFormat
        ? book.formats[defaultFormat]
        : undefined
    const defaultPrice = defaultFormat
        ? (getPrice(book.slug, defaultFormat) ??
          book.formats[defaultFormat]?.priceCents)
        : undefined
    const bundleOption = book.formats.bundle
    const bundlePrice =
        getPrice(book.slug, "bundle") ?? book.formats.bundle?.priceCents
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

    const handleAddToCart = () => {
        if (!defaultFormat) return
        addItem(book.slug, defaultFormat, 1)
        openCart()
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

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
                    {defaultPrice !== undefined && defaultFormatOption && (
                        <div className="book-index-offer">
                            <div>
                                <span>Paperback</span>
                                {defaultFormatOption.priceNote && (
                                    <small>
                                        {defaultFormatOption.priceNote}
                                    </small>
                                )}
                            </div>
                            <p>
                                {fmt(defaultPrice)}
                                {defaultFormatOption.compareAtPriceCents !==
                                    undefined && (
                                    <del>
                                        {fmt(
                                            defaultFormatOption.compareAtPriceCents,
                                        )}
                                    </del>
                                )}
                            </p>
                        </div>
                    )}

                    {bundleOption?.available && bundlePrice !== undefined && (
                        <div className="book-index-offer">
                            <div>
                                <span>Complete bundle</span>
                                {bundleOption.description && (
                                    <small>{bundleOption.description}</small>
                                )}
                            </div>
                            <p>
                                {fmt(bundlePrice)}
                                {bundleOption.compareAtPriceCents !==
                                    undefined && (
                                    <del>
                                        {fmt(bundleOption.compareAtPriceCents)}
                                    </del>
                                )}
                            </p>
                        </div>
                    )}
                </div>

                <div className="book-index-actions">
                    {isPurchasable && !isComingSoon && defaultFormat && (
                        <Button
                            size="lg"
                            onClick={handleAddToCart}
                            disabled={added}
                            className="book-index-primary-action"
                        >
                            {added ? (
                                <>
                                    Added
                                    <Check className="size-4" />
                                </>
                            ) : (
                                <>
                                    {isPreOrder ? "Pre-order" : "Buy"}
                                    <ShoppingCart className="size-4" />
                                </>
                            )}
                        </Button>
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
                    {book.amazonUrl && (
                        <Link
                            href={book.amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="book-index-link"
                        >
                            <AmazonLogo className="size-4" />
                            Amazon
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
