"use client"

import {
    useEffect,
    useRef,
    useState,
    type AnchorHTMLAttributes,
    type ReactNode,
} from "react"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowUpRight,
    BookOpenText,
    BriefcaseBusiness,
    Braces,
    GraduationCap,
    GitBranch,
    Mail,
    MonitorPlay,
} from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = {
    github: "https://github.com/gibsonmurray",
    x: "https://x.com/gibsonmurray",
    substack: "https://substack.com/@gibsonmurray",
    email: "mailto:hi@gibsonmurray.com",
    amazon: "https://www.amazon.com/Walls-Gibson-Murray/dp/B0H29YDQ61",
    verbatim: "https://verbatim.gibsonmurray.com",
    resumePdf: "/media/murray-gibson-resume-07062026.pdf",
}

const navItems = [
    { label: "books", href: "#books" },
    { label: "resume", href: "#resume" },
    { label: "code", href: "#work" },
    { label: "writing", href: links.substack, external: true },
]

const focusItems = ["walls", "biblical fiction", "substack", "resume", "verbatim"]

const bookMeta = [
    ["genre", "biblical fiction"],
    ["format", "paperback + Kindle"],
    ["signal", "faith, pressure, hidden battles"],
]

const resumeSkillGroups = [
    {
        label: "languages",
        values: ["TypeScript", "JavaScript", "Python", "Bash"],
    },
    {
        label: "frameworks",
        values: ["React.js", "Next.js", "Node.js", "Django"],
    },
    {
        label: "tools",
        values: ["Git", "AWS", "GCP", "Codex", "Claude Code"],
    },
    {
        label: "concepts",
        values: ["AI", "CI/CD", "APIs", "DX", "UX", "Compilers"],
    },
]

const resumeExperience = [
    {
        role: "Front-End Software Engineer",
        org: "Republican National Committee",
        dates: "Jul 2024 - Present",
        place: "Washington, D.C.",
        bullets: [
            "Led an AI platform for RAG, code-gen, and multi-model eval used by 3 teams across RNC HQ; reduced content turnaround by 50%.",
            "Shipped 3 presidential campaign microsites in 3 weeks; peaked at 20k concurrent users; covered by Fox News; no downtime.",
        ],
    },
    {
        role: "Founding Chief Product Officer",
        org: "Cosmera Studio",
        dates: "Aug 2024 - Jun 2025",
        place: "Remote, USA",
        bullets: [
            "Owned front-end design, app software development, and product strategy.",
            "Shipped B2B SaaS for cosmetic brands with personalized surveys via custom AI agents.",
        ],
    },
    {
        role: "Front-End Software Engineering Intern",
        org: "Pivotal Consulting Group",
        dates: "Dec 2023 - Feb 2024",
        place: "Remote, USA",
        bullets: [
            "Implemented internal data analytics software with Next.js and React.js.",
            "Built an aesthetic dashboard UI with Recharts and shadcn for consistent styling.",
        ],
    },
]

const otherExperience = [
    {
        title: "Codepen Portfolio",
        detail: "JavaScript, TypeScript, HTML, CSS, React, Figma",
        bullets: [
            "300+ followers and 2000+ likes/saves from code examples for beginners.",
            "Parallax effects, mouse animations, and scroll-triggered interactions.",
        ],
    },
    {
        title: "Passion City Church, DC",
        detail: "Doorholder / Stage Production Team",
        bullets: [
            "Sundays supporting two back-to-back services with live stage changes.",
            "Band and speaker coordination, setup, teardown, and production handoffs.",
        ],
    },
]

const connectLinks = [
    {
        label: "github",
        href: links.github,
        meta: "code + experiments",
        icon: GitBranch,
    },
    {
        label: "x.com",
        href: links.x,
        meta: "notes in public",
        icon: Braces,
    },
    {
        label: "substack",
        href: links.substack,
        meta: "essays + reflections",
        icon: BookOpenText,
    },
    {
        label: "email",
        href: links.email,
        meta: "hi@gibsonmurray.com",
        icon: Mail,
    },
]

