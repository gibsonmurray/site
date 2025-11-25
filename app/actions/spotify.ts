"use server"

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token"
const API_BASE = "https://api.spotify.com/v1"

// Access token is short-lived; cache in memory.
// For serverless with multiple instances, consider a KV cache.
let accessToken: string | null = null
let accessTokenExpiresAt = 0

const refreshAccessToken = async () => {
    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
    })

    const res = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    })

    const text = await res.text()
    if (!res.ok) {
        throw new Error(`Spotify refresh failed: ${text}`)
    }
    const json = JSON.parse(text) as {
        access_token: string
        expires_in: number
    }

    // Buffer 30s
    accessToken = json.access_token
    accessTokenExpiresAt = Date.now() + (json.expires_in - 30) * 1000

    return accessToken!
}

const getAccessToken = async () => {
    if (accessToken && Date.now() < accessTokenExpiresAt) return accessToken
    return refreshAccessToken()
}

const spotifyFetch = async (path: string, params?: Record<string, string>) => {
    const token = await getAccessToken()
    const url = new URL(`${API_BASE}${path}`)
    if (params) {
        for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
    }

    const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
    })

    // If token somehow expired, try one refresh.
    if (res.status === 401) {
        await refreshAccessToken()
        const retry = await fetch(url.toString(), {
            headers: { Authorization: `Bearer ${await getAccessToken()}` },
            next: { revalidate: 60 },
        })
        if (!retry.ok) {
            const text = await retry.text()
            throw new Error(`Spotify API error (${retry.status}): ${text}`)
        }
        return retry.json()
    }

    if (!res.ok) {
        const text = await res.text()
        throw new Error(`Spotify API error (${res.status}): ${text}`)
    }
    return res.json()
}

export const getUser = async () => {
    const json = await spotifyFetch("/me")
    return json as SpotifyApi.CurrentUsersProfileResponse
}

export const getTopTracks = async (
    term: "short_term" | "medium_term" | "long_term" = "medium_term",
    limit = 10,
) => {
    const json = await spotifyFetch("/me/top/tracks", {
        time_range: term,
        limit: String(limit),
    })
    return json as SpotifyApi.UsersTopTracksResponse
}

export const getTopArtists = async (
    term: "short_term" | "medium_term" | "long_term" = "medium_term",
    limit = 10,
) => {
    const json = await spotifyFetch("/me/top/artists", {
        time_range: term,
        limit: String(limit),
    })
    return json as SpotifyApi.UsersTopArtistsResponse
}

export const getRecentlyPlayed = async (limit = 20) => {
    const json = await spotifyFetch("/me/player/recently-played", {
        limit: String(limit),
    })
    return json as SpotifyApi.UsersRecentlyPlayedTracksResponse
}
