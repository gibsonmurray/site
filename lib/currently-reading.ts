export type CurrentlyReading = {
    title: string
    author: string
    coverImageSrc: string
    coverImageAlt: string
    url?: string // Goodreads, Amazon, etc.
    finishedPercent?: number // 0–100
}

export const currentlyReading: CurrentlyReading | null = {
    title: "The Stand",
    author: "Stephen King",
    coverImageSrc:
        "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1213131305i/149267.jpg",
    coverImageAlt: "The Stand book cover",
    url: "https://www.goodreads.com/book/show/149267.The_Stand",
    finishedPercent: 33,
}
