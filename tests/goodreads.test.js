import { describe, expect, test } from "bun:test"
import { parseCurrentlyReading } from "../lib/goodreads.ts"

const shelf = `<div id="currentlyReadingReviews">
<a href="/book/show/55077714-ender-s-game"><img src="https://example.com/cover.jpg" /></a>
<a class="bookTitle" href="/book/show/55077714-ender-s-game">Ender&#39;s Game (The Ender Saga # 1)</a>
<a class="authorName" href="/author/show/589">Orson Scott Card</a>
<div class="rating">`

describe("Goodreads profile parsing", () => {
    test("reads the current shelf and decodes HTML entities", () => {
        expect(parseCurrentlyReading(shelf)).toEqual({
            title: "Ender's Game (The Ender Saga # 1)", author: "Orson Scott Card",
            cover: "https://example.com/cover.jpg", progress: null,
            url: "https://www.goodreads.com/book/show/55077714-ender-s-game",
        })
    })
    test("ignores progress for other books and accepts dotted Goodreads URLs", () => {
        const activity = 'is on page 100 of 497 of <a href="https://www.goodreads.com/book/show/11588.The_Shining">The Shining</a>'
        expect(parseCurrentlyReading(shelf + activity).progress).toBeNull()
        expect(parseCurrentlyReading(shelf + activity.replace("11588.The_Shining", "55077714.Enders_Game")).progress).toBe(20)
    })
    test("rejects a missing current shelf instead of using historical books", () => {
        expect(() => parseCurrentlyReading(shelf.replace('id="currentlyReadingReviews"', 'id="activity"'))).toThrow()
    })
})
