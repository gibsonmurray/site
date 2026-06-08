import { Metadata } from "next"
import { books, latestBook } from "@/lib/books"
import { BooksHeader } from "@/components/books-header"
import { BookCard } from "@/components/book-card"
import { baseUrl } from "@/app/sitemap"
import {
    AUTHOR_NAME,
    BOOKS_DESCRIPTION,
    SITE_NAME,
    absoluteUrl,
    makeBreadcrumbSchema,
    makeOgImage,
} from "@/lib/seo"

export const metadata: Metadata = {
    title: {
        absolute: `Books by ${SITE_NAME}`,
    },
    description: BOOKS_DESCRIPTION,
    authors: [{ name: AUTHOR_NAME, url: baseUrl }],
    keywords: [
        "Gibson Murray books",
        "Walls book",
        "biblical fiction books",
        "Christian fiction books",
        "Jericho biblical fiction",
    ],
    alternates: {
        canonical: `${baseUrl}/books`,
    },
    openGraph: {
        title: `Books by ${SITE_NAME}`,
        description: BOOKS_DESCRIPTION,
        url: `${baseUrl}/books`,
        type: "website",
        images: [
            {
                url: makeOgImage({
                    title: `Books by ${SITE_NAME}`,
                    image: latestBook.images?.[0] ?? latestBook.coverImageSrc,
                }),
                alt: latestBook.coverImageAlt,
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `Books by ${SITE_NAME}`,
        description: BOOKS_DESCRIPTION,
        images: [
            makeOgImage({
                title: `Books by ${SITE_NAME}`,
                image: latestBook.images?.[0] ?? latestBook.coverImageSrc,
            }),
        ],
    },
}

const BooksPage = () => {
    const booksUrl = `${baseUrl}/books`
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${booksUrl}#webpage`,
                url: booksUrl,
                name: `Books by ${SITE_NAME}`,
                description: BOOKS_DESCRIPTION,
                inLanguage: "en-US",
                isPartOf: {
                    "@id": `${baseUrl}/#website`,
                },
                mainEntity: {
                    "@id": `${booksUrl}#books`,
                },
            },
            {
                "@type": "ItemList",
                "@id": `${booksUrl}#books`,
                name: `Books by ${SITE_NAME}`,
                itemListElement: books.map((book, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${booksUrl}/${book.slug}`,
                    name: book.title,
                })),
            },
            ...books.map((book) => ({
                "@type": "Book",
                "@id": `${booksUrl}/${book.slug}#book`,
                name: book.title,
                url: `${booksUrl}/${book.slug}`,
                description: book.shortDescription,
                genre: [book.genre, "Christian fiction", "Biblical Fiction"],
                inLanguage: "en-US",
                image: absoluteUrl(book.coverImageSrc),
                author: {
                    "@id": `${baseUrl}/#person`,
                },
            })),
            makeBreadcrumbSchema(
                [
                    {
                        name: SITE_NAME,
                        url: baseUrl,
                    },
                    {
                        name: "Books",
                        url: booksUrl,
                    },
                ],
                `${booksUrl}#breadcrumb`,
            ),
        ],
    }

    return (
        <section className="editorial-page overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BooksHeader />
            <div className="books-index">
                {books.map((book, index) => (
                    <BookCard
                        key={book.slug}
                        book={book}
                        priority={index === 0}
                    />
                ))}
            </div>
        </section>
    )
}

export default BooksPage
