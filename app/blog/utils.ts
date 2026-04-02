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
    let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
    let match = frontmatterRegex.exec(fileContent)
    let frontMatterBlock = match![1]
    let content = fileContent.replace(frontmatterRegex, "").trim()
    let frontMatterLines = frontMatterBlock.trim().split("\n")
    let metadata: Partial<Metadata> = {}

    frontMatterLines.forEach((line) => {
        let [key, ...valueArr] = line.split(": ")
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
    let rawContent = fs.readFileSync(filePath, "utf-8")
    return parseFrontmatter(rawContent)
}

const getMDXData = (dir: string) => {
    let mdxFiles = getMDXFiles(dir)
    return mdxFiles.map((file) => {
        let { metadata, content } = readMDXFile(path.join(dir, file))
        let slug = path.basename(file, path.extname(file))

        return {
            metadata,
            slug,
            content,
        }
    })
}

export const getBlogPosts = (recentOnly = false, recentCount = 3) => {
    let posts = getMDXData(path.join(process.cwd(), "app", "blog", "posts"))
    if (recentOnly) {
        return posts.sort((a, b) => {
            return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
        }).slice(0, recentCount)
    }
    return posts
}

export const formatDate = (
    date: string,
    includeRelativeOrOptions:
        | boolean
        | { includeRelative?: boolean; includeWeekday?: boolean } = false,
) => {
    const options =
        typeof includeRelativeOrOptions === "boolean"
            ? { includeRelative: includeRelativeOrOptions, includeWeekday: false }
            : {
                  includeRelative: includeRelativeOrOptions.includeRelative ?? false,
                  includeWeekday: includeRelativeOrOptions.includeWeekday ?? false,
              }

    let currentDate = new Date()
    if (!date.includes("T")) {
        date = `${date}T00:00:00`
    }
    let targetDate = new Date(date)

    let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
    let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
    let daysAgo = currentDate.getDate() - targetDate.getDate()

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

    let fullDate = targetDate.toLocaleString("en-us", {
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
