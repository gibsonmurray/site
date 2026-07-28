"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
    LuBellOff,
    LuBellRing,
    LuPause,
    LuPlay,
    LuX,
} from "react-icons/lu"
import { IoPause, IoPlay, IoPlayBack, IoPlayForward } from "react-icons/io5"
import { AnimatePresence, motion, MotionConfig, type Variants } from "motion/react"

const MODES = ["default", "ringer", "timer", "music"] as const

type IslandMode = (typeof MODES)[number]

const MODE_LABELS: Record<IslandMode, string> = {
    default: "Idle",
    ringer: "Ring Mode",
    timer: "Timer",
    music: "Listening",
}

const MODE_SIZES: Record<IslandMode, { width: number; height: number }> = {
    default: { width: 126, height: 37 },
    ringer: { width: 184, height: 37 },
    timer: { width: 360, height: 81 },
    music: { width: 350, height: 168 },
}

type ExitMotion = {
    scale?: number
    scaleX?: number
    scaleY?: number
    y?: number
}

const EXIT_MOTIONS: Partial<Record<`${IslandMode}-${IslandMode}`, ExitMotion>> = {
    "ringer-default": { scale: 0.9, scaleX: 0.9 },
    "timer-ringer": { scale: 0.7, y: -7.5 },
    "ringer-timer": { scale: 1.4, y: 7.5 },
    "timer-music": { scaleY: 1.1, y: 7.5 },
    "music-ringer": { scale: 0.65, y: -32 },
    "ringer-music": { scale: 1.5, y: 12.5 },
    "timer-default": { scale: 0.7, y: -7.5 },
    "music-timer": { scaleY: 0.9, y: -12 },
    "music-default": { scale: 0.4, y: -36 },
}

const CONTENT_VARIANTS: Variants = {
    exit: (motionHint: ExitMotion) => ({
        ...motionHint,
        filter: "blur(5px)",
        opacity: [1, 0],
    }),
}

