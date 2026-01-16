"use client"

import { cn } from "@/lib/utils"
import { BlogCategory, BLOG_CATEGORIES } from "@/types/blog"
import { getCategoryIcon } from "./blog-utils"

type BlogFiltersProps = {
    activeCategory: BlogCategory | "all"
    onCategoryChange: (category: BlogCategory | "all") => void
}

export function BlogFilters({
    activeCategory,
    onCategoryChange,
}: BlogFiltersProps) {
    const categories = Object.entries(BLOG_CATEGORIES) as [
        BlogCategory,
        { label: string; description: string },
    ][]

    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onCategoryChange("all")}
                className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                    activeCategory === "all"
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                )}
            >
                All
            </button>
            {categories.map(([key, { label }]) => (
                <button
                    key={key}
                    onClick={() => onCategoryChange(key)}
                    className={cn(
                        "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                        activeCategory === key
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                    )}
                >
                    <span>{getCategoryIcon(key)}</span>
                    <span>{label}</span>
                </button>
            ))}
        </div>
    )
}
