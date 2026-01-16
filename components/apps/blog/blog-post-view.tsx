"use client"

import { BlogPost } from "@/types/blog"
import { formatDate, getCategoryColor, getCategoryLabel } from "./blog-utils"
import { BlogRating } from "./blog-rating"
import { BlogMDX } from "./blog-mdx"
import { ArrowLeftIcon, ClockIcon, ExternalLinkIcon, CalendarIcon } from "lucide-react"
import Image from "next/image"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

type BlogPostViewProps = {
    post: BlogPost
    onBack: () => void
}

export function BlogPostView({ post, onBack }: BlogPostViewProps) {
    const isMyBook = post.category === "my-book"

    return (
        <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-3xl px-6 py-8"
        >
            {/* Back button */}
            <button
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground mb-8 flex items-center gap-2 text-sm transition-colors"
            >
                <ArrowLeftIcon className="size-4" />
                <span>Back to all posts</span>
            </button>

            {/* Header */}
            <header className="mb-8 space-y-4">
                {/* Category badge */}
                <span
                    className={cn(
                        "inline-block rounded-full px-3 py-1 text-sm font-medium",
                        getCategoryColor(post.category)
                    )}
                >
                    {getCategoryLabel(post.category)}
                </span>

                {/* Title */}
                <h1 className="text-foreground text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                    {post.title}
                </h1>

                {/* Description */}
                <p className="text-muted-foreground text-lg">
                    {post.description}
                </p>

                {/* Meta info */}
                <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                        <CalendarIcon className="size-4" />
                        <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ClockIcon className="size-4" />
                        <span>{post.readingTime} min read</span>
                    </div>
                    {post.rating && (
                        <BlogRating rating={post.rating} size="md" showNumber />
                    )}
                </div>

                {/* Purchase link for my books */}
                {isMyBook && post.purchaseLink && (
                    <a
                        href={post.purchaseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                    >
                        <span>Get the Book</span>
                        <ExternalLinkIcon className="size-4" />
                    </a>
                )}
            </header>

            {/* Cover image */}
            {post.coverImage && (
                <div className="relative mb-10 aspect-video overflow-hidden rounded-xl">
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
                <div className="mb-8 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Content */}
            <div className="prose prose-neutral dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-neutral-900 prose-a:underline-offset-4 hover:prose-a:text-neutral-600 dark:prose-a:text-neutral-100 dark:hover:prose-a:text-neutral-300 max-w-none">
                <BlogMDX content={post.content} />
            </div>

            {/* Footer */}
            <footer className="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-800">
                <button
                    onClick={onBack}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
                >
                    <ArrowLeftIcon className="size-4" />
                    <span>Back to all posts</span>
                </button>
            </footer>
        </motion.article>
    )
}
