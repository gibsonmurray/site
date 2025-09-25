import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import "./globals.css"
import { FC } from "react"
import { ThemeProvider } from "@/components/theme-provider"

const figtree = Figtree({ subsets: ["latin"] })

const description =
    "hey everyone, welcome to my website! i'm gibson, a design engineer."

export const metadata: Metadata = {
    metadataBase: new URL("https://gibsonmurray.com"),
    title: { template: "%s | gibson murray", default: "gibson murray" },
    description,
    openGraph: {
        type: "website",
        title: "gibson murray",
        siteName: "gibson murray",
        url: "https://gibsonmurray.com",
        description,
        images: [{ url: "/og.jpg" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "gibson murray",
        description,
        images: [{ url: "/og.jpg" }],
    },
}

type RootLayoutProps = { children: React.ReactNode }

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    forcedTheme="dark"
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}

export default RootLayout
