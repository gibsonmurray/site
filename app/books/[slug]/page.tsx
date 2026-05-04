import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { books } from "@/lib/books"
import { BookDetailClient } from "./book-detail-client"
import { BookReviews } from "@/components/book-reviews"
import { baseUrl } from "@/app/sitemap"
import { AUTHOR_NAME, SITE_NAME, makeOgImage, personSchema } from "@/lib/seo"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const book = books.find((b) => b.slug === slug)
    if (!book) return {}
    const ogImage = makeOgImage({
        title: `${book.title} by ${AUTHOR_NAME}`,
        image: book.images?.[0] ?? book.coverImageSrc,
    })
    return {
        title: `${book.title} by ${AUTHOR_NAME}`,
        description: book.shortDescription,
        authors: [{ name: AUTHOR_NAME, url: baseUrl }],
        keywords: [
            book.title,
            `${book.title} book`,
            `${book.title} Gibson Murray`,
            book.genre,
            "biblical fiction",
            "Christian fiction",
            "Jericho story",
            "Rahab fiction",
        ],
        alternates: {
            canonical: `${baseUrl}/books/${book.slug}`,
        },
        openGraph: {
            title: `${book.title} by ${AUTHOR_NAME}`,
            description: book.shortDescription,
            url: `${baseUrl}/books/${book.slug}`,
            type: "book",
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
            title: `${book.title} by ${AUTHOR_NAME}`,
            description: book.shortDescription,
            images: [ogImage],
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

    const bookUrl = `${baseUrl}/books/${book.slug}`
    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@graph": [
            personSchema,
            {
                "@type": "Book",
                "@id": `${bookUrl}#book`,
                name: book.title,
                headline: `${book.title} by ${AUTHOR_NAME}`,
                description: book.shortDescription,
                genre: [book.genre, "Christian fiction", "Biblical Fiction"],
                inLanguage: "en-US",
                url: bookUrl,
                image: `${baseUrl}${book.coverImageSrc}`,
                author: {
                    "@id": `${baseUrl}/#person`,
                },
                publisher: {
                    "@id": `${baseUrl}/#person`,
                },
                mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": bookUrl,
                },
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${bookUrl}#breadcrumb`,
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: SITE_NAME,
                        item: baseUrl,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Books",
                        item: `${baseUrl}/books`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: book.title,
                        item: bookUrl,
                    },
                ],
            },
        ],
    }

    const bookSchema = (jsonLd["@graph"] as Record<string, unknown>[]).find(
        (item) => item["@type"] === "Book",
    )

    if (book.status.type === "pre-order") {
        bookSchema!.offers = {
            "@type": "Offer",
            availability: "https://schema.org/PreOrder",
            itemCondition: "https://schema.org/NewCondition",
            seller: {
                "@id": `${baseUrl}/#person`,
            },
            url: bookUrl,
        }
    } else if (book.status.type === "available") {
        bookSchema!.offers = {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: {
                "@id": `${baseUrl}/#person`,
            },
            url: bookUrl,
        }
    }

    return (
        <section className="overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="mx-auto max-w-6xl px-6 pt-8 sm:px-8">
                <Link
                    href="/books"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
                >
                    <ChevronLeft className="size-4" />
                    Books
                </Link>
            </div>
            <BookDetailClient book={book} />
            {book.reviews && book.reviews.length > 0 && (
                <div className="mx-auto max-w-6xl px-6 pb-20 sm:px-8">
                    <BookReviews reviews={book.reviews} />
                </div>
            )}
        </section>
    )
}

export default BookPage