function useScrambleText(value: string) {
    const prefersReducedMotion = useReducedMotion()
    const [display, setDisplay] = useState(value)
    const intervalRef = useRef<number | null>(null)

    const stop = () => {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        setDisplay(value)
    }

    const start = () => {
        if (prefersReducedMotion) {
            return
        }

        stop()
        let frame = 0
        const glyphs = "01<>[]{}#$%/\\"

        intervalRef.current = window.setInterval(() => {
            setDisplay(
                value
                    .split("")
                    .map((character, index) => {
                        if (character === " ") {
                            return " "
                        }
                        if (index < frame / 2) {
                            return character
                        }
                        return glyphs[
                            Math.floor(Math.random() * glyphs.length)
                        ]
                    })
                    .join(""),
            )

            frame += 1

            if (frame > value.length * 2) {
                stop()
            }
        }, 26)
    }

    useEffect(
        () => () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current)
            }
        },
        [],
    )

    return { display, start, stop }
}

type HackerLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    label: string
    external?: boolean
}

function HackerTextLink({
    label,
    external,
    className,
    ...props
}: HackerLinkProps) {
    const { display, start, stop } = useScrambleText(label)

    return (
        <a
            {...props}
            target={external ? "_blank" : props.target}
            rel={external ? "noreferrer" : props.rel}
            className={cn("hacker-link", className)}
            aria-label={label}
            onMouseEnter={start}
            onMouseLeave={stop}
            onFocus={start}
            onBlur={stop}
        >
            <span aria-hidden="true">{display}</span>
            <span className="sr-only">{label}</span>
        </a>
    )
}

function HackerButtonLink({
    label,
    href,
    external,
}: {
    label: string
    href: string
    external?: boolean
}) {
    const { display, start, stop } = useScrambleText(label)

    return (
        <Button
            nativeButton={false}
            render={
                <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    aria-label={label}
                    onMouseEnter={start}
                    onMouseLeave={stop}
                    onFocus={start}
                    onBlur={stop}
                />
            }
            variant="outline"
            size="lg"
            className="hacker-button"
        >
            <span aria-hidden="true">&gt;</span>
            <span aria-hidden="true">{display}</span>
            <span className="sr-only">{label}</span>
            <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
        </Button>
    )
}

function SectionFrame({
    id,
    number,
    title,
    children,
    className,
}: {
    id?: string
    number: string
    title: string
    children: ReactNode
    className?: string
}) {
    return (
        <motion.section
            id={id}
            className={cn("section-frame", className)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="section-label">
                <span>[ {number} ]</span>
                <p>{title}</p>
            </div>
            {children}
        </motion.section>
    )
}

function Header() {
    return (
        <header className="site-header">
            <Link className="brand-mark" href="/" aria-label="Gibson Murray home">
                <span aria-hidden="true">&gt;</span>
                <strong>gibson.murray</strong>
            </Link>
            <nav aria-label="Primary navigation">
                {navItems.map((item) => (
                    <HackerTextLink
                        key={item.label}
                        href={item.href}
                        label={item.label}
                        external={item.external}
                    />
                ))}
            </nav>
        </header>
    )
}

function BookHeroPanel() {
    return (
        <motion.div
            className="book-hero-panel"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="book-hero-grid" aria-hidden="true" />
            <div className="book-hero-art">
                <Image
                    src="/media/walls-mock-1.png"
                    alt="Walls book mockup"
                    width={4000}
                    height={3200}
                    sizes="(max-width: 1080px) 100vw, 44vw"
                    priority
                />
            </div>
            <div className="book-terminal">
                <div className="window-bar">
                    <span />
                    <span />
                    <span />
                    <p>books.ts</p>
                </div>
                <pre aria-label="Current Gibson Murray book">
                    <code>
                        <span className="line comment">{"// current shelf"}</span>
                        <span className="line">
                            <span className="line-number">01</span>
                            <span className="token-code">title = </span>
                            <span className="token-string">&quot;Walls&quot;</span>
                        </span>
                        <span className="line">
                            <span className="line-number">02</span>
                            <span className="token-code">genre = </span>
                            <span className="token-string">&quot;biblical fiction&quot;</span>
                        </span>
                        <span className="line">
                            <span className="line-number">03</span>
                            <span className="token-code">theme = </span>
                            <span className="token-string">&quot;faith under pressure&quot;</span>
                        </span>
                        <span className="line">
                            <span className="line-number">04</span>
                            <span className="token-code">status = </span>
                            <span className="token-string">&quot;available now&quot;</span>
                        </span>
                        <span className="line comment">
                            {"// code supports the words"}
                        </span>
                        <span className="line">
                            <span className="line-number">06</span>
                            <span className="token-code">next = </span>
                            <span className="token-string">&quot;read / build / repeat&quot;</span>
                        </span>
                    </code>
                </pre>
            </div>
        </motion.div>
    )
}

function TimelineItem({
    item,
}: {
    item: (typeof resumeExperience)[number]
}) {
    return (
        <article className="resume-timeline-item">
            <div className="resume-item-top">
                <span>{item.dates}</span>
                <small>{item.place}</small>
            </div>
            <h3>{item.role}</h3>
            <p>{item.org}</p>
            <ul>
                {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                ))}
            </ul>
        </article>
    )
}

