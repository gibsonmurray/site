import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TimeRange, timeRangeLabels } from "./spotify-utils"

type SpotifyTimeRangeSelectorProps = {
    value: TimeRange
    onChange: (range: TimeRange) => void
}

export const SpotifyTimeRangeSelector = ({
    value,
    onChange,
}: SpotifyTimeRangeSelectorProps) => {
    const ranges: TimeRange[] = ["short_term", "medium_term", "long_term"]

    return (
        <div className="flex gap-2">
            {ranges.map((range) => (
                <Button
                    key={range}
                    variant={value === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChange(range)}
                    className={cn(
                        value === range && "bg-spotify-green text-white",
                    )}
                >
                    {timeRangeLabels[range]}
                </Button>
            ))}
        </div>
    )
}
