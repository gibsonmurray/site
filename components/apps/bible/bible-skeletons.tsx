const ParagraphSkeleton = () => (
    <div className="space-y-2">
        {["w-full", "w-11/12", "w-10/12", "w-4/5"].map((width, index) => (
            <div
                key={`${width}-${index}`}
                className={`bg-muted/60 h-4 rounded ${width} animate-pulse`}
            />
        ))}
    </div>
)

export const BibleSkeleton = () => (
    <div className="space-y-6">
        <div className="space-y-2">
            <div className="bg-muted h-8 w-40 animate-pulse rounded" />
            <div className="bg-muted/80 h-5 w-64 animate-pulse rounded" />
        </div>
        <ParagraphSkeleton />
        <ParagraphSkeleton />
        <ParagraphSkeleton />
    </div>
)

