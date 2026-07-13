import { NextResponse, type NextRequest } from "next/server"

type SpotifyMediaType = "track" | "episode"

type SpotifyMedia = {
    name?: string
    preview_url?: string | null
    audio_preview_url?: string | null
    external_urls?: { spotify?: string }
    images?: Array<{ url: string }>
    album?: { images?: Array<{ url: string }> }
    artists?: Array<{ name: string }>
    show?: { name?: string; publisher?: string }
}

let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken() {
    if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
        return cachedToken.value
    }

    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    if (!clientId || !clientSecret) throw new Error("Spotify credentials are unavailable")

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
        cache: "no-store",
    })

    if (!response.ok) throw new Error("Spotify authentication failed")

    const data = (await response.json()) as { access_token: string; expires_in: number }
    cachedToken = {
        value: data.access_token,
        expiresAt: Date.now() + data.expires_in * 1000,
    }
    return cachedToken.value
}

function parseSpotifyUrl(value: string) {
    const url = new URL(value)
    if (url.hostname !== "open.spotify.com") return null

    const [type, id] = url.pathname.split("/").filter(Boolean)
    if ((type !== "track" && type !== "episode") || !/^[A-Za-z0-9]+$/.test(id ?? "")) {
        return null
    }

    return { type: type as SpotifyMediaType, id }
}

export async function GET(request: NextRequest) {
    const source = request.nextUrl.searchParams.get("url")
    if (!source) {
        return NextResponse.json({ error: "A Spotify URL is required" }, { status: 400 })
    }

    try {
        const media = parseSpotifyUrl(source)
        if (!media) {
            return NextResponse.json({ error: "Unsupported Spotify URL" }, { status: 400 })
        }

        const token = await getAccessToken()
        const response = await fetch(
            `https://api.spotify.com/v1/${media.type}s/${media.id}?market=US`,
            {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            },
        )

        if (!response.ok) {
            return NextResponse.json(
                { error: "Spotify media is unavailable" },
                { status: 502 },
            )
        }

        const item = (await response.json()) as SpotifyMedia
        const artwork = item.images?.[0]?.url ?? item.album?.images?.[0]?.url ?? null
        const subtitle =
            item.artists?.map((artist) => artist.name).join(", ") ||
            item.show?.name ||
            item.show?.publisher ||
            "Spotify"

        return NextResponse.json(
            {
                title: item.name,
                subtitle,
                artwork,
                previewUrl: item.audio_preview_url ?? item.preview_url ?? null,
                spotifyUrl: item.external_urls?.spotify ?? source,
            },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
                },
            },
        )
    } catch {
        return NextResponse.json(
            { error: "Spotify media is unavailable" },
            { status: 502 },
        )
    }
}
