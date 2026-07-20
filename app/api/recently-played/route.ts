const CACHE_MAX_AGE = 60

type SpotifyTokenResponse = {
    access_token?: string
}

type SpotifyTrack = {
    album?: { images?: Array<{ url?: string }> }
    artists?: Array<{ name?: string }>
    external_urls?: { spotify?: string }
    name?: string
}

type SpotifyRecentlyPlayedResponse = {
    items?: Array<{ track?: SpotifyTrack }>
}

export async function GET() {
    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
        const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

        if (!clientId || !clientSecret || !refreshToken) {
            throw new Error("Spotify credentials are missing")
        }

        const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
        const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                Authorization: `Basic ${basic}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
            }),
            cache: "no-store",
        })

        if (!tokenResponse.ok) throw new Error("Spotify token refresh failed")

        const token = (await tokenResponse.json()) as SpotifyTokenResponse
        if (!token.access_token) throw new Error("Spotify token response was incomplete")

        const recentResponse = await fetch(
            "https://api.spotify.com/v1/me/player/recently-played?limit=1",
            {
                headers: { Authorization: `Bearer ${token.access_token}` },
                cache: "no-store",
            },
        )

        if (!recentResponse.ok) throw new Error("Spotify history unavailable")

        const recent = (await recentResponse.json()) as SpotifyRecentlyPlayedResponse
        const track = recent.items?.[0]?.track
        const title = track?.name
        const artist = track?.artists?.map(({ name }) => name).filter(Boolean).join(", ")
        const cover = track?.album?.images?.[0]?.url
        const url = track?.external_urls?.spotify

        if (!title || !artist || !cover || !url) {
            throw new Error("Spotify history response was incomplete")
        }

        return Response.json(
            { title, artist, cover, url },
            {
                headers: {
                    "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}`,
                },
            },
        )
    } catch {
        return Response.json(
            { error: "Recently played is temporarily unavailable" },
            { status: 502 },
        )
    }
}
