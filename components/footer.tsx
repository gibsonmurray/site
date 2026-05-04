import Link from "next/link"
import { LogoIcon } from "@/components/logo"
import { Code2, ExternalLink, Rss, type LucideIcon } from "lucide-react"

const LINKS: { name: string; href: string; external: boolean; icon: LucideIcon }[] = [
    {
        name: "rss",
        href: "/rss",
        external: false,
        icon: Rss,
    },
    {
        name: "github",
        href: "https://github.com/gibsonmurray",
        external: true,
        icon: ExternalLink,
    },
    {
        name: "view source",
        href: "https://github.com/gibsonmurray/site",
        external: true,
        icon: Code2,
    },
]

export const Footer = () => {
    return (
        <footer className="border-border/65 text-muted-foreground border-t px-4 py-6 text-xs">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-foreground/80 font-medium">
                        Gibson Murray
                    </p>
                    <ul className="flex flex-wrap items-center gap-3">
                        {LINKS.map((link) => {
                            const Icon = link.icon
                            return (
                                <li key={link.name}>
                                    <a
                                        className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
                                        rel={
                                            link.external
                                                ? "noopener noreferrer"
                                                : undefined
                                        }
                                        target={
                                            link.external ? "_blank" : undefined
                                        }
                                        href={link.href}
                                    >
                                        <Icon className="size-3" />
                                        {link.name}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="text-muted-foreground/90 mt-3 flex items-center justify-between text-[11px]">
                    <p>© {new Date().getFullYear()} Gibson Murray</p>
                    <Link
                        href="/"
                        className="text-foreground/45 hover:text-foreground/70 transition-colors"
                        aria-label="Gibson Murray home"
                    >
                        <LogoIcon className="size-3.5" />
                    </Link>
                </div>
            </div>
        </footer>
    )
}
