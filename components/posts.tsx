import Link from "next/link"
import { formatDate, getBlogPosts } from "@/app/blog/utils"
import { FC } from "react"

function getYear(dateStr: string): number {
    const date = new Date(
        dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`,
    )
    return date.getFullYear()
}

function getMonth(dateStr: string): number {
    const date = new Date(
        dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`,
    )
    return date.getMonth()
}

function getMonthLabel(month: number): string {
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        new Date(2000, month, 1),
    )
}

type BlogPostsProps = {
    recentOnly?: boolean
    recentCount?: number
}

function formatListDay(dateStr: string): string {
    const date = new Date(
        dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`,
    )

    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        day: "numeric",
    }).format(date)
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
                className="group flex flex-col space-y-1 px-3 py-2 transition-colors"
                href={`/blog/${post.slug}`}
            >
                <div className="flex w-full flex-col space-x-0 md:flex-row md:space-x-2">
                    <p
                        className={`${compactDate ? "w-16" : "w-25"} tabular-nums text-muted-foreground`}
                    >
                        {compactDate
                            ? formatListDay(post.metadata.publishedAt)
                            : formatDate(post.metadata.publishedAt, false)}
                    </p>
                    <p className="text-foreground group-hover:text-primary tracking-tight transition-colors">
                        {post.metadata.title}
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
