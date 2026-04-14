export type SearchablePost = {
    slug: string
    title: string
    summary: string
    publishedAt: string
    tags?: string
}

const parseDate = (dateStr: string): Date =>
    new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`)

export const getYear = (dateStr: string): number =>
    parseDate(dateStr).getFullYear()

export const getMonth = (dateStr: string): number =>
    parseDate(dateStr).getMonth()

export const getMonthLabel = (month: number): string =>
    new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        new Date(2000, month, 1),
    )

export const formatListDay = (dateStr: string): string =>
    new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        day: "numeric",
    }).format(parseDate(dateStr))

export const formatListDate = (dateStr: string): string =>
    parseDate(dateStr).toLocaleString("en-us", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
