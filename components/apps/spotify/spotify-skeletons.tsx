import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export const Skeleton = ({ className }: { className?: string }) => (
    <div className={cn("bg-muted animate-pulse rounded", className)} />
)

export const StatCardSkeleton = () => (
    <Card className="border-border/50 bg-card/50">
        <CardContent className="flex items-center gap-4 p-6">
            <div className="bg-muted flex size-12 animate-pulse items-center justify-center rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-12" />
            </div>
        </CardContent>
    </Card>
)

export const TrackSkeleton = () => (
    <div className="flex items-center gap-4 rounded-lg p-3">
        <Skeleton className="h-4 w-6" />
        <Skeleton className="size-12 shrink-0 rounded" />
        <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-4 w-12 shrink-0" />
    </div>
)

export const ArtistSkeleton = () => (
    <div className="flex flex-col items-center gap-3 rounded-lg p-4">
        <Skeleton className="size-[120px] rounded-full" />
        <div className="w-full space-y-2 text-center">
            <Skeleton className="mx-auto h-4 w-3/4" />
            <Skeleton className="mx-auto h-3 w-1/2" />
        </div>
    </div>
)