const TRACKS = [
    {
        title: "HOLD STILL",
        artist: "The Kid LAROI",
        album: "BEFORE I FORGET (DELUXE)",
        cover: "/kid-laroi-before-i-forget-deluxe.jpg",
    },
] as const

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}:${String(seconds % 60).padStart(2, "0")}`
}

function RollingTimer({ seconds }: { seconds: number }) {
    return (
        <strong className="island-rolling-time">
            {formatTime(seconds)
                .split("")
                .map((character, index) =>
                    character === ":" ? (
                        <i className="is-punctuation" key={`punctuation-${index}`}>
                            {character}
                        </i>
                    ) : (
                        <i className="island-digit" key={`digit-${index}`}>
                            <AnimatePresence initial={false} mode="popLayout">
                                <motion.b
                                    animate={{
                                        filter: "blur(0px)",
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    exit={{
                                        filter: "blur(2px)",
                                        opacity: 0,
                                        y: -12,
                                    }}
                                    initial={{
                                        filter: "blur(2px)",
                                        opacity: 0,
                                        y: 12,
                                    }}
                                    key={`${index}-${character}`}
                                    transition={{ type: "spring", bounce: 0.35 }}
                                >
                                    {character}
                                </motion.b>
                            </AnimatePresence>
                        </i>
                    ),
                )}
        </strong>
    )
}

function Waveform({ playing, expanded = false }: { playing: boolean; expanded?: boolean }) {
    return (
        <span
            className={`island-waveform${playing ? " is-playing" : ""}${expanded ? " is-expanded" : ""}`}
            aria-hidden="true"
        >
            {Array.from({ length: expanded ? 8 : 7 }).map((_, index) => (
                <i key={index} style={{ "--bar": index } as React.CSSProperties} />
            ))}
        </span>
    )
}

function CompactIsland({
    mode,
    ringerOn,
    uiScale,
}: {
    mode: "default" | "ringer"
    ringerOn: boolean
    uiScale: number
}) {
    return (
        <span
            className={`island-compact island-compact--${mode}${mode === "ringer" && ringerOn ? " is-ringing" : ""}`}
        >
            {mode !== "default" && (
                <span className="island-compact-leading">
                    <motion.i
                        animate={{
                            filter: ringerOn ? "blur(4px)" : "blur(0px)",
                            opacity: ringerOn ? 0 : 1,
                            width: ringerOn ? 0 : 50 * uiScale,
                        }}
                        className="ringer-silent-background"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.35 }}
                    />
                    <motion.i
                        animate={{
                            rotate: ringerOn
                                ? [0, 20, -15, 12.5, -10, 10, -7.5, 7.5, -5, 5, 0]
                                : [0, -15, 5, -2, 0],
                            x: ringerOn ? 0 : 9.96 * uiScale,
                        }}
                        className="ringer-bell"
                        initial={false}
                        transition={{
                            rotate: {
                                duration: ringerOn ? 0.58 : 0.28,
                                ease: "easeInOut",
                            },
                            x: { type: "spring", bounce: 0.35 },
                        }}
                    >
                        {ringerOn ? <LuBellRing /> : <LuBellOff />}
                    </motion.i>
                </span>
            )}

            {mode !== "default" && (
                <span className="island-compact-trailing">
                    <AnimatePresence initial={false} mode="popLayout">
                        <motion.strong
                            animate={{
                                filter: "blur(0px)",
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{
                                filter: "blur(4px)",
                                opacity: 0,
                                scale: 0.25,
                            }}
                            initial={{
                                filter: "blur(4px)",
                                opacity: 0,
                                scale: 0.25,
                            }}
                            key={ringerOn ? "ring" : "silent"}
                            transition={{ type: "spring", bounce: 0.35 }}
                        >
                            {ringerOn ? "Ring" : "Silent"}
                        </motion.strong>
                    </AnimatePresence>
                </span>
            )}
        </span>
    )
}

function ExpandedTimer({
    running,
    seconds,
    onPause,
    onReset,
}: {
    running: boolean
    seconds: number
    onPause: () => void
    onReset: () => void
}) {
    return (
        <span className="island-expanded island-expanded--timer">
            <span className="expanded-timer-controls">
                <button
                    aria-label={running ? "Pause timer" : "Resume timer"}
                    className="is-tinted"
                    onClick={(event) => {
                        event.stopPropagation()
                        onPause()
                    }}
                    type="button"
                >
                    {running ? <LuPause /> : <LuPlay />}
                </button>
                <button
                    aria-label="Cancel timer"
                    onClick={(event) => {
                        event.stopPropagation()
                        onReset()
                    }}
                    type="button"
                >
                    <LuX />
                </button>
            </span>

            <span className="expanded-timer-copy">
                <small>Timer</small>
                <RollingTimer seconds={seconds} />
            </span>
        </span>
    )
}

function ExpandedMusic({
    playing,
    onToggle,
    onPrevious,
    onNext,
    track,
}: {
    playing: boolean
    onToggle: () => void
    onPrevious: () => void
    onNext: () => void
    track: (typeof TRACKS)[number]
}) {
    return (
        <span className="island-expanded island-expanded--music">
            <span className="expanded-music-top">
                <span className="island-album island-album--large" aria-hidden="true">
                    <Image
                        alt=""
                        draggable={false}
                        height={200}
                        src={track.cover}
                        width={200}
                    />
                </span>
                <span className="expanded-music-copy">
                    <strong>{track.title}</strong>
                    <small>{track.artist}</small>
                </span>
                <Waveform expanded playing={playing} />
            </span>
            <span className="expanded-music-progress">
                <small>1:37</small>
                <span>
                    <i />
                </span>
                <small>−1:36</small>
            </span>
            <span className="expanded-music-controls">
                <button aria-label="Previous track" onClick={(event) => {
                    event.stopPropagation()
                    onPrevious()
                }} type="button">
                    <IoPlayBack />
                </button>
                <button
                    aria-label={playing ? "Pause music" : "Play music"}
                    onClick={(event) => {
                        event.stopPropagation()
                        onToggle()
                    }}
                    type="button"
                >
                    {playing ? <IoPause /> : <IoPlay />}
                </button>
                <button aria-label="Next track" onClick={(event) => {
                    event.stopPropagation()
                    onNext()
                }} type="button">
                    <IoPlayForward />
                </button>
            </span>
        </span>
    )
}

export function DynamicIsland() {
    const demoRef = useRef<HTMLDivElement>(null)
    const [mode, setMode] = useState<IslandMode>("default")
    const [ringerOn, setRingerOn] = useState(true)
    const [timerRunning, setTimerRunning] = useState(true)
    const [seconds, setSeconds] = useState(599)
    const [musicPlaying, setMusicPlaying] = useState(true)
    const [trackIndex, setTrackIndex] = useState(0)
    const [shellBounce, setShellBounce] = useState(0.5)
    const [exitMotion, setExitMotion] = useState<ExitMotion>({})
    const [uiScale, setUiScale] = useState(1.3)

    useEffect(() => {
        const demo = demoRef.current
        if (!demo) return

        const updateScale = () => {
            const width = demo.getBoundingClientRect().width
            setUiScale(width <= 400 ? 0.9 : width <= 500 ? 1.05 : 1.3)
        }
        const observer = new ResizeObserver(updateScale)

        updateScale()
        observer.observe(demo)

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!timerRunning || seconds === 0) return

        const interval = window.setInterval(() => {
            setSeconds((current) => Math.max(0, current - 1))
        }, 1000)

        return () => window.clearInterval(interval)
    }, [seconds, timerRunning])

    useEffect(() => {
        if (mode !== "ringer") return

        const timeout = window.setTimeout(
            () => setRingerOn((current) => !current),
            ringerOn ? 1000 : 2000,
        )

        return () => window.clearTimeout(timeout)
    }, [mode, ringerOn])

    const baseIslandSize =
        mode === "ringer"
            ? { width: ringerOn ? 184 : 210, height: MODE_SIZES.ringer.height }
            : MODE_SIZES[mode]
    const islandSize = {
        width: baseIslandSize.width * uiScale,
        height: baseIslandSize.height * uiScale,
    }
    const islandRadius =
        (mode === "music" ? 35 : mode === "timer" ? 40.5 : 18.5) * uiScale

    const chooseMode = (nextMode: IslandMode) => {
        if (nextMode === mode) return

        const previousSize = MODE_SIZES[mode]
        const nextSize = MODE_SIZES[nextMode]
        const heightDelta = Math.abs(nextSize.height - previousSize.height)
        const normalizedDelta = heightDelta / 100
        const calculatedBounce =
            nextSize.height < previousSize.height
                ? 0.35 - 0.3 * normalizedDelta
                : 0.3 + 0.3 * normalizedDelta
        const nextBounce =
            heightDelta < 20
                ? 0.5
                : Math.min(Math.max(calculatedBounce, 0.3), 0.35)

        setExitMotion(EXIT_MOTIONS[`${mode}-${nextMode}`] ?? {})
        setShellBounce(nextBounce)
        setMode(nextMode)

        if (nextMode === "timer" && seconds === 0) {
            setSeconds(599)
            setTimerRunning(true)
        }
    }

    const resetTimer = () => {
        setSeconds(599)
        setTimerRunning(true)
        chooseMode("default")
    }

    const renderIslandContent = () => {
        if (mode === "timer") {
            return (
                <ExpandedTimer
                    onPause={() => setTimerRunning((current) => !current)}
                    onReset={resetTimer}
                    running={timerRunning}
                    seconds={seconds}
                />
            )
        }

        if (mode === "music") {
            return (
                <ExpandedMusic
                    onNext={() => setTrackIndex((current) => (current + 1) % TRACKS.length)}
                    onPrevious={() =>
                        setTrackIndex((current) => (current - 1 + TRACKS.length) % TRACKS.length)
                    }
                    onToggle={() => setMusicPlaying((current) => !current)}
                    playing={musicPlaying}
                    track={TRACKS[trackIndex]}
                />
            )
        }

        return (
            <CompactIsland
                mode={mode}
                ringerOn={ringerOn}
                uiScale={uiScale}
            />
        )
    }

    return (
        <MotionConfig
            reducedMotion="user"
            transition={{ type: "spring", bounce: 0.35 }}
        >
            <div
                className="island-demo"
                ref={demoRef}
                style={{ "--island-ui-scale": uiScale } as React.CSSProperties}
            >
                <div className="island-stage">
                    <div
                        aria-label={
                            mode === "ringer"
                                ? `Switch to ${ringerOn ? "Silent" : "Ring"}`
                                : `${MODE_LABELS[mode]} Dynamic Island`
                        }
                        className="island-press-target"
                        onClick={
                            mode === "ringer"
                                ? () => setRingerOn((current) => !current)
                                : undefined
                        }
                        onKeyDown={(event) => {
                            if (
                                mode === "ringer" &&
                                (event.key === "Enter" || event.key === " ")
                            ) {
                                event.preventDefault()
                                setRingerOn((current) => !current)
                            }
                        }}
                        role={mode === "ringer" ? "button" : undefined}
                        tabIndex={mode === "ringer" ? 0 : -1}
                    >
                        <motion.span
                            animate={{
                                borderRadius: islandRadius,
                                height: islandSize.height,
                                width: islandSize.width,
                            }}
                            className={`dynamic-island dynamic-island--${mode}${mode === "timer" || mode === "music" ? " is-expanded" : ""}`}
                            initial={false}
                            transition={{
                                type: "spring",
                                bounce: mode === "ringer" ? 0.5 : shellBounce,
                            }}
                        >
                            <motion.span
                                animate={{
                                    filter: "blur(0px)",
                                    opacity: 1,
                                    scale: 1,
                                }}
                                className="island-content-layer"
                                initial={{
                                    filter: "blur(5px)",
                                    opacity: 0,
                                    scale: 0.9,
                                }}
                                key={mode}
                                transition={{
                                    type: "spring",
                                    bounce: mode === "ringer" ? 0.5 : shellBounce,
                                    delay: 0.05,
                                }}
                            >
                                {renderIslandContent()}
                            </motion.span>
                        </motion.span>

                        <span aria-hidden="true" className="island-exit-stage" inert>
                            <AnimatePresence custom={exitMotion} mode="popLayout">
                                <motion.span
                                    className="island-exit-content"
                                    custom={exitMotion}
                                    exit="exit"
                                    initial={{ opacity: 0 }}
                                    key={`${mode}-exit`}
                                    style={{
                                        height: islandSize.height,
                                        width: islandSize.width,
                                    }}
                                    variants={CONTENT_VARIANTS}
                                >
                                    {renderIslandContent()}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                    </div>
                </div>

                <div className="island-mode-picker" aria-label="Dynamic Island mode">
                    {MODES.map((item) => (
                        <motion.button
                            aria-label={`Show ${MODE_LABELS[item]} mode`}
                            aria-pressed={mode === item}
                            className={mode === item ? "is-active" : undefined}
                            key={item}
                            onClick={() => chooseMode(item)}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {MODE_LABELS[item]}
                        </motion.button>
                    ))}
                </div>

                <h2 className="seo-heading">Interactive Dynamic Island</h2>
            </div>
        </MotionConfig>
    )
}
