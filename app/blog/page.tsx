import { BlogPosts } from "@/components/posts"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Blog",
    description: "Read my blog.",
}

const BlogPage = () => {
    return (
        <section className="relative overflow-hidden p-5 sm:p-7">
            <h1 className="mb-2 text-2xl font-semibold tracking-tighter text-foreground">
                My Blog
            </h1>
            <p className="mb-8 text-sm text-muted-foreground">
                My thoughts, ideas, and learnings on faith and life 💭
            </p>
            <BlogPosts />
        </section>
    )
}

export default BlogPage
