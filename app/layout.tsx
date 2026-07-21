import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"

import { SITE } from "@/lib/site"

import "./globals.css"

export const metadata: Metadata = {
    metadataBase: new URL(SITE.url),
    title: {
        default: SITE.title,
        template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    applicationName: SITE.name,
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    publisher: SITE.name,
    keywords: [...SITE.keywords],
    category: "personal website",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: SITE.locale,
        url: "/",
        siteName: SITE.name,
        title: SITE.title,
        description: SITE.description,
        images: [
            {
                url: SITE.socialImage,
                width: 1200,
                height: 630,
                alt: SITE.socialImageAlt,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: SITE.title,
        description: SITE.description,
        images: [SITE.socialImage],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    manifest: "/manifest.webmanifest",
    formatDetection: {
        address: false,
        email: false,
        telephone: false,
    },
    appleWebApp: {
        capable: true,
        title: SITE.name,
        statusBarStyle: "default",
    },
    referrer: "strict-origin-when-cross-origin",
}

export const viewport: Viewport = {
    colorScheme: "light",
    themeColor: SITE.themeColor,
}

const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebSite",
            "@id": `${SITE.url}/#website`,
            url: SITE.url,
            name: SITE.name,
            description: SITE.description,
            inLanguage: SITE.language,
            publisher: { "@id": `${SITE.url}/#person` },
        },
        {
            "@type": "Person",
            "@id": `${SITE.url}/#person`,
            name: SITE.name,
            url: SITE.url,
            description: SITE.description,
            jobTitle: ["Author", "Programmer", "Storyteller"],
            sameAs: SITE.sameAs,
        },
        {
            "@type": "WebPage",
            "@id": `${SITE.url}/#webpage`,
            url: SITE.url,
            name: SITE.title,
            description: SITE.description,
            isPartOf: { "@id": `${SITE.url}/#website` },
            about: { "@id": `${SITE.url}/#person` },
            author: { "@id": `${SITE.url}/#person` },
            inLanguage: SITE.language,
        },
    ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en-US" className={GeistSans.variable}>
            <body>
                {children}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
                    }}
                />
            </body>
        </html>
    )
}
