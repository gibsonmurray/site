"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogoIcon } from "@/components/logo"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    AppWindow,
    BookOpen,
    Feather,
    LayoutGrid,
    Menu,
    Newspaper,
    ShoppingCart,
    type LucideIcon,
} from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { apps } from "@/lib/apps"
import { books } from "@/lib/books"
import { cn } from "@/lib/utils"
import { writings } from "@/lib/writings"

type NavMenuItem = {
    href: string
    label: string
    description: string
    imageSrc?: string
    imageAlt?: string
    icon?: LucideIcon
}

const navItems: {
    href: string
    label: string
    icon?: LucideIcon
    aliases?: string[]
    menu?: {
        allLabel: string
        allDescription: string
        allIcon: LucideIcon
        items: NavMenuItem[]
    }
}[] = [
    {
        href: "/books",
        label: "Books",
        icon: BookOpen,
        menu: {
            allLabel: "All books",
            allDescription: "Biblical fiction projects and reading options.",
            allIcon: BookOpen,
            items: books.map((book) => ({
                href: `/books/${book.slug}`,
                label: book.title,
                description: book.shortDescription,
                imageSrc: book.coverImageSrc,
                imageAlt: book.coverImageAlt,
            })),
        },
    },
    {
        href: "/apps",
        label: "Apps",
        icon: AppWindow,
        menu: {
            allLabel: "All apps",
            allDescription: "Thoughtful software built alongside the writing.",
            allIcon: LayoutGrid,
            items: apps.map((app) => ({
                href: app.href,
                label: app.name,
                description: app.tagline,
                imageSrc: app.logoSrc,
                imageAlt: "",
            })),
        },
    },
    {
        href: "/writings",
        label: "Writings",
        icon: Newspaper,
        aliases: ["/blog"],
        menu: {
            allLabel: "All writings",
            allDescription: "Essays and reflections on faith, story, and life.",
            allIcon: Feather,
            items: writings.map((writing) => ({
                href: writing.href,
                label: writing.title,
                description: writing.summary,
                icon: Newspaper,
            })),
        },
    },
]

const NavIcon = ({
    icon: Icon,
    className,
}: {
    icon: LucideIcon
    className?: string
}) => <Icon className={cn("shrink-0", className)} />

