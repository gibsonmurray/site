import { useState, useEffect } from "react"
import type { RefObject } from "react"
import { BIBLE_BOOKS } from "@/lib/constants"
import { findBookByInput } from "./bible-utils"

export const useBibleNavigation = (
    initialBook: string = "gen",
    initialChapter: number = 1,
) => {
    const [book, setBook] = useState<string>(initialBook)
    const [chapter, setChapter] = useState<number>(initialChapter)
    const [verse, setVerse] = useState<number | null>(null)

    const bookResult = findBookByInput(book)
    const currentBook = bookResult?.book ?? null
    const currentBookIndex = bookResult?.index ?? -1

    const passageBookLabel = currentBook?.name ?? book
    const passageKey = `${passageBookLabel} ${chapter}${verse ? `:${verse}` : ""}`

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

    const navigate = (
        direction: "previous" | "next",
        containerRef: RefObject<HTMLDivElement | null>,
    ) => {
        if (!currentBook) return

        // Find the scrollable parent (the div with overflow-auto in Window component)
        const scrollableParent = containerRef.current?.closest(
            ".overflow-auto",
        ) as HTMLElement
        scrollableParent?.scrollTo({
            top: 0,
            behavior: "smooth",
        })
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

    return {
        book,
        chapter,
        verse,
        setBook,
        setChapter,
        setVerse,
        currentBook,
        currentBookIndex,
        passageKey,
        canGoPrevious,
        canGoNext,
        navigate,
    }
}
