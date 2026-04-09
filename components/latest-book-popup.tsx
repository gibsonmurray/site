"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { latestBook } from "@/lib/books"

const DISMISS_KEY = "latest-book-popup-dismissed-v1"

export default function LatestBookPopup() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const dismissed = window.localStorage.getItem(DISMISS_KEY)
        if (!dismissed) {
            setIsOpen(true)
        }
    }, [])

    const dismissPopup = () => {
        window.localStorage.setItem(DISMISS_KEY, "true")
        setIsOpen(false)
    }

    if (!isOpen) {
        return null
    }

    if (!latestBook) {
        return null
    }

    return (
        <div className="fixed right-4 bottom-4 z-50 w-[calc(100%-2rem)] max-w-sm sm:right-6 sm:bottom-6">
            <div className="border-border bg-background/95 supports-backdrop-filter:bg-background/90 rounded-xl border p-3 shadow-xl backdrop-blur-sm">
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] uppercase">
                            Latest Book
                        </Badge>
                        <p className="text-foreground text-sm font-semibold">
                            {latestBook.title}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={dismissPopup}
                        className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
                        aria-label="Dismiss latest book popup"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="mb-3 flex gap-3">
                    <Image
                        src={latestBook.coverImageSrc}
                        alt={latestBook.coverImageAlt}
                        width={96}
                        height={144}
                        className="w-20 shrink-0 rounded-md border object-cover"
                    />
                    <div className="space-y-1">
                        {latestBook.status.type === "coming-soon" ? (
                            <Badge variant="default" className="text-[10px]">
                                {latestBook.status.label}
                            </Badge>
                        ) : null}
                        <p className="text-muted-foreground text-xs leading-relaxed">
                            {latestBook.shortDescription}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link href="/books" className="flex-1">
                        <Button size="sm" className="w-full">
                            See Book Details
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        className="px-3"
                        onClick={dismissPopup}
                    >
                        Later
                    </Button>
                </div>
            </div>
        </div>
    )
}