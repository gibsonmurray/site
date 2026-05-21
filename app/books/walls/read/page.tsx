import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowRight,
    BookOpen,
    ChevronDown,
    ChevronLeft,
    ShoppingCart,
} from "lucide-react"
import { books } from "@/lib/books"
import { AUTHOR_NAME, makeOgImage, personSchema } from "@/lib/seo"
import { baseUrl } from "@/app/sitemap"
import sample from "@/data/walls-sample.json"

const book = books.find((item) => item.slug === "walls")!
const sampleUrl = `${baseUrl}/books/walls/read`

export const metadata: Metadata = {
    title: {
        absolute: `Read ${book.title}: First Three Chapters by ${AUTHOR_NAME}`,
    },
    description:
        "Read the first three chapters of Walls, Gibson Murray's biblical fiction novel about Joshua, Jericho, Rahab, Salmon, and Phinehas.",
    authors: [{ name: AUTHOR_NAME, url: baseUrl }],
    alternates: {
        canonical: sampleUrl,
    },
    openGraph: {
        title: `Read ${book.title}: First Three Chapters`,
        description:
            "Start reading the first three chapters of Walls right on the site.",
        url: sampleUrl,
        type: "article",
        images: [
            {
                url: makeOgImage({
                    title: `Read ${book.title}`,
                    image: book.images?.[0] ?? book.coverImageSrc,
                }),
                alt: book.coverImageAlt,
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `Read ${book.title}: First Three Chapters`,
        description:
            "Start reading the first three chapters of Walls right on the site.",
        images: [
            makeOgImage({
                title: `Read ${book.title}`,
                image: book.images?.[0] ?? book.coverImageSrc,
            }),
        ],
    },
}

const totalWords = sample.chapters.reduce(
    (sum, chapter) => sum + chapter.wordCount,
    0,
)

const readingMinutes = Math.max(1, Math.round(totalWords / 240))

const copyrightDetails = [
    "Copyright © 2026 by Gibson Murray. All rights reserved.",
    "No portion of this book may be reproduced in any form without written permission from the publisher or author, except as permitted by U.S. copyright law.",
    "Edited by LeaAda Marshall and Eden Sung. Cover design by Danny Beaton.",
    "Isaiah 53:5 is taken from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. ESV Text Edition: 2025.",
    "All other Scripture taken from the New King James Version®. Copyright © 1982 by Thomas Nelson. Used by permission. All rights reserved.",
]

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        personSchema,
        {
            "@type": "WebPage",
            "@id": `${sampleUrl}#webpage`,
            name: `Read ${book.title}: First Three Chapters`,
            description: metadata.description,
            url: sampleUrl,
            isPartOf: {
                "@id": `${baseUrl}/#website`,
            },
            about: {
                "@id": `${baseUrl}/books/walls#book`,
            },
            author: {
                "@id": `${baseUrl}/#person`,
            },
        },
    ],
}

const ChapterLinks = ({ className = "" }: { className?: string }) => (
    <div className={className}>
        {sample.chapters.map((chapter) => (
            <a
                key={chapter.id}
                href={`#${chapter.id}`}
                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full px-2 py-1.5 transition-colors"
            >
                {chapter.title}
            </a>
        ))}
    </div>
)

