import { BlogPosts } from "@/components/posts"
import { Metadata } from "next"
import { baseUrl } from "@/app/sitemap"
import { getBlogPosts } from "@/app/blog/utils"
import { BlogSearch } from "@/components/blog-search"

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Thoughts on faith, Biblical fiction, and life from Gibson Murray.",
    alternates: {
        canonical: `${baseUrl}/blog`,
    },
    openGraph: {
        title: "Blog",
        description:
            "Thoughts on faith, Biblical fiction, and life from Gibson Murray.",
        url: `${baseUrl}/blog`,
        images: [
            {
                url: "/headshot.jpeg",
                alt: "Gibson Murray",
                width: 1200,
                height: 630,
                type: "image/jpeg",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog",
        description:
            "Thoughts on faith, Biblical fiction, and life from Gibson Murray.",
        images: ["/headshot.jpeg"],
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
