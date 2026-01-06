import { FC, useEffect, useRef } from "react"
import { InfiniteData } from "@tanstack/react-query"
import { ESVSearch } from "@/types/bible"
import { Button } from "@/components/ui/button"
import { parseReference, findBookByInput } from "./bible-utils"
import { Loader2 } from "lucide-react"

type BibleSearchResultsProps = {
    searchResults: InfiniteData<ESVSearch>
    onNavigateToReference: (
        book: string,
        chapter: number,
        verse: number | null,
    ) => void
    onLoadMore: () => void
    hasMore: boolean
    isLoadingMore: boolean
}

export const BibleSearchResults: FC<BibleSearchResultsProps> = ({
    searchResults,
    onNavigateToReference,
    onLoadMore,
    hasMore,
    isLoadingMore,
}) => {
    const observerRef = useRef<IntersectionObserver | null>(null)
    const loadMoreRef = useRef<HTMLDivElement>(null)

    // Flatten all results from all pages
    const allResults = searchResults.pages.flatMap((page) => page.results || [])

    useEffect(() => {
        if (isLoadingMore) return
        if (observerRef.current) observerRef.current.disconnect()

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && hasMore) {
                    onLoadMore()
                }
            },
            { threshold: 0.1 },
        )

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current)
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [isLoadingMore, hasMore, onLoadMore])

    if (allResults.length === 0) {
        return (
            <div className="text-muted-foreground w-full max-w-xl text-center text-sm">
                No results found
            </div>
        )
    }

    const handleResultClick = (reference: string) => {
        const parsed = parseReference(reference)
        if (!parsed) return

        const bookResult = findBookByInput(parsed.book)
        if (!bookResult?.book) return

        onNavigateToReference(bookResult.book.id, parsed.chapter, parsed.verse)
    }

    return (
        <div className="flex w-full max-w-xl flex-col gap-2">
            {allResults.map((result, index) => (
                <Button
                    key={`${result.reference}-${index}`}
                    variant="simple"
                    className="flex h-auto flex-col items-start gap-2 p-4 text-left whitespace-normal"
                    onClick={() => handleResultClick(result.reference || "")}
                >
                    <span className="text-muted-foreground text-sm font-medium">
                        {result.reference || ""}
                    </span>
                    <p className="text-foreground font-newsreader text-base leading-relaxed">
                        {result.content || ""}
                    </p>
                </Button>
            ))}
            {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-4">
                    {isLoadingMore && (
                        <Loader2 className="animate-spin text-muted-foreground" />
                    )}
                </div>
            )}
        </div>
    )
}
