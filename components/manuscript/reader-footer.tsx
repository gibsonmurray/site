"use client"

import { useEffect, useState, type ComponentType } from "react"
import { motion, useReducedMotion } from "motion/react"
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa"
import { LuBookOpen, LuMail } from "react-icons/lu"
import { SiSubstack } from "react-icons/si"

const LINKS_REVEAL = {
    hidden: {
        transition: {
            staggerChildren: 0.1,
            staggerDirection: -1,
        },
    },
    visible: {
        transition: {
            delayChildren: 0.12,
            staggerChildren: 0.14,
        },
    },
}

const LINK_REVEAL = {
    hidden: { opacity: 0, x: -32, y: 8 },
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { type: "spring" as const, stiffness: 210, damping: 22 },
    },
}

const READING_REVEAL = {
    hidden: LINK_REVEAL.hidden,
    visible: {
        ...LINK_REVEAL.visible,
        transition: { ...LINK_REVEAL.visible.transition, delay: 1.22 },
    },
}

const LISTENING_REVEAL = {
    hidden: LINK_REVEAL.hidden,
    visible: {
        ...LINK_REVEAL.visible,
        transition: { ...LINK_REVEAL.visible.transition, delay: 1.68 },
    },
}

type CurrentlyReading = {
    title: string
    author: string
    cover: string
    url: string
}

const CURRENTLY_READING_FALLBACK: CurrentlyReading = {
    title: "Mr. Mercedes (Bill Hodges #1)",
    author: "Stephen King",
    cover: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1420938311l/21558901.jpg",
    url: "https://www.goodreads.com/book/show/21558901-mr-mercedes",
}

type RecentlyPlayed = {
    title: string
    artist: string
    cover: string
    url: string
}

const RECENTLY_PLAYED_FALLBACK: RecentlyPlayed = {
    title: "HOLD STILL",
    artist: "The Kid LAROI",
    cover: "https://i1.sndcdn.com/artworks-yXkV7hohH4f5-0-t500x500.jpg",
    url: "https://open.spotify.com/",
}

type SiteLink = {
    external?: boolean
    href: string
    icon: ComponentType<{ "aria-hidden": true; className?: string }>
    iconClassName?: string
    label: string
}

function GoodreadsIcon({ className }: { "aria-hidden": true; className?: string }) {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            aria-hidden="true"
            alt=""
            className={className}
            src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/goodreads/default.svg"
        />
    )
}

const SITE_LINKS: SiteLink[] = [
    {
        external: true,
        href: "https://a.co/d/03Co6ZxH",
        icon: LuBookOpen,
        label: "Order Walls",
    },
    {
        external: true,
        href: "https://www.goodreads.com/user/show/196455087",
        icon: GoodreadsIcon,
        iconClassName: "goodreads-icon",
        label: "Goodreads",
    },
    {
        external: true,
        href: "https://github.com/gibsonmurray",
        icon: FaGithub,
        label: "GitHub",
    },
    {
        external: true,
        href: "https://www.instagram.com/gibson.murray/",
        icon: FaInstagram,
        label: "Instagram",
    },
    {
        external: true,
        href: "https://linkedin.com/in/gibsonmurray/",
        icon: FaLinkedin,
        label: "LinkedIn",
    },
    {
        external: true,
        href: "https://substack.com/@gibsonmurray",
        icon: SiSubstack,
        iconClassName: "substack-icon",
        label: "Substack",
    },
    {
        href: "mailto:hi@gibsonmurray.com",
        icon: LuMail,
        label: "Email",
    },
]

function useRemoteValue<T>(endpoint: string, fallback: T): T {
    const [value, setValue] = useState(fallback)

    useEffect(() => {
        const controller = new AbortController()

        fetch(endpoint, { signal: controller.signal })
            .then((response) => {
                if (!response.ok) throw new Error(`${endpoint} returned ${response.status}`)
                return response.json() as Promise<T>
            })
            .then(setValue)
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === "AbortError") return
            })

        return () => controller.abort()
    }, [endpoint])

    return value
}

function BookIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 7v14" />
            <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
        </svg>
    )
}

function MusicIcon() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
        </svg>
    )
}

function AnimatedExternalLinkIcon() {
    const reduceMotion = useReducedMotion()

    return (
        <motion.svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <motion.g
                animate={{
                    x: reduceMotion ? 0 : [0, 2, 0],
                    y: reduceMotion ? 0 : [0, -2, 0],
                }}
                transition={{
                    duration: 0.7,
                    ease: "easeInOut",
                    repeat: reduceMotion ? 0 : Infinity,
                    repeatDelay: 1.5,
                }}
            >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
            </motion.g>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </motion.svg>
    )
}

export function ReaderFooter({ visible }: { visible: boolean }) {
    const currentlyReading = useRemoteValue("/api/currently-reading", CURRENTLY_READING_FALLBACK)
    const recentlyPlayed = useRemoteValue("/api/recently-played", RECENTLY_PLAYED_FALLBACK)

    return (
        <>
            <motion.nav
                className="site-links"
                aria-label="Elsewhere"
                animate={visible ? "visible" : "hidden"}
                initial="hidden"
                variants={LINKS_REVEAL}
            >
                {SITE_LINKS.map(({ external, href, icon: Icon, iconClassName, label }) => (
                    <motion.a
                        href={href}
                        key={href}
                        rel={external ? "noreferrer" : undefined}
                        target={external ? "_blank" : undefined}
                        variants={LINK_REVEAL}
                    >
                        <span>{label}</span>
                        <Icon aria-hidden={true} className={iconClassName} />
                    </motion.a>
                ))}
            </motion.nav>
            <motion.section
                className="currently-reading"
                aria-labelledby="currently-reading-title"
                animate={visible ? "visible" : "hidden"}
                initial="hidden"
                variants={READING_REVEAL}
            >
                {/* The cover URL is supplied at runtime by Goodreads. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className="currently-reading-cover"
                    src={currentlyReading.cover}
                    alt={`Cover of ${currentlyReading.title} by ${currentlyReading.author}`}
                />
                <div className="currently-reading-copy">
                    <motion.p className="currently-reading-label" initial="hidden" whileHover="visible">
                        <BookIcon />
                        Currently reading
                    </motion.p>
                    <motion.a
                        id="currently-reading-title"
                        href={currentlyReading.url}
                        target="_blank"
                        rel="noreferrer"
                        initial="hidden"
                        whileHover="visible"
                        whileFocus="visible"
                    >
                        <span>{currentlyReading.title}</span>
                        <AnimatedExternalLinkIcon />
                    </motion.a>
                    <p className="currently-reading-author">by {currentlyReading.author}</p>
                </div>
            </motion.section>
            <motion.section
                className="recently-played"
                aria-labelledby="recently-played-title"
                animate={visible ? "visible" : "hidden"}
                initial="hidden"
                variants={LISTENING_REVEAL}
            >
                {/* The cover URL is supplied at runtime by Spotify. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className="recently-played-cover"
                    src={recentlyPlayed.cover}
                    alt={`Cover art for ${recentlyPlayed.title} by ${recentlyPlayed.artist}`}
                />
                <div className="recently-played-copy">
                    <p className="recently-played-label">
                        <MusicIcon />
                        Recently played
                    </p>
                    <motion.a
                        id="recently-played-title"
                        href={recentlyPlayed.url}
                        target="_blank"
                        rel="noreferrer"
                        initial="hidden"
                        whileHover="visible"
                        whileFocus="visible"
                    >
                        <span>{recentlyPlayed.title}</span>
                        <AnimatedExternalLinkIcon />
                    </motion.a>
                    <p className="recently-played-artist">by {recentlyPlayed.artist}</p>
                </div>
            </motion.section>
            <footer className="site-copyright">© 2026 Gibson Murray</footer>
        </>
    )
}
