"use server"

import { readdir, readFile } from "fs/promises"
import path from "path"
import { BlogPost, BlogPostMeta, BlogCategory } from "@/types/blog"

const BLOG_DIR = path.join(process.cwd(), "content/blog")

function parseFrontmatter(content: string): {
    frontmatter: Record<string, unknown>
    content: string
} {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
    const match = content.match(frontmatterRegex)

    if (!match) {
        return { frontmatter: {}, content }
    }

    const frontmatterStr = match[1]
    const bodyContent = match[2]

    const frontmatter: Record<string, unknown> = {}
    const lines = frontmatterStr.split("\n")

    for (const line of lines) {
        const colonIndex = line.indexOf(":")
        if (colonIndex === -1) continue

        const key = line.slice(0, colonIndex).trim()
        let value: unknown = line.slice(colonIndex + 1).trim()

        // Parse arrays
        if (typeof value === "string" && value.startsWith("[")) {
            try {
                value = JSON.parse(value)
            } catch {
                // Keep as string if parsing fails
            }
        }
        // Parse numbers
        else if (typeof value === "string" && !isNaN(Number(value))) {
            value = Number(value)
        }
        // Parse booleans
        else if (value === "true") {
            value = true
        } else if (value === "false") {
            value = false
        }
        // Remove quotes from strings
        else if (
            typeof value === "string" &&
            value.startsWith('"') &&
            value.endsWith('"')
        ) {
            value = value.slice(1, -1)
        }

        frontmatter[key] = value
    }

    return { frontmatter, content: bodyContent }
}

function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
}

export async function getBlogPosts(): Promise<BlogPostMeta[]> {
    try {
        const files = await readdir(BLOG_DIR)
        const mdxFiles = files.filter((file) => file.endsWith(".mdx"))

        const posts: BlogPostMeta[] = []

        for (const file of mdxFiles) {
            const filePath = path.join(BLOG_DIR, file)
            const fileContent = await readFile(filePath, "utf-8")
            const { frontmatter, content } = parseFrontmatter(fileContent)

            const slug = file.replace(".mdx", "")
            const readingTime = calculateReadingTime(content)

            posts.push({
                slug,
                title: (frontmatter.title as string) || slug,
                description: (frontmatter.description as string) || "",
                category: (frontmatter.category as BlogCategory) || "book",
                coverImage: frontmatter.coverImage as string | undefined,
                rating: frontmatter.rating as number | undefined,
                publishedAt:
                    (frontmatter.publishedAt as string) ||
                    new Date().toISOString(),
                updatedAt: frontmatter.updatedAt as string | undefined,
                readingTime,
                tags: (frontmatter.tags as string[]) || [],
                featured: frontmatter.featured as boolean | undefined,
                purchaseLink: frontmatter.purchaseLink as string | undefined,
            })
        }

        // Sort by date, newest first
        posts.sort(
            (a, b) =>
                new Date(b.publishedAt).getTime() -
                new Date(a.publishedAt).getTime()
        )

        return posts
    } catch (error) {
        console.error("Error fetching blog posts:", error)
        return []
    }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
        const fileContent = await readFile(filePath, "utf-8")
        const { frontmatter, content } = parseFrontmatter(fileContent)

        const readingTime = calculateReadingTime(content)

        return {
            slug,
            title: (frontmatter.title as string) || slug,
            description: (frontmatter.description as string) || "",
            category: (frontmatter.category as BlogCategory) || "book",
            coverImage: frontmatter.coverImage as string | undefined,
            rating: frontmatter.rating as number | undefined,
            publishedAt:
                (frontmatter.publishedAt as string) || new Date().toISOString(),
            updatedAt: frontmatter.updatedAt as string | undefined,
            readingTime,
            tags: (frontmatter.tags as string[]) || [],
            featured: frontmatter.featured as boolean | undefined,
            purchaseLink: frontmatter.purchaseLink as string | undefined,
            content,
        }
    } catch (error) {
        console.error(`Error fetching blog post ${slug}:`, error)
        return null
    }
}

export async function getBlogPostsByCategory(
    category: BlogCategory
): Promise<BlogPostMeta[]> {
    const posts = await getBlogPosts()
    return posts.filter((post) => post.category === category)
}

export async function getFeaturedPosts(): Promise<BlogPostMeta[]> {
    const posts = await getBlogPosts()
    return posts.filter((post) => post.featured)
}

export async function searchBlogPosts(query: string): Promise<BlogPostMeta[]> {
    const posts = await getBlogPosts()
    const lowerQuery = query.toLowerCase()

    return posts.filter(
        (post) =>
            post.title.toLowerCase().includes(lowerQuery) ||
            post.description.toLowerCase().includes(lowerQuery) ||
            post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
}
