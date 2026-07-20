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
import { ZoomLens } from "@/components/zoom-lens"

const POP_SPRING = {
    type: "spring" as const,
    stiffness: 240,
    damping: 19,
    mass: 0.72,
    opacity: { duration: 0.18 },
}

type Token = {
    text: string
    signature: boolean
    codeIcon: boolean
    friendEmoji: boolean
    zoomLens: boolean
}

function parseManuscript(source: string): Token[] {
    const tokens: Token[] = []

    const pieces = source.match(/~[^~]+~[.,!?;:]?|\s+|[^\s]+/g) ?? []

    pieces.forEach((piece) => {
        if (piece) {
            tokens.push({
                text: piece.replaceAll("~", ""),
                signature: piece.includes("~author~"),
                codeIcon: piece.includes("~programmer~"),
                friendEmoji: piece.includes("~friend~"),
                zoomLens: piece.includes("~zoom out~"),
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
                            friendEmoji={token.friendEmoji}
                            index={++wordIndex}
                            key={tokenIndex}
                            codeIcon={token.codeIcon}
                            signature={token.signature}
                            scrollY={scrollY}
                            text={token.text}
                            zoomLens={token.zoomLens}
                        />
                    ),
                )}
            </article>
        </main>
    )
}

function Word({
    codeIcon,
    friendEmoji,
    index,
    signature,
    scrollY,
    text,
    zoomLens,
}: {
    codeIcon: boolean
    friendEmoji: boolean
    index: number
    signature: boolean
    scrollY: MotionValue<number>
    text: string
    zoomLens: boolean
}) {
    const wordRef = useRef<HTMLSpanElement>(null)
    const signatureDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [emphasizeAuthor, setEmphasizeAuthor] = useState(false)
    const [showCodeIcon, setShowCodeIcon] = useState(false)
    const [showFriendEmoji, setShowFriendEmoji] = useState(false)
    const [showSignature, setShowSignature] = useState(false)
    const [showZoomLens, setShowZoomLens] = useState(false)
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
            if (value >= 0.99) setEmphasizeAuthor(true)

            if (value >= 0.99 && !showSignature && !signatureDelayRef.current) {
                signatureDelayRef.current = setTimeout(() => {
                    signatureDelayRef.current = null
                    setShowSignature(true)
                }, 500)
            } else if (value < 0.99 && !showSignature && signatureDelayRef.current) {
                clearTimeout(signatureDelayRef.current)
                signatureDelayRef.current = null
            }

            if (value <= 0.01) {
                setEmphasizeAuthor(false)
                setShowSignature(false)
            }
        }

        if (codeIcon) {
            if (value >= 0.99) {
                setShowCodeIcon(true)
            } else if (value <= 0.01) {
                setShowCodeIcon(false)
            }
        }

        if (friendEmoji) {
            if (value >= 0.99) {
                setShowFriendEmoji(true)
            } else if (value <= 0.01) {
                setShowFriendEmoji(false)
            }
        }

        if (zoomLens) {
            if (value >= 0.99) {
                setShowZoomLens(true)
            } else if (value <= 0.01) {
                setShowZoomLens(false)
            }
        }
    })

    return (
        <motion.span
            className={`word${signature ? " signature-word" : ""}${signature && emphasizeAuthor ? " is-emphasized" : ""}${codeIcon ? " code-word" : ""}${codeIcon && showCodeIcon ? " is-emphasized" : ""}${friendEmoji ? " friend-word" : ""}${friendEmoji && showFriendEmoji ? " is-emphasized" : ""}${zoomLens ? " zoom-word" : ""}`}
            ref={wordRef}
            style={index === 0 ? { opacity: 1, filter: "blur(0)" } : { opacity: reveal, filter: blur }}
        >
            {signature && showSignature ? (
                <span className="signature-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="lottie-pop"
                        initial={{ opacity: 0, scale: 0.68, y: 14 }}
                        style={{ originX: 0.5, originY: 1 }}
                        transition={POP_SPRING}
                    >
                        <Lottie
                            animationData={signatureAnimation}
                            autoplay={!reduceMotion}
                            className="signature-lottie"
                            loop
                            renderer="svg"
                        />
                    </motion.span>
                </span>
            ) : null}
            {codeIcon && showCodeIcon ? (
                <span className="code-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        className="lottie-pop"
                        initial={{ opacity: 0, scale: 0.42, x: 12 }}
                        style={{ originX: 1, originY: 0.5 }}
                        transition={POP_SPRING}
                    >
                        <Lottie
                            animationData={typeScriptAnimation}
                            autoplay={!reduceMotion}
                            className="code-lottie"
                            loop
                            renderer="svg"
                        />
                    </motion.span>
                </span>
            ) : null}
            {friendEmoji && showFriendEmoji ? (
                <span className="friend-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1 }}
                        className="emoji-pop"
                        initial={{ opacity: 0, scale: 0.3 }}
                        style={{ originX: 0, originY: 0 }}
                        transition={POP_SPRING}
                    >
                        😊
                    </motion.span>
                </span>
            ) : null}
            {zoomLens && showZoomLens ? (
                <motion.span
                    animate={{ opacity: 1, scale: 1 }}
                    aria-hidden="true"
                    className="zoom-lens-stage"
                    initial={{ opacity: 0, scale: 0.55 }}
                    style={{ originX: 0.5, originY: 0.5 }}
                    transition={POP_SPRING}
                >
                    <ZoomLens />
                </motion.span>
            ) : null}
            {zoomLens ? (
                <span className="zoom-label">{text}</span>
            ) : signature || codeIcon || friendEmoji ? (
                <>
                    <span className="accent-label">
                        {text.replace(/[.,!?;:]+$/, "")}
                    </span>
                    {text.match(/[.,!?;:]+$/)?.[0]}
                </>
            ) : (
                text
            )}
        </motion.span>
    )
}
