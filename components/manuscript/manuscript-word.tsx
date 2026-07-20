"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
    motion,
    type MotionValue,
    useMotionValueEvent,
    useTransform,
} from "motion/react"

import { WordDecoration } from "@/components/manuscript/word-decoration"
import type { AccentKind } from "@/lib/manuscript"

type ManuscriptWordProps = {
    accent?: AccentKind
    index: number
    onCompletionChange?: React.Dispatch<React.SetStateAction<boolean>>
    scrollY: MotionValue<number>
    text: string
}

const RIGHT_RAIL_ACCENTS: AccentKind[] = ["code", "friend", "signature"]

export function ManuscriptWord({
    accent,
    index,
    onCompletionChange,
    scrollY,
    text,
}: ManuscriptWordProps) {
    const wordRef = useRef<HTMLSpanElement>(null)
    const signatureDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [decorationVisible, setDecorationVisible] = useState(false)
    const [emphasized, setEmphasized] = useState(false)

    useLayoutEffect(() => {
        if (!accent || !RIGHT_RAIL_ACCENTS.includes(accent)) return

        const updateRightRailOffset = () => {
            const word = wordRef.current
            const article = word?.closest<HTMLElement>(".manuscript-text")
            if (!word || !article) return

            const wordBounds = word.getBoundingClientRect()
            const articleBounds = article.getBoundingClientRect()
            word.style.setProperty(
                "--right-rail-offset",
                `${articleBounds.right - wordBounds.left}px`,
            )
        }

        updateRightRailOffset()
        window.addEventListener("resize", updateRightRailOffset)
        document.fonts.ready.then(updateRightRailOffset)

        return () => window.removeEventListener("resize", updateRightRailOffset)
    }, [accent])

    const reveal = useTransform(scrollY, (position) => {
        if (index === 0) return 1
        if (typeof window === "undefined") return 0

        const word = wordRef.current
        const article = word?.closest<HTMLElement>(".manuscript-text")
        const firstWord = article?.querySelector<HTMLElement>(".word")
        if (!word || !article || !firstWord) return 0

        const wordBounds = word.getBoundingClientRect()
        const firstWordBounds = firstWord.getBoundingClientRect()
        const articleBounds = article.getBoundingClientRect()
        const lineHeight =
            Number.parseFloat(window.getComputedStyle(article).lineHeight) ||
            wordBounds.height * 1.28
        const horizontalPosition = Math.max(
            0,
            Math.min(1, (wordBounds.left - articleBounds.left) / articleBounds.width),
        )
        const verticalOffset = Math.max(0, wordBounds.top - firstWordBounds.top)
        const layoutStart =
            verticalOffset - window.innerHeight * 0.26 + horizontalPosition * lineHeight * 0.82
        const openingSequenceStart = Math.min(index - 1, 24) * lineHeight * 0.1
        const revealStart = Math.max(openingSequenceStart, layoutStart)
        const revealDistance = Math.max(42, lineHeight * 0.85)

        return Math.max(0, Math.min(1, (position - revealStart) / revealDistance))
    })
    const blur = useTransform(reveal, (value) => `blur(${(1 - value) * 0.12}em)`)

    useEffect(() => {
        return () => {
            if (signatureDelayRef.current) clearTimeout(signatureDelayRef.current)
        }
    }, [])

    useMotionValueEvent(reveal, "change", (value) => {
        onCompletionChange?.(value >= 0.99)
        if (!accent) return

        if (value >= 0.99) {
            if (accent !== "zoom") setEmphasized(true)

            if (accent === "signature") {
                if (!decorationVisible && !signatureDelayRef.current) {
                    signatureDelayRef.current = setTimeout(() => {
                        signatureDelayRef.current = null
                        setDecorationVisible(true)
                    }, 500)
                }
            } else {
                setDecorationVisible(true)
            }
        } else if (accent === "signature" && !decorationVisible && signatureDelayRef.current) {
            clearTimeout(signatureDelayRef.current)
            signatureDelayRef.current = null
        }

        if (value <= 0.01) {
            setDecorationVisible(false)
            setEmphasized(false)
        }
    })

    const className = [
        "word",
        accent ? `${accent}-word` : undefined,
        accent && accent !== "zoom" && emphasized ? "is-emphasized" : undefined,
    ]
        .filter(Boolean)
        .join(" ")

    return (
        <motion.span
            className={className}
            ref={wordRef}
            style={index === 0 ? { opacity: 1, filter: "blur(0)" } : { opacity: reveal, filter: blur }}
        >
            {accent && decorationVisible ? <WordDecoration accent={accent} text={text} /> : null}
            {accent === "zoom" ? (
                <span className="zoom-label">{text}</span>
            ) : accent ? (
                <>
                    <span className="accent-label">{text.replace(/[.,!?;:]+$/, "")}</span>
                    {text.match(/[.,!?;:]+$/)?.[0]}
                </>
            ) : (
                text
            )}
        </motion.span>
    )
}
