"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogoIcon } from "@/components/logo"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
    BookOpen,
    House,
    Newspaper,
    ShoppingCart,
    type LucideIcon,
} from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { cn } from "@/lib/utils"

const navItems: {
    href: string
    label: string
    icon: LucideIcon
}[] = [
    {
        href: "/",
        label: "Home",
        icon: House,
    },
    {
        href: "/books",
        label: "Books",
        icon: BookOpen,
    },
    {
        href: "/blog",
        label: "Writing",
        icon: Newspaper,
    },
]

export const Navbar = () => {
    const pathname = usePathname()
    const { items, openCart } = useCartStore()
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <aside className="border-border/55 bg-background/82 supports-[backdrop-filter]:bg-background/68 sticky top-0 z-40 border-b px-4 tracking-tight backdrop-blur-xl">
            <div className="mx-auto max-w-6xl">
                <nav
                    className="fade relative flex min-h-12 scroll-pr-6 flex-row items-center justify-between gap-2 md:relative md:overflow-visible"
                    id="nav"
                >
                    <Link
                        href="/"
                        className="text-foreground/88 hover:text-foreground inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-1 text-sm font-semibold transition-colors sm:px-2"
                        aria-label="Gibson Murray home"
                    >
                        <LogoIcon className="size-3.5" />
                        <span className="hidden md:inline">Gibson Murray</span>
                    </Link>

                    <NavigationMenu className="max-w-none min-w-0 flex-1 justify-center">
                        <NavigationMenuList className="gap-0.5 rounded-full">
                            {navItems.map(({ href, label, icon: Icon }) => {
                                const isActive =
                                    href === "/"
                                        ? pathname === href
                                        : pathname.startsWith(href)

                                return (
                                    <NavigationMenuItem key={href}>
                                        <NavigationMenuLink
                                            render={<Link href={href} />}
                                            data-active={isActive}
                                            aria-current={
                                                isActive ? "page" : undefined
                                            }
                                            className={cn(
                                                "data-active:text-foreground text-muted-foreground hover:text-foreground h-8 rounded-full bg-transparent px-2 text-xs font-medium hover:!bg-transparent focus-visible:!bg-transparent data-active:!bg-transparent sm:px-3 sm:text-sm",
                                                isActive && "text-foreground",
                                            )}
                                        >
                                            <Icon className="size-3.5 opacity-80" />
                                            <span className="sr-only md:not-sr-only">
                                                {label}
                                            </span>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                )
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>

                    <div className="flex shrink-0 items-center gap-2">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={openCart}
                            className="text-muted-foreground hover:text-foreground relative h-8 rounded-full border-transparent bg-transparent px-2 text-xs shadow-none hover:!bg-transparent focus-visible:!bg-transparent sm:px-3 sm:text-sm"
                            aria-label="Open cart"
                        >
                            <span className="relative inline-flex">
                                <ShoppingCart className="size-3.5" />
                                {totalItems > 0 && (
                                    <span className="bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 flex size-3.5 items-center justify-center rounded-full text-[9px] leading-none font-bold">
                                        {totalItems > 9 ? "9+" : totalItems}
                                    </span>
                                )}
                            </span>
                            <span className="hidden md:inline">Cart</span>
                        </Button>
                    </div>
                </nav>
            </div>
        </aside>
    )
}
