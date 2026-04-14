import Link from "next/link"
import { formatDate, getBlogPosts, getReadingTime } from "@/app/blog/utils"
import {
    formatListDay,
    getMonth,
    getMonthLabel,
    getYear,
} from "@/app/blog/format"
import { FC } from "react"

type BlogPostsProps = {
    recentOnly?: boolean
    recentCount?: number
}

const PostList = ({
    posts,
    compactDate = false,
}: {
    posts: ReturnType<typeof getBlogPosts>
    compactDate?: boolean
}) => (
    <div className="space-y-4">
        {posts.map((post) => (
            <Link
                key={post.slug}
                className="group hover:bg-muted/30 flex flex-col space-y-1 rounded-lg px-3 py-2 transition-colors"
                href={`/blog/${post.slug}`}
            >
                <div className="flex flex-1 flex-col space-y-1">
                    <p className="text-muted-foreground group-hover:text-primary/60 text-xs tabular-nums transition-colors duration-200">
                        {compactDate
                            ? formatListDay(post.metadata.publishedAt)
                            : formatDate(post.metadata.publishedAt, false)}
                    </p>
                    <p className="text-foreground group-hover:text-primary tracking-tight transition-colors">
                        {post.metadata.title}
                    </p>
                    <p className="text-muted-foreground inline-block text-xs font-medium">
                        {getReadingTime(post.content)}
                    </p>
                </div>
            </Link>
        ))}
    </div>
)

export const BlogPosts: FC<BlogPostsProps> = ({
    recentOnly = false,
    recentCount = 3,
}) => {
    const posts = getBlogPosts(recentOnly, recentCount)

    if (posts.length === 0) {
        return <p>No posts yet. Check back soon.</p>
    }

    if (recentOnly) {
        return (
            <div className="space-y-10">
                <section>
                    <h2 className="border-primary/45 text-muted-foreground mb-4 border-l-2 pl-3 text-xs font-semibold tracking-[0.12em] uppercase">
                        Recents
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
        <div className="space-y-10">
            {years.map((year) => {
                const months = Object.keys(byYearAndMonth[year])
                    .map(Number)
                    .sort((a, b) => b - a)

                return (
                    <section key={year} className="space-y-4">
                        <h2 className="border-primary/45 text-muted-foreground mb-4 border-l-2 pl-3 text-xs font-semibold tracking-[0.12em] uppercase">
                            {year}
                        </h2>
                        {months.map((month) => (
                            <div
                                key={`${year}-${month}`}
                                className="border-border/65 bg-background/80 rounded-xl border p-4 sm:p-5"
                            >
                                <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase">
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
