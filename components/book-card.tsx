"use client"

import { useState, type SyntheticEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowRight,
    CalendarClock,
    Check,
    ShoppingCart,
    Tag,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Book, BookFormat, BookFormatOption } from "@/lib/books"
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

export const BookCard = ({ book, priority = false }: BookCardProps) => {
    const [glowColor, setGlowColor] = useState<GlowColor>(DEFAULT_GLOW)
    const [hasGlowColor, setHasGlowColor] = useState(false)
    const [added, setAdded] = useState(false)

    const isPreOrder = book.status.type === "pre-order"
    const isComingSoon = book.status.type === "coming-soon"

    const releaseDate = isPreOrder
        ? (book.status as { type: "pre-order"; releaseDate: string }).releaseDate
        : null

    const { addItem, openCart } = useCartStore()

    const defaultFormat = (
        Object.entries(book.formats) as [BookFormat, BookFormatOption][]
    ).find(([, opt]) => opt.available)?.[0]

    const handleAddToCart = () => {
        if (!defaultFormat) return
        addItem(book.id, defaultFormat, 1)
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
    const glowColorDeep = mixWithBlack(glowColor, 0.18)
    const accentColor = mixWithWhite(glowColor, 0.18)
    const coverShadow = hasGlowColor
        ? `0 0 0 1px rgba(255,255,255,0.06), 0 0 18px rgba(${glowRgb(glowColorDeep)}, 0.22), 0 0 46px rgba(${glowRgb(glowColor)}, 0.1)`
        : `0 0 0 1px rgba(255,255,255,0.06), 0 18px 48px rgba(0,0,0,0.22), 0 0 18px rgba(${glowRgb(glowColorDeep)}, 0.1), 0 0 46px rgba(${glowRgb(glowColor)}, 0.05)`

    return (
        <article
            className="border-border/70 bg-card/90 relative overflow-hidden rounded-2xl border p-5 shadow-[0_16px_48px_rgba(0,0,0,0.08)] sm:p-6"
            style={{
                backgroundImage: `linear-gradient(140deg, rgba(${glowRgb(glowColorSoft)}, 0.14) 0%, transparent 50%)`,
            }}
        >
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                    background: `linear-gradient(90deg, rgba(${glowRgb(accentColor)}, 0.9) 0%, rgba(${glowRgb(glowColorDeep)}, 0.55) 60%, transparent 100%)`,
                }}
            />

            <div className="grid gap-5 md:grid-cols-[auto,minmax(0,1fr)] md:items-start md:gap-x-7">
                {/* Cover */}
                <div className="relative mx-auto w-40 shrink-0 overflow-visible md:w-48">
                    <div
                        className="pointer-events-none absolute inset-[-8%] rounded-xl blur-xl transition-opacity duration-700"
                        style={{
                            background: `radial-gradient(circle at center, rgba(${glowRgb(glowColor)}, 0.42) 0%, rgba(${glowRgb(glowColorSoft)}, 0.2) 42%, transparent 70%)`,
                            opacity: hasGlowColor ? 1 : 0.7,
                        }}
                    />
                    <div
                        className="relative aspect-5/8 w-full overflow-hidden rounded-md"
                        style={{ boxShadow: coverShadow }}
                    >
                        <Image
                            src={book.coverImageSrc}
                            alt={book.coverImageAlt}
                            fill
                            sizes="(max-width: 768px) 10rem, 12rem"
                            priority={priority}
                            onLoad={handleCoverLoad}
                            className="object-contain"
                        />
                    </div>
                </div>

                <div className="flex min-w-0 flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-foreground text-2xl font-semibold tracking-tight">
                                {book.title}
                            </h2>
                            <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                                <Tag className="size-3" />
                                {book.genre}
                            </p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs">
                            {isPreOrder ? (
                                <span className="flex items-center gap-1">
                                    <CalendarClock className="size-3" />
                                    Pre-order
                                </span>
                            ) : isComingSoon ? (
                                "Coming soon"
                            ) : (
                                "Available"
                            )}
                        </Badge>
                    </div>

                    <p className="text-muted-foreground text-sm leading-snug">
                        {book.shortDescription}
                    </p>

                    <div className="mt-auto flex flex-col gap-2">
                        {isComingSoon ? (
                            <div className="border-border/50 bg-background/50 rounded-lg border p-4 text-center">
                                <p className="text-muted-foreground text-sm font-medium">
                                    {book.status.label}
                                </p>
                            </div>
                        ) : (
                            <>
                                <Button
                                    size="lg"
                                    className="w-full gap-2 py-6 font-semibold"
                                    onClick={handleAddToCart}
                                    disabled={!defaultFormat || added}
                                >
                                    {added ? (
                                        <>
                                            <Check className="size-4" />
                                            Added to cart
                                        </>
                                    ) : isPreOrder ? (
                                        <>
                                            <ShoppingCart className="size-4" />
                                            Pre-order
                                            {releaseDate && (
                                                <span className="text-primary-foreground/60 ml-0.5 font-normal">
                                                    · {releaseDate}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="size-4" />
                                            Add to cart
                                        </>
                                    )}
                                </Button>
                                <Link
                                    href={`/books/${book.slug}`}
                                    className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 text-sm transition-colors"
                                >
                                    View more info
                                    <ArrowRight className="size-3" />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </article>
    )
}
