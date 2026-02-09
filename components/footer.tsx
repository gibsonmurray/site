import { ArrowUpRightIcon } from "lucide-react"

const LINKS = [
    {
        name: "rss",
        href: "/rss",
    },
    {
        name: "github",
        href: "https://github.com/gibsonmurray",
    },
    {
        name: "view source",
        href: "https://github.com/gibsonmurray/site",
    },
]

export const Footer = () => {
    return (
        <footer className="mb-16">
            <ul className="font-sm mt-8 flex flex-col space-y-2 space-x-0 text-neutral-600 md:flex-row md:space-y-0 md:space-x-4 dark:text-neutral-300">
                {LINKS.map((link) => (
                    <li key={link.name}>
                        <a
                            className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
                            rel="noopener noreferrer"
                            target="_blank"
                            href={link.href}
                        >
                            <ArrowUpRightIcon />
                            <p className="ml-2 h-7">{link.name}</p>
                        </a>
                    </li>
                ))}
            </ul>
            <p className="mt-8 text-neutral-600 dark:text-neutral-300">
                © {new Date().getFullYear()} Gibson Murray
            </p>
        </footer>
    )
}

export default Footer
