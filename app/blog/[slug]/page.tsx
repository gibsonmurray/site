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

export const generateStaticParams = async () => {
    let posts = getBlogPosts()

    return posts.map((post) => ({
        slug: post.slug,
    }))
}

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>
}) => {
    const toAbsoluteUrl = (value: string) => {
        if (/^https?:\/\//i.test(value)) {
            return value
        }

        return `${baseUrl}${value.startsWith("/") ? "" : "/"}${value}`
    }

    let { slug } = await params
    let post = getBlogPosts().find((post) => post.slug === slug)
    if (!post) {
        return
    }

    let {
        title,
        publishedAt: publishedTime,
        summary: description,
        image,
    } = post.metadata
    let imageParam = image ? `&image=${encodeURIComponent(image)}` : ""
    let ogImage = `${baseUrl}/og?title=${encodeURIComponent(title)}${imageParam}`
    let canonicalImage = image ? toAbsoluteUrl(image) : ogImage

    return {
        title,
        description,
        alternates: {
            canonical: `${baseUrl}/blog/${post.slug}`,
        },
        openGraph: {
            title,
            description,
            type: "article",
            publishedTime,
            url: `${baseUrl}/blog/${post.slug}`,
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
    }
}

export default async function BlogPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    let { slug } = await params
    let post = getBlogPosts().find((post) => post.slug === slug)

    if (!post) {
        notFound()
    }

    const readingTime = getReadingTime(post.content)
    const authorName = post.metadata.author?.trim() || "Gibson Murray"
    const tags = getPostTags(post.metadata.tags)
    const scriptureCopyright = post.metadata.scriptureCopyright?.trim()

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

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.metadata.title,
        datePublished: post.metadata.publishedAt,
        dateModified: post.metadata.publishedAt,
        description: post.metadata.summary,
        keywords: tags,
        image: post.metadata.image
            ? /^https?:\/\//i.test(post.metadata.image)
                ? post.metadata.image
                : `${baseUrl}${post.metadata.image.startsWith("/") ? "" : "/"}${post.metadata.image}`
            : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
        url: `${baseUrl}/blog/${post.slug}`,
        author: {
            "@type": "Person",
            name: authorName,
            url: baseUrl,
        },
    }

    return (
        <section className="bg-background relative overflow-hidden">
            <ScrollProgressBar />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <header className="border-border/60 bg-muted/35 border-b">
                <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:py-18">
                    <Link
                        href="/blog"
                        className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1 text-sm transition-colors"
                    >
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
                                description={post.metadata.summary}
                            />
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="rounded-full"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 lg:py-16">
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
                                    href={`/blog/${related.slug}`}
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
