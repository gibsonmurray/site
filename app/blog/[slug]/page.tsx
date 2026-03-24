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
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: title,
            datePublished: publishedTime,
            dateModified: publishedTime,
            description,
            keywords: getPostTags(post.metadata.tags),
            image: canonicalImage,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
                "@type": "Person",
                name: "Gibson Murray",
            },
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

    return (
        <section className="page-shell">
            <h1 className="title text-2xl font-semibold tracking-tighter">
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
        </section>
    )
}
