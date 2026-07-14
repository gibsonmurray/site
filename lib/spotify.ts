export type SpotifyMediaType = "track" | "episode"

export type SpotifyMediaReference = {
    type: SpotifyMediaType
    id: string
}

export function parseSpotifyUrl(value: string): SpotifyMediaReference | null {
    try {
        const url = new URL(value)
        if (url.hostname !== "open.spotify.com") return null

        const segments = url.pathname.split("/").filter(Boolean)
        const offset = segments[0]?.startsWith("intl-") ? 1 : 0
        const type = segments[offset]
        const id = segments[offset + 1]

        if (
            (type !== "track" && type !== "episode") ||
            !/^[A-Za-z0-9]+$/.test(id ?? "")
        ) {
            return null
        }

        return { type, id }
    } catch {
        return null
    }
}

export function getSpotifyEmbedUrl(value?: string) {
    if (!value) return null

    const media = parseSpotifyUrl(value)
    if (!media) return null

    return `https://open.spotify.com/embed/${media.type}/${media.id}?utm_source=generator&theme=0`
}

export function parseSpotifyPreviewUrl(html: string) {
    const match = html.match(/"audioPreview"\s*:\s*\{\s*"url"\s*:\s*"([^"]+)"/)
    if (!match?.[1]) return null

    try {
        const value = JSON.parse(`"${match[1]}"`) as string
        const url = new URL(value)

        if (
            url.protocol !== "https:" ||
            (url.hostname !== "scdn.co" && !url.hostname.endsWith(".scdn.co"))
        ) {
            return null
        }

        return url.toString()
    } catch {
        return null
    }
}
