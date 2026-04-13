import "./global.css"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Navbar } from "../components/nav"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Footer from "../components/footer"
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

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: "Gibson Murray",
        template: "%s | Gibson Murray",
    },
    description:
        "Gibson Murray — author and software engineer. Biblical fiction, faith, and reflections on life.",
    alternates: {
        canonical: baseUrl,
    },
    openGraph: {
        title: "Gibson Murray",
        description:
            "Gibson Murray — author and software engineer. Biblical fiction, faith, and reflections on life.",
        url: baseUrl,
        siteName: "Gibson Murray",
        images: [
            {
                url: "/headshot.jpeg",
                alt: "Gibson Murray",
                width: 1200,
                height: 630,
                type: "image/jpeg",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Gibson Murray",
        description:
            "Gibson Murray — author and software engineer. Biblical fiction, faith, and reflections on life.",
        images: ["/headshot.jpeg"],
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

const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Gibson Murray",
    url: "https://gibsonmurray.com",
    sameAs: [
        "https://github.com/gibsonmurray",
        "https://x.com/gibsonmurray",
    ],
    jobTitle: "Author",
    description:
        "Author of Biblical fiction and software engineer.",
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
            <body className="mx-auto flex min-h-screen w-full max-w-xl flex-col pt-6 antialiased sm:pt-8">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(personJsonLd),
                    }}
                />
                <Providers>
                    <PricesProvider prices={prices} />
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <TooltipProvider delay={500}>
                            <main className="mt-5 flex min-w-0 flex-1 flex-col sm:mt-6">
                                <Navbar />
                                <div className="px-10">{children}</div>
                                <div
                                    className="min-h-10 flex-1"
                                    aria-hidden="true"
                                />
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
