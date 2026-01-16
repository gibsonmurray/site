import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrackSkeleton } from "./spotify-skeletons"
import { formatTimeAgo } from "./spotify-utils"
import Image from "next/image"
import { MusicIcon } from "lucide-react"

type SpotifyRecentlyPlayedProps = {
    items: SpotifyApi.PlayHistoryObject[] | undefined
    isLoading: boolean
}

export const SpotifyRecentlyPlayed = ({
    items,
    isLoading,
}: SpotifyRecentlyPlayedProps) => {
    return (
        <Card className="border-border/50 bg-card/50">
            <CardHeader>
                <CardTitle className="text-2xl leading-tight font-bold">
                    Recently Played
                </CardTitle>
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
                        items?.map((item) => {
                            const track =
                                item.track as SpotifyApi.TrackObjectFull
                            if (!track) return null

                            return (
                                <div
                                    key={`${track.id}-${item.played_at}`}
                                    className="group hover:bg-accent/50 flex items-center gap-4 rounded-lg p-3 transition-colors"
                                >
                                    {track.album?.images?.[2]?.url ? (
                                        <Image
                                            src={track.album.images[2].url}
                                            alt={track.name || ""}
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
                                        <p className="truncate leading-tight font-semibold">
                                            {track.name}
                                        </p>
                                        <p className="text-muted-foreground truncate text-sm leading-tight">
                                            {track.artists
                                                ?.map((a) => a.name)
                                                .join(", ")}
                                        </p>
                                    </div>
                                    <div className="text-muted-foreground shrink-0 text-right text-xs font-medium tabular-nums">
                                        {formatTimeAgo(item.played_at)}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
