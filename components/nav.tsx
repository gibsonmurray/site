"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    BookOpen,
    House,
    Newspaper,
    ShoppingCart,
    SunMoon,
    type LucideIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useCartStore } from "@/lib/cart-store"

const navItems = {
    "/": {
        name: "home",
        icon: House,
    },
    "/books": {
        name: "books",
        icon: BookOpen,
    },
    "/blog": {
        name: "blog",
        icon: Newspaper,
    },
}

export const Navbar = () => {
    const { resolvedTheme, setTheme } = useTheme()
    const { items, openCart } = useCartStore()
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <aside className="border-border/60 bg-background/85 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-40 border-b px-4 tracking-tight backdrop-blur-xl">
            <div className="mx-auto max-w-6xl">
                <nav
                    className="fade relative flex h-14 scroll-pr-6 flex-row items-center justify-between px-0 pb-0 md:relative md:overflow-auto"
                    id="nav"
                >
                    <div className="flex flex-row items-center gap-1">
                        {Object.entries(navItems).map(
                            ([path, { name, icon: Icon }]: [
                                string,
                                { name: string; icon: LucideIcon },
                            ]) => {
                                return (
                                    <Link key={path} href={path}>
                                        <Tooltip>
                                            <TooltipTrigger
                                                render={
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
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
                                    </Link>
                                )
                            },
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={openCart}
                                        className="hover:bg-muted/40 relative transition-all duration-200 hover:scale-110"
                                        aria-label="Open cart"
                                    />
                                }
                            >
                                <span className="relative inline-flex">
                                    <ShoppingCart className="h-4 w-4" />
                                    {totalItems > 0 && (
                                        <span className="bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 flex size-3.5 items-center justify-center rounded-full text-[9px] leading-none font-bold">
                                            {totalItems > 9 ? "9+" : totalItems}
                                        </span>
                                    )}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Cart</TooltipContent>
                        </Tooltip>
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
                    </div>
                </nav>
            </div>
        </aside>
    )
}