function ResumeSection() {
    return (
        <motion.section
            id="resume"
            className="resume-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="section-label">
                <span>[ 02 ]</span>
                <p>resume.ts</p>
            </div>
            <div className="resume-shell">
                <div className="resume-summary">
                    <BriefcaseBusiness aria-hidden="true" />
                    <span className="resume-path">/career/gibson-murray</span>
                    <h2>
                        Front-end engineer building AI tools, campaign sites,
                        and polished product interfaces.
                    </h2>
                    <p>
                        TypeScript and React developer with product instincts,
                        a CS foundation, and experience shipping software under
                        real public pressure.
                    </p>
                    <div className="resume-actions">
                        <HackerTextLink
                            href={links.resumePdf}
                            label="download PDF"
                            target="_blank"
                        />
                        <HackerTextLink
                            href="mailto:gibmurrays@gmail.com"
                            label="email"
                        />
                    </div>
                </div>

                <div className="resume-skills" aria-label="Technical skills">
                    {resumeSkillGroups.map((group) => (
                        <div className="resume-skill-card" key={group.label}>
                            <span>{group.label}</span>
                            <p>{group.values.join(" / ")}</p>
                        </div>
                    ))}
                </div>

                <div className="resume-timeline" aria-label="Work experience">
                    {resumeExperience.map((item) => (
                        <TimelineItem item={item} key={`${item.org}-${item.role}`} />
                    ))}
                </div>

                <div className="resume-lower-grid">
                    <article className="resume-education">
                        <GraduationCap aria-hidden="true" />
                        <span>education</span>
                        <h3>University of Maryland</h3>
                        <p>Bachelor of Science, Computer Science</p>
                        <small>
                            Algorithms, data structures, compilers, web
                            development, mobile development, security, and
                            immersive media design.
                        </small>
                    </article>
                    <div className="resume-other">
                        {otherExperience.map((item) => (
                            <article key={item.title}>
                                <span>other experience</span>
                                <h3>{item.title}</h3>
                                <p>{item.detail}</p>
                                <ul>
                                    {item.bullets.map((bullet) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

function Hero() {
    return (
        <section className="hero">
            <motion.div
                className="hero-copy"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
                <Badge variant="outline" className="hero-badge">
                    {"// books-first portfolio"}
                </Badge>
                <h1>
                    I write biblical fiction and build software for{" "}
                    <span>focused</span> readers.
                </h1>
                <p>
                    I write biblical fiction and build careful software around
                    Scripture, reading, and focused practice.
                </p>
                <div className="hero-actions">
                    <HackerButtonLink
                        label="buy Walls"
                        href={links.amazon}
                        external
                    />
                    <HackerButtonLink
                        label="read Substack"
                        href={links.substack}
                        external
                    />
                    <HackerButtonLink label="view resume" href="#resume" />
                </div>
            </motion.div>
            <BookHeroPanel />
        </section>
    )
}

function AboutSection() {
    return (
        <SectionFrame number="03" title="about">
            <div className="about-copy">
                <p>
                    I&apos;m a software engineer who likes clean interfaces,
                    thoughtful systems, exact words, and products that leave
                    people with more attention than they started with.
                </p>
                <p>
                    I write biblical fiction, share reflections on Scripture and
                    ordinary life, and build small web tools for memorization,
                    reading, and focused practice.
                </p>
                <span>&lt; based in Washington, DC /&gt;</span>
            </div>
        </SectionFrame>
    )
}

function WorkSection() {
    return (
        <SectionFrame id="work" number="04" title="code work">
            <div className="work-panel">
                <div className="work-preview">
                    <Image
                        src="/media/verbatim-app-desktop.png"
                        alt="Verbatim Scripture memorization app interface"
                        width={2880}
                        height={1920}
                        sizes="(max-width: 1080px) 100vw, 38vw"
                        priority
                    />
                    <div className="work-preview-meta">
                        <span>wpm 47</span>
                        <span>accuracy 98%</span>
                        <span>time 1:32</span>
                    </div>
                </div>
                <div className="work-copy">
                    <div className="work-title-row">
                        <MonitorPlay aria-hidden="true" />
                        <h2>Verbatim</h2>
                    </div>
                    <p className="green">Scripture memorization</p>
                    <p>
                        A minimalist typing app that helps you memorize any
                        exact text with realtime feedback.
                    </p>
                    <div className="work-links">
                        <HackerTextLink
                            href={links.verbatim}
                            label="live demo"
                            external
                        />
                        <HackerTextLink
                            href={links.github}
                            label="github"
                            external
                        />
                    </div>
                </div>
            </div>
        </SectionFrame>
    )
}

function BookSection() {
    return (
        <SectionFrame id="books" number="01" title="books" className="book-section">
            <div className="book-feature-panel">
                <div className="book-feature-art">
                    <Image
                        src="/media/walls-cover-ebook.png"
                        alt="Walls book cover"
                        width={1600}
                        height={2560}
                        sizes="(max-width: 720px) 72vw, 24vw"
                    />
                </div>
                <div className="book-feature-copy">
                    <BookOpenText aria-hidden="true" />
                    <span>latest book</span>
                    <h2>Walls</h2>
                    <p>
                        Biblical fiction about unlikely alliances, faith
                        tested, and hidden battles that decided the course of
                        history.
                    </p>
                    <div className="book-meta-grid">
                        {bookMeta.map(([label, value]) => (
                            <div key={label}>
                                <small>{label}</small>
                                <strong>{value}</strong>
                            </div>
                        ))}
                    </div>
                    <div className="work-links">
                        <HackerTextLink
                            href={links.amazon}
                            label="buy on Amazon"
                            external
                        />
                        <HackerTextLink
                            href={links.substack}
                            label="read more writing"
                            external
                        />
                    </div>
                </div>
            </div>
        </SectionFrame>
    )
}

function ConnectSection() {
    return (
        <section className="connect-section">
            <div className="section-label">
                <span>[ 05 ]</span>
                <p>connect</p>
            </div>
            <div className="connect-grid">
                {connectLinks.map((item) => {
                    const Icon = item.icon
                    return (
                        <a
                            href={item.href}
                            key={item.label}
                            target={
                                item.href.startsWith("mailto:")
                                    ? undefined
                                    : "_blank"
                            }
                            rel={
                                item.href.startsWith("mailto:")
                                    ? undefined
                                    : "noreferrer"
                            }
                            className="connect-link"
                        >
                            <Icon aria-hidden="true" />
                            <span>
                                <strong>{item.label}</strong>
                                <small>{item.meta}</small>
                            </span>
                            <ArrowUpRight aria-hidden="true" />
                        </a>
                    )
                })}
            </div>
        </section>
    )
}

function FocusRail() {
    return (
        <div className="focus-rail" aria-hidden="true">
            {focusItems.map((item) => (
                <span key={item}>{item}</span>
            ))}
        </div>
    )
}

export function HomePage() {
    return (
        <main className="site-shell">
            <Header />
            <div className="site-container">
                <Hero />
                <FocusRail />
                <BookSection />
                <ResumeSection />
                <div className="content-grid">
                    <AboutSection />
                    <WorkSection />
                </div>
                <ConnectSection />
                <footer className="site-footer">
                    <p>© 2026 Gibson Murray</p>
                    <HackerTextLink href={links.email} label="hi@gibsonmurray.com" />
                </footer>
            </div>
        </main>
    )
}
