import "./globals.css"
import { Figtree, Newsreader } from "next/font/google"
import { FC } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
const figtree = Figtree({ subsets: ["latin"] })
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" })

type RootLayoutProps = { children: React.ReactNode }

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={cn(figtree.className, newsreader.variable, "bg-[#62AAD9] antialiased")}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    forcedTheme="light"
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}

export default RootLayout
