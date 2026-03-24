"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { BookText, House, SunMoon, type LucideIcon } from "lucide-react"
import { useTheme } from "next-themes"

const navItems = {
    "/": {
        name: "home",
        icon: House,
    },
    "/blog": {
        name: "blog",
        icon: BookText,
    },
}

export const Navbar = () => {
    const { resolvedTheme, setTheme } = useTheme()

    return (
        <aside className="mb-10 px-5 tracking-tight sm:mb-12 sm:px-7">
            <div className="lg:sticky lg:top-20">
                <nav
                    className="fade relative flex scroll-pr-6 flex-row items-start justify-between px-0 pb-0 md:relative md:overflow-auto"
                    id="nav"
                >
                    <div className="flex flex-row items-center gap-1">
                        {Object.entries(navItems).map(
                            ([path, { name, icon: Icon }]: [
                                string,
                                { name: string; icon: LucideIcon },
                            ]) => {
                                return (
                                    <Tooltip key={path}>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    render={
                                                        <Link href={path} />
                                                    }
                                                    className="group m-1 transition-all duration-200 hover:scale-110"
                                                    aria-label={name}
                                                />
                                            }
                                        >
                                            <span className="relative inline-flex">
                                                <Icon className="h-4 w-4" />
                                                <span className="sr-only">
                                                    {name}
                                                </span>
                                                <span className="bg-primary/60 absolute -bottom-1 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></span>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent
                                            className="capitalize"
                                            side="bottom"
                                        >
                                            {name}
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            },
                        )}
                    </div>
                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        setTheme(
                                            resolvedTheme === "dark"
                                                ? "light"
                                                : "dark",
                                        )
                                    }
                                    className="hover:bg-muted/40 transition-all duration-200 hover:scale-110"
                                    aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
                                />
                            }
                        >
                            <SunMoon />
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            Switch theme
                        </TooltipContent>
                    </Tooltip>
                </nav>
            </div>
        </aside>
    )
}
