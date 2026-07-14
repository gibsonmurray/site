import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { GeistSans } from "geist/font/sans"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import "./global.css"

const siteUrl = "https://gibsonmurray.com"

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Gibson Murray",
        template: "%s | Gibson Murray",
    },
    description: "A rearrangeable, widget-based portfolio by Gibson Murray.",
    applicationName: "Gibson Murray",
    authors: [{ name: "Gibson Murray", url: siteUrl }],
    creator: "Gibson Murray",
    publisher: "Gibson Murray",
    keywords: ["Gibson Murray", "software engineer", "author", "portfolio"],
    icons: {
        icon: [
            { url: "/gm-logo.svg", type: "image/svg+xml" },
            { url: "/gm-logo.png", type: "image/png" },
        ],
        apple: [{ url: "/gm-logo.png" }],
    },
    openGraph: {
        title: "Gibson Murray",
        description: "A rearrangeable portfolio of code, books, and ideas.",
        url: siteUrl,
        siteName: "Gibson Murray",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Gibson Murray",
        description: "A rearrangeable portfolio of code, books, and ideas.",
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            className={`${GeistSans.variable} min-w-80 bg-white scheme-light`}
        >
            <body className="min-h-svh min-w-80 bg-white font-[family-name:var(--font-geist-sans)] [font-feature-settings:'ss01'_on,'cv01'_on,'cv11'_on] text-[#111] antialiased selection:bg-[#1689e8]/25">
                {children}
                <Analytics />
            </body>
        </html>
    )
}
