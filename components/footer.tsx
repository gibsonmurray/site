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
        <footer className="mb-16 mt-auto">
            <ul className="font-sm mt-8 flex flex-col space-y-2 space-x-0 md:flex-row md:space-y-0 md:space-x-4">
                {LINKS.map((link) => (
                    <li key={link.name}>
                        <a
                            className="flex items-center transition-all"
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
            <p className="mt-8">© {new Date().getFullYear()} Gibson Murray</p>
        </footer>
    )
}

export default Footer
