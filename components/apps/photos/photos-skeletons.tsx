import { cn } from "@/lib/utils"

export function PhotoGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div className="grid grid-cols-3 gap-0.5 p-0.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "bg-muted/30 aspect-square animate-pulse",
                        i % 7 === 0 && "col-span-2 row-span-2",
                        i % 11 === 0 && "col-span-2"
                    )}
                    style={{
                        animationDelay: `${i * 50}ms`,
                    }}
                />
            ))}
        </div>
    )
}

export function PhotoDetailSkeleton() {
    return (
        <div className="bg-background flex size-full items-center justify-center">
            <div className="bg-muted/30 aspect-video w-full max-w-4xl animate-pulse rounded-lg" />
        </div>
    )
}
