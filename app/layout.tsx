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

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: "Gibson Murray",
        template: "%s | Gibson Murray",
    },
    description: "Gibson Murray's portfolio.",
    openGraph: {
        title: "Gibson Murray",
        description: "Gibson Murray's portfolio.",
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
        description: "Gibson Murray's portfolio.",
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

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
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
            <body className="mx-auto flex min-h-screen max-w-xl flex-col px-4 pt-8 antialiased">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <TooltipProvider delay={500}>
                        <main className="mt-6 flex min-w-0 flex-1 flex-col px-2 md:px-0">
                            <Navbar />
                            {children}
                            <Footer />
                            <Analytics />
                            <SpeedInsights />
                        </main>
                    </TooltipProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}

export default RootLayout
