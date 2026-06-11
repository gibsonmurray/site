"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
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
    HelpCircle,
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
}

const BookImageCarousel = ({ images, alt }: CarouselProps) => {
    const [current, setCurrent] = useState(0)
    const showControls = images.length > 1

    const goTo = (index: number) =>
        setCurrent(Math.max(0, Math.min(images.length - 1, index)))

    return (
        <div className="book-media-stage">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
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
                                    className="object-contain drop-shadow-xl"
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
                            className="bg-background/90 text-foreground hover:bg-background hover:text-foreground absolute top-1/2 left-3 z-20 !-translate-y-1/2 rounded-none shadow-sm active:!-translate-y-1/2 disabled:pointer-events-none disabled:opacity-0 sm:left-4"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="size-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-lg"
                            onClick={() => goTo(current + 1)}
                            disabled={current === images.length - 1}
                            className="bg-background/90 text-foreground hover:bg-background hover:text-foreground absolute top-1/2 right-3 z-20 !-translate-y-1/2 rounded-none shadow-sm active:!-translate-y-1/2 disabled:pointer-events-none disabled:opacity-0 sm:right-4"
                            aria-label="Next image"
                        >
                            <ChevronRight className="size-5" />
                        </Button>
                    </>
                )}
            </div>

            {showControls && (
                <div className="mt-4 flex items-center justify-center gap-1.5">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Go to image ${i + 1}`}
                            className={cn(
                                "bg-foreground rounded-none transition-all",
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
            className="rounded-none bg-transparent text-[#111] shadow-2xl shadow-black/25"
        >
            <div className="rounded-none bg-[#f5f5f7] p-5 sm:p-6">
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

                <div className="mt-5 overflow-hidden rounded-none bg-white shadow-sm ring-1 ring-black/5">
                    <div className="flex items-center justify-between gap-4 border-b border-black/6 p-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-none bg-linear-to-br from-[#111] to-[#4a4a4d] text-white">
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
                        <span className="rounded-none bg-[#e9f8f2] px-2.5 py-1 text-xs font-semibold text-[#0f7b58]">
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
                        "relative inline-flex h-13 w-full items-center justify-center overflow-hidden rounded-none border border-transparent px-5 text-base font-medium whitespace-nowrap text-white transition-shadow outline-none select-none focus-visible:ring-3 focus-visible:ring-black/20 disabled:opacity-100",
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
    const router = useRouter()
    const [added, setAdded] = useState(false)
    const [isOpeningCheckout, setIsOpeningCheckout] = useState(false)

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
    const selectedPrice =
        getPrice(book.slug, selectedFormat) ??
        book.formats[selectedFormat]?.priceCents
    const selectedFormatOption = book.formats[selectedFormat]
    const offersEbook =
        book.formats.ebook?.available || book.formats.bundle?.available
    const canBuy =
        isPurchasable &&
        !isComingSoon &&
        (book.formats[selectedFormat]?.available ?? false)

    const handleBuyNow = () => {
        setIsOpeningCheckout(true)
        const checkoutParams = new URLSearchParams({
            mode: "direct",
            bookId: book.slug,
            format: selectedFormat,
            quantity: String(quantity),
        })
        router.push(`/books/checkout?${checkoutParams.toString()}`)
    }

    const handleAddToCart = () => {
        addItem(book.slug, selectedFormat, quantity)
        openCart()
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    return (
        <div className="editorial-page book-detail-page">
            <section className="book-detail-hero">
                <div className="book-detail-back">
                    <Link href="/books" className="editorial-back-link">
                        <ChevronLeft className="size-4" />
                        Books
                    </Link>
                </div>
                <div className="book-detail-grid">
                    {book.modelAssets ? (
                        <Book3DPreview
                            assets={book.modelAssets}
                            alt={book.coverImageAlt}
                        />
                    ) : (
                        <BookImageCarousel
                            images={allImages}
                            alt={book.coverImageAlt}
                        />
                    )}

                    <div className="book-detail-copy">
                        <div className="book-detail-meta">
                            <span>{statusCopy(book, isPurchasable)}</span>
                            {releaseDate && <span>{releaseDate}</span>}
                            <span>{book.genre}</span>
                        </div>

                        <h1>{book.title}</h1>
                        <p className="book-detail-description">
                            {book.shortDescription}
                        </p>
                        {reviewHeadline ? (
                            <blockquote className="book-detail-quote">
                                <div>
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <Star
                                                key={index}
                                                className="size-3.5 fill-current"
                                            />
                                        ),
                                    )}
                                    <span>Reader praise</span>
                                </div>
                                <p>“{reviewHeadline}”</p>
                            </blockquote>
                        ) : (
                            <p className="book-detail-quote">
                                A fortified city. A dangerous mercy. A promise
                                on the move.
                            </p>
                        )}
                        {(book.slug === "walls" || book.amazonUrl) && (
                            <div className="book-detail-aux-actions">
                                {book.slug === "walls" && (
                                    <Link
                                        href="/books/walls/read/chapter-1#chapter"
                                        className="book-detail-aux-link"
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
                                        className="book-detail-aux-link"
                                    >
                                        View on Amazon
                                        <AmazonLogo className="h-4 w-auto" />
                                    </Link>
                                )}
                            </div>
                        )}

                        <div className="book-detail-purchase">
                            {!isPurchasable && isPreOrder ? (
                                <PreOrderNotifyForm
                                    book={book}
                                    releaseDate={releaseDate}
                                />
                            ) : (
                                <div className="book-purchase-panel">
                                    <p className="book-purchase-label">
                                        Choose a format
                                    </p>
                                    <div className="book-format-list">
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
                                            const price =
                                                getPrice(book.slug, format) ??
                                                opt.priceCents
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
                                                        "book-format-option",
                                                        isSelected
                                                            ? "is-selected"
                                                            : opt.available
                                                              ? ""
                                                              : "is-unavailable",
                                                    )}
                                                    aria-pressed={isSelected}
                                                >
                                                    <span className="book-format-header">
                                                        <span className="book-format-name">
                                                            <Icon className="size-4 shrink-0" />
                                                            <span className="truncate text-sm leading-5 font-semibold">
                                                                {
                                                                    FORMAT_CONFIG[
                                                                        format
                                                                    ].label
                                                                }
                                                            </span>
                                                        </span>
                                                        {isSelected && (
                                                            <span className="book-format-selected">
                                                                <Check className="size-3" />
                                                                Selected
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="book-format-price">
                                                        {price !== undefined ? (
                                                            <>
                                                                <span>
                                                                    {fmt(price)}
                                                                </span>
                                                                {hasSale && (
                                                                    <span className="line-through">
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
                                                            <span className="book-format-note">
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

                                    <div className="book-purchase-summary">
                                        <div className="min-w-0">
                                            <p className="book-purchase-label">
                                                Your selection
                                            </p>
                                            <div className="book-purchase-selection">
                                                <p>
                                                    {
                                                        FORMAT_CONFIG[
                                                            selectedFormat
                                                        ].label
                                                    }
                                                </p>
                                                <p className="book-purchase-total">
                                                    {selectedPrice !==
                                                    undefined ? (
                                                        <span className="flex flex-wrap items-baseline gap-2">
                                                            <span>
                                                                {fmt(
                                                                    selectedPrice,
                                                                )}
                                                            </span>
                                                            {selectedFormatOption?.compareAtPriceCents !==
                                                                undefined && (
                                                                <span className="line-through">
                                                                    {fmt(
                                                                        selectedFormatOption.compareAtPriceCents,
                                                                    )}
                                                                </span>
                                                            )}
                                                            {selectedFormatOption?.priceNote && (
                                                                <span className="book-format-note">
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
                                            </div>
                                            {selectedFormatOption?.description && (
                                                <p className="book-purchase-description">
                                                    {
                                                        selectedFormatOption.description
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="book-quantity">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() =>
                                                    setQuantity((q) =>
                                                        Math.max(1, q - 1),
                                                    )
                                                }
                                                disabled={quantity <= 1}
                                                className="rounded-none"
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
                                                className="rounded-none"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus className="size-3.5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {canBuy ? (
                                        <div className="book-purchase-actions">
                                            <Button
                                                size="lg"
                                                onClick={handleBuyNow}
                                                disabled={isOpeningCheckout}
                                                className="book-buy-now"
                                            >
                                                <span>
                                                    {isOpeningCheckout
                                                        ? "Opening checkout..."
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
                                                className="book-add-cart"
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
                                        <p className="book-purchase-unavailable">
                                            {isComingSoon
                                                ? book.status.label
                                                : "Purchase options are not open yet."}
                                        </p>
                                    )}
                                    {offersEbook && (
                                        <Link
                                            href="/books/ebook-help"
                                            className="book-ebook-help-link"
                                        >
                                            <span className="book-ebook-help-icon">
                                                <HelpCircle aria-hidden="true" />
                                            </span>
                                            <span className="book-ebook-help-copy">
                                                <strong>
                                                    New to EPUB ebooks?
                                                </strong>
                                                See how delivery works and how
                                                to read yours on any device.
                                            </span>
                                            <ArrowRight
                                                className="book-ebook-help-arrow"
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="book-detail-principles">
                <div className="book-detail-principle-grid">
                    <div className="book-detail-principle">
                        <BookMarked className="text-primary mb-8 size-5" />
                        <h2 className="app-panel-title-sm">
                            Imagination in the Biblical world.
                        </h2>
                        <p className="app-panel-copy-sm">
                            Rooted in Scripture, written with reverence for the
                            text and curiosity about the people inside it.
                        </p>
                    </div>
                    <div className="book-detail-principle">
                        <Sparkles className="text-primary mb-8 size-5" />
                        <h2 className="app-panel-title-sm">Cinematic pace.</h2>
                        <p className="app-panel-copy-sm">
                            Political pressure, impossible choices, spiritual
                            stakes, and chapters built to keep moving.
                        </p>
                    </div>
                    <div className="book-detail-principle">
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

            {book.slug === "walls" && (
                <section className="book-detail-field-notes">
                    <div className="book-detail-field-notes-inner">
                        <div className="book-detail-field-notes-copy">
                            <p>Field notes</p>
                            <h2>Take the story somewhere beautiful.</h2>
                            <span>
                                Walls, read in the shadow of the Swiss Alps.
                            </span>
                        </div>
                        <div className="book-detail-field-notes-grid">
                            <figure className="book-detail-field-note is-tall">
                                <Image
                                    src="/books/walls-reading-window-web.jpeg"
                                    alt="Reading Walls beside a mountain view"
                                    fill
                                    sizes="(min-width: 900px) 38vw, 92vw"
                                    className="object-cover"
                                    unoptimized
                                />
                            </figure>
                            <figure className="book-detail-field-note">
                                <Image
                                    src="/books/walls-reading-mountains-web.jpeg"
                                    alt="Reading Walls outdoors in the Swiss Alps"
                                    fill
                                    sizes="(min-width: 900px) 26vw, 92vw"
                                    className="object-cover"
                                    unoptimized
                                />
                            </figure>
                            <figure className="book-detail-field-note">
                                <Image
                                    src="/books/walls-coffee-mountains-web.jpeg"
                                    alt="Walls and iced coffee with a mountain view"
                                    fill
                                    sizes="(min-width: 900px) 26vw, 92vw"
                                    className="object-cover"
                                    unoptimized
                                />
                            </figure>
                            <figure className="book-detail-field-note is-wide">
                                <Image
                                    src="/books/walls-mountain-table.jpeg"
                                    alt="Walls on a table overlooking the Swiss Alps"
                                    fill
                                    sizes="(min-width: 900px) 52vw, 92vw"
                                    className="object-cover"
                                    unoptimized
                                />
                            </figure>
                        </div>
                    </div>
                </section>
            )}

            <section className="book-detail-about">
                <div>
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

            <section className="book-detail-promise">
                <div>
                    <div className="book-detail-promise-quote">
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
