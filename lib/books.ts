export type BookFormat = "paperback" | "ebook" | "audiobook"

export type BookFormatOption = {
    productId?: string // Stripe product ID for this format
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

export type Book = {
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
    /** Set to false to hide all add-to-cart / checkout UI sitewide */
    purchasable?: boolean
}

export const books: Book[] = [
    {
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
            paperback: { productId: "prod_UJIRemQJC3RNFj", available: true },
            ebook: { productId: "prod_UJIwvIDjh1OnQH", available: true },
            audiobook: { available: false },
        },
        purchasable: false,
    },
]

export const latestBook = books.toSorted((a, b) => b.sortOrder - a.sortOrder)[0]