"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { cn, widgetSurface } from "@/lib/widget-design"
import type { WidgetDefinition } from "@/lib/widgets"

type VerseWidgetProps = {
    widget: WidgetDefinition
}

type VerseResponse = {
    imageUrl?: string
}

const VERSE_OF_THE_DAY_URL = "https://www.bible.com/verse-of-the-day"

export function VerseWidget({ widget }: VerseWidgetProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null)

    useEffect(() => {
        const controller = new AbortController()

        async function loadVerseImage() {
            try {
                const response = await fetch("/api/verse-of-the-day", {
                    signal: controller.signal,
                })
                if (!response.ok) return

                const data = (await response.json()) as VerseResponse
                if (data.imageUrl) setImageUrl(data.imageUrl)
            } catch {
                // The linked fallback remains usable when Bible.com is unavailable.
            }
        }

        void loadVerseImage()
        return () => controller.abort()
    }, [])

    return (
        <a
            className={cn(
                widgetSurface,
                "widget-interactive isolate grid place-items-center p-0",
            )}
            href={widget.url ?? VERSE_OF_THE_DAY_URL}
            target="_blank"
            rel="noreferrer"
            draggable={false}
            aria-label="Open Bible.com Verse of the Day in a new tab"
            onPointerDownCapture={(event) => event.stopPropagation()}
        >
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt="Bible.com Verse of the Day artwork"
                    fill
                    draggable={false}
                    sizes="(max-width: 759px) 50vw, 15rem"
                    className="object-cover"
                />
            ) : (
                <span className="max-w-[10ch] text-center text-[1rem] leading-[1.08] font-[620] tracking-[-0.035em] text-[#555]">
                    Verse of the Day
                </span>
            )}
        </a>
    )
}
