"use client"

import { useState, type SyntheticEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowRight,
    BookOpen,
    CalendarClock,
    Check,
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
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/65">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                            {statusCopy}
                        </span>
                        {releaseDate && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
                                <CalendarClock className="size-3.5" />
                                {releaseDate}
                            </span>
                        )}
                        <span className="rounded-full bg-white/10 px-3 py-1">
                            {book.genre}
                        </span>
                    </div>

                    <h2 className="mt-6 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                        {book.title}
                    </h2>
                    <p className="mt-5 max-w-xl text-xl leading-8 text-white/72">
                        {book.shortDescription}
                    </p>
                    <p className="mt-5 max-w-xl text-sm leading-7 text-white/50">
                        A biblical epic designed to feel vivid, human, and
                        impossible to put down.
                    </p>
                    {defaultPrice !== undefined && defaultFormatOption && (
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <span className="text-2xl font-semibold tabular-nums">
                                {fmt(defaultPrice)}
                            </span>
                            {defaultFormatOption.compareAtPriceCents !==
                                undefined && (
                                <span className="text-sm font-medium text-white/42 tabular-nums line-through">
                                    {fmt(
                                        defaultFormatOption.compareAtPriceCents,
                                    )}
                                </span>
                            )}
                            {defaultFormatOption.priceNote && (
                                <span className="rounded-full bg-emerald-400/16 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-300/20">
                                    {defaultFormatOption.priceNote}
                                </span>
                            )}
                        </div>
                    )}
                    {bundleOption?.available && bundlePrice !== undefined && (
                        <div className="mt-4 max-w-xl rounded-2xl bg-white/8 px-4 py-3 ring-1 ring-white/10">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-white">
                                    Complete preorder bundle
                                </span>
                                <span className="text-sm font-semibold text-emerald-100 tabular-nums">
                                    {fmt(bundlePrice)}
                                </span>
                                {bundleOption.compareAtPriceCents !==
                                    undefined && (
                                    <span className="text-xs font-medium text-white/38 tabular-nums line-through">
                                        {fmt(bundleOption.compareAtPriceCents)}
                                    </span>
                                )}
                                {bundleOption.priceNote && (
                                    <span className="rounded-full bg-emerald-400/16 px-2.5 py-0.5 text-[0.7rem] font-semibold text-emerald-100 ring-1 ring-emerald-300/20">
                                        {bundleOption.priceNote}
                                    </span>
                                )}
                            </div>
                            {bundleOption.description && (
                                <p className="mt-1.5 text-xs leading-5 text-white/52">
                                    {bundleOption.description}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="mt-9 flex flex-wrap items-center gap-3">
                        {book.slug === "walls" && (
                            <Link
                                href="/books/walls/read"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#111] transition-colors hover:bg-white/90"
                            >
                                <BookOpen className="size-4" />
                                Read sample
                            </Link>
                        )}
                        <Link
                            href={`/books/${book.slug}`}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-medium text-white transition-colors hover:bg-white/16"
                        >
                            Learn more
                            <ArrowRight className="size-4" />
                        </Link>
                        {isPurchasable && !isComingSoon && defaultFormat && (
                            <Button
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={added}
                                className="h-11 rounded-full bg-white/10 px-5 text-white hover:bg-white/16"
                            >
                                {added ? (
                                    <>
                                        <Check className="size-4" />
                                        Added
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="size-4" />
                                        {isPreOrder ? "Pre-order" : "Buy"}
                                    </>
                                )}
                            </Button>
                        )}
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
