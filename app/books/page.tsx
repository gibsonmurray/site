import { Metadata } from "next"
import { books, latestBook } from "@/lib/books"
import { BooksHeader } from "@/components/books-header"
import { BookCard } from "@/components/book-card"
import { baseUrl } from "@/app/sitemap"
import {
    AUTHOR_NAME,
    BOOKS_DESCRIPTION,
    SITE_NAME,
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
    return (
        <section className="overflow-hidden">
            <BooksHeader />
            <div className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 sm:px-8 lg:pb-28">
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
