import type { MetadataRoute } from "next"
import { getBlogPosts } from "@/app/blog/utils"
import { books } from "@/lib/books"
import sample from "@/data/walls-sample.json"

export const baseUrl =
    process.env.NODE_ENV === "production"
        ? "https://gibsonmurray.com"
        : "http://localhost:3000"

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
    const blogs = getBlogPosts().map((post) => ({
        url: `${baseUrl}/writings/${post.slug}`,
        lastModified: post.metadata.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }))

    const bookPages = books.map((book) => ({
        url: `${baseUrl}/books/${book.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }))

    const wallsSamplePages = sample.chapters.map((chapter) => ({
        url: `${baseUrl}/books/walls/read/${chapter.id}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }))

    const routes = [
        {
            url: baseUrl,
            changeFrequency: "weekly" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/books`,
            changeFrequency: "weekly" as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/books/ebook-help`,
            changeFrequency: "monthly" as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/writings`,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/apps`,
            changeFrequency: "weekly" as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/verbatim`,
            changeFrequency: "weekly" as const,
            priority: 0.9,
        },
    ]

    return [...routes, ...blogs, ...bookPages, ...wallsSamplePages]
}

export default sitemap
