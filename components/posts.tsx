import Link from "next/link"
import { formatDate, getBlogPosts, getReadingTime } from "@/app/blog/utils"
import { formatDisplayTitle, getYear } from "@/app/blog/format"
import { FC } from "react"
import { Clock } from "lucide-react"

type BlogPostsProps = {
    recentOnly?: boolean
    recentCount?: number
    variant?: "cards" | "compact"
}

const PostList = ({ posts }: { posts: ReturnType<typeof getBlogPosts> }) => (
    <div className="editorial-post-list">
        {posts.map((post) => (
            <Link
                key={post.slug}
                className="editorial-post-row group"
                href={`/writings/${post.slug}`}
            >
                <p className="editorial-post-date">
                    {formatDate(post.metadata.publishedAt, false)}
                </p>
                <div className="editorial-post-main">
                    <p className="editorial-post-title">
                        {formatDisplayTitle(post.metadata.title)}
                    </p>
                    {post.metadata.summary && (
                        <p className="editorial-post-summary">
                            {post.metadata.summary}
                        </p>
                    )}
                </div>
                <p className="editorial-post-time">
                    {getReadingTime(post.content)}
                </p>
            </Link>
        ))}
    </div>
)

export const BlogPosts: FC<BlogPostsProps> = ({
    recentOnly = false,
    recentCount = 3,
    variant = "cards",
}) => {
    const posts = getBlogPosts(recentOnly, recentCount)

    if (posts.length === 0) {
        return <p>No posts yet. Check back soon.</p>
    }

    if (recentOnly) {
        if (variant === "compact") {
            return (
                <section className="editorial-ruled-panel h-full">
                    <h2 className="app-eyebrow">Latest writing</h2>
                    <div className="divide-border/65 mt-8 flex flex-1 flex-col divide-y">
                        {posts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/writings/${post.slug}`}
                                className="group flex flex-col gap-2 py-6 first:pt-0 last:pb-0"
                            >
                                <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase tabular-nums">
                                    {formatDate(
                                        post.metadata.publishedAt,
                                        false,
                                    )}
                                </p>
                                <p className="editorial-inline-title">
                                    {post.metadata.title}
                                </p>
                                {post.metadata.summary && (
                                    <p className="text-muted-foreground line-clamp-2 text-base leading-7">
                                        {post.metadata.summary}
                                    </p>
                                )}
                                <p className="text-muted-foreground inline-flex items-center gap-1 text-sm font-medium">
                                    <Clock className="size-3" />
                                    {getReadingTime(post.content)}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            )
        }

        return (
            <div className="space-y-10">
                <section>
                    <h2 className="text-primary mb-5 text-xs font-semibold tracking-[0.22em] uppercase">
                        Latest writing
                    </h2>
                    <PostList posts={posts} />
                </section>
            </div>
        )
    }

    const postsByYear = posts.reduce<Record<number, typeof posts>>(
        (acc, post) => {
            const year = getYear(post.metadata.publishedAt)
            if (!acc[year]) acc[year] = []
            acc[year].push(post)
            return acc
        },
        {},
    )

    const years = Object.keys(postsByYear)
        .map(Number)
        .sort((a, b) => b - a)

    return (
        <div className="grid gap-10">
            {years.map((year) => (
                <section key={year} className="editorial-archive-year">
                    <div className="editorial-archive-year-heading">
                        <h3>{year}</h3>
                    </div>
                    <PostList posts={postsByYear[year]} />
                </section>
            ))}
        </div>
    )
}
