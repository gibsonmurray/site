import currentlyListeningData from "@/data/currently-listening.json"

export type CurrentlyListening = {
    title: string
    artist: string
    coverImageSrc?: string
    coverImageAlt?: string
    url?: string
}

export const currentlyListening =
    currentlyListeningData as CurrentlyListening | null
