"use client"

import { useMemo, useRef, useState } from "react"
import {
    motion,
    type MotionValue,
    useMotionValueEvent,
    useScroll,
    useTransform,
} from "motion/react"

type Token = { text: string }

function parseManuscript(source: string): Token[] {
    const tokens: Token[] = []

    source.replaceAll("~", "").split(/(\s+)/).forEach((piece) => {
        if (piece) tokens.push({ text: piece })
    })

    return tokens
}

export function ManuscriptReader({ manuscript }: { manuscript: string }) {
    const tokens = useMemo(() => parseManuscript(manuscript), [manuscript])
    const { scrollY } = useScroll()
    let wordIndex = -1

    return (
        <main className="manuscript" aria-label="Manuscript">
            <article className="manuscript-text">
                {tokens.map((token, tokenIndex) =>
                    /^\s+$/.test(token.text) ? (
                        token.text.split("").map((character, characterIndex) =>
                            character === "\n" ? (
                                <br key={`${tokenIndex}-${characterIndex}`} />
                            ) : (
                                character
                            ),
                        )
                    ) : (
                        <Word
                            index={++wordIndex}
                            key={tokenIndex}
                            scrollY={scrollY}
                            text={token.text}
                        />
                    ),
                )}
            </article>
        </main>
    )
}

function Word({
    index,
    scrollY,
    text,
}: {
    index: number
    scrollY: MotionValue<number>
    text: string
}) {
    const wordRef = useRef<HTMLSpanElement>(null)
    const bookHasOpened = useRef(false)
    const [isBookOpen, setIsBookOpen] = useState(false)
    const hasBook = text.replace(/[^a-z]/gi, "").toLowerCase() === "author"
    const reveal = useTransform(scrollY, (position) => {
        if (index === 0) return 1
        if (typeof window === "undefined") return 0

        const word = wordRef.current
        const article = word?.closest<HTMLElement>(".manuscript-text")
        if (!word || !article) return 0

        const viewportHeight = window.innerHeight
        const wordBounds = word.getBoundingClientRect()
        const articleBounds = article.getBoundingClientRect()
        const horizontalPosition = Math.max(
            0,
            Math.min(1, (wordBounds.left - articleBounds.left) / articleBounds.width),
        )

        const lineProgress =
            (viewportHeight * 0.56 - wordBounds.top) / (viewportHeight * 0.13)
        const positionProgress = (lineProgress - horizontalPosition * 0.68) / 0.32
        const orderStep = viewportHeight * 0.014
        const orderStart = Math.max(0, (index - 1) * orderStep)
        const orderProgress = (position - orderStart) / (orderStep * 4)

        return Math.max(0, Math.min(1, positionProgress, orderProgress))
    })
    const blur = useTransform(reveal, (value) => `blur(${(1 - value) * 0.12}em)`)

    useMotionValueEvent(reveal, "change", (value) => {
        if (hasBook && value >= 0.99 && !bookHasOpened.current) {
            bookHasOpened.current = true
            setIsBookOpen(true)
        }
    })

    const word = (
        <motion.span
            className="word"
            ref={wordRef}
            style={index === 0 ? { opacity: 1, filter: "blur(0)" } : { opacity: reveal, filter: blur }}
        >
            {text}
        </motion.span>
    )

    if (hasBook) {
        return (
            <span className="author-word">
                <span
                    aria-hidden="true"
                    className={`author-book${isBookOpen ? " is-open" : ""}`}
                >
                    <span className="book-shadow" />
                    <span className="book-cover book-cover-left">
                        <span className="book-page-lines" />
                    </span>
                    <span className="book-cover book-cover-right">
                        <span className="book-page-lines" />
                    </span>
                    <span className="book-spine" />
                </span>
                {word}
            </span>
        )
    }

    return word
}
