"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { BrandLogo } from "@/components/brand-logo"
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
                setPlaying(true)
            } catch {
                setPlaying(false)
            }
        } else {
            audio.pause()
            setPlaying(false)
        }
    }

    const spotifyUrl = media?.spotifyUrl ?? widget.href
    const title = media?.title ?? widget.title
    const subtitle = media?.subtitle ?? widget.summary

    return (
        <div className="widget-card__surface spotify-widget">
            <a
                className="spotify-widget__identity"
                href={spotifyUrl}
                draggable={false}
                target="_blank"
                rel="noreferrer"
                aria-label={`${title} on Spotify, opens in a new tab`}
            >
                <span className="spotify-widget__logo">
                    <BrandLogo brand="spotify" />
                </span>
                <span className="spotify-widget__copy">
                    <strong>{title}</strong>
                    {subtitle && <span>{subtitle}</span>}
                </span>
            </a>

            {media?.artwork && (
                <a
                    className="spotify-widget__artwork"
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
                    />
                </a>
            )}

            {media?.previewUrl && (
                <>
                    <audio
                        ref={audioRef}
                        src={media.previewUrl}
                        preload="none"
                        onEnded={() => setPlaying(false)}
                    />
                    <button
                        type="button"
                        className="spotify-widget__play"
                        onClick={togglePlayback}
                        aria-label={`${playing ? "Pause" : "Play"} Spotify preview`}
                    >
                        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                        {playing ? "Pause" : "Play"}
                    </button>
                </>
            )}
        </div>
    )
}
