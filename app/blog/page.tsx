import { BlogPosts } from "@/components/posts"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { baseUrl } from "@/app/sitemap"
import { formatDate, getBlogPosts, getReadingTime } from "@/app/blog/utils"
import { BlogSearch } from "@/components/blog-search"
import {
    AUTHOR_NAME,
    BLOG_DESCRIPTION,
    SITE_NAME,
    makeBreadcrumbSchema,
    makeOgImage,
} from "@/lib/seo"
import { ArrowRight, Clock, Feather, Search } from "lucide-react"

export const metadata: Metadata = {
    title: {
        absolute: `${SITE_NAME} Writing`,
    },
    description: BLOG_DESCRIPTION,
    authors: [{ name: AUTHOR_NAME, url: baseUrl }],
    keywords: [
        "Gibson Murray blog",
        "Christian essays",
        "biblical reflections",
        "faith writing",
        "Christian author blog",
        "biblical fiction craft",
    ],
    alternates: {
        canonical: `${baseUrl}/writings`,
        types: {
            "application/rss+xml": `${baseUrl}/rss`,
        },
    },
    openGraph: {
        title: `${SITE_NAME} Writing`,
        description: BLOG_DESCRIPTION,
        url: `${baseUrl}/writings`,
        type: "website",
        images: [
            {
                url: makeOgImage({
                    title: `${SITE_NAME} Writing`,
                    image: "/books/walls-mock-2.png",
                }),
                alt: `${SITE_NAME} writing on faith, story, and ordinary life`,
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_NAME} Writing`,
        description: BLOG_DESCRIPTION,
        images: [
            makeOgImage({
                title: `${SITE_NAME} Writing`,
                image: "/books/walls-mock-2.png",
            }),
        ],
    },
}

const BlogPage = () => {
    const posts = getBlogPosts()
    const featuredPost = posts[0]
    const searchablePosts = posts.map((p) => ({
        slug: p.slug,
        title: p.metadata.title,
        summary: p.metadata.summary,
        publishedAt: p.metadata.publishedAt,
        tags: p.metadata.tags,
    }))
    const blogUrl = `${baseUrl}/writings`
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${blogUrl}#webpage`,
                url: blogUrl,
                name: `${SITE_NAME} Writing`,
                description: BLOG_DESCRIPTION,
                inLanguage: "en-US",
                isPartOf: {
                    "@id": `${baseUrl}/#website`,
                },
                mainEntity: {
                    "@id": `${blogUrl}#blog`,
                },
            },
            {
                "@type": "Blog",
                "@id": `${blogUrl}#blog`,
                name: `${SITE_NAME} Writing`,
                url: blogUrl,
                description: BLOG_DESCRIPTION,
                inLanguage: "en-US",
                publisher: {
                    "@id": `${baseUrl}/#person`,
                },
                blogPost: posts.map((post) => ({
                    "@type": "BlogPosting",
                    "@id": `${blogUrl}/${post.slug}#article`,
                    headline: post.metadata.title,
                    url: `${blogUrl}/${post.slug}`,
                    datePublished: post.metadata.publishedAt,
                    dateModified: post.metadata.publishedAt,
                    description: post.metadata.summary,
                    author: {
                        "@id": `${baseUrl}/#person`,
                    },
                })),
            },
            {
                "@type": "ItemList",
                "@id": `${blogUrl}#posts`,
                name: `${SITE_NAME} writing archive`,
                itemListElement: posts.map((post, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${blogUrl}/${post.slug}`,
                    name: post.metadata.title,
                })),
            },
            makeBreadcrumbSchema(
                [
                    {
                        name: SITE_NAME,
                        url: baseUrl,
                    },
                    {
                        name: "Writing",
                        url: blogUrl,
                    },
                ],
                `${blogUrl}#breadcrumb`,
            ),
        ],
    }

    return (
        <section className="bg-background overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <header className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
                <div>
                    <p className="app-eyebrow">Essays and reflections</p>
                    <h1 className="text-foreground mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                        Writing on faith, story, and ordinary life.
                    </h1>
                    <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
                        Book notes, biblical reflections, and essays from the
                        place where Christian conviction meets daily attention.
                    </p>
                </div>
                {featuredPost && (
                    <Link
                        href={`/writings/${featuredPost.slug}`}
                        className="group shadow-foreground/10 relative min-h-[34rem] overflow-hidden rounded-[2rem] bg-[#111] text-white shadow-2xl"
                    >
                        {featuredPost.metadata.image && (
                            <Image
                                src={featuredPost.metadata.image}
                                alt=""
                                fill
                                priority
                                sizes="(min-width: 1024px) 48vw, 92vw"
                                className="object-cover opacity-70 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-80"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
                        <div className="relative flex min-h-[34rem] flex-col justify-end p-6 sm:p-8 lg:p-10">
                            <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium text-white/70">
                                <span className="rounded-full bg-white/12 px-3 py-1 text-white backdrop-blur-md">
                                    Featured
                                </span>
                                <span className="rounded-full bg-white/12 px-3 py-1 backdrop-blur-md">
                                    {formatDate(
                                        featuredPost.metadata.publishedAt,
                                        false,
                                    )}
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 backdrop-blur-md">
                                    <Clock className="size-3.5" />
                                    {getReadingTime(featuredPost.content)}
                                </span>
                            </div>
                            <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                                {featuredPost.metadata.title}
                            </h2>
                            {featuredPost.metadata.summary && (
                                <p className="mt-4 line-clamp-3 max-w-xl text-base leading-7 text-white/72">
                                    {featuredPost.metadata.summary}
                                </p>
                            )}
                            <span className="mt-8 inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#111] transition-colors group-hover:bg-white/90">
                                Read essay
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                            </span>
                        </div>
                    </Link>
                )}
            </header>

            <section className="border-border/60 bg-muted/35 border-y">
                <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[0.36fr_1fr] lg:py-20">
                    <aside className="lg:sticky lg:top-20 lg:self-start">
                        <div className="app-panel bg-background/80 min-h-0 backdrop-blur-xl">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="app-eyebrow">Archive</p>
                                    <h2 className="text-foreground mt-4 text-3xl font-semibold tracking-tight">
                                        Browse the latest.
                                    </h2>
                                </div>
                                <span className="bg-muted text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                                    <Feather className="size-4" />
                                </span>
                            </div>
                            <p className="text-muted-foreground mt-4 text-sm leading-6">
                                {posts.length} essay
                                {posts.length === 1 ? "" : "s"} on faith, story,
                                Scripture, and attention.
                            </p>
                            <div className="mt-8">
                                <div className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
                                    <Search className="size-3.5" />
                                    Search
                                </div>
                                <BlogSearch posts={searchablePosts} />
                            </div>
                        </div>
                    </aside>
                    <div>
                        <BlogPosts />
                    </div>
                </div>
            </section>
        </section>
    )
}

export default BlogPage
