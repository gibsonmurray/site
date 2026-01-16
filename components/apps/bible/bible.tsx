import "./bible.css"
import "react-h5-audio-player/lib/styles.css"
import {
    useQuery,
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query"
import { RefObject, useEffect, useRef, useState } from "react"
import { getBiblePassage, getBibleSearch } from "@/app/actions/bible"
import { useBibleNavigation } from "./use-bible-navigation"
import { BibleSkeleton } from "./bible-skeletons"
import { BibleNavigationButtons } from "./bible-navigation-buttons"
import { BibleAudioPlayer } from "./bible-audio-player"
import { BiblePassage } from "./bible-passage"
import { BibleSearchResults } from "./bible-search-results"
import {
    cleanChapterNumbers,
    extractAudioFromPassage,
    parseSearchAsReference,
    scrollToVerse,
} from "./bible-utils"
import { BIBLE_BOOKS } from "@/lib/constants"
import BibleMenu from "./bible-menu"
import { cn } from "@/lib/utils"

const Bible = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()
    const [audio, setAudio] = useState<string | undefined>(undefined)
    const [showAudioPlayer, setShowAudioPlayer] = useState(false)
    const [search, setSearch] = useState("")
    const [submittedSearch, setSubmittedSearch] = useState("")

    const {
        book,
        chapter,
        verse,
        currentBook,
        currentBookIndex,
        passageKey,
        canGoPrevious,
        canGoNext,
        navigate,
        setBook,
        setChapter,
        setVerse,
    } = useBibleNavigation("gen", 1)

    const { data: passage, isLoading: isLoadingPassage } = useQuery({
        queryKey: ["bible", book, chapter, verse],
        queryFn: () => getBiblePassage(passageKey),
        enabled: !submittedSearch.trim(),
    })

    const {
        data: searchResults,
        isLoading: isLoadingSearch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["bible-search", submittedSearch],
        queryFn: ({ pageParam = 1 }) =>
            getBibleSearch(submittedSearch, pageParam),
        enabled: submittedSearch.trim().length > 0,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (!lastPage.page || !lastPage.total_pages) return undefined
            return lastPage.page < lastPage.total_pages
                ? lastPage.page + 1
                : undefined
        },
    })

    // Prefetch previous and next chapters
    useEffect(() => {
        if (!currentBook) return

        // Calculate previous chapter
        if (canGoPrevious) {
            let prevBook = currentBook
            let prevChapter = chapter - 1

            if (chapter === 1 && currentBookIndex > 0) {
                prevBook = BIBLE_BOOKS[currentBookIndex - 1]
                prevChapter = prevBook.chapter_lengths.length
            }

            const prevPassageKey = `${prevBook.name} ${prevChapter}`
            queryClient.prefetchQuery({
                queryKey: ["bible", prevBook.id, prevChapter, null],
                queryFn: () => getBiblePassage(prevPassageKey),
            })
        }

        // Calculate next chapter
        if (canGoNext) {
            let nextBook = currentBook
            let nextChapter = chapter + 1

            if (
                chapter >= currentBook.chapter_lengths.length &&
                currentBookIndex < BIBLE_BOOKS.length - 1
            ) {
                nextBook = BIBLE_BOOKS[currentBookIndex + 1]
                nextChapter = 1
            }

            const nextPassageKey = `${nextBook.name} ${nextChapter}`
            queryClient.prefetchQuery({
                queryKey: ["bible", nextBook.id, nextChapter, null],
                queryFn: () => getBiblePassage(nextPassageKey),
            })
        }
    }, [
        book,
        chapter,
        currentBook,
        currentBookIndex,
        canGoPrevious,
        canGoNext,
        queryClient,
    ])

    useEffect(() => {
        if (passage?.passages?.[0]) {
            const audioSrc = extractAudioFromPassage(passage.passages[0])
            setAudio(audioSrc)
            // Clean chapter numbers after DOM is updated
            setTimeout(() => cleanChapterNumbers(), 0)
            // Scroll to verse if one is set
            if (verse) {
                scrollToVerse(verse, containerRef)
            }
        }
    }, [passage, verse])

    const [menuOpen, setMenuOpen] = useState(false)

    const handleNavigate = (direction: "previous" | "next") => {
        navigate(direction, containerRef)
    }

    const handleNavigateToReference = (
        bookId: string,
        chapterNum: number,
        verseNum: number | null,
    ) => {
        setBook(bookId)
        setChapter(chapterNum)
        // setVerse(verseNum)
        if (verseNum) {
            scrollToVerse(verseNum, containerRef)
        }
        setSearch("")
        setSubmittedSearch("")
    }

    const handleSearchSubmit = () => {
        const trimmedSearch = search.trim()
        
        // Check if the search looks like a Bible reference (e.g., "josh 3", "gen 1:5")
        const reference = parseSearchAsReference(trimmedSearch)
        if (reference) {
            // Navigate directly to the reference instead of searching
            handleNavigateToReference(reference.bookId, reference.chapter, reference.verse)
            return
        }
        
        // Otherwise, perform a text search
        setSubmittedSearch(trimmedSearch)
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative mx-auto flex max-w-2xl flex-col items-center justify-start gap-6 px-8 pb-24",
                menuOpen && "h-full overflow-hidden",
            )}
        >
            <BibleMenu
                search={search}
                onSearchChange={setSearch}
                onSearchSubmit={handleSearchSubmit}
                onClearSearch={() => {
                    setSearch("")
                    setSubmittedSearch("")
                }}
                showAudioPlayer={showAudioPlayer}
                onToggleAudioPlayer={() => setShowAudioPlayer(!showAudioPlayer)}
                setBook={setBook}
                setChapter={setChapter}
                containerRef={containerRef}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
            />

            {!submittedSearch.trim() && (
                <BibleNavigationButtons
                    canGoPrevious={canGoPrevious}
                    canGoNext={canGoNext}
                    onPrevious={() => handleNavigate("previous")}
                    onNext={() => handleNavigate("next")}
                />
            )}

            {submittedSearch.trim() ? (
                <>
                    {isLoadingSearch && <BibleSkeleton />}
                    {!isLoadingSearch && searchResults && (
                        <BibleSearchResults
                            searchResults={searchResults}
                            onNavigateToReference={handleNavigateToReference}
                            onLoadMore={fetchNextPage}
                            hasMore={hasNextPage ?? false}
                            isLoadingMore={isFetchingNextPage}
                        />
                    )}
                </>
            ) : (
                <>
                    {isLoadingPassage && <BibleSkeleton />}
                    {!isLoadingPassage &&
                        passage?.passages?.[0] &&
                        currentBook && (
                            <BiblePassage
                                bookName={currentBook.name}
                                chapter={chapter}
                                passageHtml={passage.passages[0]}
                            />
                        )}
                    {!isLoadingPassage && !passage && (
                        <p className="text-muted-foreground text-sm">
                            Unable to load passage. Please try again.
                        </p>
                    )}
                </>
            )}

            <BibleAudioPlayer show={showAudioPlayer} audioSrc={audio} />
        </div>
    )
}

export default Bible
