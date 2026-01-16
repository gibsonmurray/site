"use client"

import { BlogPostMeta } from "@/types/blog"
import { cn } from "@/lib/utils"
import { formatDate, getCategoryColor, getCategoryLabel } from "./blog-utils"
import { BlogRating } from "./blog-rating"
import { ClockIcon, ExternalLinkIcon } from "lucide-react"
import Image from "next/image"
import { motion } from "motion/react"

type BlogPostCardProps = {
    post: BlogPostMeta
    onClick: () => void
    index?: number
}

export function BlogPostCard({ post, onClick, index = 0 }: BlogPostCardProps) {
    const isMyBook = post.category === "my-book"

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="group cursor-pointer"
            onClick={onClick}
        >
            {/* Cover Image */}
            <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                {post.coverImage ? (
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-4xl opacity-50">
                        {post.category === "tv" && "📺"}
                        {post.category === "movie" && "🎬"}
                        {post.category === "book" && "📚"}
                        {post.category === "my-book" && "✍️"}
                    </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </div>

            {/* Content */}
            <div className="space-y-2">
                {/* Category & Date */}
                <div className="flex items-center gap-3">
                    <span
                        className={cn(
                            "rounded-full px-2.5 py-0.5 text-xs font-medium",
                            getCategoryColor(post.category)
                        )}
                    >
                        {getCategoryLabel(post.category)}
                    </span>
                    <span className="text-muted-foreground text-xs">
                        {formatDate(post.publishedAt)}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-foreground text-lg font-semibold leading-tight transition-colors group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
                    {post.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground line-clamp-2 text-sm">
                    {post.description}
                </p>

                {/* Rating or Purchase Link */}
                <div className="flex items-center gap-4 pt-1">
                    {post.rating && <BlogRating rating={post.rating} size="sm" />}
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <ClockIcon className="size-3" />
                        <span>{post.readingTime} min read</span>
                    </div>
                    {isMyBook && post.purchaseLink && (
                        <span className="text-muted-foreground flex items-center gap-1 text-xs">
                            <ExternalLinkIcon className="size-3" />
                            <span>Available</span>
                        </span>
                    )}
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-muted-foreground text-xs"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.article>
    )
}
