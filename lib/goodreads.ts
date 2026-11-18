const GOODREADS_ORIGIN = "https://www.goodreads.com"

function decodeHtml(value: string): string {
    return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (entity, code: string) => {
        if (code.startsWith("#")) {
            const point = code[1].toLowerCase() === "x"
                ? parseInt(code.slice(2), 16)
                : parseInt(code.slice(1), 10)
            return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity
        }
        return ({ amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " })[code.toLowerCase()] ?? entity
    })
}

export function parseCurrentlyReading(html: string) {
    // Only inspect the current shelf, never the profile's historical activity.
    const shelf = html.split(/id=["']currentlyReadingReviews["']/)[1]?.split(/class=["']rating["']/)[0]
    const book = shelf?.match(/<a\b[^>]*class="bookTitle"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/)
    const author = shelf?.match(/<a\b[^>]*class="authorName"[^>]*>([\s\S]*?)<\/a>/)?.[1]
    const cover = shelf?.match(/<img\b[^>]*src="([^"]+)"/)?.[1]
    const bookId = book?.[1].match(/\/book\/show\/(\d+)/)?.[1]
    if (!book || !author || !cover || !bookId) throw new Error("Goodreads current shelf was incomplete")

    const progressMatch = html.match(new RegExp(`is on page\\s+([\\d,]+)\\s+of\\s+([\\d,]+)\\s+of\\s+<a[^>]+book/show/${bookId}(?:[.\\-?"/]|\\b)`, "i"))
    const current = Number(progressMatch?.[1].replaceAll(",", ""))
    const total = Number(progressMatch?.[2].replaceAll(",", ""))
    const text = (value: string) => decodeHtml(value.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim()

    return {
        title: text(book[2]),
        author: text(author),
        cover: decodeHtml(cover),
        progress: Number.isFinite(current) && total > 0 ? Math.min(100, Math.max(0, Math.round(current / total * 100))) : null,
        url: new URL(decodeHtml(book[1]), GOODREADS_ORIGIN).href,
    }
}
