"use client"

import { useState, useMemo } from "react"
import Fuse from "fuse.js"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    formatDisplayTitle,
    formatListDate,
    type SearchablePost,
} from "@/app/blog/format"

export type { SearchablePost }

export const BlogSearch = ({ posts }: { posts: SearchablePost[] }) => {
    const [query, setQuery] = useState("")

    const fuse = useMemo(
        () =>
            new Fuse(posts, {
                keys: [
                    { name: "title", weight: 3 },
                    { name: "summary", weight: 2 },
                    { name: "tags", weight: 1 },
                ],
                threshold: 0.35,
                includeScore: true,
            }),
        [posts],
    )

    const results = useMemo(() => {
        const q = query.trim()
        if (!q) return []
        return fuse.search(q).map((r) => r.item)
    }, [query, fuse])

    const showResults = query.trim().length > 0

    return (
        <div className="editorial-archive-search">
            <div className="relative">
                <Search className="absolute top-1/2 left-0 size-4 -translate-y-1/2" />
                <Input
                    type="search"
                    placeholder="Search the archive"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-12 rounded-none border-0 border-b bg-transparent pr-9 pl-7 shadow-none focus-visible:ring-0"
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setQuery("")}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
                        aria-label="Clear search"
                    >
                        <X className="size-4" />
                    </Button>
                )}
            </div>

            {showResults && (
                <div className="editorial-archive-search-results">
                    {results.length === 0 ? (
                        <p>No posts found for &ldquo;{query}&rdquo;.</p>
                    ) : (
                        <div>
                            <p className="editorial-archive-search-count">
                                {results.length} result
                                {results.length !== 1 ? "s" : ""}
                            </p>
                            {results.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/writings/${post.slug}`}
                                    className="editorial-archive-search-result group"
                                >
                                    <p>{formatListDate(post.publishedAt)}</p>
                                    <p>{formatDisplayTitle(post.title)}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
