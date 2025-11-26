import "./bible.css"
import "react-h5-audio-player/lib/styles.css"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef, useState } from "react"
import { getBiblePassage } from "@/app/actions/bible"
import { useBibleNavigation } from "./use-bible-navigation"
import { BibleSkeleton } from "./bible-skeletons"
import { BibleNavigationBar } from "./bible-navigation-bar"
import { BibleNavigationButtons } from "./bible-navigation-buttons"
import { BibleAudioPlayer } from "./bible-audio-player"
import { BiblePassage } from "./bible-passage"
import { cleanChapterNumbers, extractAudioFromPassage } from "./bible-utils"

const Bible = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [audio, setAudio] = useState<string | undefined>(undefined)
    const [showAudioPlayer, setShowAudioPlayer] = useState(false)
    const [search, setSearch] = useState("")

    const {
        book,
        chapter,
        verse,
        currentBook,
        passageKey,
        canGoPrevious,
        canGoNext,
        navigate,
    } = useBibleNavigation("gen", 1)

    const { data: passage, isLoading: isLoadingPassage } = useQuery({
        queryKey: ["bible", book, chapter, verse],
        queryFn: () => getBiblePassage(passageKey),
    })

    useEffect(() => {
        if (passage?.passages?.[0]) {
            const audioSrc = extractAudioFromPassage(passage.passages[0])
            setAudio(audioSrc)
            // Clean chapter numbers after DOM is updated
            setTimeout(() => cleanChapterNumbers(), 0)
        }
    }, [passage])

    const handleNavigate = (direction: "previous" | "next") => {
        navigate(direction, containerRef)
    }

    return (
        <div
            ref={containerRef}
            className="relative mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 px-8 pb-24"
        >
            <BibleNavigationBar
                search={search}
                onSearchChange={setSearch}
                showAudioPlayer={showAudioPlayer}
                onToggleAudioPlayer={() => setShowAudioPlayer(!showAudioPlayer)}
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
