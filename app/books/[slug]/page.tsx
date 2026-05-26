import { Metadata } from "next"
import { notFound } from "next/navigation"
import { books, getFeaturedReviewHeadline } from "@/lib/books"
import { BookDetailClient } from "./book-detail-client"
import { BookReviews } from "@/components/book-reviews"
import { baseUrl } from "@/app/sitemap"
import {
    AUTHOR_NAME,
    SITE_NAME,
    absoluteUrl,
    makeBreadcrumbSchema,
    makeOgImage,
    personSchema,
} from "@/lib/seo"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const book = books.find((b) => b.slug === slug)
    if (!book) return {}
    const reviewHeadline = getFeaturedReviewHeadline(book)
    const description = reviewHeadline
        ? `${book.shortDescription} Reader praise: “${reviewHeadline}”`
        : book.shortDescription
    const ogImage = makeOgImage({
        title: `${book.title} by ${AUTHOR_NAME}`,
        subtitle: reviewHeadline,
        image: book.images?.[0] ?? book.coverImageSrc,
    })
    const title = `${book.title} by ${AUTHOR_NAME}`

    return {
        title: {
            absolute: title,
        },
        description,
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
            title,
            description,
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
            title,
            description,
            images: [ogImage],
        },
        other: {
            thumbnail: absoluteUrl(book.coverImageSrc),
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
    const reviewHeadline = getFeaturedReviewHeadline(book)
    const description = reviewHeadline
        ? `${book.shortDescription} Reader praise: “${reviewHeadline}”`
        : book.shortDescription
    const jsonLd: Record<string, unknown> = {
        "@context": "https://schema.org",
        "@graph": [
            personSchema,
            {
                "@type": "Book",
                "@id": `${bookUrl}#book`,
                name: book.title,
                headline: `${book.title} by ${AUTHOR_NAME}`,
                description,
                genre: [book.genre, "Christian fiction", "Biblical Fiction"],
                inLanguage: "en-US",
                url: bookUrl,
                image: Array.from(
                    new Set([book.coverImageSrc, ...(book.images ?? [])]),
                ).map(absoluteUrl),
                sameAs: book.amazonUrl,
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
                        url: bookUrl,
                    },
                ],
                `${bookUrl}#breadcrumb`,
            ),
        ],
    }

    const bookSchema = (jsonLd["@graph"] as Record<string, unknown>[]).find(
        (item) => item["@type"] === "Book",
    )

    const availability =
        book.status.type === "pre-order"
            ? "https://schema.org/PreOrder"
            : book.status.type === "available"
              ? "https://schema.org/InStock"
              : "https://schema.org/PreSale"
    const offers = Object.entries(book.formats)
        .filter(([, option]) => option?.available)
        .map(([format, option]) => ({
            "@type": "Offer",
            name: `${book.title} ${format}`,
            availability,
            itemCondition: "https://schema.org/NewCondition",
            price: option.priceCents
                ? (option.priceCents / 100).toFixed(2)
                : undefined,
            priceCurrency: option.priceCents ? "USD" : undefined,
            seller: {
                "@id": `${baseUrl}/#person`,
            },
            url: bookUrl,
        }))

    if (offers.length > 0) {
        bookSchema!.offers = offers
    }

    if (book.reviews && book.reviews.length > 0) {
        bookSchema!.review = book.reviews.map((review) => ({
            "@type": "Review",
            reviewBody: review.quote,
            name: review.headline,
            author: {
                "@type": "Person",
                name: review.reviewer,
            },
            reviewRating: review.rating
                ? {
                      "@type": "Rating",
                      ratingValue: review.rating,
                      bestRating: 5,
                  }
                : undefined,
        }))

        const ratedReviews = book.reviews.filter((review) => review.rating)
        if (ratedReviews.length > 0) {
            const ratingTotal = ratedReviews.reduce(
                (sum, review) => sum + (review.rating ?? 0),
                0,
            )
            bookSchema!.aggregateRating = {
                "@type": "AggregateRating",
                ratingValue: (ratingTotal / ratedReviews.length).toFixed(1),
                reviewCount: ratedReviews.length,
                bestRating: 5,
            }
        }
    }

    return (
        <section className="overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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
