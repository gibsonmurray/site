import { BlogPosts } from "@/components/posts"
import { Metadata } from "next"
import LogoIcon from "@/components/logo"
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
        <section className="page-shell">
            <div className="mb-2 flex items-center gap-2">
                <LogoIcon className="text-primary size-5" />
                <h1 className="text-2xl font-semibold tracking-tighter text-foreground">
                    My Blog
                </h1>
            </div>
            <p className="mb-6 text-sm text-muted-foreground">
                My thoughts, ideas, and learnings on faith and life 💭
            </p>
            <BlogSearch posts={searchablePosts} />
            <BlogPosts />
        </section>
    )
}

export default BlogPage
