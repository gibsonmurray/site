export type BookFormat = "paperback" | "ebook" | "audiobook"

export type BookFormatOption = {
    priceId?: string // Stripe price ID for this format (falls back to product default_price)
    available: boolean
    price?: number // Display price in USD (cents), e.g. 1499 = $14.99
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

export type Book = {
    id: string
    slug: string
    title: string
    genre: string
    coverImageSrc: string
    coverImageAlt: string
    images?: string[] // Extra images shown in the carousel after coverImageSrc
    shortDescription: string
    longDescription: string[]
    status: BookStatus
    sortOrder: number
    formats: Partial<Record<BookFormat, BookFormatOption>>
}

export const books: Book[] = [
    {
        id: "prod_UJ1F7uxQumemsV",
        slug: "walls",
        title: "Walls",
        genre: "Biblical Fiction",
        coverImageSrc: "/books/walls-cover-ebook.png",
        images: [
            "/books/walls-mock-1.png",
            "/books/walls-mock-2.png",
            "/books/walls-cover-ebook.png",
        ],
        coverImageAlt: "Walls book cover",
        shortDescription:
            "A story of unlikely alliances, faith tested, and the hidden battles that decided the course of history.",
        longDescription: [
            "When Joshua, son of Nun, sends two spies into the fortified city of Jericho, their mission quickly spirals into a fight for survival. Salmon, a fierce warrior of Judah, and Phinehas, a zealous Levitical priest, must navigate deadly streets, political conspiracies, and supernatural forces beyond their understanding.",
            "Only Rahab, a resourceful prostitute with dangerous secrets, can guide them through the city's peril and challenge everything they believe about loyalty, faith, and courage. As Jericho's walls and the spies' own prejudices begin to crumble, the fate of Israel and the promise of God hang in the balance.",
        ],
        status: {
            type: "pre-order",
            label: "Pre-order",
            releaseDate: "Summer 2026",
        },
        sortOrder: 1,
        formats: {
            paperback: { available: true, price: 1499 },
            ebook: { available: true, price: 999 },
            audiobook: { available: false },
        },
    },
]

export const latestBook = books.toSorted((a, b) => b.sortOrder - a.sortOrder)[0]