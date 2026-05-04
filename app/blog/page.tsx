import { BlogPosts } from "@/components/posts"
import { Metadata } from "next"
import { baseUrl } from "@/app/sitemap"
import { getBlogPosts } from "@/app/blog/utils"
import { BlogSearch } from "@/components/blog-search"
import {
    AUTHOR_NAME,
    BLOG_DESCRIPTION,
    SITE_NAME,
    makeOgImage,
} from "@/lib/seo"

export const metadata: Metadata = {
    title: "Writing",
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
        canonical: `${baseUrl}/blog`,
    },
    openGraph: {
        title: `${SITE_NAME} Writing`,
        description: BLOG_DESCRIPTION,
        url: `${baseUrl}/blog`,
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
    const searchablePosts = posts.map((p) => ({
        slug: p.slug,
        title: p.metadata.title,
        summary: p.metadata.summary,
        publishedAt: p.metadata.publishedAt,
        tags: p.metadata.tags,
    }))

    return (
        <section className="bg-background">
            <header className="mx-auto max-w-4xl px-6 py-16 text-center sm:px-8 lg:py-24">
                <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                    Essays and reflections
                </p>
                <h1 className="text-foreground mt-5 text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                    Writing on faith, story, and ordinary life.
                </h1>
                <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8">
                    Biblical reflections, book notes, and essays from the place
                    where Christian conviction meets daily attention.
                </p>
            </header>
            <div className="mx-auto max-w-4xl px-6 pb-20 sm:px-8 lg:pb-28">
                <BlogSearch posts={searchablePosts} />
                <BlogPosts />
            </div>
        </section>
    )
}

export default BlogPage
