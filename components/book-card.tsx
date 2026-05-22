"use client"

import { useState, type SyntheticEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowRight,
    BookOpen,
    CalendarClock,
    Check,
    ExternalLink,
    ShoppingCart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Book, BookFormat, BookFormatOption } from "@/lib/books"
import { usePricesStore } from "@/lib/prices-store"
import {
    DEFAULT_GLOW,
    mixWithBlack,
    mixWithWhite,
    glowRgb,
    sampleGlowColor,
    type GlowColor,
} from "@/lib/book-glow"
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
    const [glowColor, setGlowColor] = useState<GlowColor>(DEFAULT_GLOW)
    const [hasGlowColor, setHasGlowColor] = useState(false)
    const [added, setAdded] = useState(false)

    const { addItem, openCart } = useCartStore()
    const getPrice = usePricesStore((s) => s.getPrice)
    const isPreOrder = book.status.type === "pre-order"
    const isComingSoon = book.status.type === "coming-soon"
    const isPurchasable = book.purchasable !== false
    const releaseDate =
        book.status.type === "pre-order" ? book.status.releaseDate : null

    const defaultFormat = (
        Object.entries(book.formats) as [BookFormat, BookFormatOption][]
    ).find(([, opt]) => opt.available)?.[0]
    const defaultFormatOption = defaultFormat
        ? book.formats[defaultFormat]
        : undefined
    const defaultPrice = defaultFormat
        ? getPrice(book.slug, defaultFormat)
        : undefined
    const bundleOption = book.formats.bundle
    const bundlePrice = getPrice(book.slug, "bundle")

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

    const handleCoverLoad = (event: SyntheticEvent<HTMLImageElement>) => {
        void (async () => {
            const nextGlowColor = await sampleGlowColor(event.currentTarget)
            setGlowColor(nextGlowColor)
            setHasGlowColor(true)
        })()
    }

    const glowColorSoft = mixWithWhite(glowColor, 0.35)
    const glowColorDeep = mixWithBlack(glowColor, 0.22)
    const heroImage = book.images?.[0] ?? book.coverImageSrc

    return (
        <article
            className="shadow-foreground/10 relative overflow-hidden rounded-[2rem] bg-[#111] text-white shadow-2xl"
            style={{
                backgroundImage: `radial-gradient(circle at 24% 20%, rgba(${glowRgb(glowColorSoft)}, 0.24), transparent 32%), linear-gradient(145deg, rgba(255,255,255,0.08), transparent 42%)`,
            }}
        >
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-80"
                style={{
                    background: `linear-gradient(90deg, transparent, rgba(${glowRgb(glowColor)}, 0.8), transparent)`,
                }}
            />
            <div className="grid min-h-[34rem] gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
                <div className="relative isolate min-h-80 overflow-hidden rounded-[1.5rem] bg-white/[0.04]">
                    <div
                        className="pointer-events-none absolute inset-x-10 bottom-10 h-20 rounded-full blur-3xl transition-opacity duration-700"
                        style={{
                            background: `rgba(${glowRgb(glowColor)}, 0.45)`,
                            opacity: hasGlowColor ? 1 : 0.5,
                        }}
                    />
                    <Image
                        src={heroImage}
                        alt={book.coverImageAlt}
                        fill
                        sizes="(min-width: 1024px) 48vw, 90vw"
                        priority={priority}
                        onLoad={handleCoverLoad}
                        className="relative z-10 rounded-[inherit] object-cover"
                    />
                </div>

                <div className="flex flex-col justify-center py-2">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold tracking-[0.16em] text-white/48 uppercase">
                        <span>{statusCopy}</span>
                        {releaseDate && (
                            <span className="inline-flex items-center gap-1.5">
                                <CalendarClock className="size-3.5" />
                                {releaseDate}
                            </span>
                        )}
                        <span>{book.genre}</span>
                    </div>

                    <h2 className="mt-5 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                        {book.title}
                    </h2>
                    <p className="mt-5 max-w-xl text-xl leading-8 text-white/76">
                        {book.shortDescription}
                    </p>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-white/48">
                        A biblical epic designed to feel vivid, human, and
                        impossible to put down.
                    </p>

                    <div className="mt-8 max-w-xl overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
                        <div className="p-4 sm:p-5">
                            {defaultPrice !== undefined &&
                                defaultFormatOption && (
                                    <div className="flex items-start justify-between gap-5">
                                        <div>
                                            <p className="text-xs font-semibold tracking-[0.16em] text-white/42 uppercase">
                                                Paperback preorder
                                            </p>
                                            {defaultFormatOption.priceNote && (
                                                <p className="mt-1 text-sm font-medium text-emerald-100">
                                                    {
                                                        defaultFormatOption.priceNote
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-baseline gap-2 text-right">
                                            <span className="text-3xl font-semibold tabular-nums">
                                                {fmt(defaultPrice)}
                                            </span>
                                            {defaultFormatOption.compareAtPriceCents !==
                                                undefined && (
                                                <span className="text-sm font-medium text-white/38 tabular-nums line-through">
                                                    {fmt(
                                                        defaultFormatOption.compareAtPriceCents,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                            {bundleOption?.available &&
                                bundlePrice !== undefined && (
                                    <div className="mt-5 border-t border-white/10 pt-4">
                                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                            <span className="text-sm font-semibold text-white">
                                                Complete preorder bundle
                                            </span>
                                            <span className="text-sm font-semibold text-emerald-100 tabular-nums">
                                                {fmt(bundlePrice)}
                                            </span>
                                            {bundleOption.compareAtPriceCents !==
                                                undefined && (
                                                <span className="text-xs font-medium text-white/36 tabular-nums line-through">
                                                    {fmt(
                                                        bundleOption.compareAtPriceCents,
                                                    )}
                                                </span>
                                            )}
                                            {bundleOption.priceNote && (
                                                <span className="text-xs font-semibold text-emerald-100/86">
                                                    {bundleOption.priceNote}
                                                </span>
                                            )}
                                        </div>
                                        {bundleOption.description && (
                                            <p className="mt-1.5 text-xs leading-5 text-white/48">
                                                {bundleOption.description}
                                            </p>
                                        )}
                                    </div>
                                )}
                        </div>

                        <div className="border-t border-white/10 bg-black/12 p-2">
                            {book.slug === "walls" && (
                                <Link
                                    href="/books/walls/read"
                                    className="group flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 text-[#111] transition-colors hover:bg-white/90"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="flex size-9 items-center justify-center rounded-lg bg-[#111]/6">
                                            <BookOpen className="size-4" />
                                        </span>
                                        <span>
                                            <span className="block text-sm font-semibold">
                                                Read the sample
                                            </span>
                                            <span className="mt-0.5 block text-xs text-[#111]/58">
                                                First three chapters
                                            </span>
                                        </span>
                                    </span>
                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            )}
                            <div className="mt-2 grid gap-2 sm:grid-cols-3">
                                <Link
                                    href={`/books/${book.slug}`}
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white/8 px-3 text-sm font-medium text-white ring-1 ring-white/10 transition-colors hover:bg-white/12"
                                >
                                    Details
                                    <ArrowRight className="size-4" />
                                </Link>
                                {book.amazonUrl && (
                                    <Link
                                    href={book.amazonUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white/8 px-3 text-sm font-medium text-white ring-1 ring-white/10 transition-colors hover:bg-white/12"
                                >
                                    Amazon
                                    <ExternalLink className="size-4" />
                                    </Link>
                                )}
                                {isPurchasable &&
                                    !isComingSoon &&
                                    defaultFormat && (
                                        <Button
                                            size="lg"
                                            variant="ghost"
                                            onClick={handleAddToCart}
                                            disabled={added}
                                            className="h-11 justify-center gap-2 rounded-xl bg-white/8 px-3 text-white ring-1 ring-white/10 hover:bg-white/12 hover:text-white"
                                        >
                                            {added ? (
                                                <>
                                                    <Check className="size-4" />
                                                    Added
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="size-4" />
                                                    {isPreOrder
                                                        ? "Pre-order"
                                                        : "Buy"}
                                                </>
                                            )}
                                        </Button>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="pointer-events-none absolute right-0 bottom-0 h-40 w-1/2 opacity-25 blur-3xl"
                style={{
                    background: `rgba(${glowRgb(glowColorDeep)}, 0.75)`,
                }}
            />
        </article>
    )
}
