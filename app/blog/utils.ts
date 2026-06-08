import fs from "fs"
import path from "path"

type Metadata = {
    title: string
    publishedAt: string
    summary: string
    image?: string
    author?: string
    tags?: string
    scriptureCopyright?: string
}

const parseFrontmatter = (fileContent: string) => {
    const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
    const match = frontmatterRegex.exec(fileContent)
    const frontMatterBlock = match![1]
    const content = fileContent.replace(frontmatterRegex, "").trim()
    const frontMatterLines = frontMatterBlock.trim().split("\n")
    const metadata: Partial<Metadata> = {}

    frontMatterLines.forEach((line) => {
        const [key, ...valueArr] = line.split(": ")
        let value = valueArr.join(": ").trim()
        value = value.replace(/^['"](.*)['"]$/, "$1") // Remove quotes
        metadata[key.trim() as keyof Metadata] = value
    })

    return { metadata: metadata as Metadata, content }
}

const getMDXFiles = (dir: string) => {
    return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx")
}

const readMDXFile = (filePath: string) => {
    const rawContent = fs.readFileSync(filePath, "utf-8")
    return parseFrontmatter(rawContent)
}

const getMDXData = (dir: string) => {
    const mdxFiles = getMDXFiles(dir)
    return mdxFiles.map((file) => {
        const { metadata, content } = readMDXFile(path.join(dir, file))
        const slug = path.basename(file, path.extname(file))

        return {
            metadata,
            slug,
            content,
        }
    })
}

export const getBlogPosts = (recentOnly = false, recentCount = 3) => {
    const posts = getMDXData(path.join(process.cwd(), "app", "blog", "posts"))
    const sortedPosts = posts.sort((a, b) => {
        return (
            new Date(b.metadata.publishedAt).getTime() -
            new Date(a.metadata.publishedAt).getTime()
        )
    })

    if (recentOnly) {
        return sortedPosts.slice(0, recentCount)
    }
    return sortedPosts
}

export const formatDate = (
    date: string,
    includeRelativeOrOptions:
        | boolean
        | { includeRelative?: boolean; includeWeekday?: boolean } = false,
) => {
    const options =
        typeof includeRelativeOrOptions === "boolean"
            ? {
                  includeRelative: includeRelativeOrOptions,
                  includeWeekday: false,
              }
            : {
                  includeRelative:
                      includeRelativeOrOptions.includeRelative ?? false,
                  includeWeekday:
                      includeRelativeOrOptions.includeWeekday ?? false,
              }

    const currentDate = new Date()
    if (!date.includes("T")) {
        date = `${date}T00:00:00`
    }
    const targetDate = new Date(date)

    const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
    const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
    const daysAgo = currentDate.getDate() - targetDate.getDate()

    let formattedDate = ""

    if (yearsAgo > 0) {
        formattedDate = `${yearsAgo}y ago`
    } else if (monthsAgo > 0) {
        formattedDate = `${monthsAgo}mo ago`
    } else if (daysAgo > 0) {
        formattedDate = `${daysAgo}d ago`
    } else {
        formattedDate = "Today"
    }

    const fullDate = targetDate.toLocaleString("en-us", {
        weekday: options.includeWeekday ? "long" : undefined,
        month: "short",
        day: "numeric",
        year: "numeric",
    })

    if (!options.includeRelative) {
        return fullDate
    }

    return `${fullDate} (${formattedDate})`
}

export const getReadingTime = (content: string, wordsPerMinute = 200) => {
    const words = content.trim().split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.ceil(words / wordsPerMinute))
    return `${minutes} min read`
}

export const getPostTags = (tags?: string) => {
    if (!tags) {
        return []
    }

    return tags
        .replace(/^\[/, "")
        .replace(/\]$/, "")
        .split(",")
        .map((tag) => tag.trim().replace(/^['\"](.*)['\"]$/, "$1"))
        .filter(Boolean)
}
