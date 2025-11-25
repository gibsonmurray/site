import { FC } from "react"
import Image from "next/image"
import { TrendingUpIcon, MusicIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { StatCardSkeleton } from "./spotify-skeletons"
import { formatDuration } from "./spotify-utils"

type SpotifyMostPopularTrackProps = {
    mostPopularTrack: SpotifyApi.TrackObjectFull | undefined
    isLoading: boolean
}

export const SpotifyMostPopularTrack: FC<SpotifyMostPopularTrackProps> = ({
    mostPopularTrack,
    isLoading,
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCardSkeleton />
            </div>
        )
    }

    if (!mostPopularTrack) {
        return null
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center gap-4">
                        <div className="bg-spotify-green/20 flex size-12 shrink-0 items-center justify-center rounded-full">
                            <TrendingUpIcon className="text-spotify-green size-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
                                Most Popular Track
                            </p>
                            <div className="flex items-start gap-4">
                                {mostPopularTrack.album?.images?.[1]?.url ? (
                                    <Image
                                        src={
                                            mostPopularTrack.album.images[1].url
                                        }
                                        alt={
                                            mostPopularTrack.album.name ||
                                            mostPopularTrack.name ||
                                            ""
                                        }
                                        width={80}
                                        height={80}
                                        className="shrink-0 rounded-lg"
                                    />
                                ) : (
                                    <div className="bg-spotify-green/20 flex size-20 shrink-0 items-center justify-center rounded-lg">
                                        <MusicIcon className="text-spotify-green size-8" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <h3 className="mb-1 text-xl leading-tight font-bold">
                                        {mostPopularTrack.name}
                                    </h3>
                                    <p className="text-muted-foreground mb-2 text-sm leading-tight">
                                        {mostPopularTrack.artists
                                            ?.map((a) => a.name)
                                            .join(", ")}
                                    </p>
                                    {mostPopularTrack.album && (
                                        <p className="text-muted-foreground mb-1 text-xs leading-tight">
                                            {mostPopularTrack.album.name}
                                        </p>
                                    )}
                                    <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
                                        {mostPopularTrack.duration_ms && (
                                            <span className="tabular-nums">
                                                {formatDuration(
                                                    mostPopularTrack.duration_ms,
                                                )}
                                            </span>
                                        )}
                                        {mostPopularTrack.popularity !==
                                            undefined && (
                                            <span>
                                                {mostPopularTrack.popularity}%
                                                popularity
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
