import { BlogCategory } from "@/types/blog"

export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

export function getCategoryColor(category: BlogCategory): string {
    const colors: Record<BlogCategory, string> = {
        tv: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
        movie: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        book: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        "my-book": "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    }
    return colors[category]
}

export function getCategoryIcon(category: BlogCategory): string {
    const icons: Record<BlogCategory, string> = {
        tv: "📺",
        movie: "🎬",
        book: "📚",
        "my-book": "✍️",
    }
    return icons[category]
}

export function getCategoryLabel(category: BlogCategory): string {
    const labels: Record<BlogCategory, string> = {
        tv: "TV Show",
        movie: "Movie",
        book: "Book",
        "my-book": "My Book",
    }
    return labels[category]
}
