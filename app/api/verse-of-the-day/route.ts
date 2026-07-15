import { NextResponse } from "next/server"

const VERSE_OF_THE_DAY_URL = "https://www.bible.com/verse-of-the-day"
const IMAGE_HOSTNAME = "imageproxy.youversionapi.com"

export const revalidate = 3600

export async function GET() {
    try {
        const response = await fetch(VERSE_OF_THE_DAY_URL, {
            headers: {
                Accept: "text/html",
                "User-Agent": "gibsonmurray-portfolio",
            },
            next: { revalidate: 3600 },
        })

        if (!response.ok) {
            return NextResponse.json(
                { error: "Verse of the Day is unavailable" },
                { status: 502 },
            )
        }

        const html = await response.text()
        const imageMatch = html.match(
            /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["'][^>]*>/i,
        )

        if (!imageMatch?.[1]) {
            return NextResponse.json(
                { error: "Verse of the Day image could not be found" },
                { status: 502 },
            )
        }

        const imageUrl = new URL(imageMatch[1].replaceAll("&amp;", "&"))
        if (
            imageUrl.protocol !== "https:" ||
            imageUrl.hostname !== IMAGE_HOSTNAME
        ) {
            return NextResponse.json(
                { error: "Verse of the Day image host is invalid" },
                { status: 502 },
            )
        }

        return NextResponse.json(
            { imageUrl: imageUrl.toString() },
            {
                headers: {
                    "Cache-Control":
                        "public, s-maxage=3600, stale-while-revalidate=86400",
                },
            },
        )
    } catch {
        return NextResponse.json(
            { error: "Verse of the Day is unavailable" },
            { status: 502 },
        )
    }
}
