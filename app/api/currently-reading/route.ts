const CACHE_MAX_AGE = 3600

function readXmlTag(item: string, tag: string): string | undefined {
    const openingTag = `<${tag}>`
    const closingTag = `</${tag}>`
    const start = item.indexOf(openingTag)
    const end = item.indexOf(closingTag, start + openingTag.length)
    if (start === -1 || end === -1) return undefined

    return item
        .slice(start + openingTag.length, end)
        .replace(/^<!\[CDATA\[/, "")
        .replace(/\]\]>$/, "")
        .trim()
}

export async function GET() {
    try {
        const response = await fetch(
            "https://www.goodreads.com/review/list_rss/196455087?shelf=currently-reading",
            {
                headers: { "User-Agent": "Gibson Murray currently-reading widget" },
                next: { revalidate: CACHE_MAX_AGE },
            },
        )

        if (!response.ok) throw new Error(`Goodreads returned ${response.status}`)

        const xml = await response.text()
        const item = xml.match(/<item>[\s\S]*?<\/item>/)?.[0]
        if (!item) throw new Error("No currently-reading book found")

        const bookId = readXmlTag(item, "book_id")
        const title = readXmlTag(item, "title")
        const author = readXmlTag(item, "author_name")?.replace(/\s+/g, " ")
        const cover = readXmlTag(item, "book_large_image_url")

        if (!bookId || !title || !author || !cover) {
            throw new Error("Goodreads response was incomplete")
        }

        return Response.json(
            {
                title,
                author,
                cover,
                url: `https://www.goodreads.com/book/show/${bookId}`,
            },
            {
                headers: {
                    "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}`,
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
