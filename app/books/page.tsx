import { Metadata } from "next"
import { books } from "@/lib/books"
import { BooksHeader } from "@/components/books-header"
import { BookCard } from "@/components/book-card"

export const metadata: Metadata = {
    title: "Books",
    description: "Books written by Gibson Murray.",
    openGraph: {
        title: "Books",
        description: "Books written by Gibson Murray.",
        images: [
            {
                url: "/og?title=Books",
                alt: "Books",
                width: 1200,
                height: 630,
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Books",
        description: "Books written by Gibson Murray.",
        images: ["/og?title=Books"],
    },
}

const BooksPage = () => {
    return (
        <section className="page-shell">
            <BooksHeader />
            <div className="space-y-4">
                {books.map((book, index) => (
                    <BookCard
                        key={book.id}
                        book={book}
                        priority={index === 0}
                    />
                ))}
            </div>
        </section>
    )
}

export default BooksPage
