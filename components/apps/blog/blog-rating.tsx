"use client"

import { cn } from "@/lib/utils"
import { StarIcon } from "lucide-react"

type BlogRatingProps = {
    rating: number
    size?: "sm" | "md" | "lg"
    showNumber?: boolean
}

export function BlogRating({
    rating,
    size = "md",
    showNumber = false,
}: BlogRatingProps) {
    const sizes = {
        sm: "size-3",
        md: "size-4",
        lg: "size-5",
    }

    const stars = Array.from({ length: 5 }, (_, i) => i + 1)

    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {stars.map((star) => (
                    <StarIcon
                        key={star}
                        className={cn(
                            sizes[size],
                            star <= rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-neutral-200 text-neutral-200 dark:fill-neutral-700 dark:text-neutral-700"
                        )}
                    />
                ))}
            </div>
            {showNumber && (
                <span className="text-muted-foreground ml-1 text-sm tabular-nums">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    )
}
