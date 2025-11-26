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
    return bookIndex !== -1 ? { book: BIBLE_BOOKS[bookIndex], index: bookIndex } : null
}

export const extractAudioFromPassage = (passageHtml: string): string | undefined => {
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

