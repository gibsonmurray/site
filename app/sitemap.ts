import { getBlogPosts } from "@/app/blog/utils"
import { books } from "@/lib/books"

export const baseUrl =
    process.env.NODE_ENV === "production"
        ? "https://gibsonmurray.com"
        : "http://localhost:3000"

const sitemap = async () => {
    let blogs = getBlogPosts().map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.metadata.publishedAt,
    }))

    let bookPages = books.map((book) => ({
        url: `${baseUrl}/books/${book.slug}`,
        lastModified: new Date().toISOString().split("T")[0],
    }))

    let routes = ["", "/blog", "/books"].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString().split("T")[0],
    }))

    return [...routes, ...blogs, ...bookPages]
}

export default sitemap
