"use client"

import { useCallback, useRef, useState, type SyntheticEvent } from "react"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import {
    Bell,
    BookMarked,
    BookOpen,
    Check,
    ChevronLeft,
    ChevronRight,
    Feather,
    Headphones,
    Minus,
    Plus,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Tablet,
    type LucideIcon,
} from "lucide-react"
import { Book3DPreview } from "@/components/book-3d-preview"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
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
import { usePricesStore } from "@/lib/prices-store"
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

type CarouselProps = {
    images: string[]
    alt: string
    glowColor: GlowColor
    glowColorSoft: GlowColor
    hasGlowColor: boolean
    onFirstLoad: (e: SyntheticEvent<HTMLImageElement>) => void
}

const BookImageCarousel = ({
    images,
    alt,
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
        <div className="relative overflow-hidden rounded-[2rem] bg-white/[0.06] p-4 sm:p-6">
            <div
                className="pointer-events-none absolute inset-x-8 bottom-14 h-24 rounded-full blur-3xl transition-opacity duration-700"
                style={{
                    background: `rgba(${glowRgb(glowColor)}, 0.5)`,
                    opacity: hasGlowColor ? 1 : 0.45,
                }}
            />
            <div
                className="pointer-events-none absolute inset-[-20%] blur-3xl"
                style={{
                    background: `radial-gradient(circle at center, rgba(${glowRgb(glowColorSoft)}, 0.18), transparent 48%)`,
                }}
            />

            <div className="relative z-10 aspect-[4/3] w-full overflow-hidden rounded-[1.5rem]">
                <div
                    className="flex h-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {images.map((src, i) => (
                        <div
                            key={src}
                            className="relative h-full w-full shrink-0 p-2 sm:p-4"
                        >
                            <div className="relative h-full w-full">
                                <Image
                                    src={src}
                                    alt={`${alt}${images.length > 1 ? `, view ${i + 1}` : ""}`}
                                    fill
                                    sizes="(min-width: 1024px) 48vw, 88vw"
                                    priority={i === 0}
                                    onLoad={i === 0 ? onFirstLoad : undefined}
                                    className="object-contain drop-shadow-2xl"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {showControls && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon-lg"
                            onClick={() => goTo(current - 1)}
                            disabled={current === 0}
                            className="absolute top-1/2 left-3 z-20 !-translate-y-1/2 rounded-full bg-black/28 text-white backdrop-blur-md hover:bg-black/40 hover:text-white active:!-translate-y-1/2 disabled:pointer-events-none disabled:opacity-0 sm:left-4"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="size-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-lg"
                            onClick={() => goTo(current + 1)}
                            disabled={current === images.length - 1}
                            className="absolute top-1/2 right-3 z-20 !-translate-y-1/2 rounded-full bg-black/28 text-white backdrop-blur-md hover:bg-black/40 hover:text-white active:!-translate-y-1/2 disabled:pointer-events-none disabled:opacity-0 sm:right-4"
                            aria-label="Next image"
                        >
                            <ChevronRight className="size-5" />
                        </Button>
                    </>
                )}
            </div>

            {showControls && (
                <div className="relative z-10 mt-4 flex items-center justify-center gap-1.5">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Go to image ${i + 1}`}
                            className={cn(
                                "rounded-full bg-white transition-all",
                                i === current
                                    ? "h-1.5 w-5 opacity-85"
                                    : "size-1.5 opacity-28 hover:opacity-55",
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

const PreOrderNotifyForm = ({
    book,
    releaseDate,
}: {
    book: Book
    releaseDate: string | null
}) => {
    const [submitted, setSubmitted] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const mutation = useMutation({
        mutationFn: async (email: string) => {
            const res = await fetch("/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, bookSlug: book.slug }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? "Something went wrong")
        },
        onSuccess: () => setSubmitted(true),
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const email = inputRef.current?.value.trim() ?? ""
        if (email) mutation.mutate(email)
    }

    if (submitted) {
        return (
            <div className="app-panel-dark">
                <div className="flex flex-1 items-center gap-3">
                    <Check className="text-primary size-5 shrink-0" />
                    <span className="font-medium">
                        You are on the list. I will send an update when
                        pre-orders open.
                    </span>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="app-panel-dark">
            <div>
                <p className="text-2xl font-semibold tracking-tight text-white">
                    Pre-order opening soon
                </p>
                {releaseDate && (
                    <p className="mt-2 text-base leading-7 text-white/55">
                        Releasing {releaseDate}
                    </p>
                )}
            </div>
            <div className="app-panel-action flex flex-col gap-3 sm:flex-row">
                <Input
                    ref={inputRef}
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="h-12 flex-1 rounded-full border-white/15 bg-white/10 px-5 text-base text-white placeholder:text-white/35"
                />
                <Button
                    type="submit"
                    size="lg"
                    disabled={mutation.isPending}
                    className="h-12 rounded-full bg-white px-5 text-base text-[#111] hover:bg-white/90 sm:shrink-0"
                >
                    <Bell className="size-4" />
                    {mutation.isPending ? "..." : "Notify me"}
                </Button>
            </div>
            {mutation.isError && (
                <p className="text-destructive mt-2 text-xs">
                    {mutation.error?.message ??
                        "Something went wrong. Try again."}
                </p>
            )}
        </form>
    )
}

const statusCopy = (book: Book, isPurchasable: boolean) => {
    if (book.status.type === "pre-order" && !isPurchasable) {
        return "Pre-order opening soon"
    }
    if (book.status.type === "pre-order")
        return book.status.label ?? "Pre-order"
    if (book.status.type === "coming-soon") return book.status.label
    return book.status.label ?? "Available now"
}

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
    const getPrice = usePricesStore((s) => s.getPrice)

    const isPreOrder = book.status.type === "pre-order"
    const isComingSoon = book.status.type === "coming-soon"
    const isPurchasable = book.purchasable !== false
    const releaseDate =
        book.status.type === "pre-order" ? book.status.releaseDate : null
    const selectedPrice = getPrice(book.slug, selectedFormat)
    const canBuy =
        isPurchasable &&
        !isComingSoon &&
        (book.formats[selectedFormat]?.available ?? false)

    const buyNowMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: [
                        { bookId: book.slug, format: selectedFormat, quantity },
                    ],
                }),
            })
            const { url, error } = await res.json()
            if (!res.ok) throw new Error(error)
            window.location.href = url
        },
    })

    const handleAddToCart = () => {
        addItem(book.slug, selectedFormat, quantity)
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

    const handleModelFrontImageLoad = useCallback(
        (imageElement: HTMLImageElement) => {
            void (async () => {
                const nextGlowColor = await sampleGlowColor(imageElement)
                setGlowColor(nextGlowColor)
                setHasGlowColor(true)
            })()
        },
        [],
    )

    const glowColorSoft = mixWithWhite(glowColor, 0.35)
    const glowColorDeep = mixWithBlack(glowColor, 0.18)

    return (
        <div className="pt-8">
            <section
                className="relative overflow-hidden bg-[#111] text-white"
                style={{
                    backgroundImage: `radial-gradient(circle at 75% 16%, rgba(${glowRgb(glowColorSoft)}, 0.2), transparent 32%), radial-gradient(circle at 20% 86%, rgba(${glowRgb(glowColorDeep)}, 0.34), transparent 34%)`,
                }}
            >
                <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:py-16">
                    {book.modelAssets ? (
                        <Book3DPreview
                            assets={book.modelAssets}
                            alt={book.coverImageAlt}
                            glowColor={glowColor}
                            glowColorSoft={glowColorSoft}
                            hasGlowColor={hasGlowColor}
                            onFrontImageLoad={handleModelFrontImageLoad}
                        />
                    ) : (
                        <BookImageCarousel
                            images={allImages}
                            alt={book.coverImageAlt}
                            glowColor={glowColor}
                            glowColorSoft={glowColorSoft}
                            hasGlowColor={hasGlowColor}
                            onFirstLoad={handleFirstImageLoad}
                        />
                    )}

                    <div className="flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/65">
                            <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                                {statusCopy(book, isPurchasable)}
                            </span>
                            {releaseDate && (
                                <span className="rounded-full bg-white/10 px-3 py-1">
                                    {releaseDate}
                                </span>
                            )}
                            <span className="rounded-full bg-white/10 px-3 py-1">
                                {book.genre}
                            </span>
                        </div>

                        <h1 className="mt-6 text-6xl font-semibold tracking-tight text-balance sm:text-7xl">
                            {book.title}
                        </h1>
                        <p className="mt-6 max-w-xl text-xl leading-8 text-white/72">
                            {book.shortDescription}
                        </p>
                        <p className="mt-5 max-w-xl text-sm leading-7 text-white/52">
                            A fortified city. A dangerous mercy. A promise on
                            the move.
                        </p>

                        <div className="mt-8">
                            {!isPurchasable && isPreOrder ? (
                                <PreOrderNotifyForm
                                    book={book}
                                    releaseDate={releaseDate}
                                />
                            ) : (
                                <div className="app-panel-dark">
                                    <div className="grid gap-2 sm:grid-cols-3">
                                        {(
                                            Object.entries(book.formats) as [
                                                BookFormat,
                                                BookFormatOption,
                                            ][]
                                        ).map(([format, opt]) => {
                                            const isSelected =
                                                selectedFormat === format &&
                                                opt.available
                                            const Icon =
                                                FORMAT_CONFIG[format].icon
                                            const price = getPrice(
                                                book.slug,
                                                format,
                                            )
                                            const btn = (
                                                <Button
                                                    key={format}
                                                    variant="ghost"
                                                    disabled={!opt.available}
                                                    onClick={() =>
                                                        opt.available &&
                                                        setSelectedFormat(
                                                            format,
                                                        )
                                                    }
                                                    className={cn(
                                                        "h-auto w-full flex-col items-start gap-2 rounded-2xl border px-4 py-3 text-left text-white hover:bg-white/10 hover:text-white",
                                                        isSelected
                                                            ? "border-white/45 bg-white/14"
                                                            : opt.available
                                                              ? "border-white/12 bg-white/5"
                                                              : "border-white/8 bg-white/[0.03] text-white/32",
                                                    )}
                                                >
                                                    <Icon className="size-4" />
                                                    <span className="text-sm font-semibold">
                                                        {
                                                            FORMAT_CONFIG[
                                                                format
                                                            ].label
                                                        }
                                                    </span>
                                                    <span className="text-xs font-normal text-white/55">
                                                        {price !== undefined
                                                            ? fmt(price)
                                                            : "Coming soon"}
                                                    </span>
                                                </Button>
                                            )

                                            return opt.available ? (
                                                <div key={format}>{btn}</div>
                                            ) : (
                                                <Tooltip key={format}>
                                                    <TooltipTrigger
                                                        render={
                                                            <span className="block" />
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

                                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                                        <div>
                                            <p className="text-xs font-medium text-white/45">
                                                Price
                                            </p>
                                            <p className="text-lg font-semibold tabular-nums">
                                                {selectedPrice !== undefined
                                                    ? fmt(selectedPrice)
                                                    : "Coming soon"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 rounded-full bg-white/8 p-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() =>
                                                    setQuantity((q) =>
                                                        Math.max(1, q - 1),
                                                    )
                                                }
                                                disabled={quantity <= 1}
                                                className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus className="size-3.5" />
                                            </Button>
                                            <span className="w-8 text-center text-sm font-semibold tabular-nums">
                                                {quantity}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() =>
                                                    setQuantity((q) =>
                                                        Math.min(99, q + 1),
                                                    )
                                                }
                                                disabled={quantity >= 99}
                                                className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="size-3.5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {canBuy ? (
                                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                            <Button
                                                size="lg"
                                                onClick={() =>
                                                    buyNowMutation.mutate()
                                                }
                                                disabled={
                                                    buyNowMutation.isPending
                                                }
                                                className="h-12 rounded-full bg-white text-[#111] hover:bg-white/90"
                                            >
                                                {buyNowMutation.isPending
                                                    ? "Redirecting..."
                                                    : isPreOrder
                                                      ? "Pre-order now"
                                                      : "Buy now"}
                                            </Button>
                                            <Button
                                                size="lg"
                                                variant="ghost"
                                                onClick={handleAddToCart}
                                                disabled={added}
                                                className="h-12 rounded-full bg-white/10 text-white hover:bg-white/16 hover:text-white"
                                            >
                                                {added ? (
                                                    <>
                                                        <Check className="size-4" />
                                                        Added
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart className="size-4" />
                                                        Add to cart
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    ) : (
                                        <p className="mt-4 rounded-[1.25rem] bg-white/7 p-4 text-center text-sm font-medium text-white/65">
                                            {isComingSoon
                                                ? book.status.label
                                                : "Purchase options are not open yet."}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-background">
                <div className="mx-auto grid max-w-6xl gap-8 px-6 py-18 sm:px-8 lg:grid-cols-3 lg:py-24">
                    <div className="app-panel-compact">
                        <BookMarked className="text-primary mb-8 size-5" />
                        <h2 className="app-panel-title-sm">
                            Biblical imagination.
                        </h2>
                        <p className="app-panel-copy-sm">
                            Rooted in Scripture, written with reverence for the
                            text and curiosity about the people inside it.
                        </p>
                    </div>
                    <div className="app-panel-compact">
                        <Sparkles className="text-primary mb-8 size-5" />
                        <h2 className="app-panel-title-sm">Cinematic pace.</h2>
                        <p className="app-panel-copy-sm">
                            Political pressure, impossible choices, spiritual
                            stakes, and chapters built to keep moving.
                        </p>
                    </div>
                    <div className="app-panel-compact">
                        <ShieldCheck className="text-primary mb-8 size-5" />
                        <h2 className="app-panel-title-sm">
                            Faith under fire.
                        </h2>
                        <p className="app-panel-copy-sm">
                            A story about courage, holiness, mercy, and what God
                            can do through unlikely obedience.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-muted/35">
                <div className="mx-auto grid max-w-6xl gap-12 px-6 py-18 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
                    <div>
                        <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                            About the book
                        </p>
                        <h2 className="text-foreground mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                            Ancient walls. Human hearts. Divine promise.
                        </h2>
                    </div>
                    <div className="space-y-6">
                        {book.longDescription.map((paragraph, i) => (
                            <p
                                key={i}
                                className="text-foreground/78 text-lg leading-8"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-background">
                <div className="mx-auto grid max-w-6xl gap-8 px-6 py-18 sm:px-8 lg:grid-cols-[1fr_1fr] lg:py-24">
                    <div className="app-panel-dark-solid">
                        <Feather className="text-primary mb-10 size-5" />
                        <p className="text-3xl leading-tight font-semibold tracking-tight text-balance">
                            Written for readers who want biblical fiction to
                            feel both faithful and alive.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                            Reader promise
                        </p>
                        <h2 className="text-foreground mt-4 text-4xl font-semibold tracking-tight">
                            Reverent, vivid, and built to move.
                        </h2>
                        <p className="text-muted-foreground mt-5 text-sm leading-7">
                            The aim is not to replace Scripture, but to send you
                            back to it with a larger imagination for the people,
                            places, fear, faith, and mercy moving through the
                            biblical story.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
