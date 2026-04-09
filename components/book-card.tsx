"use client"

import { useState, type SyntheticEvent } from "react"
import { useMutation } from "@tanstack/react-query"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Book } from "@/lib/books"
import {
    DEFAULT_GLOW,
    mixWithBlack,
    mixWithWhite,
    glowRgb,
    sampleGlowColor,
    type GlowColor,
} from "@/lib/book-glow"

interface BookCardProps {
    book: Book
    priority?: boolean
}

export const BookCard = ({ book, priority = false }: BookCardProps) => {
    const [glowColor, setGlowColor] = useState<GlowColor>(DEFAULT_GLOW)
    const [hasGlowColor, setHasGlowColor] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const isPreOrder = book.status.type === "pre-order"
    const isComingSoon = book.status.type === "coming-soon"
    const isAvailable = book.status.type === "available"

    const checkoutMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookId: book.id }),
            })
            const { url, error } = await res.json()
            if (!res.ok) throw new Error(error)
            window.location.href = url
        },
    })

    const handlePreOrder = () => {
        checkoutMutation.mutate()
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
                className="pointer-events-none absolute inset-x-0 top-0 h-1"
                style={{
                    background: `linear-gradient(90deg, rgba(${glowRgb(accentColor)}, 0.9) 0%, rgba(${glowRgb(glowColorDeep)}, 0.55) 60%, transparent 100%)`,
                }}
            />

            <div className="grid gap-5 md:grid-cols-[auto,minmax(0,1fr)] md:items-start md:gap-x-7">
                {/* Cover Image */}
                <div className="relative mx-auto w-44 shrink-0 overflow-visible md:w-52">
                    <div
                        className="pointer-events-none absolute inset-[-8%] rounded-xl blur-xl transition-opacity duration-700"
                        style={{
                            background: `radial-gradient(circle at center, rgba(${glowRgb(glowColor)}, 0.42) 0%, rgba(${glowRgb(glowColorSoft)}, 0.2) 42%, transparent 70%)`,
                            opacity: hasGlowColor ? 1 : 0.7,
                        }}
                    />
                    <div
                        className="relative aspect-5/8 w-full overflow-hidden rounded-md shadow-[0_18px_48px_rgba(0,0,0,0.22)]"
                        style={{
                            boxShadow: coverShadow,
                        }}
                    >
                        <Image
                            src={book.coverImageSrc}
                            alt={book.coverImageAlt}
                            fill
                            sizes="(max-width: 768px) 9rem, (max-width: 1200px) 12rem, 15rem"
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
                            <p className="text-muted-foreground mt-1 text-xs">
                                {book.genre}
                            </p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs">
                            {isPreOrder
                                ? "Pre-order"
                                : isComingSoon
                                  ? "Coming soon"
                                  : "Available"}
                        </Badge>
                    </div>

                    {/* Hook - subtle */}
                    <p className="text-muted-foreground text-sm leading-snug">
                        {book.shortDescription}
                    </p>

                    {/* Expandable Details */}
                    {!isExpanded && (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="text-primary hover:text-primary/80 w-fit text-xs font-medium transition-colors"
                        >
                            Learn more →
                        </button>
                    )}

                    {isExpanded && (
                        <div className="border-border/50 bg-background/50 space-y-2 rounded-lg border p-4">
                            {book.longDescription.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className="text-muted-foreground text-sm leading-relaxed"
                                >
                                    {paragraph}
                                </p>
                            ))}
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="text-primary hover:text-primary/80 mt-3 text-xs font-medium transition-colors"
                            >
                                ← Show less
                            </button>
                        </div>
                    )}
                    <div className="mt-auto flex flex-col gap-3">
                        {isPreOrder ? (
                            <>
                                <Button
                                    size="lg"
                                    onClick={handlePreOrder}
                                    disabled={checkoutMutation.isPending}
                                    className="w-full py-6 text-base font-semibold"
                                >
                                    {checkoutMutation.isPending
                                        ? "Redirecting..."
                                        : "Pre-order"}
                                </Button>
                                <p className="text-muted-foreground text-center text-xs">
                                    {`Releases ${
                                        (
                                            book.status as {
                                                type: "pre-order"
                                                label?: string
                                                releaseDate: string
                                            }
                                        ).releaseDate
                                    }`}
                                </p>
                            </>
                        ) : isComingSoon ? (
                            <div className="border-border/50 bg-background/50 rounded-lg border p-4 text-center">
                                <p className="text-muted-foreground text-sm font-medium">
                                    {book.status.label}
                                </p>
                            </div>
                        ) : (
                            <Button
                                size="lg"
                                onClick={handlePreOrder}
                                disabled={checkoutMutation.isPending}
                                className="w-full py-6 text-base font-semibold"
                            >
                                {checkoutMutation.isPending
                                    ? "Redirecting..."
                                    : "Get now"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    )
}
