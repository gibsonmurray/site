"use client"

import { useState, useMemo } from "react"
import Fuse from "fuse.js"
import Link from "next/link"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatListDate, type SearchablePost } from "@/app/blog/format"

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
        <div className="mb-8 flex flex-col gap-4">
            <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                    type="search"
                    placeholder="Search posts…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 pr-9"
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
                <div className="border-border/65 bg-background/80 rounded-xl border p-4 sm:p-5">
                    {results.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                            No posts found for &ldquo;{query}&rdquo;.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-[0.12em] uppercase">
                                {results.length} result
                                {results.length !== 1 ? "s" : ""}
                            </p>
                            {results.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="group hover:bg-muted/30 flex flex-col gap-1 rounded-lg px-3 py-2 transition-colors"
                                >
                                    <p className="text-muted-foreground group-hover:text-primary/60 text-xs tabular-nums transition-colors">
                                        {formatListDate(post.publishedAt)}
                                    </p>
                                    <p className="text-foreground group-hover:text-primary tracking-tight transition-colors">
                                        {post.title}
                                    </p>
                                    {post.summary && (
                                        <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed line-clamp-2">
                                            {post.summary}
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
