"use client"

import { useCallback, useRef, useState, type SyntheticEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { useMutation } from "@tanstack/react-query"
import { AnimatePresence, motion } from "motion/react"
import {
    Bell,
    BookMarked,
    BookOpen,
    ArrowRight,
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Feather,
    Headphones,
    Mail,
    Minus,
    PackageCheck,
    Plus,
    Send,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Star,
    Tablet,
    type LucideIcon,
} from "lucide-react"
import dynamic from "next/dynamic"
import { AmazonLogo } from "@/components/amazon-logo"

const Book3DPreview = dynamic(
    () =>
        import("@/components/book-3d-preview").then((m) => ({
            default: m.Book3DPreview,
        })),
    { ssr: false },
)
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import {
    Book,
    BookFormat,
    BookFormatOption,
    getFeaturedReviewHeadline,
} from "@/lib/books"
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
    bundle: { label: "Complete bundle", icon: PackageCheck },
}

const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
    }).format(cents / 100)

const PREORDER_CONFIRMATION_MIN_MS = 850

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

const ApplePaySpinner = () => (
    <span className="apple-pay-spinner" aria-hidden="true" />
)

const ButtonCheckmark = () => (
    <svg viewBox="0 0 52 52" className="size-5" aria-hidden="true">
        <path
            className="apple-pay-checkmark-path"
            d="M14 27.2 22.1 35 38.5 17.8"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="5"
        />
    </svg>
)

