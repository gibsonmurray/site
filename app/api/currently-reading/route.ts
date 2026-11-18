import { parseCurrentlyReading } from "@/lib/goodreads"

const CACHE_MAX_AGE = 3600

export async function GET() {
    try {
        const response = await fetch("https://www.goodreads.com/user/show/196455087", {
            headers: { "User-Agent": "Gibson Murray currently-reading widget" },
            next: { revalidate: CACHE_MAX_AGE },
            signal: AbortSignal.timeout(10_000),
        })
        if (!response.ok) throw new Error(`Goodreads returned ${response.status}`)

        return Response.json(parseCurrentlyReading(await response.text()), {
            headers: {
                "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}`,
            },
        })
    } catch (error) {
        console.error("Currently reading fetch failed:", error)
        return Response.json(
            { error: "Currently reading is temporarily unavailable" },
            { status: 502, headers: { "Cache-Control": "no-store" } },
        )
    }
}
