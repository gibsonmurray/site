import { Photo } from "@/types/photos"

/**
 * Get the best quality derivative URL for a photo
 */
export function getBestDerivativeUrl(photo: Photo): string {
    const derivatives = Object.values(photo.derivatives)
    if (!derivatives.length) return ""

    const sorted = derivatives.sort(
        (a, b) => b.width * b.height - a.width * a.height
    )
    return sorted[0]?.url || ""
}

/**
 * Get a thumbnail URL for a photo (smaller size for grid view)
 */
export function getThumbnailUrl(photo: Photo): string {
    const derivatives = Object.values(photo.derivatives)
    if (!derivatives.length) return ""

    const thumbnail = derivatives.find((d) => d.width >= 300 && d.width <= 600)
    if (thumbnail) return thumbnail.url

    const sorted = derivatives.sort(
        (a, b) => a.width * a.height - b.width * b.height
    )
    return sorted[0]?.url || ""
}

/**
 * Get a medium quality URL for lightbox view
 */
export function getMediumUrl(photo: Photo): string {
    const derivatives = Object.values(photo.derivatives)
    if (!derivatives.length) return ""

    const medium = derivatives.find((d) => d.width >= 1200 && d.width <= 2000)
    if (medium) return medium.url

    return getBestDerivativeUrl(photo)
}

/**
 * Format a date string for display
 */
export function formatPhotoDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

/**
 * Format date for short display
 */
export function formatShortDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

/**
 * Group photos by date
 */
export function groupPhotosByDate(photos: Photo[]): Map<string, Photo[]> {
    const groups = new Map<string, Photo[]>()

    photos.forEach((photo) => {
        const date = new Date(photo.dateCreated)
        const key = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })

        if (!groups.has(key)) {
            groups.set(key, [])
        }
        groups.get(key)!.push(photo)
    })

    return groups
}
