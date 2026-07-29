import type { Metadata } from "next"
import Link from "next/link"
import { LuArrowLeft } from "react-icons/lu"

import { CodepenGallery } from "@/components/demos/codepen-gallery"

import "./demos.css"

export const metadata: Metadata = {
    title: "Demos",
    description: "Small design engineering experiments by Gibson Murray.",
    alternates: {
        canonical: "/demos",
    },
}

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

            <CodepenGallery />
        </main>
    )
}
