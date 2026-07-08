import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import "./global.css"

const siteUrl = "https://gibsonmurray.com"

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Gibson Murray",
        template: "%s | Gibson Murray",
    },
    description:
        "Gibson Murray is a software engineer, Christian author, and maker of focused web tools.",
    applicationName: "Gibson Murray",
    authors: [{ name: "Gibson Murray", url: siteUrl }],
    creator: "Gibson Murray",
    publisher: "Gibson Murray",
    keywords: [
        "Gibson Murray",
        "software engineer",
        "Christian author",
        "biblical fiction",
        "Walls book",
        "Verbatim",
    ],
    icons: {
        icon: [
            { url: "/gm-logo.svg", type: "image/svg+xml" },
            { url: "/gm-logo.png", type: "image/png" },
        ],
        apple: [{ url: "/gm-logo.png" }],
    },
    openGraph: {
        title: "Gibson Murray",
        description:
            "Code, books, and tools for exact words.",
        url: siteUrl,
        siteName: "Gibson Murray",
        images: [
            {
                url: "/media/walls-mock-1.png",
                width: 1200,
                height: 630,
                alt: "Walls book mockup",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Gibson Murray",
        description:
            "Code, books, and tools for exact words.",
        images: ["/media/walls-mock-1.png"],
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
        <html lang="en" className="dark">
            <body>
                {children}
                <Analytics />
            </body>
        </html>
    )
}
