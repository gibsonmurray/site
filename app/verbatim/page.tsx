import { baseUrl } from "@/app/sitemap"
import {
    AUTHOR_NAME,
    SITE_NAME,
    VERBATIM_DESCRIPTION,
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
    EyeOff,
    Keyboard,
    ListChecks,
    RotateCcw,
    Sparkles,
    Trophy,
    type LucideIcon,
} from "lucide-react"

const verbatimUrl = "https://verbatim.gibsonmurray.com"
const verbatimTitle = "Verbatim | Scripture Memorization App"
const verbatimOgImage = makeOgImage({
    title: "Verbatim",
    subtitle: "Memorize Scripture, exactly.",
    image: "/verbatim/app-desktop.png",
})

const features: {
    icon: LucideIcon
    title: string
    copy: string
}[] = [
    {
        icon: Keyboard,
        title: "Type to remember.",
        copy: "Practice Scripture recall with the same physical rhythm you use to write, rehearse, and recite.",
    },
    {
        icon: CheckCircle2,
        title: "Checked instantly.",
        copy: "Correct and incorrect words are marked as you type, so small wording drift is easy to catch.",
    },
    {
        icon: Trophy,
        title: "Quietly gamified.",
        copy: "Accuracy, streaks, and clean restarts make repetition feel lighter without distracting from the passage.",
    },
]

const useCases = [
    "Scripture",
    "Bible study",
    "Sermons",
    "Prayers",
    "Speeches",
    "Poems",
    "Lines",
]

export const metadata: Metadata = {
    title: {
        absolute: verbatimTitle,
    },
    description: VERBATIM_DESCRIPTION,
    authors: [{ name: AUTHOR_NAME, url: baseUrl }],
    keywords: [
        "Verbatim",
        "Scripture memorization app",
        "Bible verse memorization",
        "memorize Scripture",
        "typing memorization app",
        "memorize text",
        "realtime typing practice",
        "exact text memorization",
    ],
    alternates: {
        canonical: `${baseUrl}/verbatim`,
    },
    openGraph: {
        title: verbatimTitle,
        description: VERBATIM_DESCRIPTION,
        url: `${baseUrl}/verbatim`,
        siteName: SITE_NAME,
        locale: "en_US",
        type: "website",
        images: [
            {
                url: verbatimOgImage,
                alt: "Verbatim Scripture memorization app by Gibson Murray",
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: verbatimTitle,
        description: VERBATIM_DESCRIPTION,
        creator: "@gibsonmurray",
        images: [verbatimOgImage],
    },
}

const verbatimPageUrl = `${baseUrl}/verbatim`
const verbatimJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebPage",
            "@id": `${verbatimPageUrl}#webpage`,
            url: verbatimPageUrl,
            name: verbatimTitle,
            description: VERBATIM_DESCRIPTION,
            inLanguage: "en-US",
            isPartOf: {
                "@id": `${baseUrl}/#website`,
            },
            primaryImageOfPage: {
                "@type": "ImageObject",
                url: absoluteUrl("/verbatim/app-desktop.png"),
            },
            mainEntity: {
                "@id": `${verbatimPageUrl}#software`,
            },
        },
        {
            "@type": "SoftwareApplication",
            "@id": `${verbatimPageUrl}#software`,
            name: "Verbatim",
            url: verbatimUrl,
            sameAs: verbatimPageUrl,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            description: VERBATIM_DESCRIPTION,
            image: absoluteUrl("/verbatim/app-desktop.png"),
            author: {
                "@id": `${baseUrl}/#person`,
            },
        },
        makeBreadcrumbSchema(
            [
                {
                    name: SITE_NAME,
                    url: baseUrl,
                },
                {
                    name: "Apps",
                    url: `${baseUrl}/apps`,
                },
                {
                    name: "Verbatim",
                    url: verbatimPageUrl,
                },
            ],
            `${verbatimPageUrl}#breadcrumb`,
        ),
    ],
}

const ProductScreenshot = ({ variant }: { variant: "desktop" | "mobile" }) => {
    const isMobile = variant === "mobile"

    return (
        <Image
            src={
                isMobile
                    ? "/verbatim/app-mobile.png"
                    : "/verbatim/app-desktop.png"
            }
            alt={
                isMobile
                    ? "Mobile Verbatim app screenshot showing John 3:16 practice"
                    : "Verbatim app screenshot showing John 3:16 memorization practice in progress"
            }
            width={isMobile ? 1170 : 2880}
            height={isMobile ? 2532 : 1920}
            sizes={isMobile ? "390px" : "(min-width: 1024px) 80vw, 92vw"}
            className={
                isMobile
                    ? "ring-border/70 shadow-foreground/15 mx-auto w-full max-w-[24rem] rounded-[0.25rem] shadow-2xl ring-1"
                    : "ring-border/70 shadow-foreground/15 relative rounded-[0.25rem] shadow-2xl ring-1"
            }
            priority={!isMobile}
            unoptimized
        />
    )
}

const ResponsiveProductScreenshot = () => (
    <>
        <div className="hidden md:block">
            <ProductScreenshot variant="desktop" />
        </div>
        <div className="md:hidden">
            <ProductScreenshot variant="mobile" />
        </div>
    </>
)

