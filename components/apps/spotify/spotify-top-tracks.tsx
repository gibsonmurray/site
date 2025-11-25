import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUpIcon, MusicIcon } from "lucide-react"
import { SpotifyTimeRangeSelector } from "./spotify-time-range-selector"
import { SpotifyTrackItem } from "./spotify-track-item"
import { TrackSkeleton } from "./spotify-skeletons"
import { TimeRange, formatDuration } from "./spotify-utils"

type SpotifyTopTracksProps = {
    tracks: SpotifyApi.TrackObjectFull[] | undefined
    mostPopularTrack: SpotifyApi.TrackObjectFull | undefined
    timeRange: TimeRange
    onTimeRangeChange: (range: TimeRange) => void
    isLoading: boolean
}

export const SpotifyTopTracks = ({
    tracks,
    mostPopularTrack,
    timeRange,
    onTimeRangeChange,
    isLoading,
}: SpotifyTopTracksProps) => {
    // Filter out the most popular track from the regular list to avoid duplication
    const filteredTracks = tracks?.filter(
        (track) => track.id !== mostPopularTrack?.id,
    )

    return (
        <Card className="border-border/50 bg-card/50">
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-2xl leading-tight font-bold">
                        Top Tracks
                    </CardTitle>
                    <SpotifyTimeRangeSelector
                        value={timeRange}
                        onChange={onTimeRangeChange}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {isLoading ? (
                        <>
                            {Array.from({ length: 10 }).map((_, i) => (
                                <TrackSkeleton key={i} />
                            ))}
                        </>
                    ) : (
                        <>
                            {mostPopularTrack && (
                                <div className="group hover:bg-accent/50 flex items-center gap-4 rounded-lg border-2 border-spotify-green/30 bg-spotify-green/5 p-3 transition-colors">
                                    <div className="bg-spotify-green/20 flex size-6 shrink-0 items-center justify-center rounded-full">
                                        <TrendingUpIcon className="text-spotify-green size-4" />
                                    </div>
                                    {mostPopularTrack.album?.images?.[2]?.url ? (
                                        <Image
                                            src={
                                                mostPopularTrack.album.images[2]
                                                    .url
                                            }
                                            alt={mostPopularTrack.name || ""}
                                            width={48}
                                            height={48}
                                            className="shrink-0 rounded"
                                        />
                                    ) : (
                                        <div className="bg-spotify-green/20 flex size-12 shrink-0 items-center justify-center rounded">
                                            <MusicIcon className="text-spotify-green size-6" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate leading-tight font-semibold">
                                                {mostPopularTrack.name}
                                            </p>
                                            <span className="text-spotify-green text-xs font-medium uppercase">
                                                Most Popular
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground truncate text-sm leading-tight">
                                            {mostPopularTrack.artists
                                                ?.map((a) => a.name)
                                                .join(", ")}
                                        </p>
                                        {mostPopularTrack.album && (
                                            <p className="text-muted-foreground truncate text-xs leading-tight">
                                                {mostPopularTrack.album.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-muted-foreground shrink-0 text-sm font-medium tabular-nums">
                                        {formatDuration(
                                            mostPopularTrack.duration_ms,
                                        )}
                                    </div>
                                </div>
                            )}
                            {filteredTracks?.map((track, index) => (
                                <SpotifyTrackItem
                                    key={track.id}
                                    track={track}
                                    index={index}
                                    showIndex
                                />
                            ))}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
