"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
    Pause,
    Play,
    Radio,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
} from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { cn, widgetSurface } from "@/lib/widget-design"
import type { WidgetDefinition } from "@/lib/widgets"

type SpotifyWidgetProps = {
    widget: WidgetDefinition
}

type SpotifyMedia = {
    title: string
    subtitle?: string
    explicit?: boolean
    artwork?: string | null
    previewUrl?: string | null
    spotifyUrl: string
}

function wrapIndex(index: number, length: number) {
    return ((index % length) + length) % length
}

export function SpotifyWidget({ widget }: SpotifyWidgetProps) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const resumeAfterTrackChangeRef = useRef(false)
    const sources = widget.playlist?.length
        ? widget.playlist
        : widget.url
          ? [widget.url]
          : []
    const [playlist, setPlaylist] = useState<SpotifyMedia[]>(() =>
        sources.map((spotifyUrl, index) => ({
            title: index === 0 ? widget.title : `Track ${index + 1}`,
            subtitle: index === 0 ? widget.description : "Spotify",
            spotifyUrl,
        })),
    )
    const [trackIndex, setTrackIndex] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [muted, setMuted] = useState(false)

    useEffect(() => {
        if (!sources.length) return
        const controller = new AbortController()

        async function loadPlaylist() {
            const loaded = await Promise.all(
                sources.map(async (source, index) => {
                    try {
                        const response = await fetch(
                            `/api/spotify-media?url=${encodeURIComponent(source)}`,
                            { signal: controller.signal },
                        )
                        if (!response.ok) throw new Error("Unavailable")

                        const media =
                            (await response.json()) as Partial<SpotifyMedia>
                        return {
                            title:
                                media.title ??
                                (index === 0
                                    ? widget.title
                                    : `Track ${index + 1}`),
                            subtitle:
                                media.subtitle ??
                                (index === 0 ? widget.description : "Spotify"),
                            explicit: media.explicit,
                            artwork: media.artwork,
                            previewUrl: media.previewUrl,
                            spotifyUrl: media.spotifyUrl ?? source,
                        }
                    } catch {
                        return {
                            title:
                                index === 0
                                    ? widget.title
                                    : `Track ${index + 1}`,
                            subtitle:
                                index === 0 ? widget.description : "Spotify",
                            spotifyUrl: source,
                        }
                    }
                }),
            )

            if (!controller.signal.aborted) setPlaylist(loaded)
        }

        void loadPlaylist()
        return () => controller.abort()
    }, [widget.id])

    const currentTrack = playlist[trackIndex] ?? playlist[0]

    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !resumeAfterTrackChangeRef.current) return
        resumeAfterTrackChangeRef.current = false

        const resume = async () => {
            try {
                await audio.play()
            } catch {
                setPlaying(false)
            }
        }
        void resume()
    }, [trackIndex, currentTrack?.previewUrl])

    const selectTrack = (index: number, resume = playing) => {
        if (!playlist.length) return
        resumeAfterTrackChangeRef.current = resume
        setTrackIndex(wrapIndex(index, playlist.length))
    }

    const togglePlayback = async () => {
        const audio = audioRef.current
        if (!audio || !currentTrack?.previewUrl) return

        if (audio.paused) {
            try {
                await audio.play()
            } catch {
                setPlaying(false)
            }
        } else {
            audio.pause()
        }
    }

    const toggleMuted = () => {
        const audio = audioRef.current
        if (audio) audio.muted = !muted
        setMuted((current) => !current)
    }

    if (!currentTrack) return null

    return (
        <div
            className={cn(
                widgetSurface,
                "isolate grid grid-rows-[minmax(0,1fr)_auto_auto] gap-2 bg-[#f6f6f8] p-[0.9rem] transition-colors duration-500",
                playing && "text-white",
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    "absolute top-[0.9rem] left-[0.9rem] z-0 size-[3.05rem] rounded-[0.9rem] bg-[#1ed760] shadow-[0_5px_13px_rgba(30,215,96,0.2)] transition-[inset,width,height,border-radius,box-shadow] duration-500 ease-[cubic-bezier(0.16,0.84,0.22,1)]",
                    playing &&
                        "inset-0 size-full rounded-none shadow-none duration-700",
                )}
            />

            <div className="relative z-[2] flex min-h-0 flex-row-reverse items-start justify-between gap-3">
                {currentTrack.artwork ? (
                    <a
                        className="relative block aspect-square h-full max-h-[7.75rem] min-h-0 overflow-hidden rounded-[0.55rem] bg-[#dcf4e5] shadow-[0_5px_13px_rgba(0,0,0,0.13)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                        href={currentTrack.spotifyUrl}
                        draggable={false}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${currentTrack.title} on Spotify`}
                        onPointerDownCapture={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <Image
                            src={currentTrack.artwork}
                            alt={`${currentTrack.title} artwork`}
                            fill
                            sizes="104px"
                            className="object-cover"
                        />
                    </a>
                ) : (
                    <span className="aspect-square h-full max-h-[7.75rem] rounded-[0.55rem] bg-black/5" />
                )}

                <a
                    className="grid size-[3.05rem] shrink-0 place-items-center rounded-[0.9rem] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    href={currentTrack.spotifyUrl}
                    draggable={false}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${currentTrack.title} on Spotify, opens in a new tab`}
                    onPointerDownCapture={(event) => event.stopPropagation()}
                >
                    <BrandLogo brand="spotify" />
                </a>
            </div>

            <a
                className="relative z-[2] grid w-[min(7.75rem,100%)] min-w-0 gap-px justify-self-end text-center focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                href={currentTrack.spotifyUrl}
                draggable={false}
                target="_blank"
                rel="noreferrer"
                onPointerDownCapture={(event) => event.stopPropagation()}
            >
                <span className="flex min-w-0 items-center justify-center gap-1">
                    <strong className="truncate text-[1rem] leading-[1.08] font-[650] tracking-[-0.025em]">
                        {currentTrack.title}
                    </strong>
                    {currentTrack.explicit && (
                        <small
                            className={cn(
                                "grid size-[0.92rem] shrink-0 place-items-center rounded-[0.2rem] bg-[#949498] text-[0.58rem] leading-none font-[720] text-white",
                                playing && "bg-white text-[#158d40]",
                            )}
                            aria-label="Explicit"
                        >
                            E
                        </small>
                    )}
                </span>
                {currentTrack.subtitle && (
                    <span
                        className={cn(
                            "truncate text-[0.67rem] leading-tight text-[#727272] transition-colors duration-500",
                            playing && "text-white/78",
                        )}
                    >
                        {currentTrack.subtitle}
                    </span>
                )}
            </a>

            <audio
                ref={audioRef}
                src={currentTrack.previewUrl ?? undefined}
                preload="metadata"
                muted={muted}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => selectTrack(trackIndex + 1, true)}
            />

            <div
                className={cn(
                    "widget-interactive relative z-[3] grid h-10 grid-cols-5 items-center rounded-full border border-[#d8d8dc] bg-[#ededf0] px-1 text-[#8f8f93] transition-[color,background,border-color] duration-300",
                    playing && "border-[#117a36] bg-[#158d40] text-white",
                )}
                role="group"
                aria-label="Spotify playback controls"
                onPointerDownCapture={(event) => event.stopPropagation()}
            >
                <a
                    className="grid size-8 place-items-center justify-self-center rounded-full transition-colors hover:bg-black/6 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current"
                    href={currentTrack.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open current track on Spotify"
                >
                    <Radio aria-hidden="true" className="size-[0.95rem]" />
                </a>
                <button
                    type="button"
                    className="grid size-8 cursor-pointer place-items-center justify-self-center rounded-full transition-colors hover:bg-black/6 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current disabled:cursor-default disabled:opacity-40"
                    onClick={() => selectTrack(trackIndex - 1)}
                    disabled={playlist.length < 2}
                    aria-label="Previous track"
                >
                    <SkipBack
                        aria-hidden="true"
                        className="size-[0.95rem] fill-current"
                    />
                </button>
                <button
                    type="button"
                    className="grid size-9 cursor-pointer place-items-center justify-self-center rounded-full transition-colors hover:bg-black/6 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current disabled:cursor-default disabled:opacity-40"
                    onClick={togglePlayback}
                    disabled={!currentTrack.previewUrl}
                    aria-label={`${playing ? "Pause" : "Play"} ${currentTrack.title}`}
                >
                    {playing ? (
                        <Pause
                            aria-hidden="true"
                            className="size-[1.12rem] fill-current stroke-[2.4]"
                        />
                    ) : (
                        <Play
                            aria-hidden="true"
                            className="size-[1.12rem] translate-x-px fill-current stroke-[2.4]"
                        />
                    )}
                </button>
                <button
                    type="button"
                    className="grid size-8 cursor-pointer place-items-center justify-self-center rounded-full transition-colors hover:bg-black/6 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current disabled:cursor-default disabled:opacity-40"
                    onClick={() => selectTrack(trackIndex + 1)}
                    disabled={playlist.length < 2}
                    aria-label="Next track"
                >
                    <SkipForward
                        aria-hidden="true"
                        className="size-[0.95rem] fill-current"
                    />
                </button>
                <button
                    type="button"
                    className="grid size-8 cursor-pointer place-items-center justify-self-center rounded-full transition-colors hover:bg-black/6 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current"
                    onClick={toggleMuted}
                    aria-label={muted ? "Unmute" : "Mute"}
                >
                    {muted ? (
                        <VolumeX aria-hidden="true" className="size-[1rem]" />
                    ) : (
                        <Volume2 aria-hidden="true" className="size-[1rem]" />
                    )}
                </button>
            </div>

            <span className="sr-only" aria-live="polite">
                {playing ? "Playing" : "Paused"}: {currentTrack.title} by{" "}
                {currentTrack.subtitle}
            </span>
        </div>
    )
}
