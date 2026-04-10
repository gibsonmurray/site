import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { books } from "@/lib/books"
import { BookDetailClient } from "./book-detail-client"

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

    return (
        <section className="page-shell">
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
