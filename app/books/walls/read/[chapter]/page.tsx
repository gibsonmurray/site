import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
    ArrowRight,
    BookOpen,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ShoppingCart,
} from "lucide-react"
import { books } from "@/lib/books"
import {
    AUTHOR_NAME,
    SITE_NAME,
    absoluteUrl,
    makeBreadcrumbSchema,
    makeOgImage,
    personSchema,
} from "@/lib/seo"
import { baseUrl } from "@/app/sitemap"
import sample from "@/data/walls-sample.json"

const book = books.find((item) => item.slug === "walls")!
const sampleBasePath = "/books/walls/read"
const sampleBaseUrl = `${baseUrl}${sampleBasePath}`

type Props = {
    params: Promise<{ chapter: string }>
}

const getChapterUrl = (chapterId: string) => `${sampleBaseUrl}/${chapterId}`
const getChapterPath = (chapterId: string) =>
    `${sampleBasePath}/${chapterId}#chapter`
const getChapter = (chapterId: string) =>
    sample.chapters.find((chapter) => chapter.id === chapterId)

export const generateStaticParams = () =>
    sample.chapters.map((chapter) => ({
        chapter: chapter.id,
    }))

export const generateMetadata = async ({
    params,
}: Props): Promise<Metadata> => {
    const { chapter: chapterId } = await params
    const chapter = getChapter(chapterId)

    if (!chapter) return {}

    const title = `Read ${book.title}: ${chapter.title} by ${AUTHOR_NAME}`
    const description = `${chapter.title} from the free Walls reading sample by Gibson Murray.`
    const url = getChapterUrl(chapter.id)
    const ogImage = makeOgImage({
        title: `Read ${book.title}: ${chapter.title}`,
        image: book.images?.[0] ?? book.coverImageSrc,
    })

    return {
        title: {
            absolute: title,
        },
        description,
        authors: [{ name: AUTHOR_NAME, url: baseUrl }],
        keywords: [
            "Walls sample chapters",
            "Read Walls by Gibson Murray",
            "biblical fiction sample",
            "Christian fiction sample",
            "Jericho biblical fiction",
            chapter.title,
        ],
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: `Read ${book.title}: ${chapter.title}`,
            description,
            url,
            type: "article",
            images: [
                {
                    url: ogImage,
                    alt: book.coverImageAlt,
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `Read ${book.title}: ${chapter.title}`,
            description,
            images: [ogImage],
        },
        other: {
            thumbnail: absoluteUrl(book.coverImageSrc),
        },
    }
}

const getReadingMinutes = (wordCount: number) =>
    Math.max(1, Math.round(wordCount / 240))

const copyrightDetails = [
    "Copyright © 2026 by Gibson Murray. All rights reserved.",
    "No portion of this book may be reproduced in any form without written permission from the publisher or author, except as permitted by U.S. copyright law.",
    "Edited by LeaAda Marshall and Eden Sung. Cover design by Danny Beaton.",
    "Isaiah 53:5 is taken from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. ESV Text Edition: 2025.",
    "All other Scripture taken from the New King James Version®. Copyright © 1982 by Thomas Nelson. Used by permission. All rights reserved.",
]

const getJsonLd = (
    chapter: (typeof sample.chapters)[number],
    chapterIndex: number,
    readingMinutes: number,
) => {
    const chapterUrl = getChapterUrl(chapter.id)

    return {
        "@context": "https://schema.org",
        "@graph": [
            personSchema,
            {
                "@type": "WebPage",
                "@id": `${chapterUrl}#webpage`,
                name: `Read ${book.title}: ${chapter.title}`,
                description: `${chapter.title} from the free Walls reading sample by Gibson Murray.`,
                url: chapterUrl,
                isPartOf: {
                    "@id": `${baseUrl}/#website`,
                },
                about: {
                    "@id": `${baseUrl}/books/walls#book`,
                },
                mainEntity: {
                    "@id": `${chapterUrl}#chapter`,
                },
                author: {
                    "@id": `${baseUrl}/#person`,
                },
            },
            {
                "@type": "Chapter",
                "@id": `${chapterUrl}#chapter`,
                name: `${book.title}: ${chapter.title}`,
                headline: `Read ${book.title}: ${chapter.title}`,
                url: chapterUrl,
                position: chapterIndex + 1,
                wordCount: chapter.wordCount,
                timeRequired: `PT${readingMinutes}M`,
                isAccessibleForFree: true,
                inLanguage: "en-US",
                image: absoluteUrl(book.coverImageSrc),
                isPartOf: {
                    "@type": "Book",
                    "@id": `${baseUrl}/books/walls#book`,
                    name: book.title,
                    author: {
                        "@id": `${baseUrl}/#person`,
                    },
                },
                author: {
                    "@id": `${baseUrl}/#person`,
                },
            },
            makeBreadcrumbSchema(
                [
                    {
                        name: SITE_NAME,
                        url: baseUrl,
                    },
                    {
                        name: "Books",
                        url: `${baseUrl}/books`,
                    },
                    {
                        name: book.title,
                        url: `${baseUrl}/books/walls`,
                    },
                    {
                        name: "Read sample",
                        url: sampleBaseUrl,
                    },
                    {
                        name: chapter.title,
                        url: chapterUrl,
                    },
                ],
                `${chapterUrl}#breadcrumb`,
            ),
        ],
    }
}

const ChapterLinks = ({
    activeChapterId,
    className = "",
}: {
    activeChapterId: string
    className?: string
}) => (
    <div className={className}>
        {sample.chapters.map((chapter) => (
            <Link
                key={chapter.id}
                href={getChapterPath(chapter.id)}
                aria-current={
                    chapter.id === activeChapterId ? "page" : undefined
                }
                className={
                    chapter.id === activeChapterId
                        ? "bg-muted text-foreground rounded-none px-3 py-2 transition-colors"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground rounded-none px-3 py-2 transition-colors"
                }
            >
                {chapter.title}
            </Link>
        ))}
    </div>
)

const WallsSampleChapterPage = async ({ params }: Props) => {
    const { chapter: chapterId } = await params
    const chapter = getChapter(chapterId)

    if (!chapter) {
        notFound()
    }

    const chapterIndex = sample.chapters.findIndex(
        (item) => item.id === chapter.id,
    )
    const previousChapter = sample.chapters[chapterIndex - 1]
    const nextChapter = sample.chapters[chapterIndex + 1]
    const readingMinutes = getReadingMinutes(chapter.wordCount)
    const jsonLd = getJsonLd(chapter, chapterIndex, readingMinutes)

    return (
        <section className="editorial-page editorial-reader bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="book-sample-hero">
                <div className="site-page-container pt-8">
                    <Link href="/books/walls" className="editorial-back-link">
                        <ChevronLeft className="size-4" />
                        Walls
                    </Link>
                </div>
                <div className="book-sample-hero-grid">
                    <div className="flex flex-col justify-center">
                        <div className="book-sample-meta">
                            <span>Free sample</span>
                            <span>{chapter.title}</span>
                            <span>{readingMinutes} min read</span>
                        </div>
                        <h1>Read the first three chapters of {book.title}.</h1>
                        <p className="book-sample-intro">
                            Begin in the camp of Israel as Joshua, Salmon, and
                            Phinehas stand at the edge of the promise and the
                            fight ahead.
                        </p>
                        <div className="book-sample-actions">
                            <Link
                                href={getChapterPath(chapter.id)}
                                className="book-sample-primary"
                            >
                                <BookOpen className="size-4" />
                                Start reading
                            </Link>
                            <Link
                                href="/books/walls"
                                className="book-sample-secondary"
                            >
                                <ShoppingCart className="size-4" />
                                Buy Walls
                            </Link>
                        </div>
                    </div>

                    <div className="book-sample-cover">
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

            <div className="border-border/65 bg-background/95 sticky top-12 z-30 border-b px-4 py-3 backdrop-blur-xl sm:px-6 lg:hidden">
                <details className="group mx-auto max-w-3xl">
                    <summary className="border-border/70 bg-background hover:bg-muted/45 flex h-10 cursor-pointer list-none items-center justify-between rounded-none border px-4 text-sm font-medium transition-colors [&::-webkit-details-marker]:hidden">
                        <span>Chapters</span>
                        <span className="text-muted-foreground inline-flex items-center gap-2 text-xs">
                            {sample.chapters.length} chapters
                            <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                        </span>
                    </summary>
                    <nav
                        className="border-border/70 bg-background mt-2 grid gap-1 rounded-none border p-3 text-sm"
                        aria-label="Sample chapters"
                    >
                        <ChapterLinks
                            activeChapterId={chapter.id}
                            className="grid gap-1"
                        />
                    </nav>
                </details>
            </div>

            <div className="book-sample-reading-layout">
                <aside className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
                    <nav
                        className="book-sample-chapter-nav"
                        aria-label="Sample chapters"
                    >
                        <p className="text-muted-foreground px-2 text-xs font-semibold tracking-[0.18em] uppercase">
                            Chapters
                        </p>
                        <ChapterLinks
                            activeChapterId={chapter.id}
                            className="mt-3 grid gap-1"
                        />
                    </nav>
                </aside>

                <div className="min-w-0 space-y-16">
                    <article
                        id="chapter"
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
                                {chapter.wordCount.toLocaleString()} words ·{" "}
                                {readingMinutes} min read
                            </p>
                        </header>
                        <div
                            className="walls-reader mx-auto mt-8 max-w-3xl"
                            dangerouslySetInnerHTML={{
                                __html: chapter.bodyHtml,
                            }}
                        />
                    </article>

                    <nav
                        className="book-sample-pagination"
                        aria-label="Chapter pagination"
                    >
                        {previousChapter ? (
                            <Link
                                href={getChapterPath(previousChapter.id)}
                                className="book-sample-pagination-link"
                            >
                                <span className="text-muted-foreground inline-flex items-center gap-1 text-sm">
                                    <ChevronLeft className="size-4" />
                                    Previous
                                </span>
                                <span className="mt-2 text-lg font-semibold">
                                    {previousChapter.title}
                                </span>
                            </Link>
                        ) : (
                            <div />
                        )}
                        {nextChapter ? (
                            <Link
                                href={getChapterPath(nextChapter.id)}
                                className="book-sample-pagination-link sm:text-right"
                            >
                                <span className="text-muted-foreground inline-flex items-center gap-1 text-sm sm:justify-end">
                                    Next
                                    <ChevronRight className="size-4" />
                                </span>
                                <span className="mt-2 text-lg font-semibold">
                                    {nextChapter.title}
                                </span>
                            </Link>
                        ) : (
                            <div />
                        )}
                    </nav>

                    <div className="book-sample-continue">
                        <p>Keep reading with your copy of {book.title}.</p>
                        <p>
                            Buy the paperback, hardcover, or eBook and step back
                            into Jericho.
                        </p>
                        <div>
                            <Link
                                href="/books/walls"
                                className="book-sample-primary"
                            >
                                Buy Walls
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

export default WallsSampleChapterPage
