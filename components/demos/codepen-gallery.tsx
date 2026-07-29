"use client"

import type { CSSProperties } from "react"

import { DynamicIsland } from "@/components/demos/dynamic-island"
import { OriginalHoverPreviewText } from "@/components/demos/original/hover-preview-text"
import { OriginalOlympicMedals } from "@/components/demos/original/olympic-medals"

const ORIGINAL_PENS = [
    {
        desktopScale: 1.3,
        id: "KKjLRMj",
        mobileScale: 1.65,
        tabletScale: 1.65,
        title: "Pressure Grid",
        wide: false,
    },
    {
        desktopScale: 0.78,
        id: "gONaLwy",
        mobileScale: 0.96,
        tabletScale: 1,
        title: "Trashy Photos",
        wide: false,
    },
    {
        desktopScale: 0.68,
        id: "JjzmrWR",
        mobileScale: 0.62,
        tabletScale: 0.6,
        title: "Parallax Devices",
        wide: true,
    },
    {
        desktopScale: 1,
        id: "oNrXoaL",
        mobileScale: 0.59,
        tabletScale: 1.15,
        title: "Jumpy Cards",
        wide: true,
    },
    {
        desktopScale: 0.42,
        id: "OJdzxyK",
        mobileScale: 0.235,
        tabletScale: 0.65,
        title: "Poppr Landing Page",
        wide: true,
    },
    {
        desktopScale: 0.78,
        id: "jOdwaKb",
        mobileScale: 0.44,
        tabletScale: 0.78,
        title: "Parallax Seasons",
        wide: true,
    },
    {
        desktopScale: 0.8,
        id: "gOqMmvE",
        mobileScale: 0.8,
        tabletScale: 0.8,
        title: "Sticky Notes",
        wide: true,
    },
] as const

function OriginalPen({
    desktopScale,
    id,
    mobileScale,
    tabletScale,
    title,
    wide,
}: {
    desktopScale: number
    id: string
    mobileScale: number
    tabletScale: number
    title: string
    wide: boolean
}) {
    return (
        <article
            className={`demo-card demo-card--original demo-card--tall original-pen--${id}${wide ? " demo-card--wide" : ""}`}
            style={
                {
                    "--preview-desktop-scale": desktopScale,
                    "--preview-mobile-scale": mobileScale,
                    "--preview-tablet-scale": tabletScale,
                } as CSSProperties
            }
        >
            <iframe
                className="original-pen-frame"
                loading="lazy"
                sandbox="allow-same-origin allow-scripts"
                src={`/demos/codepen/${id}.html`}
                title={title}
            />
        </article>
    )
}

export function CodepenGallery() {
    return (
        <section className="demo-grid" aria-label="Demo collection">
            <article className="demo-card demo-card--wide island-card">
                <DynamicIsland />
            </article>

            <OriginalPen {...ORIGINAL_PENS[0]} />

            <article
                className="demo-card demo-card--original demo-card--tall original-olympic-card"
                style={
                    {
                        "--preview-desktop-scale": 1.1,
                        "--preview-mobile-scale": 1.15,
                        "--preview-tablet-scale": 1.15,
                    } as CSSProperties
                }
            >
                <OriginalOlympicMedals />
            </article>

            <article
                className="demo-card demo-card--original demo-card--tall demo-card--wide original-hover-card"
                style={
                    {
                        "--preview-desktop-scale": 1.2,
                        "--preview-mobile-scale": 0.65,
                        "--preview-tablet-scale": 1.2,
                    } as CSSProperties
                }
            >
                <OriginalHoverPreviewText />
            </article>

            {ORIGINAL_PENS.slice(1).map((pen) => (
                <OriginalPen key={pen.id} {...pen} />
            ))}
        </section>
    )
}
