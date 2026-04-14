import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { books } from "@/lib/books"
import { BookDetailClient } from "./book-detail-client"
import { BookReviews } from "@/components/book-reviews"
import { baseUrl } from "@/app/sitemap"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const book = books.find((b) => b.slug === slug)
    if (!book) return {}
    return {
        title: book.title,
        description: book.shortDescription,
        alternates: {
            canonical: `${baseUrl}/books/${book.slug}`,
        },
        openGraph: {
            title: book.title,
            description: book.shortDescription,
            url: `${baseUrl}/books/${book.slug}`,
            type: "book",
            images: [
                {
                    url: `${baseUrl}${book.coverImageSrc}`,
                    alt: book.coverImageAlt,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: book.title,
            description: book.shortDescription,
            images: [`${baseUrl}${book.coverImageSrc}`],
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
            {book.reviews && book.reviews.length > 0 && (
                <div className="mt-2 px-1">
                    <BookReviews reviews={book.reviews} />
                </div>
            )}
        </section>
    )
}

export default BookPage
