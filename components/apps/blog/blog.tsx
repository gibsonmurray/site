"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { BlogPost, BlogPostMeta, BlogCategory } from "@/types/blog"
import { getBlogPosts, getBlogPost } from "@/app/actions/blog"
import { BlogFilters } from "./blog-filters"
import { BlogSearch } from "./blog-search"
import { BlogPostCard } from "./blog-post-card"
import { BlogPostView } from "./blog-post-view"
import { BlogListSkeleton, BlogPostViewSkeleton } from "./blog-skeletons"
import { BookOpenIcon, PenLineIcon } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"

const Blog = () => {
    const [posts, setPosts] = useState<BlogPostMeta[]>([])
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
    const [activeCategory, setActiveCategory] = useState<BlogCategory | "all">(
        "all"
    )
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingPost, setIsLoadingPost] = useState(false)

    // Fetch all posts on mount
    const fetchPosts = useCallback(async () => {
        setIsLoading(true)
        try {
            const fetchedPosts = await getBlogPosts()
            setPosts(fetchedPosts)
        } catch (error) {
            console.error("Error fetching posts:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    // Handle post selection
    const handlePostClick = useCallback(async (slug: string) => {
        setIsLoadingPost(true)
        try {
            const post = await getBlogPost(slug)
            setSelectedPost(post)
        } catch (error) {
            console.error("Error fetching post:", error)
        } finally {
            setIsLoadingPost(false)
        }
    }, [])

    const handleBack = useCallback(() => {
        setSelectedPost(null)
    }, [])

    // Filter posts
    const filteredPosts = useMemo(() => {
        let result = posts

        // Filter by category
        if (activeCategory !== "all") {
            result = result.filter((post) => post.category === activeCategory)
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (post) =>
                    post.title.toLowerCase().includes(query) ||
                    post.description.toLowerCase().includes(query) ||
                    post.tags.some((tag) => tag.toLowerCase().includes(query))
            )
        }

        return result
    }, [posts, activeCategory, searchQuery])

    // Get featured posts for hero
    const featuredPosts = useMemo(() => {
        return posts.filter((post) => post.featured).slice(0, 3)
    }, [posts])

    return (
        <div className="bg-background text-foreground flex size-full flex-col">
            <AnimatePresence mode="wait">
                {selectedPost ? (
                    <motion.div
                        key="post-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="size-full overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700"
                    >
                        {isLoadingPost ? (
                            <div className="mx-auto max-w-3xl px-6 py-8">
                                <BlogPostViewSkeleton />
                            </div>
                        ) : (
                            <BlogPostView post={selectedPost} onBack={handleBack} />
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="list-view"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="size-full overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700"
                    >
                        {/* Header */}
                        <header className="border-b border-neutral-200 px-6 py-8 dark:border-neutral-800">
                            <div className="mx-auto max-w-6xl">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src="/icons/books.png"
                                        alt="Blog"
                                        width={40}
                                        height={40}
                                        className="size-10"
                                    />
                                    <div>
                                        <h1 className="text-2xl font-bold tracking-tight">
                                            Gibson&apos;s Blog
                                        </h1>
                                        <p className="text-muted-foreground text-sm">
                                            Reviews, thoughts, and my own creations
                                        </p>
                                    </div>
                                </div>

                                {/* Search & Filters */}
                                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <BlogFilters
                                        activeCategory={activeCategory}
                                        onCategoryChange={setActiveCategory}
                                    />
                                    <BlogSearch
                                        value={searchQuery}
                                        onChange={setSearchQuery}
                                        className="w-full sm:w-64"
                                    />
                                </div>
                            </div>
                        </header>

                        {/* Content */}
                        <main className="px-6 py-8">
                            <div className="mx-auto max-w-6xl">
                                {isLoading ? (
                                    <BlogListSkeleton count={6} />
                                ) : filteredPosts.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex flex-col items-center justify-center py-20 text-center"
                                    >
                                        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                                            {searchQuery ? (
                                                <BookOpenIcon className="text-muted-foreground size-8" />
                                            ) : (
                                                <PenLineIcon className="text-muted-foreground size-8" />
                                            )}
                                        </div>
                                        <h3 className="text-foreground mb-1 text-lg font-semibold">
                                            {searchQuery
                                                ? "No posts found"
                                                : "No posts yet"}
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            {searchQuery
                                                ? `No posts match "${searchQuery}"`
                                                : "Check back soon for new content"}
                                        </p>
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery("")}
                                                className="mt-4 text-sm text-neutral-600 underline underline-offset-4 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                                            >
                                                Clear search
                                            </button>
                                        )}
                                    </motion.div>
                                ) : (
                                    <>
                                        {/* Featured section - only show on "all" */}
                                        {activeCategory === "all" &&
                                            !searchQuery &&
                                            featuredPosts.length > 0 && (
                                                <section className="mb-12">
                                                    <h2 className="text-muted-foreground mb-6 text-sm font-medium uppercase tracking-wider">
                                                        Featured
                                                    </h2>
                                                    <div className="grid gap-8 lg:grid-cols-3">
                                                        {featuredPosts.map(
                                                            (post, index) => (
                                                                <BlogPostCard
                                                                    key={post.slug}
                                                                    post={post}
                                                                    onClick={() =>
                                                                        handlePostClick(
                                                                            post.slug
                                                                        )
                                                                    }
                                                                    index={index}
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                </section>
                                            )}

                                        {/* All posts grid */}
                                        <section>
                                            {activeCategory === "all" &&
                                                !searchQuery &&
                                                featuredPosts.length > 0 && (
                                                    <h2 className="text-muted-foreground mb-6 text-sm font-medium uppercase tracking-wider">
                                                        All Posts
                                                    </h2>
                                                )}
                                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                                {filteredPosts
                                                    .filter(
                                                        (post) =>
                                                            activeCategory !==
                                                                "all" ||
                                                            searchQuery ||
                                                            !post.featured
                                                    )
                                                    .map((post, index) => (
                                                        <BlogPostCard
                                                            key={post.slug}
                                                            post={post}
                                                            onClick={() =>
                                                                handlePostClick(
                                                                    post.slug
                                                                )
                                                            }
                                                            index={index}
                                                        />
                                                    ))}
                                            </div>
                                        </section>
                                    </>
                                )}
                            </div>
                        </main>

                        {/* Footer */}
                        <footer className="border-t border-neutral-200 px-6 py-6 dark:border-neutral-800">
                            <div className="mx-auto max-w-6xl">
                                <p className="text-muted-foreground text-center text-xs">
                                    All opinions are my own • Built with Next.js
                                </p>
                            </div>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Blog
