import { baseUrl } from "@/app/sitemap"
import { apps, featuredApp } from "@/lib/apps"
import {
    APPS_DESCRIPTION,
    AUTHOR_NAME,
    SITE_NAME,
    absoluteUrl,
    makeBreadcrumbSchema,
    makeOgImage,
} from "@/lib/seo"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowRight,
    CheckCircle2,
    ExternalLink,
    Keyboard,
    Sparkles,
    type LucideIcon,
} from "lucide-react"

const appsTitle = `Apps by ${SITE_NAME}`
const appsOgImage = makeOgImage({
    title: appsTitle,
    subtitle: "Thoughtful software for Scripture, story, and exact words.",
    image: featuredApp.desktopImageSrc,
})

const principles: {
    icon: LucideIcon
    title: string
    copy: string
}[] = [
    {
        icon: Keyboard,
        title: "Built around practice.",
        copy: "Tools should help you do the thing itself, with less ceremony and clearer feedback.",
    },
    {
        icon: CheckCircle2,
        title: "Small details matter.",
        copy: "The interface gets out of the way, but it still notices exactness, progress, and drift.",
    },
    {
        icon: Sparkles,
        title: "Quiet by default.",
        copy: "No heavy dashboards when a focused loop, a clean screen, and a next attempt will do.",
    },
]

