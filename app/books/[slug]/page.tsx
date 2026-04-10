import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { books } from "@/lib/books"
import { BookDetailClient } from "./book-detail-client"
import { baseUrl } from "@/app/sitemap"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const book = books.find((b) => b.slug === slug)
    if (!book) return {}
    return {
        title: book.title,
        description: book.shortDescription,
        openGraph: {
            title: book.title,
            description: book.shortDescription,
            images: [
                {
                    url: `/og?title=${encodeURIComponent(book.title)}`,
                    alt: book.title,
                    width: 1200,
                    height: 630,
                    type: "image/png",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: book.title,
            description: book.shortDescription,
            images: [`/og?title=${encodeURIComponent(book.title)}`],
        },
    }
}

export function generateStaticParams() {
    return books.map((b) => ({ slug: b.slug }))
}

const BookPage = async ({ params }: Props) => {
    const { slug } = await params
    const book = books.find((b) => b.slug === slug)
    if (!book) notFound()

    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@type": "Book",
        name: book.title,
        description: book.shortDescription,
        genre: book.genre,
        url: `${baseUrl}/books/${book.slug}`,
        image: `${baseUrl}${book.coverImageSrc}`,
        author: {
            "@type": "Person",
            name: "Gibson Murray",
            url: baseUrl,
        },
    }

    if (book.status.type === "pre-order") {
        jsonLd.offers = {
            "@type": "Offer",
            availability: "https://schema.org/PreOrder",
            url: `${baseUrl}/books/${book.slug}`,
        }
    } else if (book.status.type === "available") {
        jsonLd.offers = {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            url: `${baseUrl}/books/${book.slug}`,
        }
    }

    return (
        <section className="page-shell">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Link
                href="/books"
                className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1 text-sm transition-colors"
            >
                <ChevronLeft className="size-4" />
                Books
            </Link>
            <BookDetailClient book={book} />
        </section>
    )
}

export default BookPage
