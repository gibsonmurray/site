import "./bible.css"
import "react-h5-audio-player/lib/styles.css"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { RefObject, useEffect, useRef, useState } from "react"
import { getBiblePassage } from "@/app/actions/bible"
import { useBibleNavigation } from "./use-bible-navigation"
import { BibleSkeleton } from "./bible-skeletons"
import { BibleNavigationButtons } from "./bible-navigation-buttons"
import { BibleAudioPlayer } from "./bible-audio-player"
import { BiblePassage } from "./bible-passage"
import { cleanChapterNumbers, extractAudioFromPassage } from "./bible-utils"
import { BIBLE_BOOKS } from "@/lib/constants"
import BibleMenu from "./bible-menu"
import { cn } from "@/lib/utils"

const Bible = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()
    const [audio, setAudio] = useState<string | undefined>(undefined)
    const [showAudioPlayer, setShowAudioPlayer] = useState(false)
    const [search, setSearch] = useState("")

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
    } = useBibleNavigation("gen", 1)

    const { data: passage, isLoading: isLoadingPassage } = useQuery({
        queryKey: ["bible", book, chapter, verse],
        queryFn: () => getBiblePassage(passageKey),
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
        }
    }, [passage])

    const [menuOpen, setMenuOpen] = useState(false)

    const handleNavigate = (direction: "previous" | "next") => {
        navigate(direction, containerRef)
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
                showAudioPlayer={showAudioPlayer}
                onToggleAudioPlayer={() => setShowAudioPlayer(!showAudioPlayer)}
                setBook={setBook}
                setChapter={setChapter}
                containerRef={containerRef}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
            />

            <BibleNavigationButtons
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                onPrevious={() => handleNavigate("previous")}
                onNext={() => handleNavigate("next")}
            />

            {isLoadingPassage && <BibleSkeleton />}
            {!isLoadingPassage && passage?.passages?.[0] && currentBook && (
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

            <BibleAudioPlayer show={showAudioPlayer} audioSrc={audio} />
        </div>
    )
}

export default Bible
