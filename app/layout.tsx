import "./global.css"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Navbar } from "../components/nav"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Footer } from "../components/footer"
import { baseUrl } from "./sitemap"
import { cn } from "@/lib/utils"
import { FC } from "react"
import { ThemeProvider } from "next-themes"
import { Geist } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Providers } from "@/components/providers"
import { CartDrawer } from "@/components/cart-drawer"
import { fetchBookPrices } from "@/lib/stripe-server"
import { PricesProvider } from "@/components/prices-provider"
import {
    APPS_DESCRIPTION,
    AUTHOR_NAME,
    BLOG_DESCRIPTION,
    BOOKS_DESCRIPTION,
    SITE_DESCRIPTION,
    SITE_KEYWORDS,
    SITE_LINKS,
    SITE_NAME,
    SITE_TITLE,
    defaultOgImage,
    makeSiteNavigationSchema,
    organizationSchema,
    personSchema,
} from "@/lib/seo"
import { apps } from "@/lib/apps"
import { books } from "@/lib/books"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    generator: "Next.js",
    authors: [{ name: AUTHOR_NAME, url: baseUrl }],
    creator: AUTHOR_NAME,
    publisher: AUTHOR_NAME,
    category: "Books and Writing",
    keywords: SITE_KEYWORDS,
    referrer: "origin-when-cross-origin",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: [
            { url: "/gm-logo.svg", type: "image/svg+xml" },
            { url: "/gm-logo.png", type: "image/png", sizes: "184x184" },
        ],
        apple: [{ url: "/gm-logo.png", sizes: "184x184" }],
    },
    alternates: {
        canonical: baseUrl,
        types: {
            "application/rss+xml": `${baseUrl}/rss`,
        },
    },
    openGraph: {
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        url: baseUrl,
        siteName: SITE_NAME,
        images: [
            {
                url: defaultOgImage,
                alt: "Gibson Murray biblical fiction and writing",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: [defaultOgImage],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
}

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        personSchema,
        organizationSchema,
        makeSiteNavigationSchema([
            ...SITE_LINKS,
            ...apps.map((app) => ({
                name: app.name,
                url: `${baseUrl}${app.href}`,
            })),
            ...books.map((book) => ({
                name: book.title,
                url: `${baseUrl}/books/${book.slug}`,
            })),
        ]),
        {
            "@type": "WebSite",
            "@id": `${baseUrl}/#website`,
            name: SITE_NAME,
            url: baseUrl,
            description: SITE_DESCRIPTION,
            inLanguage: "en-US",
            publisher: {
                "@id": `${baseUrl}/#organization`,
            },
            author: {
                "@id": `${baseUrl}/#person`,
            },
            hasPart: [
                {
                    "@type": "WebPage",
                    name: "Books",
                    url: `${baseUrl}/books`,
                    description: BOOKS_DESCRIPTION,
                },
                {
                    "@type": "Blog",
                    "@id": `${baseUrl}/writings#blog`,
                    name: "Writing",
                    url: `${baseUrl}/writings`,
                    description: BLOG_DESCRIPTION,
                },
                {
                    "@type": "CollectionPage",
                    name: "Apps",
                    url: `${baseUrl}/apps`,
                    description: APPS_DESCRIPTION,
                },
                ...apps.map((app) => ({
                    "@type": "SoftwareApplication",
                    "@id": `${baseUrl}${app.href}#software`,
                    name: app.name,
                    url: app.externalUrl,
                    sameAs: `${baseUrl}${app.href}`,
                    applicationCategory: app.category,
                    operatingSystem: "Web",
                    description: app.description,
                })),
                ...books.map((book) => ({
                    "@type": "Book",
                    "@id": `${baseUrl}/books/${book.slug}#book`,
                    name: book.title,
                    url: `${baseUrl}/books/${book.slug}`,
                    description: book.shortDescription,
                })),
            ],
        },
        {
            "@type": "Blog",
            "@id": `${baseUrl}/writings#blog`,
            name: `${SITE_NAME} Writing`,
            url: `${baseUrl}/writings`,
            description: BLOG_DESCRIPTION,
            inLanguage: "en-US",
            publisher: {
                "@id": `${baseUrl}/#person`,
            },
        },
    ],
}

const RootLayout: FC<{ children: React.ReactNode }> = async ({ children }) => {
    const prices = await fetchBookPrices()
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn(
                GeistSans.variable,
                GeistMono.variable,
                "font-sans",
                geist.variable,
            )}
        >
            <body
                suppressHydrationWarning
                className="bg-background flex min-h-screen w-full flex-col antialiased"
            >
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd),
                    }}
                />
                <Providers>
                    <PricesProvider prices={prices} />
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem={false}
                        disableTransitionOnChange
                    >
                        <TooltipProvider delay={500}>
                            <main className="site-reveal-layout">
                                <div className="site-reveal-surface">
                                    <Navbar />
                                    <div>{children}</div>
                                </div>
                                <Footer />
                                <Analytics />
                                <SpeedInsights />
                                <CartDrawer />
                            </main>
                        </TooltipProvider>
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    )
}

export default RootLayout
