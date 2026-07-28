import type { Metadata } from "next"
import Link from "next/link"
import { LuArrowLeft } from "react-icons/lu"

import { DynamicIsland } from "@/components/demos/dynamic-island"

export const metadata: Metadata = {
    title: "Demos",
    description: "Small design engineering experiments by Gibson Murray.",
    alternates: {
        canonical: "/demos",
    },
}

const DEMOS = [
    { eyebrow: "Motion", title: "Demo 02", size: "standard" },
    { eyebrow: "Typography", title: "Demo 03", size: "tall" },
    { eyebrow: "Input", title: "Demo 04", size: "standard" },
    { eyebrow: "Physics", title: "Demo 05", size: "standard" },
    { eyebrow: "Canvas", title: "Demo 06", size: "wide" },
] as const

export default function DemosPage() {
    return (
        <main className="demos-page">
            <header className="demos-header">
                <Link className="demos-back" href="/">
                    <LuArrowLeft aria-hidden="true" />
                    Home
                </Link>
                <div className="demos-intro">
                    <p className="demos-kicker">Design engineering experiments</p>
                    <h1>Demos</h1>
                    <p>
                        A growing collection of small, tactile ideas for the web.
                    </p>
                </div>
            </header>

            <section className="demo-grid" aria-label="Demo collection">
                <article className="demo-card demo-card--wide island-card">
                    <DynamicIsland />
                </article>

                {DEMOS.map((demo) => (
                    <article
                        className={`demo-card demo-card--${demo.size}`}
                        key={demo.title}
                    >
                        <div className="demo-card-copy">
                            <p>{demo.eyebrow}</p>
                            <h2>{demo.title}</h2>
                        </div>
                        <span className="demo-status">Coming soon</span>
                    </article>
                ))}
            </section>
        </main>
    )
}