const PreOrderNotifyForm = ({
    book,
    releaseDate,
}: {
    book: Book
    releaseDate: string | null
}) => {
    const [email, setEmail] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const mutation = useMutation({
        mutationFn: async (email: string) => {
            const animationDelay = new Promise((resolve) =>
                setTimeout(resolve, PREORDER_CONFIRMATION_MIN_MS),
            )
            const res = await fetch("/api/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, bookSlug: book.slug }),
            })
            const data = await res.json()
            await animationDelay
            if (!res.ok) throw new Error(data.error ?? "Something went wrong")
        },
        onSuccess: () => setSubmitted(true),
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const nextEmail = inputRef.current?.value.trim() ?? ""
        if (nextEmail) {
            setEmail(nextEmail)
            mutation.mutate(nextEmail)
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        if (submitted) {
            setSubmitted(false)
        }
        if (mutation.isError) {
            mutation.reset()
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] bg-transparent text-[#111] shadow-2xl shadow-black/25"
        >
            <div className="rounded-[1.45rem] bg-[#f5f5f7] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.18em] text-black/42 uppercase">
                            Preorder alert
                        </p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight">
                            Claim your first-in-line ping
                        </p>
                    </div>
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#111] text-white shadow-sm">
                        <Bell className="size-5" />
                    </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-[1.2rem] bg-white shadow-sm ring-1 ring-black/5">
                    <div className="flex items-center justify-between gap-4 border-b border-black/6 p-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#111] to-[#4a4a4d] text-white">
                                <CreditCard className="size-4" />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                    {book.title}
                                </p>
                                <p className="mt-0.5 text-xs text-black/45">
                                    Preorder notification pass
                                </p>
                            </div>
                        </div>
                        <span className="rounded-full bg-[#e9f8f2] px-2.5 py-1 text-xs font-semibold text-[#0f7b58]">
                            Free
                        </span>
                    </div>

                    {releaseDate && (
                        <div className="flex items-center justify-between gap-4 border-b border-black/6 px-4 py-3">
                            <div className="flex items-center gap-2 text-sm text-black/55">
                                <Calendar className="size-4" />
                                <span>Release window</span>
                            </div>
                            <span className="text-sm font-medium">
                                {releaseDate}
                            </span>
                        </div>
                    )}

                    <label className="flex items-center gap-3 px-4 py-3">
                        <Mail className="size-4 shrink-0 text-black/38" />
                        <Input
                            ref={inputRef}
                            value={email}
                            onChange={handleEmailChange}
                            type="email"
                            disabled={mutation.isPending}
                            required
                            placeholder="your@email.com"
                            aria-label="Email address for preorder notifications"
                            className="h-10 border-0 bg-transparent px-0 text-base text-[#111] shadow-none placeholder:text-black/35 focus-visible:ring-0 disabled:bg-transparent disabled:text-black/58 disabled:opacity-100 md:text-sm"
                        />
                    </label>
                </div>

                <p className="my-5 px-1 text-center text-xs leading-5 font-medium text-black/45">
                    One preorder alert, one launch note, and no extra noise.
                </p>

                <motion.button
                    layout
                    type="submit"
                    disabled={mutation.isPending || submitted}
                    animate={{
                        backgroundColor: submitted
                            ? "#34c759"
                            : mutation.isPending
                              ? "#1c1c1e"
                              : "#111111",
                        scale: mutation.isPending ? 0.985 : 1,
                    }}
                    whileTap={
                        mutation.isPending || submitted
                            ? undefined
                            : { scale: 0.985 }
                    }
                    transition={{
                        type: "spring",
                        stiffness: 520,
                        damping: 38,
                        mass: 0.75,
                    }}
                    className={cn(
                        "relative inline-flex h-13 w-full items-center justify-center overflow-hidden rounded-full border border-transparent px-5 text-base font-medium whitespace-nowrap text-white transition-shadow outline-none select-none focus-visible:ring-3 focus-visible:ring-black/20 disabled:opacity-100",
                        mutation.isPending && "shadow-inner",
                        submitted && "shadow-lg shadow-[#34c759]/24",
                    )}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {submitted ? (
                            <motion.span
                                key="confirmed"
                                className="absolute inset-0 flex items-center justify-center gap-2"
                                initial={{
                                    y: 10,
                                    opacity: 0,
                                    filter: "blur(6px)",
                                }}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                    filter: "blur(0px)",
                                }}
                                exit={{
                                    y: -10,
                                    opacity: 0,
                                    filter: "blur(6px)",
                                }}
                                transition={{
                                    duration: 0.24,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                <ButtonCheckmark />
                                Notifications on
                            </motion.span>
                        ) : mutation.isPending ? (
                            <motion.span
                                key="processing"
                                className="absolute inset-0 flex items-center justify-center gap-2"
                                initial={{
                                    y: 10,
                                    opacity: 0,
                                    filter: "blur(6px)",
                                }}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                    filter: "blur(0px)",
                                }}
                                exit={{
                                    y: -10,
                                    opacity: 0,
                                    filter: "blur(6px)",
                                }}
                                transition={{
                                    duration: 0.22,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                <ApplePaySpinner />
                                Processing
                            </motion.span>
                        ) : (
                            <motion.span
                                key="ready"
                                className="absolute inset-0 flex items-center justify-center gap-2"
                                initial={{
                                    y: 10,
                                    opacity: 0,
                                    filter: "blur(6px)",
                                }}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                    filter: "blur(0px)",
                                }}
                                exit={{
                                    y: -10,
                                    opacity: 0,
                                    filter: "blur(6px)",
                                }}
                                transition={{
                                    duration: 0.22,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                <Send className="size-4" />
                                Confirm notification
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>

                {mutation.isError && (
                    <p className="text-destructive mt-3 text-sm">
                        {mutation.error?.message ??
                            "Something went wrong. Try again."}
                    </p>
                )}
            </div>
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
    const reviewHeadline = getFeaturedReviewHeadline(book)
    const selectedPrice = getPrice(book.slug, selectedFormat)
    const selectedFormatOption = book.formats[selectedFormat]
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
        <div>
            <section
                className="relative overflow-hidden bg-[#111] text-white"
                style={{
                    backgroundImage: `radial-gradient(circle at 75% 16%, rgba(${glowRgb(glowColorSoft)}, 0.2), transparent 32%), radial-gradient(circle at 20% 86%, rgba(${glowRgb(glowColorDeep)}, 0.34), transparent 34%)`,
                }}
            >
                <div className="mx-auto max-w-6xl px-6 pt-8 sm:px-8">
                    <Link
                        href="/books"
                        className="inline-flex items-center gap-1 text-sm text-white/50 transition-colors hover:text-white/90"
                    >
                        <ChevronLeft className="size-4" />
                        Books
                    </Link>
                </div>
                <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-2 lg:py-16">
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
                        <p className="mt-6 max-w-none text-xl leading-8 text-white/72 lg:max-w-xl">
                            {book.shortDescription}
                        </p>
                        {reviewHeadline ? (
                            <div className="mt-6 max-w-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 lg:max-w-xl">
                                <div className="mb-2 flex items-center gap-1.5 text-emerald-100">
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <Star
                                                key={index}
                                                className="size-3.5 fill-current"
                                            />
                                        ),
                                    )}
                                    <span className="ml-2 text-xs font-semibold tracking-[0.16em] text-white/44 uppercase">
                                        Reader praise
                                    </span>
                                </div>
                                <p className="text-sm leading-6 font-medium text-white/82">
                                    “{reviewHeadline}”
                                </p>
                            </div>
                        ) : (
                            <p className="mt-5 max-w-none text-sm leading-7 text-white/52 lg:max-w-xl">
                                A fortified city. A dangerous mercy. A promise
                                on the move.
                            </p>
                        )}
                        {(book.slug === "walls" || book.amazonUrl) && (
                            <div className="mt-7 grid gap-3">
                                {book.slug === "walls" && (
                                    <Link
                                        href="/books/walls/read/chapter-1#chapter"
                                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white/10 px-4 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-white/16"
                                    >
                                        <BookOpen className="size-4" />
                                        Read the first 3 chapters
                                        <ArrowRight className="size-4" />
                                    </Link>
                                )}
                                {book.amazonUrl && (
                                    <Link
                                        href={book.amazonUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-medium whitespace-nowrap text-[#111] transition-colors hover:bg-white/90"
                                    >
                                        View on Amazon
                                        <AmazonLogo className="h-4 w-auto" />
                                    </Link>
                                )}
                            </div>
                        )}

                        <div className="mt-8">
                            {!isPurchasable && isPreOrder ? (
                                <PreOrderNotifyForm
                                    book={book}
                                    releaseDate={releaseDate}
                                />
                            ) : (
                                <div className="app-panel-dark">
                                    <div className="grid auto-rows-fr gap-2 sm:grid-cols-2">
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
                                            const hasSale =
                                                opt.compareAtPriceCents !==
                                                    undefined &&
                                                price !== undefined
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
                                                        "h-full min-h-24 w-full min-w-0 flex-col items-start justify-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-left whitespace-normal text-white hover:bg-white/10 hover:text-white",
                                                        isSelected
                                                            ? "border-white/45 bg-white/14"
                                                            : opt.available
                                                              ? "border-white/12 bg-white/5"
                                                              : "border-white/8 bg-white/[0.03] text-white/32",
                                                    )}
                                                >
                                                    <span className="flex max-w-full items-center gap-2">
                                                        <Icon className="size-4 shrink-0" />
                                                        <span className="truncate text-sm leading-5 font-semibold">
                                                            {
                                                                FORMAT_CONFIG[
                                                                    format
                                                                ].label
                                                            }
                                                        </span>
                                                    </span>
                                                    <span className="flex min-h-6 max-w-full flex-wrap items-center gap-2 text-xs font-normal whitespace-normal text-white/55">
                                                        {price !== undefined ? (
                                                            <>
                                                                <span>
                                                                    {fmt(price)}
                                                                </span>
                                                                {hasSale && (
                                                                    <span className="text-white/32 line-through">
                                                                        {fmt(
                                                                            opt.compareAtPriceCents!,
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span>
                                                                Coming soon
                                                            </span>
                                                        )}
                                                        {opt.priceNote && (
                                                            <span className="rounded-full bg-emerald-400/14 px-2 py-0.5 text-[0.68rem] font-semibold text-emerald-100 ring-1 ring-emerald-300/18">
                                                                {opt.priceNote}
                                                            </span>
                                                        )}
                                                    </span>
                                                </Button>
                                            )

                                            return opt.available ? (
                                                <div
                                                    key={format}
                                                    className="h-full"
                                                >
                                                    {btn}
                                                </div>
                                            ) : (
                                                <Tooltip key={format}>
                                                    <TooltipTrigger
                                                        render={
                                                            <span className="block h-full" />
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
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-white/45">
                                                Price
                                            </p>
                                            <p className="text-lg font-semibold tabular-nums">
                                                {selectedPrice !== undefined ? (
                                                    <span className="flex flex-wrap items-baseline gap-2">
                                                        <span>
                                                            {fmt(selectedPrice)}
                                                        </span>
                                                        {selectedFormatOption?.compareAtPriceCents !==
                                                            undefined && (
                                                            <span className="text-sm font-medium text-white/35 line-through">
                                                                {fmt(
                                                                    selectedFormatOption.compareAtPriceCents,
                                                                )}
                                                            </span>
                                                        )}
                                                        {selectedFormatOption?.priceNote && (
                                                            <span className="text-xs font-semibold text-emerald-100">
                                                                {
                                                                    selectedFormatOption.priceNote
                                                                }
                                                            </span>
                                                        )}
                                                    </span>
                                                ) : (
                                                    "Coming soon"
                                                )}
                                            </p>
                                            {selectedFormatOption?.description && (
                                                <p className="mt-1 max-w-md text-xs leading-5 text-white/45">
                                                    {
                                                        selectedFormatOption.description
                                                    }
                                                </p>
                                            )}
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
                                        <div className="mt-4 grid gap-2">
                                            <Button
                                                size="lg"
                                                onClick={() =>
                                                    buyNowMutation.mutate()
                                                }
                                                disabled={
                                                    buyNowMutation.isPending
                                                }
                                                className="h-12 justify-between rounded-xl bg-white px-4 text-[#111] hover:bg-white/90"
                                            >
                                                <span>
                                                    {buyNowMutation.isPending
                                                        ? "Redirecting..."
                                                        : isPreOrder
                                                          ? "Pre-order now"
                                                          : "Buy now"}
                                                </span>
                                                <CreditCard className="size-4" />
                                            </Button>
                                            <Button
                                                size="lg"
                                                variant="ghost"
                                                onClick={handleAddToCart}
                                                disabled={added}
                                                className="h-12 justify-between rounded-xl bg-white/10 px-4 text-white hover:bg-white/16 hover:text-white"
                                            >
                                                {added ? (
                                                    <>
                                                        <span>Added</span>
                                                        <Check className="size-4" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Add to cart</span>
                                                        <ShoppingCart className="size-4" />
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
                            Imagination in the Biblical world.
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