const WallsSamplePage = () => {
    return (
        <section className="bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="relative overflow-hidden bg-[#111] text-white">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_12%,rgba(163,107,60,0.32),transparent_32%),radial-gradient(circle_at_18%_82%,rgba(23,109,84,0.24),transparent_30%)]" />
                <div className="relative mx-auto max-w-6xl px-6 pt-8 sm:px-8">
                    <Link
                        href="/books/walls"
                        className="inline-flex items-center gap-1 text-sm text-white/55 transition-colors hover:text-white/90"
                    >
                        <ChevronLeft className="size-4" />
                        Walls
                    </Link>
                </div>
                <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[1fr_0.55fr] lg:py-18">
                    <div className="flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-white/65">
                            <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                                Free sample
                            </span>
                            <span className="rounded-full bg-white/10 px-3 py-1">
                                {sample.chapters.length} chapters
                            </span>
                            <span className="rounded-full bg-white/10 px-3 py-1">
                                {readingMinutes} min read
                            </span>
                        </div>
                        <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
                            Read the first three chapters of {book.title}.
                        </h1>
                        <p className="mt-6 max-w-2xl text-xl leading-8 text-white/72">
                            Begin in the camp of Israel as Joshua, Salmon, and
                            Phinehas stand at the edge of the promise and the
                            fight ahead.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <a
                                href="#chapter-1"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#111] transition-colors hover:bg-white/90"
                            >
                                <BookOpen className="size-4" />
                                Start reading
                            </a>
                            <Link
                                href="/books/walls"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-sm font-medium text-white transition-colors hover:bg-white/16"
                            >
                                <ShoppingCart className="size-4" />
                                Pre-order Walls
                            </Link>
                        </div>
                    </div>

                    <div className="relative mx-auto aspect-[5/8] w-full max-w-72 overflow-hidden rounded-[1.4rem] bg-white/[0.06] shadow-2xl ring-1 shadow-black/40 ring-white/12 sm:max-w-80 lg:mx-0 lg:justify-self-end">
                        <Image
                            src={book.coverImageSrc}
                            alt={book.coverImageAlt}
                            fill
                            loading="eager"
                            sizes="(min-width: 1024px) 320px, 72vw"
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>

            <div className="border-border/65 bg-background/95 sticky top-12 z-30 border-b px-6 py-3 backdrop-blur-xl sm:px-8 lg:hidden">
                <details className="group mx-auto max-w-3xl">
                    <summary className="border-border/70 bg-background hover:bg-muted/45 flex h-10 cursor-pointer list-none items-center justify-between rounded-xl border px-4 text-sm font-medium transition-colors [&::-webkit-details-marker]:hidden">
                        <span>Chapters</span>
                        <span className="text-muted-foreground inline-flex items-center gap-2 text-xs">
                            {sample.chapters.length} chapters
                            <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                        </span>
                    </summary>
                    <nav
                        className="border-border/70 bg-background mt-2 grid gap-1 rounded-xl border p-3 text-sm"
                        aria-label="Sample chapters"
                    >
                        <ChapterLinks className="grid gap-1" />
                    </nav>
                </details>
            </div>

            <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:py-16">
                <aside className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
                    <nav
                        className="border-border/65 bg-background rounded-[1.5rem] border p-4 text-sm"
                        aria-label="Sample chapters"
                    >
                        <p className="text-muted-foreground px-2 text-xs font-semibold tracking-[0.18em] uppercase">
                            Chapters
                        </p>
                        <ChapterLinks className="mt-3 grid gap-1" />
                    </nav>
                </aside>

                <div className="min-w-0 space-y-16">
                    {sample.chapters.map((chapter) => (
                        <article
                            key={chapter.id}
                            id={chapter.id}
                            className="scroll-mt-32 lg:scroll-mt-20"
                        >
                            <header className="border-border/70 mx-auto max-w-3xl border-b pb-6">
                                <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                                    {book.title}
                                </p>
                                <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                                    {chapter.title}
                                </h2>
                                <p className="text-muted-foreground mt-3 text-sm">
                                    {chapter.wordCount.toLocaleString()} words
                                </p>
                            </header>
                            <div
                                className="walls-reader mx-auto mt-8 max-w-3xl"
                                dangerouslySetInnerHTML={{
                                    __html: chapter.bodyHtml,
                                }}
                            />
                        </article>
                    ))}

                    <div className="mx-auto max-w-3xl rounded-[2rem] bg-[#111] p-6 text-white sm:p-8">
                        <p className="text-2xl font-semibold tracking-tight">
                            Keep reading when {book.title} releases.
                        </p>
                        <p className="mt-3 text-sm leading-6 text-white/60">
                            Pre-order the paperback, eBook, or complete bundle
                            and step back into Jericho on launch day.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/books/walls"
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#111] transition-colors hover:bg-white/90"
                            >
                                Pre-order Walls
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>

                    <footer className="border-border/70 text-muted-foreground mx-auto max-w-3xl border-t pt-8 text-xs leading-6">
                        <h2 className="text-foreground text-sm font-semibold">
                            Copyright Details
                        </h2>
                        <div className="mt-3 space-y-2">
                            {copyrightDetails.map((detail) => (
                                <p key={detail}>{detail}</p>
                            ))}
                        </div>
                    </footer>
                </div>
            </div>
        </section>
    )
}

export default WallsSamplePage
