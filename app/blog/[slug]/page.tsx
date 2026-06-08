import { notFound } from "next/navigation"
import { CustomMDX } from "@/components/mdx"
import { Badge } from "@/components/ui/badge"
import { ShareButtons } from "@/components/share-buttons"
import { ScrollProgressBar } from "@/components/scroll-progress-bar"
import {
    formatDate,
    getBlogPosts,
    getPostTags,
    getReadingTime,
} from "@/app/blog/utils"
import { baseUrl } from "@/app/sitemap"
import Link from "next/link"
import { ArrowRight, ChevronLeft } from "lucide-react"
import {
    AUTHOR_NAME,
    SITE_NAME,
    absoluteUrl,
    makeBreadcrumbSchema,
    makeOgImage,
    personSchema,
} from "@/lib/seo"

export const generateStaticParams = async () => {
    const posts = getBlogPosts()

    return posts.map((post) => ({
        slug: post.slug,
    }))
}

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>
}) => {
    const { slug } = await params
    const post = getBlogPosts().find((post) => post.slug === slug)
    if (!post) {
        return
    }

    const {
        title,
        publishedAt: publishedTime,
        summary: description,
        image,
    } = post.metadata
    const tags = getPostTags(post.metadata.tags)
    const ogImage = makeOgImage({ title, image })
    const canonicalImage = image ? absoluteUrl(image) : ogImage

    return {
        title,
        description,
        authors: [{ name: post.metadata.author?.trim() || AUTHOR_NAME }],
        keywords: [
            ...tags,
            "Gibson Murray",
            "Christian essay",
            "biblical reflection",
        ],
        alternates: {
            canonical: `${baseUrl}/writings/${post.slug}`,
        },
        openGraph: {
            title,
            description,
            type: "article",
            publishedTime,
            modifiedTime: publishedTime,
            url: `${baseUrl}/writings/${post.slug}`,
            authors: [post.metadata.author?.trim() || AUTHOR_NAME],
            section: "Christian reflections",
            tags,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
        other: {
            thumbnail: canonicalImage,
        },
    }
}

export default async function BlogPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const post = getBlogPosts().find((post) => post.slug === slug)

    if (!post) {
        notFound()
    }

    const readingTime = getReadingTime(post.content)
    const authorName = post.metadata.author?.trim() || "Gibson Murray"
    const tags = getPostTags(post.metadata.tags)
    const scriptureCopyright = post.metadata.scriptureCopyright?.trim()
    const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length
    const readingMinutes = Math.max(1, Math.ceil(wordCount / 200))

    const allPosts = getBlogPosts()
    const relatedPosts = allPosts
        .filter((p) => p.slug !== slug)
        .map((p) => {
            const pTags = getPostTags(p.metadata.tags)
            const overlap = tags.filter((t) => pTags.includes(t)).length
            return { post: p, overlap }
        })
        .filter(({ overlap }) => overlap > 0)
        .sort((a, b) => b.overlap - a.overlap)
        .slice(0, 3)
        .map(({ post }) => post)

    const postUrl = `${baseUrl}/writings/${post.slug}`
    const postImage = post.metadata.image
        ? absoluteUrl(post.metadata.image)
        : makeOgImage({ title: post.metadata.title })

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            personSchema,
            {
                "@type": "BlogPosting",
                "@id": `${postUrl}#article`,
                headline: post.metadata.title,
                datePublished: post.metadata.publishedAt,
                dateModified: post.metadata.publishedAt,
                description: post.metadata.summary,
                keywords: tags,
                articleSection: tags[0] ?? "Christian reflections",
                wordCount,
                timeRequired: `PT${readingMinutes}M`,
                isAccessibleForFree: true,
                image: {
                    "@type": "ImageObject",
                    url: postImage,
                },
                url: postUrl,
                inLanguage: "en-US",
                isPartOf: {
                    "@id": `${baseUrl}/writings#blog`,
                },
                mainEntityOfPage: {
                    "@type": "WebPage",
                    "@id": postUrl,
                },
                author: {
                    "@id": `${baseUrl}/#person`,
                    name: authorName,
                },
                publisher: {
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
                        name: "Writing",
                        url: `${baseUrl}/writings`,
                    },
                    {
                        name: post.metadata.title,
                        url: postUrl,
                    },
                ],
                `${postUrl}#breadcrumb`,
            ),
        ],
    }

    return (
        <section className="editorial-page editorial-article bg-background relative overflow-hidden">
            <ScrollProgressBar />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <header className="editorial-article-header border-border/60 bg-muted/35 border-b">
                <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-18">
                    <Link href="/writings" className="editorial-back-link mb-8">
                        <ChevronLeft className="size-4" />
                        Writing
                    </Link>
                    <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                        Reflection
                    </p>
                    <h1 className="text-foreground mt-5 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                        {post.metadata.title}
                    </h1>
                    <div className="mt-6 space-y-4 text-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="text-muted-foreground flex flex-wrap items-center gap-2">
                                <p>
                                    {formatDate(post.metadata.publishedAt, {
                                        includeWeekday: true,
                                    })}
                                </p>
                                <span aria-hidden>·</span>
                                <p>{readingTime}</p>
                                <span aria-hidden>·</span>
                                <p>By {authorName}</p>
                            </div>
                            <ShareButtons
                                title={post.metadata.title}
                                slug={slug}
                            />
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="rounded-none"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
                <article className="prose prose-lg dark:prose-invert prose-headings:tracking-tight prose-a:text-primary prose-a:decoration-primary/35 prose-a:underline-offset-4 max-w-none">
                    <CustomMDX source={post.content} />
                </article>
                {scriptureCopyright && (
                    <p className="text-muted-foreground mt-8 text-xs leading-relaxed">
                        {scriptureCopyright}
                    </p>
                )}
                {relatedPosts.length > 0 && (
                    <div className="border-border/60 mt-14 border-t pt-10">
                        <h2 className="text-primary mb-5 text-xs font-semibold tracking-[0.22em] uppercase">
                            Related posts
                        </h2>
                        <div className="grid gap-3">
                            {relatedPosts.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/writings/${related.slug}`}
                                    className="app-panel-muted group hover:bg-muted/50 min-h-40 gap-2 transition duration-300 hover:-translate-y-0.5"
                                >
                                    <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase tabular-nums">
                                        {formatDate(
                                            related.metadata.publishedAt,
                                            false,
                                        )}
                                    </p>
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-foreground group-hover:text-primary text-lg font-semibold tracking-tight transition-colors">
                                            {related.metadata.title}
                                        </p>
                                        <ArrowRight className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
