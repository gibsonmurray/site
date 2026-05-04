import Link from "next/link"
import { formatDate, getBlogPosts, getReadingTime } from "@/app/blog/utils"
import {
    formatListDay,
    getMonth,
    getMonthLabel,
    getYear,
} from "@/app/blog/format"
import { FC } from "react"
import { ArrowRight, Clock } from "lucide-react"

type BlogPostsProps = {
    recentOnly?: boolean
    recentCount?: number
    variant?: "cards" | "compact"
}

const PostList = ({
    posts,
    compactDate = false,
}: {
    posts: ReturnType<typeof getBlogPosts>
    compactDate?: boolean
}) => (
    <div className="grid gap-3">
        {posts.map((post) => (
            <Link
                key={post.slug}
                className="border-border/65 bg-background group hover:shadow-foreground/8 grid min-h-44 gap-5 rounded-[2rem] border p-6 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:grid-cols-[1fr_auto] sm:p-8"
                href={`/blog/${post.slug}`}
            >
                <div className="flex flex-col gap-2">
                    <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase tabular-nums">
                        {compactDate
                            ? formatListDay(post.metadata.publishedAt)
                            : formatDate(post.metadata.publishedAt, false)}
                    </p>
                    <p className="text-foreground group-hover:text-primary text-lg font-semibold tracking-tight transition-colors">
                        {post.metadata.title}
                    </p>
                    {post.metadata.summary && (
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-6">
                            {post.metadata.summary}
                        </p>
                    )}
                    <p className="text-muted-foreground inline-flex items-center gap-1 text-xs font-medium">
                        <Clock className="size-3" />
                        {getReadingTime(post.content)}
                    </p>
                </div>
                <span className="text-muted-foreground group-hover:bg-foreground group-hover:text-background bg-muted flex size-10 items-center justify-center rounded-full transition-colors sm:self-center">
                    <ArrowRight className="size-4" />
                </span>
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
                <section className="app-panel h-full">
                    <h2 className="app-eyebrow">Latest writing</h2>
                    <div className="divide-border/65 mt-8 flex flex-1 flex-col divide-y">
                        {posts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group flex flex-col gap-2 py-6 first:pt-0 last:pb-0"
                            >
                                <p className="text-primary text-xs font-semibold tracking-[0.18em] uppercase tabular-nums">
                                    {formatDate(
                                        post.metadata.publishedAt,
                                        false,
                                    )}
                                </p>
                                <p className="text-foreground group-hover:text-primary text-2xl font-semibold tracking-tight transition-colors">
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

    const byYearAndMonth = posts.reduce<
        Record<number, Record<number, typeof posts>>
    >((acc, post) => {
        const year = getYear(post.metadata.publishedAt)
        const month = getMonth(post.metadata.publishedAt)
        if (!acc[year]) acc[year] = {}
        if (!acc[year][month]) acc[year][month] = []
        acc[year][month].push(post)
        return acc
    }, {})

    const years = Object.keys(byYearAndMonth)
        .map(Number)
        .sort((a, b) => b - a)

    return (
        <div className="grid gap-10">
            {years.map((year) => {
                const months = Object.keys(byYearAndMonth[year])
                    .map(Number)
                    .sort((a, b) => b - a)

                return (
                    <section key={year} className="grid gap-5">
                        <h2 className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                            {year}
                        </h2>
                        {months.map((month) => (
                            <div
                                key={`${year}-${month}`}
                                className="grid gap-4"
                            >
                                <h3 className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                                    {getMonthLabel(month)}
                                </h3>
                                <PostList
                                    posts={byYearAndMonth[year][month]}
                                    compactDate
                                />
                            </div>
                        ))}
                    </section>
                )
            })}
        </div>
    )
}
