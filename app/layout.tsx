import "./globals.css"
import { Figtree } from "next/font/google"
import { FC } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
const figtree = Figtree({ subsets: ["latin"] })

type RootLayoutProps = { children: React.ReactNode }

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={cn(figtree.className, "bg-[#62AAD9] antialiased")}>
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