export const Navbar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { items, openCart } = useCartStore()
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    useEffect(() => {
        setOpenMenu(null)
        setMobileMenuOpen(false)
    }, [pathname])

    const handleMenuTriggerClick = (href: string) => {
        setOpenMenu(null)
        router.push(href)
    }

    const isNavItemActive = (item: (typeof navItems)[number]) =>
        pathname.startsWith(item.href) ||
        item.aliases?.some((alias) => pathname.startsWith(alias)) ||
        item.menu?.items.some((menuItem) =>
            pathname.startsWith(menuItem.href),
        ) ||
        false

    return (
        <aside className="site-nav border-foreground/10 bg-background/94 supports-[backdrop-filter]:bg-background/86 sticky top-0 z-40 border-b px-4 tracking-tight backdrop-blur-xl sm:px-6">
            <div className="mx-auto max-w-6xl">
                <nav
                    className="fade relative flex min-h-14 scroll-pr-6 flex-row items-center justify-between gap-2 md:relative md:overflow-visible"
                    id="nav"
                >
                    <Link
                        href="/"
                        className="site-nav-brand text-foreground/88 hover:text-foreground inline-flex h-10 shrink-0 items-center gap-2 px-1 text-sm font-semibold transition-colors md:hidden"
                        aria-label="Gibson Murray home"
                        aria-current={pathname === "/" ? "page" : undefined}
                    >
                        <LogoIcon className="size-3.5" />
                        <span>Gibson Murray</span>
                    </Link>

                    <div className="ml-auto flex shrink-0 items-center gap-1 md:hidden">
                        <Button
                            variant="outline"
                            size="icon-lg"
                            onClick={openCart}
                            className="text-muted-foreground hover:text-foreground relative rounded-none border-transparent bg-transparent shadow-none hover:!bg-transparent focus-visible:!bg-transparent"
                            aria-label="Open cart"
                        >
                            <span className="relative inline-flex">
                                <NavIcon
                                    icon={ShoppingCart}
                                    className="size-4"
                                />
                                {totalItems > 0 && (
                                    <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full text-[9px] leading-none font-bold">
                                        {totalItems > 9 ? "9+" : totalItems}
                                    </span>
                                )}
                            </span>
                        </Button>
                    </div>

                    <Sheet
                        open={mobileMenuOpen}
                        onOpenChange={setMobileMenuOpen}
                    >
                        <SheetTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon-lg"
                                    className="text-foreground hover:bg-transparent focus-visible:bg-transparent md:hidden"
                                    aria-label="Open menu"
                                />
                            }
                        >
                            <NavIcon icon={Menu} className="size-5" />
                        </SheetTrigger>
                        <SheetContent
                            side="top"
                            className="max-h-[calc(100svh-1rem)] overflow-y-auto rounded-none border-b px-4 pb-5 shadow-xl md:hidden"
                        >
                            <SheetHeader className="px-0 pt-5 pb-2">
                                <SheetTitle className="sr-only">
                                    Site menu
                                </SheetTitle>
                                <SheetDescription className="sr-only">
                                    Navigation for Gibson Murray
                                </SheetDescription>
                            </SheetHeader>

                            <div className="grid gap-3">
                                {navItems
                                    .filter((item) => item.menu)
                                    .map((item) => {
                                        const Icon = item.icon
                                        const menu = item.menu!
                                        const AllIcon = menu.allIcon

                                        return (
                                            <section
                                                key={item.href}
                                                className="grid gap-1.5"
                                            >
                                                <div className="text-muted-foreground flex items-center gap-2 px-1 pt-2 text-xs font-semibold tracking-[0.18em] uppercase">
                                                    {Icon && (
                                                        <NavIcon
                                                            icon={Icon}
                                                            className="size-3.5"
                                                        />
                                                    )}
                                                    {item.label}
                                                </div>
                                                <Link
                                                    href={item.href}
                                                    className="hover:bg-muted/70 flex min-h-14 items-center gap-3 rounded-none px-3 py-2.5 transition-colors"
                                                >
                                                    <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-none">
                                                        <NavIcon
                                                            icon={AllIcon}
                                                            className="size-4"
                                                        />
                                                    </span>
                                                    <span>
                                                        <span className="text-foreground block text-sm font-semibold">
                                                            {menu.allLabel}
                                                        </span>
                                                        <span className="text-muted-foreground mt-0.5 line-clamp-1 block text-xs">
                                                            {
                                                                menu.allDescription
                                                            }
                                                        </span>
                                                    </span>
                                                </Link>
                                                {menu.items.map((menuItem) => {
                                                    const MenuIcon =
                                                        menuItem.icon

                                                    return (
                                                        <Link
                                                            key={menuItem.href}
                                                            href={menuItem.href}
                                                            className="hover:bg-muted/70 flex min-h-14 items-center gap-3 rounded-none px-3 py-2.5 transition-colors"
                                                        >
                                                            {menuItem.imageSrc ? (
                                                                <img
                                                                    src={
                                                                        menuItem.imageSrc
                                                                    }
                                                                    alt={
                                                                        menuItem.imageAlt ??
                                                                        ""
                                                                    }
                                                                    className="border-border/60 size-9 shrink-0 rounded-[0.25rem] border object-cover"
                                                                    aria-hidden={
                                                                        menuItem.imageAlt
                                                                            ? undefined
                                                                            : "true"
                                                                    }
                                                                />
                                                            ) : (
                                                                MenuIcon && (
                                                                    <span className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-none">
                                                                        <NavIcon
                                                                            icon={
                                                                                MenuIcon
                                                                            }
                                                                            className="size-4"
                                                                        />
                                                                    </span>
                                                                )
                                                            )}
                                                            <span>
                                                                <span className="text-foreground block text-sm font-semibold">
                                                                    {
                                                                        menuItem.label
                                                                    }
                                                                </span>
                                                                <span className="text-muted-foreground mt-0.5 line-clamp-1 block text-xs">
                                                                    {
                                                                        menuItem.description
                                                                    }
                                                                </span>
                                                            </span>
                                                        </Link>
                                                    )
                                                })}
                                            </section>
                                        )
                                    })}
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Link
                        href="/"
                        className="site-nav-brand text-foreground/88 hover:text-foreground hidden h-10 shrink-0 items-center gap-2 px-1 text-sm font-semibold transition-colors md:inline-flex"
                        aria-label="Gibson Murray home"
                        aria-current={pathname === "/" ? "page" : undefined}
                    >
                        <LogoIcon className="size-3.5" />
                        <span>Gibson Murray</span>
                    </Link>

                    <NavigationMenu
                        value={openMenu}
                        onValueChange={setOpenMenu}
                        className="hidden max-w-none min-w-0 flex-1 justify-center md:flex"
                    >
                        <NavigationMenuList className="gap-5">
                            {navItems.map((item) => {
                                const { href, label, menu } = item
                                const isActive = isNavItemActive(item)

                                if (menu) {
                                    const AllIcon = menu.allIcon

                                    return (
                                        <NavigationMenuItem
                                            key={href}
                                            value={href}
                                        >
                                            <NavigationMenuTrigger
                                                onClick={() =>
                                                    handleMenuTriggerClick(href)
                                                }
                                                data-active={isActive}
                                                aria-current={
                                                    isActive
                                                        ? "page"
                                                        : undefined
                                                }
                                                className={cn(
                                                    "site-nav-link data-active:text-foreground text-muted-foreground hover:text-foreground h-14 rounded-none bg-transparent px-0 text-xs font-medium hover:!bg-transparent focus-visible:!bg-transparent data-active:!bg-transparent sm:text-sm",
                                                    isActive &&
                                                        "text-foreground",
                                                )}
                                            >
                                                <span className="sr-only md:not-sr-only">
                                                    {label}
                                                </span>
                                            </NavigationMenuTrigger>
                                            <NavigationMenuContent className="w-[min(calc(100vw-2rem),22rem)] p-2">
                                                <div className="grid gap-1">
                                                    <NavigationMenuLink
                                                        render={
                                                            <Link href={href} />
                                                        }
                                                        onClick={() =>
                                                            setOpenMenu(null)
                                                        }
                                                        data-active={
                                                            pathname === href
                                                        }
                                                        className="group min-h-16 items-start gap-3 rounded-none p-3"
                                                    >
                                                        <span className="bg-primary/10 text-primary mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-none">
                                                            <NavIcon
                                                                icon={AllIcon}
                                                                className="size-4"
                                                            />
                                                        </span>
                                                        <span>
                                                            <span className="text-foreground block text-sm font-semibold">
                                                                {menu.allLabel}
                                                            </span>
                                                            <span className="text-muted-foreground mt-1 block text-xs leading-5">
                                                                {
                                                                    menu.allDescription
                                                                }
                                                            </span>
                                                        </span>
                                                    </NavigationMenuLink>
                                                    {menu.items.map(
                                                        (menuItem) => {
                                                            const MenuIcon =
                                                                menuItem.icon

                                                            return (
                                                                <NavigationMenuLink
                                                                    key={
                                                                        menuItem.href
                                                                    }
                                                                    render={
                                                                        <Link
                                                                            href={
                                                                                menuItem.href
                                                                            }
                                                                        />
                                                                    }
                                                                    onClick={() =>
                                                                        setOpenMenu(
                                                                            null,
                                                                        )
                                                                    }
                                                                    data-active={pathname.startsWith(
                                                                        menuItem.href,
                                                                    )}
                                                                    className="group min-h-16 items-start gap-3 rounded-none p-3"
                                                                >
                                                                    {menuItem.imageSrc ? (
                                                                        <img
                                                                            src={
                                                                                menuItem.imageSrc
                                                                            }
                                                                            alt={
                                                                                menuItem.imageAlt ??
                                                                                ""
                                                                            }
                                                                            className="border-border/60 mt-0.5 size-9 shrink-0 rounded-[0.25rem] border object-cover"
                                                                            aria-hidden={
                                                                                menuItem.imageAlt
                                                                                    ? undefined
                                                                                    : "true"
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        MenuIcon && (
                                                                            <span className="bg-primary/10 text-primary mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-none">
                                                                                <NavIcon
                                                                                    icon={
                                                                                        MenuIcon
                                                                                    }
                                                                                    className="size-4"
                                                                                />
                                                                            </span>
                                                                        )
                                                                    )}
                                                                    <span>
                                                                        <span className="text-foreground block text-sm font-semibold">
                                                                            {
                                                                                menuItem.label
                                                                            }
                                                                        </span>
                                                                        <span className="text-muted-foreground mt-1 block text-xs leading-5">
                                                                            {
                                                                                menuItem.description
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                </NavigationMenuLink>
                                                            )
                                                        },
                                                    )}
                                                </div>
                                            </NavigationMenuContent>
                                        </NavigationMenuItem>
                                    )
                                }

                                return (
                                    <NavigationMenuItem key={href}>
                                        <NavigationMenuLink
                                            render={<Link href={href} />}
                                            data-active={isActive}
                                            aria-current={
                                                isActive ? "page" : undefined
                                            }
                                            className={cn(
                                                "site-nav-link data-active:text-foreground text-muted-foreground hover:text-foreground h-14 rounded-none bg-transparent px-0 text-xs font-medium hover:!bg-transparent focus-visible:!bg-transparent data-active:!bg-transparent sm:text-sm",
                                                isActive && "text-foreground",
                                            )}
                                        >
                                            <span className="sr-only md:not-sr-only">
                                                {label}
                                            </span>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                )
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>

                    <div className="hidden shrink-0 items-center gap-2 md:flex">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={openCart}
                            className="site-nav-link text-muted-foreground hover:text-foreground relative h-14 rounded-none border-transparent bg-transparent px-0 text-xs shadow-none hover:!bg-transparent focus-visible:!bg-transparent sm:text-sm"
                            aria-label="Open cart"
                        >
                            <span className="relative inline-flex">
                                <NavIcon
                                    icon={ShoppingCart}
                                    className="size-3.5"
                                />
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
