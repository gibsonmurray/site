"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
import { cn, getWidgetSize, widgetSurface } from "@/lib/widget-design"
import type { WidgetDefinition } from "@/lib/widgets"

type SpotifyWidgetProps = {
    widget: WidgetDefinition
}

type SpotifyMedia = {
    title?: string
    subtitle?: string
    artwork?: string | null
    previewUrl?: string | null
    spotifyUrl?: string
}

export function SpotifyWidget({ widget }: SpotifyWidgetProps) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [media, setMedia] = useState<SpotifyMedia | null>(null)
    const [playing, setPlaying] = useState(false)

    useEffect(() => {
        if (!widget.href) return
        const controller = new AbortController()

        async function loadMedia() {
            try {
                const response = await fetch(
                    `/api/spotify-media?url=${encodeURIComponent(widget.href ?? "")}`,
                    { signal: controller.signal },
                )
                if (!response.ok) return
                setMedia((await response.json()) as SpotifyMedia)
            } catch {
                // JSON fallback copy remains visible if Spotify is unavailable.
            }
        }

        void loadMedia()
        return () => controller.abort()
    }, [widget.href])

    const togglePlayback = async () => {
        const audio = audioRef.current
        if (!audio || !media?.previewUrl) return

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

    const spotifyUrl = media?.spotifyUrl ?? widget.href
    const title = media?.title ?? widget.title
    const subtitle = media?.subtitle ?? widget.summary
    const size = getWidgetSize(widget.size)
    const isWide = size.name === "wide"

    return (
        <div
            className={cn(
                widgetSurface,
                "isolate justify-start gap-4 bg-[#effbf4]",
                isWide &&
                    "grid grid-cols-[minmax(8rem,1fr)_auto] grid-rows-[1fr_auto] items-center gap-x-4 gap-y-[0.55rem]",
            )}
        >
            <a
                className={cn(
                    "relative z-[2] flex flex-col items-start gap-3",
                    size.name === "compact" && "h-full justify-between",
                    isWide && "flex-row items-center",
                )}
                href={spotifyUrl}
                draggable={false}
                target="_blank"
                rel="noreferrer"
                aria-label={`${title} on Spotify, opens in a new tab`}
            >
                <span className="grid size-12 place-items-center rounded-[0.82rem] bg-[#1ed760] text-white shadow-[0_5px_14px_rgba(30,215,96,0.2)] [&>svg]:size-[1.65rem]">
                    <BrandLogo brand="spotify" />
                </span>
                <span className="grid gap-1">
                    <strong className="max-w-[14ch] text-[1.05rem] leading-[1.15] font-[560] tracking-[-0.025em]">
                        {title}
                    </strong>
                    {size.showSummary && subtitle && (
                        <span className="text-[0.68rem] text-[#727272]">
                            {subtitle}
                        </span>
                    )}
                </span>
            </a>

            {size.showMedia && media?.artwork && (
                <a
                    className={cn(
                        "relative z-[2] block aspect-square w-full overflow-hidden rounded-[0.9rem] border border-black/8 bg-[#dcf4e5]",
                        isWide && "col-start-2 row-span-2 row-start-1 w-28",
                        size.name === "large" &&
                            "w-[min(100%,19rem)] self-center",
                    )}
                    href={spotifyUrl}
                    draggable={false}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${title} on Spotify`}
                >
                    <Image
                        src={media.artwork}
                        alt={`${title} artwork`}
                        width={640}
                        height={640}
                        sizes="14rem"
                        className="block size-full object-cover"
                    />
                </a>
            )}

            {size.name !== "compact" && media?.previewUrl && (
                <>
                    <audio
                        ref={audioRef}
                        src={media.previewUrl}
                        preload="none"
                        onPlay={() => setPlaying(true)}
                        onPause={() => setPlaying(false)}
                        onEnded={() => setPlaying(false)}
                    />
                    <button
                        type="button"
                        className={cn(
                            "group/playback relative z-[2] mt-auto inline-flex w-fit cursor-pointer items-center self-start justify-self-start rounded-full border border-[#159c3f]/15 bg-[#1ed760] py-[0.56rem] pr-[0.82rem] pl-[0.68rem] text-[0.68rem] leading-none font-[680] text-[#0b2714] shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_6px_16px_rgba(30,215,96,0.2)] transition-[background,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:bg-[#23df66] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_9px_20px_rgba(30,215,96,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168f42] active:translate-y-0 active:scale-[0.97]",
                            isWide && "m-0",
                        )}
                        onClick={togglePlayback}
                        aria-label={`${playing ? "Pause" : "Play"} ${title} preview`}
                    >
                        <span className="relative mr-[0.45rem] grid size-[0.9rem] place-items-center">
                            <Play
                                aria-hidden="true"
                                className={cn(
                                    "absolute size-[0.88rem] fill-current stroke-[2.2] transition-[opacity,transform] duration-200",
                                    playing
                                        ? "scale-75 opacity-0"
                                        : "scale-100 opacity-100",
                                )}
                            />

                            <span
                                aria-hidden="true"
                                className={cn(
                                    "spotify-playback-wave absolute flex h-[0.9rem] items-center gap-[0.09rem] transition-[opacity,transform] duration-200",
                                    playing
                                        ? "scale-100 opacity-100 group-hover/playback:scale-75 group-hover/playback:opacity-0 group-focus-visible/playback:scale-75 group-focus-visible/playback:opacity-0"
                                        : "scale-75 opacity-0",
                                )}
                            >
                                <span
                                    className="h-[0.48rem] w-[0.11rem] origin-center rounded-full bg-current"
                                    style={{ animationDelay: "-0.42s" }}
                                />
                                <span
                                    className="h-[0.78rem] w-[0.11rem] origin-center rounded-full bg-current"
                                    style={{ animationDelay: "-0.24s" }}
                                />
                                <span
                                    className="h-[0.6rem] w-[0.11rem] origin-center rounded-full bg-current"
                                    style={{ animationDelay: "-0.6s" }}
                                />
                                <span
                                    className="h-[0.36rem] w-[0.11rem] origin-center rounded-full bg-current"
                                    style={{ animationDelay: "-0.12s" }}
                                />
                            </span>

                            <Pause
                                aria-hidden="true"
                                className={cn(
                                    "absolute size-[0.88rem] fill-current stroke-[2.2] opacity-0 transition-[opacity,transform] duration-200",
                                    playing
                                        ? "scale-75 group-hover/playback:scale-100 group-hover/playback:opacity-100 group-focus-visible/playback:scale-100 group-focus-visible/playback:opacity-100"
                                        : "scale-75",
                                )}
                            />
                        </span>

                        <span className="relative grid min-w-[2.55rem]">
                            <span
                                className={cn(
                                    "col-start-1 row-start-1 transition-[opacity,transform] duration-200",
                                    playing &&
                                        "group-hover/playback:-translate-y-0.5 group-hover/playback:opacity-0 group-focus-visible/playback:-translate-y-0.5 group-focus-visible/playback:opacity-0",
                                )}
                            >
                                {playing ? "Playing" : "Play"}
                            </span>
                            {playing && (
                                <span className="col-start-1 row-start-1 translate-y-0.5 opacity-0 transition-[opacity,transform] duration-200 group-hover/playback:translate-y-0 group-hover/playback:opacity-100 group-focus-visible/playback:translate-y-0 group-focus-visible/playback:opacity-100">
                                    Pause
                                </span>
                            )}
                        </span>
                    </button>
                </>
            )}
        </div>
    )
}
