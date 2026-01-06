import type { RefObject } from "react"
import { BIBLE_BOOKS } from "@/lib/constants"

export const normalizeBookValue = (value: string) =>
    value.replace(/[^a-z0-9]/gi, "").toLowerCase()

export const findBookByInput = (bookInput: string) => {
    const normalizedInput = normalizeBookValue(bookInput)
    const bookIndex = BIBLE_BOOKS.findIndex((bibleBook) => {
        const normalizedId = normalizeBookValue(bibleBook.id)
        const normalizedName = normalizeBookValue(bibleBook.name)
        return (
            normalizedId === normalizedInput ||
            normalizedName === normalizedInput ||
            normalizedName.startsWith(normalizedInput)
        )
    })
    return bookIndex !== -1
        ? { book: BIBLE_BOOKS[bookIndex], index: bookIndex }
        : null
}

export const extractAudioFromPassage = (
    passageHtml: string,
): string | undefined => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(passageHtml, "text/html")
    const audioLink = doc.querySelector(".mp3link") as HTMLAnchorElement
    return audioLink?.href
}

export const cleanChapterNumbers = () => {
    document.querySelectorAll(".chapter-num").forEach((element) => {
        const onlyVerse = element.textContent?.split(":")[1]
        element.textContent = onlyVerse || element.textContent || ""
    })
}

export const parseReference = (
    reference: string,
): { book: string; chapter: number; verse: number | null } | null => {
    // Match patterns like "Numbers 11:4" or "1 Corinthians 2:5"
    const match = reference.match(/^(.+?)\s+(\d+)(?::(\d+))?$/)
    if (!match) return null

    const bookName = match[1].trim()
    const chapter = parseInt(match[2], 10)
    const verse = match[3] ? parseInt(match[3], 10) : null

    return { book: bookName, chapter, verse }
}

export const scrollToVerse = (
    verse: number,
    containerRef: RefObject<HTMLDivElement | null>,
) => {
    // Wait for DOM to update, then scroll to verse
    setTimeout(() => {
        // Find verse by matching the verse number in the text content
        const verseElements = document.querySelectorAll(".verse-num")
        let targetVerse: Element | null = null

        for (const element of verseElements) {
            const text = element.textContent || ""
            // Match verse number (e.g., "4" or "4:" or ":4")
            const verseMatch = text.match(/:?(\d+)/)
            if (verseMatch && parseInt(verseMatch[1], 10) === verse) {
                targetVerse = element
                break
            }
        }

        if (targetVerse) {
            const scrollableParent = containerRef.current?.closest(
                ".overflow-auto",
            ) as HTMLElement
            if (scrollableParent) {
                const elementTop = targetVerse.getBoundingClientRect().top
                const parentTop = scrollableParent.getBoundingClientRect().top
                const scrollPosition =
                    scrollableParent.scrollTop + elementTop - parentTop - 100 // 100px offset from top
                scrollableParent.scrollTo({
                    top: scrollPosition,
                    behavior: "smooth",
                })

                // Add highlight effect after scroll completes
                // Smooth scroll typically takes ~300-500ms, so we wait a bit
                setTimeout(() => {
                    // Find the parent element that contains the verse text
                    const verseParent =
                        targetVerse?.parentElement || targetVerse
                    if (verseParent) {
                        verseParent.classList.add("verse-highlight")
                        // Remove class after animation completes (1.2s animation duration)
                        setTimeout(() => {
                            verseParent.classList.remove("verse-highlight")
                        }, 1200)
                    }
                }, 500) // Wait for smooth scroll to complete
            }
        }
    }, 300) // Increased delay to ensure DOM is fully updated
}
