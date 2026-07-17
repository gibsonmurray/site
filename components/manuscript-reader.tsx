"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Lottie from "lottie-react"
import {
    motion,
    type MotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useTransform,
} from "motion/react"

import signatureAnimation from "@/animations/signature.json"
import typeScriptAnimation from "@/animations/type-script.json"

type Token = { text: string; signature: boolean; codeIcon: boolean }

function parseManuscript(source: string): Token[] {
    const tokens: Token[] = []

    source.split(/(\s+)/).forEach((piece) => {
        if (piece) {
            tokens.push({
                text: piece.replaceAll("~", ""),
                signature: piece.includes("~author~"),
                codeIcon: piece.includes("~programmer~"),
            })
        }
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
                            codeIcon={token.codeIcon}
                            signature={token.signature}
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
    codeIcon,
    index,
    signature,
    scrollY,
    text,
}: {
    codeIcon: boolean
    index: number
    signature: boolean
    scrollY: MotionValue<number>
    text: string
}) {
    const wordRef = useRef<HTMLSpanElement>(null)
    const signatureDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [showCodeIcon, setShowCodeIcon] = useState(false)
    const [showSignature, setShowSignature] = useState(false)
    const reduceMotion = useReducedMotion()
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

    useEffect(() => {
        return () => {
            if (signatureDelayRef.current) clearTimeout(signatureDelayRef.current)
        }
    }, [])

    useMotionValueEvent(reveal, "change", (value) => {
        if (signature) {
            if (value >= 0.99 && !showSignature && !signatureDelayRef.current) {
                signatureDelayRef.current = setTimeout(() => {
                    signatureDelayRef.current = null
                    setShowSignature(true)
                }, 500)
            } else if (value < 0.99 && !showSignature && signatureDelayRef.current) {
                clearTimeout(signatureDelayRef.current)
                signatureDelayRef.current = null
            }

            if (value <= 0.01) setShowSignature(false)
        }

        if (codeIcon) {
            if (value >= 0.99) {
                setShowCodeIcon(true)
            } else if (value <= 0.01) {
                setShowCodeIcon(false)
            }
        }
    })

    return (
        <motion.span
            className={`word${signature ? " signature-word" : ""}${codeIcon ? " code-word" : ""}`}
            ref={wordRef}
            style={index === 0 ? { opacity: 1, filter: "blur(0)" } : { opacity: reveal, filter: blur }}
        >
            {signature && showSignature ? (
                <span className="signature-animation" aria-hidden="true">
                    <Lottie
                        animationData={signatureAnimation}
                        autoplay={!reduceMotion}
                        className="signature-lottie"
                        loop
                        renderer="svg"
                    />
                </span>
            ) : null}
            {codeIcon && showCodeIcon ? (
                <span className="code-animation" aria-hidden="true">
                    <Lottie
                        animationData={typeScriptAnimation}
                        autoplay={!reduceMotion}
                        className="code-lottie"
                        loop
                        renderer="svg"
                    />
                </span>
            ) : null}
            {text}
        </motion.span>
    )
}
