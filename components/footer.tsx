import Link from "next/link"
import { LogoIcon } from "@/components/logo"

const LINKS = [
    {
        name: "rss",
        href: "/rss",
        external: false,
    },
    {
        name: "github",
        href: "https://github.com/gibsonmurray",
        external: true,
    },
    {
        name: "view source",
        href: "https://github.com/gibsonmurray/site",
        external: true,
    },
]

export const Footer = () => {
    return (
        <footer className="mb-6 border-t border-border/65 px-5 pt-4 text-xs text-muted-foreground sm:mb-8 sm:px-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-foreground/80 font-medium">Gibson Murray</p>
                <ul className="flex flex-wrap items-center gap-3">
                    {LINKS.map((link) => (
                        <li key={link.name}>
                            <a
                                className="transition-colors hover:text-foreground"
                                rel={
                                    link.external
                                        ? "noopener noreferrer"
                                        : undefined
                                }
                                target={link.external ? "_blank" : undefined}
                                href={link.href}
                            >
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground/90">
                <p>© {new Date().getFullYear()} Gibson Murray</p>
                <Link
                    href="/"
                    className="text-foreground/45 hover:text-foreground/70 transition-colors"
                    aria-label="Gibson Murray home"
                >
                    <LogoIcon className="size-3.5" />
                </Link>
            </div>
        </footer>
    )
}

