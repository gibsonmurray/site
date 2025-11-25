export const formatDuration = (ms: number | undefined) => {
    if (!ms) return "0:00"
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

export const formatTimeAgo = (dateString: string | undefined) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
}

export type TimeRange = "short_term" | "medium_term" | "long_term"

export const timeRangeLabels: Record<TimeRange, string> = {
    short_term: "Last 4 weeks",
    medium_term: "Last 6 months",
    long_term: "All time",
}
