import Image from "next/image"
import { MusicIcon } from "lucide-react"
import { formatDuration } from "./spotify-utils"

type SpotifyTrackItemProps = {
    track: SpotifyApi.TrackObjectFull
    index?: number
    showDuration?: boolean
    showIndex?: boolean
}

export const SpotifyTrackItem = ({
    track,
    index,
    showDuration = true,
    showIndex = false,
}: SpotifyTrackItemProps) => {
    return (
        <div className="group hover:bg-accent/50 flex items-center gap-4 rounded-lg p-3 transition-colors">
            {showIndex && (
                <span className="text-muted-foreground w-6 shrink-0 text-center text-sm font-bold tabular-nums">
                    {index !== undefined ? index + 1 : ""}
                </span>
            )}
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
                    {track.artists?.map((a) => a.name).join(", ")}
                </p>
            </div>
            {showDuration && (
                <div className="text-muted-foreground shrink-0 text-sm font-medium tabular-nums">
                    {formatDuration(track.duration_ms)}
                </div>
            )}
        </div>
    )
}
