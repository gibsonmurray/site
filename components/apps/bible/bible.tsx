import "./bible.css"
import "react-h5-audio-player/lib/styles.css"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { getBiblePassage } from "@/app/actions/bible"
import { BIBLE_BOOKS } from "@/lib/constants"
import AudioPlayer from "react-h5-audio-player"
import { BookOpenIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const ParagraphSkeleton = () => (
    <div className="space-y-2">
        {["w-full", "w-11/12", "w-10/12", "w-4/5"].map((width, index) => (
            <div
                key={`${width}-${index}`}
                className={`bg-muted/60 h-4 rounded ${width} animate-pulse`}
            />
        ))}
    </div>
)

const BibleSkeleton = () => (
    <div className="space-y-6">
        <div className="space-y-2">
            <div className="bg-muted h-8 w-40 animate-pulse rounded" />
            <div className="bg-muted/80 h-5 w-64 animate-pulse rounded" />
        </div>
        <ParagraphSkeleton />
        <ParagraphSkeleton />
        <ParagraphSkeleton />
    </div>
)

const Bible = () => {
    const [book, setBook] = useState<string>("gen")
    const [chapter, setChapter] = useState<number>(1)
    const [verse, setVerse] = useState<number | null>(null)
    const [audio, setAudio] = useState<string | undefined>(undefined)

    const normalizeBookValue = (value: string) =>
        value.replace(/[^a-z0-9]/gi, "").toLowerCase()
    const normalizedBookInput = normalizeBookValue(book)
    const currentBookIndex = BIBLE_BOOKS.findIndex((bibleBook) => {
        const normalizedId = normalizeBookValue(bibleBook.id)
        const normalizedName = normalizeBookValue(bibleBook.name)
        return (
            normalizedId === normalizedBookInput ||
            normalizedName === normalizedBookInput ||
            normalizedName.startsWith(normalizedBookInput)
        )
    })
    const currentBook =
        currentBookIndex !== -1 ? BIBLE_BOOKS[currentBookIndex] : null
    const passageBookLabel = currentBook?.name ?? book
    const passageKey = `${passageBookLabel} ${chapter}${
        verse ? `:${verse}` : ""
    }`
    const isFirstBook = currentBookIndex === 0
    const isLastBook = currentBookIndex === BIBLE_BOOKS.length - 1
    const canGoPrevious = Boolean(currentBook) && (!isFirstBook || chapter > 1)
    const canGoNext = currentBook
        ? chapter < currentBook.chapter_lengths.length || !isLastBook
        : false

    useEffect(() => {
        if (currentBook && book !== currentBook.id) {
            setBook(currentBook.id)
        }
    }, [book, currentBook])

    const { data: passage, isLoading: isLoadingPassage } = useQuery({
        queryKey: ["bible", book, chapter, verse],
        queryFn: () => getBiblePassage(passageKey),
    })

    useEffect(() => {
        if (passage) {
            document.querySelectorAll(".chapter-num").forEach((element) => {
                const onlyVerse = element.textContent?.split(":")[1]
                element.textContent = onlyVerse
            })
            const audioLink = document.querySelector(
                ".mp3link",
            ) as HTMLAnchorElement
            setAudio(audioLink?.href)
        }
    }, [passage])

    const handleNavigate = (direction: "previous" | "next") => {
        if (!currentBook) return
        setVerse(null)

        if (direction === "next") {
            const isLastChapterOfBook =
                chapter >= currentBook.chapter_lengths.length

            if (isLastChapterOfBook) {
                const nextBook = BIBLE_BOOKS[currentBookIndex + 1]
                if (!nextBook) return

                setBook(nextBook.id)
                setChapter(1)
                return
            }

            setChapter((prev) => prev + 1)
            return
        }

        const isFirstChapterOfBook = chapter <= 1

        if (isFirstChapterOfBook) {
            const previousBook = BIBLE_BOOKS[currentBookIndex - 1]
            if (!previousBook) return

            setBook(previousBook.id)
            setChapter(previousBook.chapter_lengths.length)
            return
        }

        setChapter((prev) => prev - 1)
    }

    return (
        <div className="relative mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 px-8 pb-24">
            <nav className="bg-background/50 sticky top-0 z-10 flex w-full items-center justify-between px-4 py-2 backdrop-blur-xs">
                <Button variant="ghost" size="icon">
                    <BookOpenIcon className="size-4" />
                </Button>
            </nav>
            <nav className="fixed top-1/2 left-1/2 flex w-2xl -translate-x-1/2 -translate-y-1/2 items-center justify-between">
                <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => handleNavigate("previous")}
                            disabled={!canGoPrevious}
                        >
                            <ChevronLeftIcon className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="dark">
                        <p>Previous</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => handleNavigate("next")}
                            disabled={!canGoNext}
                        >
                            <ChevronRightIcon className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="dark">
                        <p>Next</p>
                    </TooltipContent>
                </Tooltip>
            </nav>
            {isLoadingPassage && <BibleSkeleton />}
            {!isLoadingPassage && passage && (
                <>
                    <div className="relative flex w-full max-w-xl items-center gap-2">
                        <div className="bg-bible-red h-8 w-3"></div>
                        <h2 className="text-foreground text-start font-newsreader text-4xl">
                            {currentBook?.name}
                        </h2>
                    </div>
                    <h3 className="text-bible-red w-full max-w-xl text-start font-newsreader text-4xl">
                        {chapter}
                    </h3>
                    <div
                        className="prose max-w-xl font-newsreader"
                        dangerouslySetInnerHTML={{
                            __html: passage.passages?.[0] ?? "",
                        }}
                    />
                </>
            )}
            {!isLoadingPassage && !passage && (
                <p className="text-muted-foreground text-sm">
                    Unable to load passage. Please try again.
                </p>
            )}
            <AudioPlayer
                src={audio}
                className="bg-background/50! fixed right-0 bottom-0 left-0 mx-auto mb-1 max-w-2xl shadow-none! backdrop-blur-xs!"
            />
        </div>
    )
}

export default Bible
