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
    title: string
    genre: string
    coverImageSrc: string
    coverImageAlt: string
    shortDescription: string
    longDescription: string[]
    status: BookStatus
    sortOrder: number
}

export const books: Book[] = [
    {
        id: "prod_UJ1F7uxQumemsV",
        title: "Walls 🧱",
        genre: "Biblical Fiction",
        coverImageSrc: "/books/walls-cover-ebook.png",
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
            releaseDate: "July 1, 2026",
        },
        sortOrder: 1,
    },
]

export const latestBook = books.toSorted((a, b) => b.sortOrder - a.sortOrder)[0]