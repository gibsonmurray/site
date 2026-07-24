"use client"

import { useCallback, useEffect, useRef } from "react"
import Lottie, { type LottieRefCurrentProps } from "lottie-react"
import { motion, useReducedMotion, type Target } from "motion/react"

import aiSearchingAnimation from "@/animations/ai-searching.json"
import bibleAnimation from "@/animations/bible.json"
import championAnimation from "@/animations/champion.json"
import heroAnimation from "@/animations/hero-and-cape.json"
import ideaAnimation from "@/animations/idea-designer.json"
import loveAnimation from "@/animations/love-particle.json"
import movieAnimation from "@/animations/movie-dark.json"
import signatureAnimation from "@/animations/signature.json"
import globeAnimation from "@/animations/spinning-globe.json"
import teacherAnimation from "@/animations/teacher.json"
import tennisBallAnimation from "@/animations/tennis-ball.json"
import typeScriptAnimation from "@/animations/type-script.json"
import plantAnimation from "@/animations/animated-plant-loader.json"
import { LogoMark } from "@/components/logo-mark"
import { ZoomLens } from "@/components/zoom-lens"
import type { AccentKind } from "@/lib/manuscript"

const POP_SPRING = {
    type: "spring" as const,
    stiffness: 240,
    damping: 19,
    mass: 0.72,
    opacity: { duration: 0.18 },
}

type LottieAccent = Exclude<
    AccentKind,
    "friend" | "laugh" | "logo" | "nerd" | "pointing" | "school" | "zoom"
>

type LottieConfig = {
    animationData: object
    initial: Target
    originX: number
    originY: number
}

const LOTTIE_CONFIG: Record<LottieAccent, LottieConfig> = {
    "ai-searching": {
        animationData: aiSearchingAnimation,
        initial: { opacity: 0, scale: 0.4, x: -18 },
        originX: 0,
        originY: 0.5,
    },
    bible: {
        animationData: bibleAnimation,
        initial: { opacity: 0, scale: 0.48, y: -12 },
        originX: 0.5,
        originY: 0,
    },
    champion: {
        animationData: championAnimation,
        initial: { opacity: 0, scale: 0.42, x: 18, y: 14 },
        originX: 1,
        originY: 1,
    },
    code: {
        animationData: typeScriptAnimation,
        initial: { opacity: 0, scale: 0.42, x: 12 },
        originX: 1,
        originY: 0.5,
    },
    globe: {
        animationData: globeAnimation,
        initial: { opacity: 0, scale: 0.42, x: -12 },
        originX: 0,
        originY: 0.5,
    },
    hero: {
        animationData: heroAnimation,
        initial: { opacity: 0, scale: 0.42, x: 96, y: 48 },
        originX: 0,
        originY: 0.5,
    },
    idea: {
        animationData: ideaAnimation,
        initial: { opacity: 0, scale: 0.42, x: -12 },
        originX: 0,
        originY: 0.5,
    },
    love: {
        animationData: loveAnimation,
        initial: { opacity: 0, scale: 0.4, y: -12 },
        originX: 0.5,
        originY: 0,
    },
    movie: {
        animationData: movieAnimation,
        initial: { opacity: 0, scale: 0.42, x: -12 },
        originX: 0,
        originY: 0.5,
    },
    plant: {
        animationData: plantAnimation,
        initial: { opacity: 0, scale: 0.42, y: 14 },
        originX: 0.5,
        originY: 1,
    },
    signature: {
        animationData: signatureAnimation,
        initial: { opacity: 0, scale: 0.68, y: 14 },
        originX: 0.5,
        originY: 1,
    },
    teacher: {
        animationData: teacherAnimation,
        initial: { opacity: 0, scale: 0.5, y: 12 },
        originX: 0.5,
        originY: 1,
    },
    tennis: {
        animationData: tennisBallAnimation,
        initial: { opacity: 0, scale: 0.38, x: -24 },
        originX: 0,
        originY: 0.5,
    },
}

const EMOJI_BY_ACCENT = {
    friend: "😊",
    laugh: "😂",
    nerd: "🤓",
    pointing: "🫵",
    school: "🏫",
} as const

type EmojiAccent = keyof typeof EMOJI_BY_ACCENT

function isEmojiAccent(accent: AccentKind): accent is EmojiAccent {
    return accent in EMOJI_BY_ACCENT
}

function LottieDecoration({ accent }: { accent: LottieAccent }) {
    const reduceMotion = useReducedMotion()
    const plantRef = useRef<LottieRefCurrentProps | null>(null)
    const plantDirection = useRef<1 | -1>(1)
    const config = LOTTIE_CONFIG[accent]

    useEffect(() => {
        if (accent !== "plant" || reduceMotion) return

        plantDirection.current = 1
        plantRef.current?.setDirection(1)
        plantRef.current?.goToAndPlay(0, true)
    }, [accent, reduceMotion])

    const handlePlantComplete = useCallback(() => {
        if (accent !== "plant" || reduceMotion) return

        plantDirection.current = plantDirection.current === 1 ? -1 : 1
        plantRef.current?.setDirection(plantDirection.current)
        plantRef.current?.play()
    }, [accent, reduceMotion])

    const animation = (
        <motion.span
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            className="lottie-pop"
            initial={config.initial}
            style={{ originX: config.originX, originY: config.originY }}
            transition={POP_SPRING}
        >
            <Lottie
                animationData={config.animationData}
                autoplay={!reduceMotion}
                className={`${accent}-lottie`}
                lottieRef={accent === "plant" ? plantRef : undefined}
                loop={accent !== "plant"}
                onComplete={accent === "plant" ? handlePlantComplete : undefined}
                renderer="svg"
            />
        </motion.span>
    )

    return (
        <span className={`${accent}-animation`} aria-hidden="true">
            {accent === "hero" ? <span className="hero-float">{animation}</span> : animation}
        </span>
    )
}

function EmojiDecoration({ accent }: { accent: EmojiAccent }) {
    const initial: Target =
        accent === "pointing" ? { opacity: 0, scale: 0.3, y: -10 } : { opacity: 0, scale: 0.3 }
    const originX = accent === "nerd" || accent === "school" ? 1 : accent === "pointing" ? 0.5 : 0
    const originY = accent === "friend" ? 0 : accent === "pointing" ? 0 : 0.5
    const emoji = EMOJI_BY_ACCENT[accent]

    return (
        <span className={`${accent}-animation`} aria-hidden="true">
            <motion.span
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="emoji-pop"
                initial={initial}
                style={{ originX, originY }}
                transition={POP_SPRING}
            >
                {accent === "pointing" ? <span className="pointing-pulse">{emoji}</span> : emoji}
            </motion.span>
        </span>
    )
}

export function WordDecoration({ accent, text }: { accent: AccentKind; text: string }) {
    if (isEmojiAccent(accent)) {
        return <EmojiDecoration accent={accent} />
    }

    if (accent === "logo") {
        return (
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
        )
    }

    if (accent === "zoom") {
        return (
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
        )
    }

    return <LottieDecoration accent={accent} />
}
