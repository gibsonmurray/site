"use client"

import { useEffect, useMemo, useRef } from "react"
import { animate, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react"

type Token = {
    text: string
    special: boolean
    visual?: string
}

const visuals: Record<string, string> = {
    author: "✎",
    programmer: "⌨",
    friend: "☺",
    "zoom out": "↗",
    world: "◉",
    theaters: "◫",
    "least favorite student": "🙋",
    blackboard: "A+",
    "underdog's rise": "↑",
    imagination: "✦",
    book: "▤",
    live: "♥",
    fling: "🎾",
    laugh: "😂",
    love: "∞",
    best: "★",
    your: "→",
}

function parseManuscript(source: string): Token[] {
    const tokens: Token[] = []
    let special = false

    source.split(/(~)/).forEach((part) => {
        if (part === "~") {
            special = !special
            return
        }

        const pieces = special ? [part] : part.split(/(\s+)/)
        pieces.forEach((piece) => {
            if (!piece) return
            const key = piece.trim().toLowerCase()
            tokens.push({
                text: piece,
                special: special && Boolean(key),
                visual: special && key ? visuals[key] : undefined,
            })
        })
    })

    return tokens
}

export function ManuscriptReader({ manuscript }: { manuscript: string }) {
    const rootRef = useRef<HTMLElement>(null)
    const activeSpecialRef = useRef(-1)
    const tokens = useMemo(() => parseManuscript(manuscript), [manuscript])
    const { scrollY } = useScroll()
    const reduceMotion = useReducedMotion()

    const update = () => {
        const root = rootRef.current
        if (!root) return

        const words = Array.from(root.querySelectorAll<HTMLElement>("[data-word]"))
        const readingLine = window.innerHeight * 0.62
        let latestSpecial = -1

        words.forEach((word, index) => {
            const distance = readingLine - word.getBoundingClientRect().top
            const progress = Math.max(0, Math.min(1, (distance + 38) / 76))
            word.style.setProperty("--reveal", progress.toString())
            if (progress > 0.72 && word.dataset.special === "true") latestSpecial = index
        })

        if (latestSpecial !== activeSpecialRef.current) {
            words.forEach((word, index) => word.toggleAttribute("data-current", index === latestSpecial))
            const visual = words[latestSpecial]?.querySelector<HTMLElement>("[data-visual]")
            if (visual) {
                animate(
                    visual,
                    reduceMotion
                        ? { opacity: 1, transform: "translate(-50%, 0) rotate(0deg) scale(1)" }
                        : {
                              opacity: [0, 1, 1],
                              transform: [
                                  "translate(-50%, 0.8em) rotate(-8deg) scale(0.45)",
                                  "translate(-50%, -0.28em) rotate(4deg) scale(1.14)",
                                  "translate(-50%, 0) rotate(-2deg) scale(1)",
                              ],
                          },
                    { duration: reduceMotion ? 0 : 0.68, ease: [0.16, 1, 0.3, 1] },
                )
            }
            activeSpecialRef.current = latestSpecial
        }
    }

    useMotionValueEvent(scrollY, "change", update)

    useEffect(() => {
        update()
        window.addEventListener("resize", update)
        return () => {
            window.removeEventListener("resize", update)
        }
    }, [tokens, reduceMotion])

    return (
        <main ref={rootRef} className="manuscript" aria-label="Manuscript">
            <div className="reading-line" aria-hidden="true" />
            <article className="manuscript-text">
                {tokens.map((token, index) =>
                    /^\s+$/.test(token.text) ? (
                        token.text.split("").map((character, characterIndex) =>
                            character === "\n" ? (
                                <br key={`${index}-${characterIndex}`} />
                            ) : (
                                character
                            ),
                        )
                    ) : (
                        <span
                            className={token.special ? "word special-word" : "word"}
                            data-special={token.special}
                            data-word
                            key={index}
                        >
                            {token.text}
                            {token.special && token.visual ? (
                                <span className="word-visual" data-visual aria-hidden="true">
                                    {token.visual}
                                </span>
                            ) : null}
                        </span>
                    ),
                )}
            </article>
        </main>
    )
}
