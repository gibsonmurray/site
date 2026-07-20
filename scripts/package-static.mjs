import { cp, mkdir, rename, rm, writeFile } from "node:fs/promises"

await rm("dist", { recursive: true, force: true })
await mkdir("dist/server", { recursive: true })
await mkdir("dist/.openai", { recursive: true })
await rename("out", "dist/client")
await cp(".openai/hosting.json", "dist/.openai/hosting.json")
await writeFile(
    "dist/server/index.js",
    `export default {
    async fetch(request, env) {
        const url = new URL(request.url)

        if (url.pathname === "/api/currently-reading") {
            try {
                const response = await fetch(
                    "https://www.goodreads.com/review/list_rss/196455087?shelf=currently-reading",
                    { headers: { "User-Agent": "Gibson Murray currently-reading widget" } },
                )

                if (!response.ok) throw new Error("Goodreads returned " + response.status)

                const xml = await response.text()
                const item = xml.match(/<item>[\\s\\S]*?<\\/item>/)?.[0]
                if (!item) throw new Error("No currently-reading book found")

                const readTag = (tag) => {
                    const openingTag = "<" + tag + ">"
                    const closingTag = "</" + tag + ">"
                    const start = item.indexOf(openingTag)
                    const end = item.indexOf(closingTag, start + openingTag.length)
                    if (start === -1 || end === -1) return undefined

                    return item
                        .slice(start + openingTag.length, end)
                        .replace(/^<!\\[CDATA\\[/, "")
                        .replace(/\\]\\]>$/, "")
                        .trim()
                }

                const bookId = readTag("book_id")
                const title = readTag("title")
                const author = readTag("author_name")?.replace(/\\s+/g, " ")
                const cover = readTag("book_large_image_url")

                if (!bookId || !title || !author || !cover) {
                    throw new Error("Goodreads response was incomplete")
                }

                return Response.json(
                    {
                        title,
                        author,
                        cover,
                        url: "https://www.goodreads.com/book/show/" + bookId,
                    },
                    {
                        headers: {
                            "Cache-Control": "public, max-age=3600, s-maxage=3600",
                        },
                    },
                )
            } catch {
                return Response.json(
                    { error: "Currently reading is temporarily unavailable" },
                    { status: 502 },
                )
            }
        }

        if (url.pathname === "/api/recently-played") {
            try {
                if (
                    !env.SPOTIFY_CLIENT_ID ||
                    !env.SPOTIFY_CLIENT_SECRET ||
                    !env.SPOTIFY_REFRESH_TOKEN
                ) {
                    throw new Error("Spotify credentials are missing")
                }

                const basic = btoa(env.SPOTIFY_CLIENT_ID + ":" + env.SPOTIFY_CLIENT_SECRET)
                const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
                    method: "POST",
                    headers: {
                        Authorization: "Basic " + basic,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        grant_type: "refresh_token",
                        refresh_token: env.SPOTIFY_REFRESH_TOKEN,
                    }),
                })

                if (!tokenResponse.ok) throw new Error("Spotify token refresh failed")
                const token = await tokenResponse.json()
                const recentResponse = await fetch(
                    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
                    { headers: { Authorization: "Bearer " + token.access_token } },
                )

                if (!recentResponse.ok) throw new Error("Spotify history unavailable")
                const recent = await recentResponse.json()
                const track = recent.items?.[0]?.track

                if (!track) throw new Error("No recently played track found")

                return Response.json(
                    {
                        title: track.name,
                        artist: track.artists.map((artist) => artist.name).join(", "),
                        cover: track.album.images?.[0]?.url,
                        url: track.external_urls?.spotify,
                    },
                    {
                        headers: {
                            "Cache-Control": "public, max-age=60, s-maxage=60",
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

        return env.ASSETS.fetch(request)
    },
}\n`,
)
