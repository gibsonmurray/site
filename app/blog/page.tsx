import { BlogPosts } from "@/components/posts"
import { Metadata } from "next"
import LogoIcon from "@/components/logo"

export const metadata: Metadata = {
    title: "Blog",
    description: "Read my blog.",
    openGraph: {
        title: "Blog",
        description: "Read my blog.",
        images: [
            {
                url: "/og?title=Blog",
                alt: "Blog",
                width: 1200,
                height: 630,
                type: "image/png",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog",
        description: "Read my blog.",
        images: ["/og?title=Blog"],
    },
}

const BlogPage = () => {
    return (
        <section className="page-shell">
            <div className="mb-2 flex items-center gap-2">
                <LogoIcon className="text-primary size-5" />
                <h1 className="text-2xl font-semibold tracking-tighter text-foreground">
                    My Blog
                </h1>
            </div>
            <p className="mb-8 text-sm text-muted-foreground">
                My thoughts, ideas, and learnings on faith and life 💭
            </p>
            <BlogPosts />
        </section>
    )
}

export default BlogPage
