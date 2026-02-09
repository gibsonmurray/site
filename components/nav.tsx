"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SunIcon, MoonIcon } from "lucide-react"
import { useTheme } from "next-themes"

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

    return (
        <aside className="mb-16 -ml-[8px] tracking-tight">
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
                                    className="relative m-1 flex px-2 py-1 align-middle transition-all hover:text-neutral-800 dark:hover:text-neutral-200"
                                >
                                    {name}
                                </Link>
                            )
                        })}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        {theme === "dark" ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
                    </Button>
                </nav>
            </div>
        </aside>
    )
}
