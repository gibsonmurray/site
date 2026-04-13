import { Metadata } from "next"
import { books, latestBook } from "@/lib/books"
import { BooksHeader } from "@/components/books-header"
import { BookCard } from "@/components/book-card"
import { baseUrl } from "@/app/sitemap"

export const metadata: Metadata = {
    title: "Books",
    description: "Books written by Gibson Murray.",
    alternates: {
        canonical: `${baseUrl}/books`,
    },
    openGraph: {
        title: "Books",
        description: "Books written by Gibson Murray.",
        url: `${baseUrl}/books`,
        images: [
            {
                url: `${baseUrl}${latestBook.coverImageSrc}`,
                alt: latestBook.coverImageAlt,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Books",
        description: "Books written by Gibson Murray.",
        images: [`${baseUrl}${latestBook.coverImageSrc}`],
    },
}

const BooksPage = () => {
    return (
        <section className="page-shell">
            <BooksHeader />
            <div className="space-y-4">
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
