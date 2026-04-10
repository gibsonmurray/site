"use client"

import { useState, type SyntheticEvent } from "react"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import {
    BookOpen,
    Check,
    ChevronLeft,
    ChevronRight,
    Headphones,
    Minus,
    Plus,
    ShoppingCart,
    Tablet,
    type LucideIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
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
import { cn } from "@/lib/utils"

const FORMAT_CONFIG: Record<BookFormat, { label: string; icon: LucideIcon }> = {
    paperback: { label: "Paperback", icon: BookOpen },
    ebook: { label: "eBook", icon: Tablet },
    audiobook: { label: "Audiobook", icon: Headphones },
}

const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(cents / 100)

// ─── Carousel ────────────────────────────────────────────────────────────────

type CarouselProps = {
    images: string[]
    alt: string
    coverShadow: string
    glowColor: GlowColor
    glowColorSoft: GlowColor
    hasGlowColor: boolean
    onFirstLoad: (e: SyntheticEvent<HTMLImageElement>) => void
}

const BookImageCarousel = ({
    images,
    alt,
    coverShadow,
    glowColor,
    glowColorSoft,
    hasGlowColor,
    onFirstLoad,
}: CarouselProps) => {
    const [current, setCurrent] = useState(0)
    const showControls = images.length > 1

    const goTo = (index: number) =>
        setCurrent(Math.max(0, Math.min(images.length - 1, index)))

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-full px-10">
                {/* Glow halo */}
                <div
                    className="pointer-events-none absolute inset-[-14%] rounded-2xl blur-2xl transition-opacity duration-1000"
                    style={{
                        background: `radial-gradient(ellipse at center, rgba(${glowRgb(glowColor)}, 0.5) 0%, rgba(${glowRgb(glowColorSoft)}, 0.25) 50%, transparent 72%)`,
                        opacity: hasGlowColor ? 1 : 0.5,
                    }}
                />

                {/* Clipping frame */}
                <div
                    className="relative aspect-square size-100 w-full overflow-hidden rounded-lg"
                    style={{ boxShadow: coverShadow }}
                >
                    {/* Sliding strip — absolute so height is guaranteed */}
                    <div
                        className="absolute inset-0 flex transition-transform duration-300 ease-in-out"
                        style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                        {images.map((src, i) => (
                            <div
                                key={src}
                                className="relative size-full shrink-0"
                            >
                                <Image
                                    src={src}
                                    alt={`${alt}${images.length > 1 ? ` — ${i + 1} of ${images.length}` : ""}`}
                                    width={1000}
                                    height={1000}
                                    priority={i === 0}
                                    onLoad={i === 0 ? onFirstLoad : undefined}
                                    className="size-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prev / Next arrows */}
                {showControls && (
                    <>
                        <button
                            onClick={() => goTo(current - 1)}
                            disabled={current === 0}
                            className="bg-background/80 border-border hover:bg-background absolute top-1/2 -left-5 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-all disabled:opacity-0"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                        <button
                            onClick={() => goTo(current + 1)}
                            disabled={current === images.length - 1}
                            className="bg-background/80 border-border hover:bg-background absolute top-1/2 -right-5 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-all disabled:opacity-0"
                            aria-label="Next image"
                        >
                            <ChevronRight className="size-5" />
                        </button>
                    </>
                )}
            </div>

            {/* Dot indicators */}
            {showControls && (
                <div className="flex items-center gap-1.5">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Go to image ${i + 1}`}
                            className={cn(
                                "bg-foreground rounded-full transition-all duration-300",
                                i === current
                                    ? "h-1.5 w-4 opacity-70"
                                    : "size-1.5 opacity-20 hover:opacity-40",
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export const BookDetailClient = ({ book }: { book: Book }) => {
    const [glowColor, setGlowColor] = useState<GlowColor>(DEFAULT_GLOW)
    const [hasGlowColor, setHasGlowColor] = useState(false)
    const [added, setAdded] = useState(false)

    const allImages =
        book.images && book.images.length > 0
            ? book.images
            : [book.coverImageSrc]

    const defaultFormat =
        (Object.entries(book.formats) as [BookFormat, BookFormatOption][]).find(
            ([, opt]) => opt.available,
        )?.[0] ?? "paperback"

    const [selectedFormat, setSelectedFormat] =
        useState<BookFormat>(defaultFormat)
    const [quantity, setQuantity] = useState(1)

    const { addItem, openCart } = useCartStore()

    const isPreOrder = book.status.type === "pre-order"
    const isComingSoon = book.status.type === "coming-soon"
    const canBuy =
        !isComingSoon && (book.formats[selectedFormat]?.available ?? false)
    const selectedFormatOption = book.formats[selectedFormat]
    const selectedPrice = selectedFormatOption?.price

    const buyNowMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: [
                        { bookId: book.id, format: selectedFormat, quantity },
                    ],
                }),
            })
            const { url, error } = await res.json()
            if (!res.ok) throw new Error(error)
            window.location.href = url
        },
    })

    const handleAddToCart = () => {
        addItem(book.id, selectedFormat, quantity)
        openCart()
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    const handleFirstImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
        void (async () => {
            const nextGlowColor = await sampleGlowColor(event.currentTarget)
            setGlowColor(nextGlowColor)
            setHasGlowColor(true)
        })()
    }

    const glowColorSoft = mixWithWhite(glowColor, 0.35)
    const glowColorDeep = mixWithBlack(glowColor, 0.18)
    const coverShadow = hasGlowColor
        ? `0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(${glowRgb(glowColorDeep)}, 0.35), 0 0 60px rgba(${glowRgb(glowColor)}, 0.18)`
        : `0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.28)`

    const releaseDate = isPreOrder
        ? (book.status as { type: "pre-order"; releaseDate: string })
              .releaseDate
        : null

    return (
        <div className="flex flex-col gap-8 md:gap-10">
            {/* Carousel */}
            <BookImageCarousel
                images={allImages}
                alt={book.coverImageAlt}
                coverShadow={coverShadow}
                glowColor={glowColor}
                glowColorSoft={glowColorSoft}
                hasGlowColor={hasGlowColor}
                onFirstLoad={handleFirstImageLoad}
            />

            <div className="flex flex-col gap-7">
                {/* Title block */}
                <div className="flex flex-col items-center gap-1.5 text-center">
                    <Badge variant="outline" className="text-xs">
                        {isPreOrder
                            ? "Pre-order"
                            : isComingSoon
                              ? "Coming soon"
                              : "Available"}
                    </Badge>
                    <h1 className="text-foreground text-3xl font-bold tracking-tight">
                        {book.title}
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {book.genre}
                    </p>
                </div>

                {/* Short description */}
                <p className="text-muted-foreground mx-auto max-w-prose text-center text-sm leading-relaxed">
                    {book.shortDescription}
                </p>

                {/* Purchase section */}
                <div className="border-border/60 bg-muted/20 flex flex-col gap-4 rounded-2xl border p-4 sm:p-5">
                    {/* Format */}
                    <div className="flex flex-col gap-3">
                        <span className="text-foreground text-sm font-semibold">
                            Format
                        </span>
                        <div className="flex gap-2">
                            {(
                                Object.entries(book.formats) as [
                                    BookFormat,
                                    BookFormatOption,
                                ][]
                            ).map(([format, opt]) => {
                                const isSelected =
                                    selectedFormat === format && opt.available
                                const Icon = FORMAT_CONFIG[format].icon
                                const btn = (
                                    <button
                                        key={format}
                                        disabled={!opt.available}
                                        onClick={() =>
                                            opt.available &&
                                            setSelectedFormat(format)
                                        }
                                        className={cn(
                                            "flex w-full flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-xs font-medium transition-all",
                                            isSelected
                                                ? "border-primary/40 bg-primary/5 text-foreground shadow-sm"
                                                : opt.available
                                                  ? "border-border text-muted-foreground hover:border-primary/20 hover:text-foreground cursor-pointer"
                                                  : "border-border/40 text-muted-foreground/40 cursor-not-allowed",
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                "size-4",
                                                isSelected
                                                    ? "text-primary"
                                                    : "text-current",
                                            )}
                                        />
                                        {FORMAT_CONFIG[format].label}
                                        <span className="text-[11px] font-normal opacity-75">
                                            {opt.price !== undefined
                                                ? fmt(opt.price)
                                                : "Coming soon"}
                                        </span>
                                    </button>
                                )
                                return opt.available ? (
                                    <div key={format} className="flex flex-1">
                                        {btn}
                                    </div>
                                ) : (
                                    <Tooltip key={format}>
                                        <TooltipTrigger
                                            render={
                                                <span className="flex flex-1 cursor-not-allowed" />
                                            }
                                        >
                                            {btn}
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            Coming soon
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            })}
                        </div>
                    </div>

                    <div className="border-border/50 flex items-center justify-between border-t pt-4">
                        <span className="text-foreground text-sm font-semibold">
                            Price
                        </span>
                        {selectedPrice !== undefined ? (
                            <span className="text-foreground text-sm font-semibold tabular-nums">
                                {fmt(selectedPrice)}
                            </span>
                        ) : (
                            <span className="text-muted-foreground text-sm">
                                Price coming soon
                            </span>
                        )}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between">
                        <span className="text-foreground text-sm font-semibold">
                            Quantity
                        </span>
                        <div className="border-border bg-muted/40 flex items-center gap-1 rounded-xl border p-1">
                            <button
                                onClick={() =>
                                    setQuantity((q) => Math.max(1, q - 1))
                                }
                                disabled={quantity <= 1}
                                className="text-muted-foreground hover:text-foreground flex size-7 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Decrease quantity"
                            >
                                <Minus className="size-3.5" />
                            </button>
                            <span className="text-foreground w-8 text-center text-sm font-semibold tabular-nums">
                                {quantity}
                            </span>
                            <button
                                onClick={() =>
                                    setQuantity((q) => Math.min(99, q + 1))
                                }
                                disabled={quantity >= 99}
                                className="text-muted-foreground hover:text-foreground flex size-7 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Increase quantity"
                            >
                                <Plus className="size-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* CTAs */}
                    {canBuy ? (
                        <div className="border-border/50 flex flex-col gap-2.5 border-t pt-4">
                            <Button
                                size="lg"
                                onClick={() => buyNowMutation.mutate()}
                                disabled={buyNowMutation.isPending}
                                className="w-full py-6 text-base font-semibold"
                            >
                                {buyNowMutation.isPending
                                    ? "Redirecting..."
                                    : isPreOrder
                                      ? "Pre-order now"
                                      : "Buy now"}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleAddToCart}
                                disabled={added}
                                className="w-full gap-2 py-6 font-semibold"
                            >
                                {added ? (
                                    <>
                                        <Check className="size-4" />
                                        Added to cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="size-4" />
                                        Add to cart
                                    </>
                                )}
                            </Button>
                            {releaseDate && (
                                <p className="text-muted-foreground text-center text-xs">
                                    Ships {releaseDate}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="border-border/50 bg-muted/30 border-t pt-4 text-center">
                            <p className="text-muted-foreground text-sm font-medium">
                                {isComingSoon
                                    ? book.status.label
                                    : "Not available"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* About */}
            <div className="border-border/50 flex flex-col gap-4 border-t pt-8">
                <h2 className="text-foreground text-sm font-semibold">
                    About this book
                </h2>
                {book.longDescription.map((paragraph, i) => (
                    <p
                        key={i}
                        className="text-muted-foreground text-sm leading-relaxed"
                    >
                        {paragraph}
                    </p>
                ))}
            </div>
        </div>
    )
}
