"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getFeaturedReviewHeadline, latestBook } from "@/lib/books"

const DISMISS_KEY = "latest-book-popup-dismissed-v1"

export const LatestBookPopup = () => {
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
    const reviewHeadline = getFeaturedReviewHeadline(latestBook)

    return (
        <div className="fixed right-4 bottom-4 z-50 w-[calc(100%-2rem)] max-w-sm sm:right-6 sm:bottom-6">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#111]/95 p-4 text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
                {/* Header */}
                <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                        Latest Book
                    </p>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={dismissPopup}
                        className="-mr-1 rounded-full text-white/55 hover:bg-white/10 hover:text-white"
                        aria-label="Dismiss"
                    >
                        <X className="size-4" />
                    </Button>
                </div>

                {/* Book info */}
                <Link
                    href={bookHref}
                    onClick={dismissPopup}
                    className="group mb-5 flex gap-4"
                >
                    <Image
                        src={latestBook.coverImageSrc}
                        alt={latestBook.coverImageAlt}
                        width={72}
                        height={108}
                        className="w-[76px] shrink-0 rounded-xl object-cover shadow-xl shadow-black/30 transition-transform duration-200 group-hover:scale-[1.02]"
                    />
                    <div className="flex flex-col gap-1 pt-0.5">
                        <p className="leading-tight font-semibold text-white">
                            {latestBook.title}
                        </p>
                        <p className="text-xs font-medium text-white/55">
                            {latestBook.genre}
                        </p>
                        <p className="mt-0.5 line-clamp-3 text-xs leading-relaxed text-white/62">
                            {reviewHeadline ?? latestBook.shortDescription}
                        </p>
                    </div>
                </Link>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <Button
                        className="w-full rounded-full bg-white font-semibold text-[#111] hover:bg-white/90"
                        render={<Link href={bookHref} onClick={dismissPopup} />}
                    >
                        {latestBook.status.type === "pre-order" &&
                        latestBook.purchasable !== false
                            ? "Pre-order now"
                            : "See book details"}
                        <ArrowRight className="size-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={dismissPopup}
                        className="w-full rounded-full text-sm text-white/60 hover:bg-white/10 hover:text-white"
                    >
                        Maybe later
                    </Button>
                </div>
            </div>
        </div>
    )
}
