import { cn } from "@/lib/utils"

export function BlogPostSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="aspect-[16/10] w-full rounded-lg bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="h-5 w-16 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>
                <div className="h-6 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>
            </div>
        </div>
    )
}

export function BlogListSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <BlogPostSkeleton key={i} />
            ))}
        </div>
    )
}

export function BlogPostViewSkeleton() {
    return (
        <div className="animate-pulse space-y-8">
            <div className="space-y-4">
                <div className="h-5 w-20 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-10 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="flex items-center gap-4">
                    <div className="h-4 w-32 rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-4 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>
            </div>
            <div className="aspect-video w-full rounded-xl bg-neutral-200 dark:bg-neutral-800" />
            <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-4 rounded bg-neutral-200 dark:bg-neutral-800",
                            i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-5/6" : "w-4/5"
                        )}
                    />
                ))}
            </div>
        </div>
    )
}
