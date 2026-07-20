"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"
import { FaGithub, FaInstagram } from "react-icons/fa"
import { LuArrowUpRight, LuMail } from "react-icons/lu"
import {
    motion,
    type MotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useTransform,
} from "motion/react"

import signatureAnimation from "@/animations/signature.json"
import globeAnimation from "@/animations/spinning-globe.json"
import heroAnimation from "@/animations/hero-and-cape.json"
import ideaAnimation from "@/animations/idea-designer.json"
import loveAnimation from "@/animations/love-particle.json"
import movieAnimation from "@/animations/movie-dark.json"
import plantAnimation from "@/animations/animated-plant-loader.json"
import teacherAnimation from "@/animations/teacher.json"
import tennisBallAnimation from "@/animations/tennis-ball.json"
import typeScriptAnimation from "@/animations/type-script.json"
import { ZoomLens } from "@/components/zoom-lens"
import { LogoMark } from "@/components/logo-mark"
import bibleAnimation from "@/animations/bible.json"
import aiSearchingAnimation from "@/animations/ai-searching.json"
import championAnimation from "@/animations/champion.json"

const POP_SPRING = {
    type: "spring" as const,
    stiffness: 240,
    damping: 19,
    mass: 0.72,
    opacity: { duration: 0.18 },
}

type Token = {
    aiSearchingIcon: boolean
    bibleIcon: boolean
    championIcon: boolean
    text: string
    signature: boolean
    codeIcon: boolean
    friendEmoji: boolean
    globeIcon: boolean
    heroIcon: boolean
    ideaIcon: boolean
    laughEmoji: boolean
    loveIcon: boolean
    logoIcon: boolean
    movieIcon: boolean
    nerdEmoji: boolean
    plantIcon: boolean
    pointingEmoji: boolean
    teacherIcon: boolean
    tennisBallIcon: boolean
    zoomLens: boolean
}

