export type CurrentlyReading = {
    title: string
    author: string
    coverImageSrc: string
    coverImageAlt: string
    url?: string // Goodreads, Amazon, etc.
    finishedPercent?: number // 0–100
}

export const currentlyReading: CurrentlyReading | null = null
