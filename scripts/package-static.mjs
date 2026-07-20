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

        return env.ASSETS.fetch(request)
    },
}\n`,
)
