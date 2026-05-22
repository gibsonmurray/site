import booksData from "@/data/books.json"

export type BookFormat = "paperback" | "ebook" | "audiobook" | "bundle"

export type BookFormatOption = {
    productId?: string // Stripe product ID for this format
    /** Explicit checkout price in cents. Falls back to Stripe default price when omitted. */
    priceCents?: number
    compareAtPriceCents?: number
    priceNote?: string
    description?: string
    available: boolean
}

export type BookStatus =
    | {
          type: "coming-soon"
          label: string
      }
    | {
          type: "pre-order"
          label?: string
          releaseDate: string
      }
    | {
          type: "available"
          label?: string
      }

export type BookReview = {
    headline?: string
    rating?: number
    quote: string
    reviewer: string
    source?: string // e.g. "Goodreads", "Amazon", "Publisher's Weekly"
    url?: string
}

export type BookModelAssets = {
    frontImageSrc: string
    frontImageCrop?: {
        x: number
        y: number
        width: number
        height: number
    }
    spineImageSrc: string
    backImageSrc: string
    thicknessRatio?: number
    pageEdgeColor?: string
}

export type Book = {
    slug: string
    title: string
    genre: string
    coverImageSrc: string
    coverImageAlt: string
    images?: string[] // Extra images shown in the carousel after coverImageSrc
    modelAssets?: BookModelAssets
    shortDescription: string
    longDescription: string[]
    status: BookStatus
    sortOrder: number
    formats: Partial<Record<BookFormat, BookFormatOption>>
    amazonAsin?: string
    amazonUrl?: string
    /** Set to false to hide all add-to-cart / checkout UI sitewide */
    purchasable?: boolean
    reviews?: BookReview[]
}

export const books = booksData as Book[]

export const latestBook = books.toSorted((a, b) => b.sortOrder - a.sortOrder)[0]

export const getFeaturedReviewHeadline = (book: Book) =>
    book.reviews?.find((review) => review.headline)?.headline
