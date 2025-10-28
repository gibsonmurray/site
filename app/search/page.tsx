// app/search/page.tsx
import type { Metadata } from "next"

// Helper to sanitize a query string for safe inclusion in metadata
function sanitizeQuery(input: string): string {
    // Remove control chars and trim
    const cleaned = input.replace(/[\x00-\x1F\x7F]/g, "").trim()
    // Collapse whitespace and limit length to avoid huge titles/descriptions
    const collapsed = cleaned.replace(/\s+/g, " ")
    return collapsed.slice(0, 120)
}

export const dynamic = "force-dynamic" // ensures metadata can depend on searchParams

type SearchParams = {
    q?: string
    page?: string
}

export async function generateMetadata({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}): Promise<Metadata> {
    const params = await searchParams
    const rawQ = params.q
    const q = rawQ ? sanitizeQuery(rawQ) : ""

    // Optional: if q is required, you can set a default or use notFound
    if (!q) {
        return {
            title: "Search",
            description: "Search across content.",
            robots: { index: true, follow: true },
            openGraph: {
                title: "Search",
                description: "Search across content.",
                url: "https://example.com/search",
                type: "website",
            },
            alternates: {
                canonical: "https://example.com/search",
            },
        }
    }

    const pageNum = Number(params.page ?? "1")
    const pageSuffix = pageNum > 1 ? ` • Page ${pageNum}` : ""

    const title = `Results for "${q}"${pageSuffix}`
    const description = `Explore search results for "${q}"${pageSuffix}.`

    return {
        title,
        description,
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title,
            description,
            url: `https://example.com/search?q=${encodeURIComponent(q)}${pageNum > 1 ? `&page=${pageNum}` : ""}`,
            type: "website",
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
        alternates: {
            canonical: `https://example.com/search?q=${encodeURIComponent(q)}${pageNum > 1 ? `&page=${pageNum}` : ""}`,
        },
    }
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const params = await searchParams
    const q = sanitizeQuery(params.q ?? "")
    const pageNum = Number(params.page ?? "1")

    // Example UI using the same params
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold">
                {q ? `Results for “${q}”` : "Search"}
            </h1>
            {pageNum > 1 && (
                <p className="text-sm text-gray-500">Page {pageNum}</p>
            )}
            {/* Render your results here */}
        </main>
    )
}
