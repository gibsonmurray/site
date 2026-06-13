import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowUpRight, BookOpenText, Headphones } from "lucide-react"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { formatDate, getBlogPosts, getReadingTime } from "@/app/blog/utils"
import { baseUrl } from "@/app/sitemap"
import { latestBook } from "@/lib/books"
import { currentlyReading } from "@/lib/currently-reading"
import { currentlyListening } from "@/lib/currently-listening"
import {
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_TITLE,
    defaultOgImage,
    makeBreadcrumbSchema,
} from "@/lib/seo"

export const metadata: Metadata = {
    title: {
        absolute: SITE_TITLE,
    },
    description: SITE_DESCRIPTION,
    alternates: {
        canonical: baseUrl,
        types: {
            "application/rss+xml": `${baseUrl}/rss`,
        },
    },
    openGraph: {
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        url: baseUrl,
        type: "website",
        images: [
            {
                url: defaultOgImage,
                alt: "Gibson Murray biblical fiction and writing",
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        images: [defaultOgImage],
    },
}

const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebPage",
            "@id": `${baseUrl}/#webpage`,
            url: baseUrl,
            name: SITE_TITLE,
            description: SITE_DESCRIPTION,
            inLanguage: "en-US",
            isPartOf: {
                "@id": `${baseUrl}/#website`,
            },
            about: {
                "@id": `${baseUrl}/#person`,
            },
            primaryImageOfPage: {
                "@type": "ImageObject",
                url: defaultOgImage,
            },
        },
        makeBreadcrumbSchema(
            [
                {
                    name: SITE_NAME,
                    url: baseUrl,
                },
            ],
            `${baseUrl}/#breadcrumb`,
        ),
    ],
}

const EditorialLink = ({
    href,
    children,
    external = false,
}: {
    href: string
    children: React.ReactNode
    external?: boolean
}) => (
    <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="home-editorial-link"
    >
        {children}
        <ArrowUpRight aria-hidden="true" />
    </Link>
)

const SectionLabel = ({
    number,
    children,
}: {
    number: string
    children: React.ReactNode
}) => (
    <div className="home-section-label">
        <span>{number}</span>
        <i aria-hidden="true" />
        <p>{children}</p>
    </div>
)

