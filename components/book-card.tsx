"use client"

import { useState, type SyntheticEvent } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
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

    const handleCoverLoad = (event: SyntheticEvent<HTMLImageElement>) => {
        void (async () => {
            const nextGlowColor = await sampleGlowColor(event.currentTarget)
            setGlowColor(nextGlowColor)
            setHasGlowColor(true)
        })()
    }

    const glowColorSoft = mixWithWhite(glowColor, 0.35)
    const glowColorDeep = mixWithBlack(glowColor, 0.18)
    const coverShadow = hasGlowColor
        ? `0 0 0 1px rgba(255,255,255,0.06), 0 0 18px rgba(${glowRgb(glowColorDeep)}, 0.22), 0 0 46px rgba(${glowRgb(glowColor)}, 0.1)`
        : `0 0 0 1px rgba(255,255,255,0.06), 0 18px 48px rgba(0,0,0,0.22), 0 0 18px rgba(${glowRgb(glowColorDeep)}, 0.1), 0 0 46px rgba(${glowRgb(glowColor)}, 0.05)`

    return (
        <article className="border-border/65 bg-background/80 overflow-hidden rounded-xl border p-5">
            <div className="grid gap-4 md:h-60 md:grid-cols-[auto,minmax(0,1fr)] md:grid-rows-[auto,minmax(0,1fr)] md:gap-x-6 md:gap-y-3">
                {/* Cover Image */}
                <div className="relative order-2 mx-auto h-60 min-w-36 shrink-0 overflow-visible md:order-1 md:row-span-2 md:mx-0 md:h-60 md:w-auto">
                    <div
                        className="pointer-events-none absolute inset-[-8%] rounded-xl blur-xl transition-opacity duration-700"
                        style={{
                            background: `radial-gradient(circle at center, rgba(${glowRgb(glowColor)}, 0.42) 0%, rgba(${glowRgb(glowColorSoft)}, 0.2) 42%, transparent 70%)`,
                            opacity: hasGlowColor ? 1 : 0.7,
                        }}
                    />
                    <div
                        className="relative h-full w-full overflow-hidden rounded-md shadow-[0_18px_48px_rgba(0,0,0,0.22)]"
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
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Title and Badge */}
                <div className="order-1 flex justify-between gap-3 md:order-2 md:col-start-2">
                    <div className="flex flex-col">
                        <h2 className="text-foreground text-xl font-semibold tracking-tight">
                            {book.title}
                        </h2>
                        <p className="text-muted-foreground text-xs">
                            {book.genre}
                        </p>
                    </div>
                    {book.status.type === "coming-soon" ? (
                        <Badge variant="default" className="shrink-0 text-xs">
                            {book.status.label}
                        </Badge>
                    ) : null}
                </div>

                {/* Description */}
                <div className="order-3 flex min-h-0 flex-col gap-3 md:col-start-2 md:overflow-y-auto md:pr-1">
                    <p className="text-foreground text-sm font-bold">
                        {book.shortDescription}
                    </p>
                    {book.longDescription.map((paragraph) => (
                        <p
                            key={paragraph}
                            className="text-foreground/80 text-sm leading-relaxed"
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </article>
    )
}
