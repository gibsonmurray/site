import Image from "next/image"
import { UserIcon, Users, Crown, Globe } from "lucide-react"
import { Skeleton } from "./spotify-skeletons"

type SpotifyUser = {
    display_name?: string | null
    images?: Array<{ url: string }> | null
    followers?: { total?: number | null } | null
    country?: string | null
    product?: string | null
    external_urls?: { spotify?: string | null } | null
}

type SpotifyUserHeaderProps = {
    user: SpotifyUser | undefined
    isLoading: boolean
}

export const SpotifyUserHeader = ({
    user,
    isLoading,
}: SpotifyUserHeaderProps) => {
    if (isLoading) {
        return (
            <div className="border-border/50 bg-card/50 group hover:border-spotify-green/30 hover:bg-card/70 relative overflow-hidden rounded-2xl border p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center gap-6">
                    <Skeleton className="ring-spotify-green/20 size-24 rounded-full ring-4" />
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </div>
        )
    }

    const isPremium = user?.product === "premium"
    const followerCount = user?.followers?.total || 0

    return (
        <div className="border-border/50 bg-card/50 group hover:border-spotify-green/30 hover:bg-card/70 hover:shadow-spotify-green/10 relative shrink-0 overflow-hidden rounded-2xl border p-6 shadow-sm backdrop-blur-sm transition-all duration-300">
            {/* Gradient overlay on hover */}
            <div className="from-spotify-green/5 absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* Avatar with animated border */}
                <div className="relative shrink-0">
                    <div className="from-spotify-green/40 via-spotify-green/20 absolute -inset-1 animate-pulse rounded-full bg-linear-to-r to-transparent opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
                    {user?.images?.[0]?.url ? (
                        <div className="relative">
                            <Image
                                src={user.images[0].url}
                                alt={user.display_name || "User"}
                                width={96}
                                height={96}
                                className="border-spotify-green/20 group-hover:border-spotify-green/40 relative z-10 rounded-full border-4 transition-all duration-300 group-hover:scale-105"
                            />
                        </div>
                    ) : (
                        <div className="bg-spotify-green border-spotify-green/20 group-hover:border-spotify-green/40 relative flex size-24 items-center justify-center rounded-full border-4 transition-all duration-300 group-hover:scale-105">
                            <UserIcon className="size-12 text-white" />
                            {isPremium && (
                                <div className="absolute -right-1 -bottom-1 z-20 flex size-8 items-center justify-center rounded-full bg-linear-to-br from-yellow-400 to-yellow-600 shadow-lg">
                                    <Crown className="size-4 text-white" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* User info */}
                <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-4xl leading-tight font-bold transition-transform duration-300 group-hover:translate-x-1">
                            {user?.display_name || "Spotify User"}
                        </h1>
                        {isPremium && (
                            <span className="text-spotify-green bg-spotify-green/10 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                                <Crown className="size-3" />
                                Premium
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="text-muted-foreground flex items-center gap-2 font-medium">
                            <Users className="size-4" />
                            <span className="tabular-nums">
                                {followerCount.toLocaleString()}{" "}
                                {followerCount === 1 ? "follower" : "followers"}
                            </span>
                        </div>
                        {user?.country && (
                            <div className="text-muted-foreground flex items-center gap-2 font-medium">
                                <Globe className="size-4" />
                                <span className="uppercase">USA 🇺🇸</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
