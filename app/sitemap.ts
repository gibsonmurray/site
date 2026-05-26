import type { MetadataRoute } from "next"
import { getBlogPosts } from "@/app/blog/utils"
import { books } from "@/lib/books"
import sample from "@/data/walls-sample.json"

export const baseUrl =
    process.env.NODE_ENV === "production"
        ? "https://gibsonmurray.com"
        : "http://localhost:3000"

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
    const today = new Date().toISOString().split("T")[0]
    let blogs = getBlogPosts().map((post) => ({
        url: `${baseUrl}/writings/${post.slug}`,
        lastModified: post.metadata.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }))

    let bookPages = books.map((book) => ({
        url: `${baseUrl}/books/${book.slug}`,
        lastModified: today,
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }))

    let wallsSamplePages = sample.chapters.map((chapter) => ({
        url: `${baseUrl}/books/walls/read/${chapter.id}`,
        lastModified: today,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }))

    let routes = [
        {
            url: baseUrl,
            lastModified: today,
            changeFrequency: "weekly" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/books`,
            lastModified: today,
            changeFrequency: "weekly" as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/writings`,
            lastModified: today,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/apps`,
            lastModified: today,
            changeFrequency: "weekly" as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/verbatim`,
            lastModified: today,
            changeFrequency: "weekly" as const,
            priority: 0.9,
        },
    ]

    return [...routes, ...blogs, ...bookPages, ...wallsSamplePages]
}

export default sitemap
