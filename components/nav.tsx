"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SunIcon, MoonIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const navItems = {
    "/": {
        name: "home",
    },
    "/blog": {
        name: "blog",
    },
}

export const Navbar = () => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <aside className="mb-16 -ml-2 tracking-tight">
            <div className="lg:sticky lg:top-20">
                <nav
                    className="fade relative flex scroll-pr-6 flex-row items-start justify-between px-0 pb-0 md:relative md:overflow-auto"
                    id="nav"
                >
                    <div className="flex flex-row space-x-0 pr-10">
                        {Object.entries(navItems).map(([path, { name }]) => {
                            return (
                                <Link
                                    key={path}
                                    href={path}
                                    className="relative m-1 flex px-3 py-1 align-middle transition-all rounded-md hover:bg-muted/40 group"
                                >
                                    <span className="relative">
                                        {name}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary/60 group-hover:w-full transition-all duration-300"></span>
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                            className="transition-all duration-200 hover:scale-110 hover:bg-muted/40"
                        >
                            {theme === "dark" ? (
                                <MoonIcon className="size-4 transition-transform duration-300" />
                            ) : (
                                <SunIcon className="size-4 transition-transform duration-300" />
                            )}
                        </Button>
                    )}
                </nav>
            </div>
        </aside>
    )
}
