import { BlogPosts } from "@/app/components/posts"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Blog",
    description: "Read my blog.",
}

const BlogPage = () => {
    return (
        <section>
            <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
                My Blog
            </h1>
            <BlogPosts />
        </section>
    )
}

export default BlogPage
