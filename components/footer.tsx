import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { LogoIcon } from "@/components/logo"
import { publicContactEmail } from "@/lib/contact"

const LINKS = [
    {
        name: "Books",
        description: "Biblical fiction and new releases",
        href: "/books",
    },
    {
        name: "Apps",
        description: "Thoughtful tools made with care",
        href: "/apps",
    },
    {
        name: "Writing",
        description: "Essays, notes, and reflections",
        href: "/writings",
    },
    {
        name: "Ebook help",
        description: "Read your EPUB on any device",
        href: "/books/ebook-help",
    },
]

export const Footer = () => {
    return (
        <footer className="site-editorial-footer">
            <div className="site-editorial-footer-inner">
                <div className="site-editorial-footer-main">
                    <div className="site-editorial-footer-intro">
                        <p className="site-editorial-footer-kicker">
                            Books, essays, and software
                        </p>
                        <p className="site-editorial-footer-copy">
                            Stories shaped by Scripture.
                            <br />
                            Built with care.
                        </p>
                        <a
                            className="site-editorial-footer-contact"
                            href={`mailto:${publicContactEmail}`}
                        >
                            {publicContactEmail}
                            <ArrowUpRight aria-hidden="true" />
                        </a>
                    </div>
                    <ul className="site-editorial-footer-links">
                        {LINKS.map((link) => (
                            <li key={link.name}>
                                <Link
                                    className="site-editorial-footer-link"
                                    href={link.href}
                                >
                                    <span>{link.name}</span>
                                    <small>{link.description}</small>
                                    <ArrowUpRight aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <Link
                    href="/"
                    className="site-editorial-footer-name"
                    aria-label="Gibson Murray home"
                >
                    Gibson <em>Murray</em>
                </Link>
                <div className="site-editorial-footer-meta">
                    <p>© {new Date().getFullYear()} Gibson Murray</p>
                    <Link
                        href="/"
                        className="site-editorial-footer-mark"
                        aria-label="Gibson Murray home"
                    >
                        <LogoIcon />
                    </Link>
                    <a
                        href="https://github.com/gibsonmurray"
                        target="_blank"
                        rel="noreferrer"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    )
}