const VerbatimPage = () => {
    return (
        <section className="editorial-page bg-background overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(verbatimJsonLd),
                }}
            />
            <header className="site-page-container editorial-verbatim-hero flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center py-16 text-center lg:py-20">
                <img
                    src="/verbatim-logo.svg"
                    alt=""
                    className="mx-auto size-14 rounded-[0.25rem] shadow-xl shadow-black/10"
                    aria-hidden="true"
                />
                <h1 className="text-foreground mt-7 text-6xl font-semibold tracking-tight text-balance sm:text-7xl lg:text-8xl">
                    Verbatim
                </h1>
                <p className="text-foreground mt-6 max-w-4xl text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                    Memorize Scripture, exactly.
                </p>
                <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
                    A minimalist typing tool for learning Bible passages word
                    for word. Paste a passage, hide it, type it from memory, and
                    get realtime feedback as you go. It works just as well for
                    speeches, poems, lines, and any text you need to know
                    exactly.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <Link
                        href={verbatimUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary text-primary-foreground hover:bg-primary/85 inline-flex h-12 items-center justify-center gap-2 rounded-none px-6 text-base font-medium transition-colors"
                    >
                        Try Verbatim
                        <ArrowRight className="size-4" />
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="border-border bg-background text-foreground hover:bg-muted inline-flex h-12 items-center justify-center gap-2 rounded-none border px-6 text-base font-medium transition-colors"
                    >
                        See how it works
                    </Link>
                </div>
                <div className="relative mt-14 w-full max-w-5xl">
                    <div className="bg-primary/10 absolute inset-x-10 bottom-2 h-24 rounded-full blur-3xl" />
                    <ResponsiveProductScreenshot />
                </div>
            </header>

            <section className="bg-[#111] text-white">
                <div className="site-page-container grid items-center gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
                    <div>
                        <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                            Built for Scripture
                        </p>
                        <h2 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                            Repetition should feel like progress.
                        </h2>
                        <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
                            Verbatim keeps Scripture practice simple: read the
                            passage, commit it, hide it, then type. Each
                            keystroke tells you whether memory and wording are
                            lining up.
                        </p>
                    </div>
                    <div className="editorial-dark-list">
                        {features.map(({ icon: Icon, title, copy }) => (
                            <div
                                key={title}
                                className="editorial-dark-list-item"
                            >
                                <Icon className="text-primary size-5" />
                                <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                                    {title}
                                </h3>
                                <p className="mt-3 text-sm leading-6 text-white/58">
                                    {copy}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="bg-background scroll-mt-14">
                <div className="site-page-container py-20 lg:py-28">
                    <div className="mx-auto max-w-4xl text-center">
                        <p className="app-eyebrow">How it works</p>
                        <h2 className="text-foreground mt-5 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                            Read. Hide. Type. Know.
                        </h2>
                    </div>
                    <div className="editorial-step-grid">
                        <Step
                            icon={ListChecks}
                            title="Add the passage."
                            copy="Drop in the verse, paragraph, chapter, or exact text you want to own word for word."
                        />
                        <Step
                            icon={EyeOff}
                            title="Recall without peeking."
                            copy="Move from rereading to retrieval, where the words have to come back from memory."
                        />
                        <Step
                            icon={Sparkles}
                            title="Let feedback sharpen it."
                            copy="Realtime marking helps you catch substitutions, omissions, punctuation, and wording drift."
                        />
                    </div>
                </div>
            </section>

            <section className="editorial-usecase-section border-border/60 border-y bg-[#f6f7f4]">
                <div className="site-page-container grid items-center gap-10 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
                    <div className="order-2 lg:order-1">
                        <ProductScreenshot variant="mobile" />
                    </div>
                    <div className="order-1 lg:order-2">
                        <p className="app-eyebrow">Beyond Scripture</p>
                        <h2 className="text-foreground mt-5 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                            For anything you need to carry word for word.
                        </h2>
                        <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-8">
                            Scripture memory is the heart of Verbatim, but the
                            method is general. If the wording matters, Verbatim
                            can help you practice it until it comes back
                            cleanly.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-2">
                            {useCases.map((useCase) => (
                                <span
                                    key={useCase}
                                    className="border-border/70 bg-background rounded-none border px-4 py-2 text-sm font-medium"
                                >
                                    {useCase}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="editorial-final-cta bg-background">
                <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:py-28">
                    <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
                        <RotateCcw className="size-5" />
                    </div>
                    <h2 className="text-foreground mt-6 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                        Return to the passage as often as you need.
                    </h2>
                    <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8">
                        No heavy setup, no noisy dashboard, no ceremony. Just a
                        passage, your memory, and the next attempt.
                    </p>
                    <Link
                        href={verbatimUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-foreground text-background hover:bg-foreground/85 mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-none px-6 text-base font-medium transition-colors"
                    >
                        Open Verbatim
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            </section>
        </section>
    )
}

const Step = ({
    icon: Icon,
    title,
    copy,
}: {
    icon: LucideIcon
    title: string
    copy: string
}) => (
    <div className="editorial-step">
        <Icon className="text-primary size-5" />
        <h3 className="text-foreground mt-8 text-3xl font-semibold tracking-tight">
            {title}
        </h3>
        <p className="text-muted-foreground mt-4 text-sm leading-6">{copy}</p>
    </div>
)

export default VerbatimPage
