import { notFound } from "next/navigation"
import { CustomMDX } from "@/components/mdx"
import { Badge } from "@/components/ui/badge"
import { ShareButtons } from "@/components/share-buttons"
import {
    formatDate,
    getBlogPosts,
    getPostTags,
    getReadingTime,
} from "@/app/blog/utils"
import { baseUrl } from "@/app/sitemap"

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
        <section className="flex flex-col relative overflow-hidden px-5 py-5 sm:px-7 sm:py-7">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <h1 className="text-2xl font-semibold tracking-tighter">
                {post.metadata.title}
            </h1>
            <div className="mt-2 mb-8 space-y-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-neutral-600 dark:text-neutral-400">
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
                            <Badge key={tag} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
            <article className="prose dark:prose-invert">
                <CustomMDX source={post.content} />
            </article>
            {scriptureCopyright && (
                <p className="text-muted-foreground text-xs leading-relaxed mt-5">
                    {scriptureCopyright}
                </p>
            )}
        </section>
    )
}
