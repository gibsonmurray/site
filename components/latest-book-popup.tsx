"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { latestBook } from "@/lib/books"

const DISMISS_KEY = "latest-book-popup-dismissed-v1"

export default function LatestBookPopup() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const dismissed = window.localStorage.getItem(DISMISS_KEY)
        if (!dismissed) setIsOpen(true)
    }, [])

    const dismissPopup = () => {
        window.localStorage.setItem(DISMISS_KEY, "true")
        setIsOpen(false)
    }

    if (!isOpen || !latestBook) return null

    const bookHref = `/books/${latestBook.slug}`

    return (
        <div className="fixed right-4 bottom-4 z-50 w-[calc(100%-2rem)] max-w-sm sm:right-6 sm:bottom-6">
            <div className="border-border bg-background/95 supports-backdrop-filter:bg-background/90 rounded-2xl border p-4 shadow-2xl backdrop-blur-sm">
                {/* Header */}
                <div className="mb-3 flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                        Latest Book
                    </Badge>
                    <button
                        type="button"
                        onClick={dismissPopup}
                        className="text-muted-foreground hover:text-foreground -mr-1 rounded-lg p-1.5 transition-colors"
                        aria-label="Dismiss"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {/* Book info */}
                <Link href={bookHref} onClick={dismissPopup} className="group mb-4 flex gap-3">
                    <Image
                        src={latestBook.coverImageSrc}
                        alt={latestBook.coverImageAlt}
                        width={72}
                        height={108}
                        className="w-[72px] shrink-0 rounded-md object-cover shadow-md transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                    <div className="flex flex-col gap-1 pt-0.5">
                        <p className="text-foreground font-semibold leading-tight">
                            {latestBook.title}
                        </p>
                        <p className="text-muted-foreground text-xs font-medium">
                            {latestBook.genre}
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                            {latestBook.shortDescription}
                        </p>
                    </div>
                </Link>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <Button
                        className="w-full gap-2 font-semibold"
                        render={<Link href={bookHref} onClick={dismissPopup} />}
                    >
                        {latestBook.status.type === "pre-order" &&
                        latestBook.purchasable !== false
                            ? "Pre-order now"
                            : "See book details"}
                        <ArrowRight className="size-4" />
                    </Button>
                    <button
                        onClick={dismissPopup}
                        className="text-muted-foreground hover:text-foreground w-full py-1 text-sm transition-colors"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    )
}
