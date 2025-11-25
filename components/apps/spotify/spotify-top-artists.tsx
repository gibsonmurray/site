import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SpotifyTimeRangeSelector } from "./spotify-time-range-selector"
import { SpotifyArtistItem } from "./spotify-artist-item"
import { ArtistSkeleton } from "./spotify-skeletons"
import { TimeRange } from "./spotify-utils"

type SpotifyTopArtistsProps = {
    artists: SpotifyApi.ArtistObjectFull[] | undefined
    timeRange: TimeRange
    onTimeRangeChange: (range: TimeRange) => void
    isLoading: boolean
}

export const SpotifyTopArtists = ({
    artists,
    timeRange,
    onTimeRangeChange,
    isLoading,
}: SpotifyTopArtistsProps) => {
    return (
        <Card className="border-border/50 bg-card/50">
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-2xl leading-tight font-bold">
                        Top Artists
                    </CardTitle>
                    <SpotifyTimeRangeSelector
                        value={timeRange}
                        onChange={onTimeRangeChange}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3">
                    {isLoading ? (
                        <>
                            {Array.from({ length: 10 }).map((_, i) => (
                                <ArtistSkeleton key={i} />
                            ))}
                        </>
                    ) : (
                        artists?.map((artist, index) => (
                            <SpotifyArtistItem
                                key={artist.id}
                                artist={artist}
                                index={index}
                            />
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
