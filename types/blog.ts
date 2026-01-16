export type BlogCategory = "tv" | "movie" | "book" | "my-book"

export type BlogPost = {
    slug: string
    title: string
    description: string
    category: BlogCategory
    coverImage?: string
    rating?: number // 1-5 stars for reviews
    publishedAt: string
    updatedAt?: string
    readingTime: number // in minutes
    tags: string[]
    featured?: boolean
    // For my-book category
    purchaseLink?: string
    // Content
    content: string
}

export type BlogPostMeta = Omit<BlogPost, "content">

export const BLOG_CATEGORIES: Record<
    BlogCategory,
    { label: string; description: string }
> = {
    tv: {
        label: "TV Shows",
        description: "Reviews and thoughts on television series",
    },
    movie: {
        label: "Movies",
        description: "Film reviews and cinema discussions",
    },
    book: {
        label: "Books",
        description: "Book reviews and reading recommendations",
    },
    "my-book": {
        label: "My Books",
        description: "My published works and writing",
    },
}