export const metadata: Metadata = {
    title: {
        absolute: appsTitle,
    },
    description: APPS_DESCRIPTION,
    authors: [{ name: AUTHOR_NAME, url: baseUrl }],
    keywords: [
        "Gibson Murray apps",
        "Christian software",
        "Scripture memorization app",
        "Bible verse memorization app",
        "Verbatim app",
        "typing memorization app",
    ],
    alternates: {
        canonical: `${baseUrl}/apps`,
    },
    openGraph: {
        title: appsTitle,
        description: APPS_DESCRIPTION,
        url: `${baseUrl}/apps`,
        siteName: SITE_NAME,
        locale: "en_US",
        type: "website",
        images: [
            {
                url: appsOgImage,
                alt: "Apps by Gibson Murray, featuring Verbatim",
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: appsTitle,
        description: APPS_DESCRIPTION,
        creator: "@gibsonmurray",
        images: [appsOgImage],
    },
}

const AppsPage = () => {
    const appsUrl = `${baseUrl}/apps`
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${appsUrl}#webpage`,
                url: appsUrl,
                name: appsTitle,
                description: APPS_DESCRIPTION,
                inLanguage: "en-US",
                isPartOf: {
                    "@id": `${baseUrl}/#website`,
                },
                mainEntity: {
                    "@id": `${appsUrl}#apps`,
                },
            },
            {
                "@type": "ItemList",
                "@id": `${appsUrl}#apps`,
                name: appsTitle,
                itemListElement: apps.map((app, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${baseUrl}${app.href}`,
                    name: app.name,
                })),
            },
            ...apps.map((app) => ({
                "@type": "SoftwareApplication",
                "@id": `${baseUrl}${app.href}#software`,
                name: app.name,
                url: app.externalUrl,
                sameAs: `${baseUrl}${app.href}`,
                applicationCategory: app.category,
                operatingSystem: "Web",
                description: app.description,
                image: absoluteUrl(app.desktopImageSrc),
                author: {
                    "@id": `${baseUrl}/#person`,
                },
            })),
            makeBreadcrumbSchema(
                [
                    {
                        name: SITE_NAME,
                        url: baseUrl,
                    },
                    {
                        name: "Apps",
                        url: appsUrl,
                    },
                ],
                `${appsUrl}#breadcrumb`,
            ),
        ],
    }

    return (
        <section className="editorial-page overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <header className="site-page-container editorial-product-hero grid min-h-[calc(100svh-3.5rem)] items-center gap-12 py-16 lg:grid-cols-[0.82fr_1.18fr] lg:py-20">
                <div>
                    <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                        Apps
                    </p>
                    <h1 className="text-foreground mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                        Thoughtful software for Scripture, story, and exact
                        words.
                    </h1>
                    <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
                        Small, focused tools built with the same care as the
                        writing: clear loops, useful feedback, and enough polish
                        to make repeated practice feel lighter.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                            href={featuredApp.href}
                            className="bg-foreground text-background hover:bg-foreground/85 inline-flex h-11 items-center justify-center gap-2 rounded-none px-5 text-sm font-medium transition-colors"
                        >
                            Explore {featuredApp.name}
                            <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            href={featuredApp.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-border bg-background text-foreground hover:bg-muted inline-flex h-11 items-center justify-center gap-2 rounded-none border px-5 text-sm font-medium transition-colors"
                        >
                            Open app
                            <ExternalLink className="size-4" />
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <div className="bg-primary/10 absolute inset-x-10 bottom-4 h-24 rounded-full blur-3xl" />
                    <Image
                        src={featuredApp.desktopImageSrc}
                        alt={featuredApp.imageAlt}
                        width={2880}
                        height={1920}
                        sizes="(min-width: 1024px) 54vw, 92vw"
                        className="ring-border/70 shadow-foreground/15 relative hidden rounded-[0.25rem] shadow-2xl ring-1 md:block"
                        priority
                        unoptimized
                    />
                    <Image
                        src={featuredApp.mobileImageSrc}
                        alt={featuredApp.imageAlt}
                        width={1170}
                        height={2532}
                        sizes="min(92vw, 24rem)"
                        className="ring-border/70 shadow-foreground/15 relative mx-auto w-full max-w-[24rem] rounded-[0.25rem] shadow-2xl ring-1 md:hidden"
                        priority
                        unoptimized
                    />
                </div>
            </header>

            <section className="bg-[#111] text-white">
                <div className="site-page-container grid items-center gap-10 py-20 lg:grid-cols-[0.78fr_1.22fr] lg:py-28">
                    <div>
                        <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                            Featured app
                        </p>
                        <h2 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                            {featuredApp.name}
                        </h2>
                        <p className="mt-5 max-w-xl text-xl leading-8 font-semibold text-white/86">
                            {featuredApp.tagline}
                        </p>
                        <p className="mt-5 max-w-xl text-base leading-7 text-white/62">
                            {featuredApp.description}
                        </p>
                    </div>

                    <Link
                        href={featuredApp.href}
                        className="editorial-dark-feature group grid overflow-hidden bg-white/[0.06] p-5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-black/25 sm:p-6"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <img
                                    src={featuredApp.logoSrc}
                                    alt=""
                                    className="size-11 shrink-0 rounded-[0.25rem] shadow-lg shadow-black/15"
                                    aria-hidden="true"
                                />
                                <div className="min-w-0">
                                    <p className="truncate text-2xl font-semibold tracking-tight">
                                        {featuredApp.name}
                                    </p>
                                    <p className="text-sm text-white/50">
                                        {featuredApp.eyebrow}
                                    </p>
                                </div>
                            </div>
                            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-none bg-white text-[#111] transition-transform group-hover:translate-x-0.5">
                                <ArrowRight className="size-4" />
                            </span>
                        </div>
                        <div className="relative mt-6">
                            <div className="bg-primary/20 absolute inset-x-8 bottom-0 h-16 rounded-full blur-2xl" />
                            <Image
                                src={featuredApp.desktopImageSrc}
                                alt={featuredApp.imageAlt}
                                width={2880}
                                height={1920}
                                sizes="(min-width: 1024px) 48vw, 88vw"
                                className="relative rounded-[0.25rem] ring-1 ring-white/10"
                                unoptimized
                            />
                        </div>
                    </Link>
                </div>
            </section>

            <section className="border-border/60 border-b bg-[#f6f7f4]">
                <div className="site-page-container py-20 lg:py-28">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="app-eyebrow">Design notes</p>
                        <h2 className="text-foreground mt-5 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                            Useful, exact, and calm.
                        </h2>
                    </div>
                    <div className="editorial-principle-grid">
                        {principles.map(({ icon: Icon, title, copy }) => (
                            <div key={title} className="editorial-principle">
                                <Icon className="text-primary mb-6 size-5" />
                                <h3>{title}</h3>
                                <p>{copy}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </section>
    )
}

export default AppsPage
