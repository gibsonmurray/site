import Link from "next/link"
import { formatDate, getBlogPosts } from "@/app/blog/utils"
import { FC } from "react"

function getYear(dateStr: string): number {
    const date = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`)
    return date.getFullYear()
}

type BlogPostsProps = {
    recentOnly?: boolean
    recentCount?: number
}

const PostList = ({ posts }: { posts: ReturnType<typeof getBlogPosts> }) => (
    <div className="space-y-4">
        {posts.map((post) => (
            <Link
                key={post.slug}
                className="flex flex-col space-y-1"
                href={`/blog/${post.slug}`}
            >
                <div className="flex w-full flex-col space-x-0 md:flex-row md:space-x-2">
                    <p className="w-[100px] text-neutral-600 tabular-nums dark:text-neutral-400">
                        {formatDate(post.metadata.publishedAt, false)}
                    </p>
                    <p className="tracking-tight text-neutral-900 dark:text-neutral-100">
                        {post.metadata.title}
                    </p>
                </div>
            </Link>
        ))}
    </div>
)

export const BlogPosts: FC<BlogPostsProps> = ({ recentOnly = false, recentCount = 3 }) => {
    const posts = getBlogPosts(recentOnly, recentCount)

    if (posts.length === 0) {
        return (
            <p className="text-neutral-500 dark:text-neutral-400">
                No posts yet. Check back soon.
            </p>
        )
    }

    if (recentOnly) {
        return (
            <div className="space-y-10">
                <section>
                    <h2 className="mb-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        Recents
                    </h2>
                    <PostList posts={posts} />
                </section>
            </div>
        )
    }

    const byYear = posts.reduce<Record<number, typeof posts>>((acc, post) => {
        const year = getYear(post.metadata.publishedAt)
        if (!acc[year]) acc[year] = []
        acc[year].push(post)
        return acc
    }, {})

    const years = Object.keys(byYear)
        .map(Number)
        .sort((a, b) => b - a)

    return (
        <div className="space-y-10">
            {years.map((year) => (
                <section key={year}>
                    <h2 className="mb-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        {year}
                    </h2>
                    <PostList posts={byYear[year]} />
                </section>
            ))}
        </div>
    )
}