const Home = () => {
    const latestPosts = getBlogPosts(true, 2)

    return (
        <div className="home-editorial overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(homeJsonLd),
                }}
            />

            <section className="home-hero">
                <div className="home-hero-copy">
                    <h1 className="home-display">
                        <span>Stories shaped</span>
                        <span>by Scripture.</span>
                        <em>Built with care.</em>
                    </h1>
                    <p className="home-hero-intro home-hero-reveal">
                        I write biblical fiction and reflections on faith, then
                        build thoughtful software for the things worth
                        remembering.
                    </p>
                    <div className="home-hero-actions home-hero-reveal">
                        <EditorialLink href="/books">
                            Explore books
                        </EditorialLink>
                        <EditorialLink href="/writings">
                            Read latest
                        </EditorialLink>
                    </div>
                </div>

                <div className="home-hero-art home-hero-reveal">
                    <div className="home-hero-halo" aria-hidden="true" />
                    <Image
                        src={latestBook.images?.[0] ?? latestBook.coverImageSrc}
                        alt={latestBook.coverImageAlt}
                        width={950}
                        height={950}
                        sizes="(min-width: 1024px) 44vw, 88vw"
                        className="home-hero-book"
                        priority
                    />
                </div>

                <a href="#featured-book" className="home-scroll-cue">
                    <span>Scroll</span>
                    <ArrowDown aria-hidden="true" />
                </a>
            </section>

            <div className="home-marquee" aria-hidden="true">
                <div className="home-marquee-track">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <span key={index}>
                            Scripture <i>·</i> Story <i>·</i> Software <i>·</i>{" "}
                            Faith <i>·</i> Fiction <i>·</i>
                        </span>
                    ))}
                </div>
            </div>

            <section id="featured-book" className="home-section home-reveal">
                <SectionLabel number="01">Featured book</SectionLabel>
                <div className="home-book-feature">
                    <Link
                        href={`/books/${latestBook.slug}`}
                        className="home-book-media"
                    >
                        <Image
                            src={latestBook.coverImageSrc}
                            alt={latestBook.coverImageAlt}
                            width={520}
                            height={780}
                            sizes="(min-width: 1024px) 28vw, 70vw"
                            className="home-book-cover"
                        />
                    </Link>
                    <div className="home-book-copy">
                        <p className="home-kicker">
                            {latestBook.genre} · {latestBook.status.label}
                        </p>
                        <h2 className="home-section-title">
                            <em>{latestBook.title}</em>
                        </h2>
                        <p className="home-lead">
                            {latestBook.shortDescription}
                        </p>
                        <p className="home-body-copy">
                            A story of unlikely alliances, tested faith, and the
                            hidden battles inside a city waiting for its walls
                            to fall.
                        </p>
                        <div className="home-link-row">
                            <EditorialLink href={`/books/${latestBook.slug}`}>
                                Learn more
                            </EditorialLink>
                            <EditorialLink href={`/books/${latestBook.slug}`}>
                                Purchase options
                            </EditorialLink>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-section home-reveal">
                <SectionLabel number="02">Latest writing</SectionLabel>
                <div className="home-writing-list">
                    {latestPosts.map((post, index) => (
                        <Link
                            key={post.slug}
                            href={`/writings/${post.slug}`}
                            className="home-writing-row"
                        >
                            <span className="home-writing-number">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="home-writing-main">
                                <span>{post.metadata.title}</span>
                                <small>{post.metadata.summary}</small>
                            </span>
                            <span className="home-writing-meta">
                                {formatDate(post.metadata.publishedAt, false)}
                                <i>·</i>
                                {getReadingTime(post.content)}
                            </span>
                            <ArrowUpRight aria-hidden="true" />
                        </Link>
                    ))}
                </div>
            </section>

            <section className="home-verbatim home-reveal">
                <div className="home-section home-verbatim-inner">
                    <SectionLabel number="03">Verbatim</SectionLabel>
                    <div className="home-verbatim-grid">
                        <div className="home-verbatim-copy">
                            <h2 className="home-section-title">
                                Memorize Scripture, <em>exactly.</em>
                            </h2>
                            <p className="home-body-copy">
                                Verbatim turns Scripture memory into a live
                                typing practice, checking every character as you
                                bring a passage back from memory.
                            </p>
                            <EditorialLink href="/verbatim">
                                Explore Verbatim
                            </EditorialLink>
                        </div>
                        <div className="home-verbatim-media">
                            <Image
                                src="/verbatim/app-desktop.png"
                                alt="Verbatim Scripture memorization practice"
                                width={2880}
                                height={1920}
                                sizes="(min-width: 1024px) 56vw, 92vw"
                                className="home-verbatim-image"
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-section home-reveal">
                <SectionLabel number="04">About</SectionLabel>
                <div className="home-about-grid">
                    <div className="home-about-photo">
                        <Image
                            src="/headshot.jpeg"
                            alt="Gibson Murray"
                            width={720}
                            height={720}
                            sizes="(min-width: 1024px) 28vw, 70vw"
                            className="home-about-image"
                        />
                    </div>
                    <div className="home-about-copy">
                        <h2 className="home-section-title">
                            I&apos;m a Christian author and software engineer,
                            paying attention to the places{" "}
                            <em>faith becomes ordinary.</em>
                        </h2>
                        <p className="home-body-copy">
                            I write books and reflections about Scripture,
                            story, courage, and the patient work of grace. I
                            also build software that helps useful things get out
                            of the way.
                        </p>
                        <div className="home-about-notes">
                            <span>Based in Washington, DC</span>
                            <span>Serving at Passion City Church DC</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-section home-currently home-reveal">
                <SectionLabel number="05">Currently</SectionLabel>
                <div className="home-currently-grid">
                    {currentlyReading && (
                        <article className="home-current-item">
                            <p className="home-current-label">
                                <BookOpenText aria-hidden="true" />
                                Reading
                            </p>
                            <div className="home-reading-content">
                                <Link
                                    href={currentlyReading.url ?? "#"}
                                    target={
                                        currentlyReading.url
                                            ? "_blank"
                                            : undefined
                                    }
                                    rel={
                                        currentlyReading.url
                                            ? "noopener noreferrer"
                                            : undefined
                                    }
                                >
                                    <Image
                                        src={currentlyReading.coverImageSrc}
                                        alt={currentlyReading.coverImageAlt}
                                        width={200}
                                        height={300}
                                        className="home-reading-cover"
                                    />
                                </Link>
                                <div>
                                    <h3>{currentlyReading.title}</h3>
                                    <p>{currentlyReading.author}</p>
                                    {currentlyReading.finishedPercent !==
                                        undefined && (
                                        <div className="home-progress">
                                            <span>
                                                {
                                                    currentlyReading.finishedPercent
                                                }
                                                % complete
                                            </span>
                                            <div>
                                                <i
                                                    style={{
                                                        width: `${currentlyReading.finishedPercent}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    )}

                    {currentlyListening && (
                        <article className="home-current-item home-listening">
                            <p className="home-current-label">
                                <Headphones aria-hidden="true" />
                                Listening
                            </p>
                            <div className="home-listening-content">
                                {currentlyListening.coverImageSrc &&
                                currentlyListening.coverImageAlt ? (
                                    <Link
                                        href={currentlyListening.url ?? "#"}
                                        target={
                                            currentlyListening.url
                                                ? "_blank"
                                                : undefined
                                        }
                                        rel={
                                            currentlyListening.url
                                                ? "noopener noreferrer"
                                                : undefined
                                        }
                                    >
                                        <Image
                                            src={
                                                currentlyListening.coverImageSrc
                                            }
                                            alt={
                                                currentlyListening.coverImageAlt
                                            }
                                            width={300}
                                            height={300}
                                            className="home-album-cover"
                                        />
                                    </Link>
                                ) : (
                                    <div
                                        className="home-album-art"
                                        aria-hidden="true"
                                    >
                                        <span>
                                            {currentlyListening.artist
                                                .split(/\s+/)
                                                .map((word) => word[0])
                                                .join("")
                                                .slice(0, 2)}
                                        </span>
                                        <i />
                                    </div>
                                )}
                                <div>
                                    <h3>{currentlyListening.title}</h3>
                                    <p>{currentlyListening.artist}</p>
                                    <div
                                        className="home-equalizer"
                                        aria-label="Now playing"
                                    >
                                        {Array.from({ length: 20 }).map(
                                            (_, index) => (
                                                <i key={index} />
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </article>
                    )}
                </div>
            </section>

            <section className="home-newsletter">
                <div className="home-section home-newsletter-inner">
                    <div>
                        <p className="home-kicker">Occasional letters</p>
                        <h2 className="home-section-title">
                            Notes from <em>the desk.</em>
                        </h2>
                        <p>
                            Book updates, biblical reflections, essays, and
                            occasional dispatches. No noise.
                        </p>
                    </div>
                    <NewsletterSignup variant="minimal" />
                </div>
            </section>
        </div>
    )
}

export default Home
