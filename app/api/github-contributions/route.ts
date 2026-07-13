import { NextResponse, type NextRequest } from "next/server"

const GITHUB_USERNAME = /^[a-zd](?:[a-z\d-]{0,37}[a-z\d])?$/i

export const revalidate = 3600

export async function GET(request: NextRequest) {
    const username = request.nextUrl.searchParams.get("username")?.trim()

    if (!username || !GITHUB_USERNAME.test(username)) {
        return NextResponse.json({ error: "Invalid GitHub username" }, { status: 400 })
    }

    try {
        const response = await fetch(
            `https://github.com/users/${encodeURIComponent(username)}/contributions`,
            {
                headers: {
                    Accept: "text/html",
                    "User-Agent": "gibsonmurray-portfolio",
                },
                next: { revalidate: 3600 },
            },
        )

        if (!response.ok) {
            return NextResponse.json(
                { error: "GitHub contribution data is unavailable" },
                { status: 502 },
            )
        }

        const html = await response.text()
        const days = Array.from(
            html.matchAll(
                /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="([0-4])"[^>]*>/g,
            ),
            (match) => ({ date: match[1], level: Number(match[2]) }),
        ).sort((a, b) => a.date.localeCompare(b.date))

        if (days.length === 0) {
            return NextResponse.json(
                { error: "GitHub contribution data could not be read" },
                { status: 502 },
            )
        }

        return NextResponse.json(
            { days },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
                },
            },
        )
    } catch {
        return NextResponse.json(
            { error: "GitHub contribution data is unavailable" },
            { status: 502 },
        )
    }
}
