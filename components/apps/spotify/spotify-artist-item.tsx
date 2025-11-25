import Image from "next/image"
import { UserIcon } from "lucide-react"

type SpotifyArtistItemProps = {
    artist: SpotifyApi.ArtistObjectFull
    index: number
}

export const SpotifyArtistItem = ({
    artist,
    index,
}: SpotifyArtistItemProps) => {
    const artistImages = "images" in artist ? artist.images : undefined
    const artistFollowers = "followers" in artist ? artist.followers : undefined

    return (
        <div className="group hover:bg-accent/50 flex flex-col items-center gap-3 rounded-lg p-4 transition-colors">
            <div className="relative">
                {artistImages?.[2]?.url ? (
                    <div className="relative size-32 overflow-hidden rounded-full">
                        <Image
                            src={artistImages[2].url}
                            alt={artist.name || ""}
                            fill
                            className="size-full rounded-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="bg-spotify-green/20 flex size-[120px] items-center justify-center rounded-full">
                        <UserIcon className="text-spotify-green size-12" />
                    </div>
                )}
                <span className="bg-spotify-green absolute -top-2 -left-2 flex size-6 items-center justify-center rounded-full text-xs font-bold text-white">
                    {index + 1}
                </span>
            </div>
            <div className="w-full text-center">
                <p className="truncate leading-tight font-semibold">
                    {artist.name}
                </p>
                <p className="text-muted-foreground text-xs leading-tight font-medium">
                    {artistFollowers?.total?.toLocaleString() || 0} followers
                </p>
            </div>
        </div>
    )
}