function parseManuscript(source: string): Token[] {
    const tokens: Token[] = []
    let markedLiveCount = 0

    const pieces = source.match(/~[^~]+~[.,!?;:]?|\s+|[^\s]+/g) ?? []

    pieces.forEach((piece) => {
        if (piece) {
            const markedLive = piece.includes("~live~")

            tokens.push({
                aiSearchingIcon: piece.includes("~best~"),
                bibleIcon: piece.includes("~Book~"),
                championIcon: markedLive && markedLiveCount === 1,
                text: piece.replaceAll("~", ""),
                signature: piece.includes("~author~"),
                codeIcon: piece.includes("~programmer~"),
                friendEmoji: piece.includes("~friend~"),
                globeIcon: piece.includes("~world~"),
                heroIcon: piece.includes("~underdog's rise~"),
                ideaIcon: piece.includes("~imagination~"),
                laughEmoji: piece.includes("~laugh~"),
                loveIcon: piece.includes("~love~"),
                logoIcon: piece.includes("~Gibson~"),
                movieIcon: piece.includes("~theaters~"),
                nerdEmoji: piece.includes("~least favorite student~"),
                plantIcon: markedLive && markedLiveCount === 0,
                pointingEmoji: piece.includes("~your~"),
                teacherIcon: piece.includes("~blackboard~"),
                tennisBallIcon: piece.includes("~fling"),
                zoomLens: piece.includes("~zoom out~"),
            })

            if (markedLive) markedLiveCount += 1
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
                            aiSearchingIcon={token.aiSearchingIcon}
                            bibleIcon={token.bibleIcon}
                            championIcon={token.championIcon}
                            friendEmoji={token.friendEmoji}
                            globeIcon={token.globeIcon}
                            heroIcon={token.heroIcon}
                            ideaIcon={token.ideaIcon}
                            laughEmoji={token.laughEmoji}
                            loveIcon={token.loveIcon}
                            logoIcon={token.logoIcon}
                            movieIcon={token.movieIcon}
                            nerdEmoji={token.nerdEmoji}
                            plantIcon={token.plantIcon}
                            pointingEmoji={token.pointingEmoji}
                            teacherIcon={token.teacherIcon}
                            tennisBallIcon={token.tennisBallIcon}
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
            <nav className="site-links" aria-label="Elsewhere">
                <a href="https://a.co/d/03Co6ZxH" target="_blank" rel="noreferrer">
                    <span>order walls</span>
                    <LuArrowUpRight aria-hidden="true" />
                </a>
                <a href="https://github.com/gibsonmurray" target="_blank" rel="noreferrer">
                    <span>github</span>
                    <FaGithub aria-hidden="true" />
                </a>
                <a
                    href="https://www.instagram.com/gibson.murray/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <span>instagram</span>
                    <FaInstagram aria-hidden="true" />
                </a>
                <a href="mailto:hi@gibsonmurray.com">
                    <span>email</span>
                    <LuMail aria-hidden="true" />
                </a>
            </nav>
        </main>
    )
}

function Word({
    aiSearchingIcon,
    bibleIcon,
    championIcon,
    codeIcon,
    friendEmoji,
    globeIcon,
    heroIcon,
    ideaIcon,
    laughEmoji,
    loveIcon,
    logoIcon,
    movieIcon,
    nerdEmoji,
    plantIcon,
    pointingEmoji,
    teacherIcon,
    tennisBallIcon,
    index,
    signature,
    scrollY,
    text,
    zoomLens,
}: {
    aiSearchingIcon: boolean
    bibleIcon: boolean
    championIcon: boolean
    codeIcon: boolean
    friendEmoji: boolean
    globeIcon: boolean
    heroIcon: boolean
    ideaIcon: boolean
    laughEmoji: boolean
    loveIcon: boolean
    logoIcon: boolean
    movieIcon: boolean
    nerdEmoji: boolean
    plantIcon: boolean
    pointingEmoji: boolean
    teacherIcon: boolean
    tennisBallIcon: boolean
    index: number
    signature: boolean
    scrollY: MotionValue<number>
    text: string
    zoomLens: boolean
}) {
    const wordRef = useRef<HTMLSpanElement>(null)
    const plantLottieRef = useRef<LottieRefCurrentProps | null>(null)
    const signatureDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [emphasizeAuthor, setEmphasizeAuthor] = useState(false)
    const [showAiSearchingIcon, setShowAiSearchingIcon] = useState(false)
    const [showBibleIcon, setShowBibleIcon] = useState(false)
    const [showChampionIcon, setShowChampionIcon] = useState(false)
    const [showCodeIcon, setShowCodeIcon] = useState(false)
    const [showFriendEmoji, setShowFriendEmoji] = useState(false)
    const [showGlobeIcon, setShowGlobeIcon] = useState(false)
    const [showHeroIcon, setShowHeroIcon] = useState(false)
    const [showIdeaIcon, setShowIdeaIcon] = useState(false)
    const [showLaughEmoji, setShowLaughEmoji] = useState(false)
    const [showLoveIcon, setShowLoveIcon] = useState(false)
    const [showLogoIcon, setShowLogoIcon] = useState(false)
    const [showMovieIcon, setShowMovieIcon] = useState(false)
    const [showNerdEmoji, setShowNerdEmoji] = useState(false)
    const [showPlantIcon, setShowPlantIcon] = useState(false)
    const [showPointingEmoji, setShowPointingEmoji] = useState(false)
    const [showTeacherIcon, setShowTeacherIcon] = useState(false)
    const [showTennisBallIcon, setShowTennisBallIcon] = useState(false)
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

    useEffect(() => {
        if (!showPlantIcon || reduceMotion) return

        plantLottieRef.current?.setDirection(-1)
        plantLottieRef.current?.goToAndPlay(99, true)
    }, [reduceMotion, showPlantIcon])

    useMotionValueEvent(reveal, "change", (value) => {
        if (aiSearchingIcon) {
            if (value >= 0.99) {
                setShowAiSearchingIcon(true)
            } else if (value <= 0.01) {
                setShowAiSearchingIcon(false)
            }
        }

        if (bibleIcon) {
            if (value >= 0.99) {
                setShowBibleIcon(true)
            } else if (value <= 0.01) {
                setShowBibleIcon(false)
            }
        }

        if (championIcon) {
            if (value >= 0.99) {
                setShowChampionIcon(true)
            } else if (value <= 0.01) {
                setShowChampionIcon(false)
            }
        }

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

        if (globeIcon) {
            if (value >= 0.99) {
                setShowGlobeIcon(true)
            } else if (value <= 0.01) {
                setShowGlobeIcon(false)
            }
        }

        if (heroIcon) {
            if (value >= 0.99) {
                setShowHeroIcon(true)
            } else if (value <= 0.01) {
                setShowHeroIcon(false)
            }
        }

        if (ideaIcon) {
            if (value >= 0.99) {
                setShowIdeaIcon(true)
            } else if (value <= 0.01) {
                setShowIdeaIcon(false)
            }
        }

        if (laughEmoji) {
            if (value >= 0.99) {
                setShowLaughEmoji(true)
            } else if (value <= 0.01) {
                setShowLaughEmoji(false)
            }
        }

        if (loveIcon) {
            if (value >= 0.99) {
                setShowLoveIcon(true)
            } else if (value <= 0.01) {
                setShowLoveIcon(false)
            }
        }

        if (logoIcon) {
            if (value >= 0.99) {
                setShowLogoIcon(true)
            } else if (value <= 0.01) {
                setShowLogoIcon(false)
            }
        }

        if (movieIcon) {
            if (value >= 0.99) {
                setShowMovieIcon(true)
            } else if (value <= 0.01) {
                setShowMovieIcon(false)
            }
        }

        if (nerdEmoji) {
            if (value >= 0.99) {
                setShowNerdEmoji(true)
            } else if (value <= 0.01) {
                setShowNerdEmoji(false)
            }
        }

        if (plantIcon) {
            if (value >= 0.99) {
                setShowPlantIcon(true)
            } else if (value <= 0.01) {
                setShowPlantIcon(false)
            }
        }

        if (pointingEmoji) {
            if (value >= 0.99) {
                setShowPointingEmoji(true)
            } else if (value <= 0.01) {
                setShowPointingEmoji(false)
            }
        }

        if (teacherIcon) {
            if (value >= 0.99) {
                setShowTeacherIcon(true)
            } else if (value <= 0.01) {
                setShowTeacherIcon(false)
            }
        }

        if (tennisBallIcon) {
            if (value >= 0.99) {
                setShowTennisBallIcon(true)
            } else if (value <= 0.01) {
                setShowTennisBallIcon(false)
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
            className={`word${aiSearchingIcon ? " ai-searching-word" : ""}${aiSearchingIcon && showAiSearchingIcon ? " is-emphasized" : ""}${bibleIcon ? " bible-word" : ""}${bibleIcon && showBibleIcon ? " is-emphasized" : ""}${championIcon ? " champion-word" : ""}${championIcon && showChampionIcon ? " is-emphasized" : ""}${signature ? " signature-word" : ""}${signature && emphasizeAuthor ? " is-emphasized" : ""}${codeIcon ? " code-word" : ""}${codeIcon && showCodeIcon ? " is-emphasized" : ""}${friendEmoji ? " friend-word" : ""}${friendEmoji && showFriendEmoji ? " is-emphasized" : ""}${globeIcon ? " globe-word" : ""}${globeIcon && showGlobeIcon ? " is-emphasized" : ""}${heroIcon ? " hero-word" : ""}${heroIcon && showHeroIcon ? " is-emphasized" : ""}${ideaIcon ? " idea-word" : ""}${ideaIcon && showIdeaIcon ? " is-emphasized" : ""}${laughEmoji ? " laugh-word" : ""}${laughEmoji && showLaughEmoji ? " is-emphasized" : ""}${loveIcon ? " love-word" : ""}${loveIcon && showLoveIcon ? " is-emphasized" : ""}${logoIcon ? " logo-word" : ""}${logoIcon && showLogoIcon ? " is-emphasized" : ""}${movieIcon ? " movie-word" : ""}${movieIcon && showMovieIcon ? " is-emphasized" : ""}${nerdEmoji ? " nerd-word" : ""}${nerdEmoji && showNerdEmoji ? " is-emphasized" : ""}${plantIcon ? " plant-word" : ""}${plantIcon && showPlantIcon ? " is-emphasized" : ""}${pointingEmoji ? " pointing-word" : ""}${pointingEmoji && showPointingEmoji ? " is-emphasized" : ""}${teacherIcon ? " teacher-word" : ""}${teacherIcon && showTeacherIcon ? " is-emphasized" : ""}${tennisBallIcon ? " tennis-word" : ""}${tennisBallIcon && showTennisBallIcon ? " is-emphasized" : ""}${zoomLens ? " zoom-word" : ""}`}
            ref={wordRef}
            style={index === 0 ? { opacity: 1, filter: "blur(0)" } : { opacity: reveal, filter: blur }}
        >
            {aiSearchingIcon && showAiSearchingIcon ? (
                <span className="ai-searching-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        className="lottie-pop"
                        initial={{ opacity: 0, scale: 0.4, x: -18 }}
                        style={{ originX: 0, originY: 0.5 }}
                        transition={POP_SPRING}
                    >
                        <Lottie
                            animationData={aiSearchingAnimation}
                            autoplay={!reduceMotion}
                            className="ai-searching-lottie"
                            loop
                            renderer="svg"
                        />
                    </motion.span>
                </span>
            ) : null}
            {bibleIcon && showBibleIcon ? (
                <span className="bible-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="lottie-pop"
                        initial={{ opacity: 0, scale: 0.48, y: -12 }}
                        style={{ originX: 0.5, originY: 0 }}
                        transition={POP_SPRING}
                    >
                        <Lottie
                            animationData={bibleAnimation}
                            autoplay={!reduceMotion}
                            className="bible-lottie"
                            loop
                            renderer="svg"
                        />
                    </motion.span>
                </span>
            ) : null}
            {championIcon && showChampionIcon ? (
                <span className="champion-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        className="lottie-pop"
                        initial={{ opacity: 0, scale: 0.42, x: 18, y: 14 }}
                        style={{ originX: 1, originY: 1 }}
                        transition={POP_SPRING}
                    >
                        <Lottie
                            animationData={championAnimation}
                            autoplay={!reduceMotion}
                            className="champion-lottie"
                            loop
                            renderer="svg"
                        />
                    </motion.span>
                </span>
            ) : null}
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
            {laughEmoji && showLaughEmoji ? (
                <span className="laugh-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1 }}
                        className="emoji-pop"
                        initial={{ opacity: 0, scale: 0.3 }}
                        style={{ originX: 0, originY: 0.5 }}
                        transition={POP_SPRING}
                    >
                        😂
                    </motion.span>
                </span>
            ) : null}
            {loveIcon && showLoveIcon ? (
                <span className="love-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="lottie-pop"
                        initial={{ opacity: 0, scale: 0.4, y: -12 }}
                        style={{ originX: 0.5, originY: 0 }}
                        transition={POP_SPRING}
                    >
                        <Lottie
                            animationData={loveAnimation}
                            autoplay={!reduceMotion}
                            className="love-lottie"
                            loop
                            renderer="svg"
                        />
                    </motion.span>
                </span>
            ) : null}
            {logoIcon && showLogoIcon ? (
                <span className="logo-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        className="logo-pop"
                        initial={{ opacity: 0, scale: 0.55, x: -12, y: 10 }}
                        style={{ originX: 0, originY: 1 }}
                        transition={POP_SPRING}
                    >
                        <LogoMark />
                    </motion.span>
                </span>
            ) : null}
            {nerdEmoji && showNerdEmoji ? (
                <span className="nerd-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1 }}
                        className="emoji-pop"
                        initial={{ opacity: 0, scale: 0.3 }}
                        style={{ originX: 1, originY: 0.5 }}
                        transition={POP_SPRING}
                    >
                        🤓
                    </motion.span>
                </span>
            ) : null}
            {globeIcon && showGlobeIcon ? (
                <span className="globe-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        className="lottie-pop"
                        initial={{ opacity: 0, scale: 0.42, x: -12 }}
                        style={{ originX: 0, originY: 0.5 }}
                        transition={POP_SPRING}
                    >
                        <Lottie
                            animationData={globeAnimation}
                            autoplay={!reduceMotion}
                            className="globe-lottie"
                            loop
                            renderer="svg"
                        />
                    </motion.span>
                </span>
            ) : null}
            {heroIcon && showHeroIcon ? (
                <span className="hero-animation" aria-hidden="true">
                    <span className="hero-float">
                        <motion.span
                            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                            className="lottie-pop"
                            initial={{ opacity: 0, scale: 0.42, x: 96, y: 48 }}
                            style={{ originX: 0, originY: 0.5 }}
                            transition={POP_SPRING}
                        >
                            <Lottie
                                animationData={heroAnimation}
                                autoplay={!reduceMotion}
                                className="hero-lottie"
                                loop
                                renderer="svg"
                            />
                        </motion.span>
                    </span>
                </span>
            ) : null}
            {ideaIcon && showIdeaIcon ? (
                <span className="idea-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        className="lottie-pop"
                        initial={{ opacity: 0, scale: 0.42, x: -12 }}
                        style={{ originX: 0, originY: 0.5 }}
                        transition={POP_SPRING}
                    >
                        <Lottie
                            animationData={ideaAnimation}
                            autoplay={!reduceMotion}
                            className="idea-lottie"
                            loop
                            renderer="svg"
                        />
                    </motion.span>
                </span>
            ) : null}
            {movieIcon && showMovieIcon ? (
                <span className="movie-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        className="lottie-pop"
                        initial={{ opacity: 0, scale: 0.42, x: -12 }}
                        style={{ originX: 0, originY: 0.5 }}
                        transition={POP_SPRING}
                    >
                        <Lottie
                            animationData={movieAnimation}
                            autoplay={!reduceMotion}
                            className="movie-lottie"
                            loop
                            renderer="svg"
                        />
                    </motion.span>
                </span>
            ) : null}
            {plantIcon && showPlantIcon ? (
                <span className="plant-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="lottie-pop"
                        initial={{ opacity: 0, scale: 0.42, y: 14 }}
                        style={{ originX: 0.5, originY: 1 }}
                        transition={POP_SPRING}
                    >
                        <Lottie
                            animationData={plantAnimation}
                            autoplay={!reduceMotion}
                            className="plant-lottie"
                            lottieRef={plantLottieRef}
                            loop
                            renderer="svg"
                        />
                    </motion.span>
                </span>
            ) : null}
            {pointingEmoji && showPointingEmoji ? (
                <span className="pointing-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="emoji-pop"
                        initial={{ opacity: 0, scale: 0.3, y: -10 }}
                        style={{ originX: 0.5, originY: 0 }}
                        transition={POP_SPRING}
                    >
                        <span className="pointing-pulse">🫵</span>
                    </motion.span>
                </span>
            ) : null}
            {teacherIcon && showTeacherIcon ? (
                <span className="teacher-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="lottie-pop"
                        initial={{ opacity: 0, scale: 0.5, y: 12 }}
                        style={{ originX: 0.5, originY: 1 }}
                        transition={POP_SPRING}
                    >
                        <Lottie
                            animationData={teacherAnimation}
                            autoplay={!reduceMotion}
                            className="teacher-lottie"
                            loop
                            renderer="svg"
                        />
                    </motion.span>
                </span>
            ) : null}
            {tennisBallIcon && showTennisBallIcon ? (
                <span className="tennis-animation" aria-hidden="true">
                    <motion.span
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        className="lottie-pop"
                        initial={{ opacity: 0, scale: 0.38, x: -24 }}
                        style={{ originX: 0, originY: 0.5 }}
                        transition={POP_SPRING}
                    >
                        <Lottie
                            animationData={tennisBallAnimation}
                            autoplay={!reduceMotion}
                            className="tennis-lottie"
                            loop
                            renderer="svg"
                        />
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
                    <ZoomLens text={text} />
                </motion.span>
            ) : null}
            {zoomLens ? (
                <span className="zoom-label">{text}</span>
            ) : aiSearchingIcon || bibleIcon || championIcon || signature || codeIcon || friendEmoji || globeIcon || heroIcon || ideaIcon || laughEmoji || loveIcon || logoIcon || movieIcon || nerdEmoji || plantIcon || pointingEmoji || teacherIcon || tennisBallIcon ? (
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
