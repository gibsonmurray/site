import currentlyReadingData from "@/data/currently-reading.json"

export type CurrentlyReading = {
    title: string
    author: string
    coverImageSrc: string
    coverImageAlt: string
    url?: string // Goodreads, Amazon, etc.
    finishedPercent?: number // 0–100
}

export const currentlyReading = currentlyReadingData as CurrentlyReading | null
