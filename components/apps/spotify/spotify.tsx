"use client"

import {
    getUser,
    getTopTracks,
    getTopArtists,
    getRecentlyPlayed,
} from "@/app/actions/spotify"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { SpotifyUserHeader } from "./spotify-user-header"
import { SpotifyTopTracks } from "./spotify-top-tracks"
import { SpotifyTopArtists } from "./spotify-top-artists"
import { SpotifyRecentlyPlayed } from "./spotify-recently-played"
import { TimeRange } from "./spotify-utils"
import { AudioLinesIcon } from "@/components/animate-ui/icons/audio-lines"

const Spotify = () => {
    const [tracksTimeRange, setTracksTimeRange] =
        useState<TimeRange>("medium_term")
    const [artistsTimeRange, setArtistsTimeRange] =
        useState<TimeRange>("medium_term")

    const { data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ["spotify", "user"],
        queryFn: () => getUser(),
    })

    const { data: topTracks, isLoading: isLoadingTracks } = useQuery({
        queryKey: ["spotify", "top-tracks", tracksTimeRange],
        queryFn: () => getTopTracks(tracksTimeRange, 10),
    })

    const { data: topArtists, isLoading: isLoadingArtists } = useQuery({
        queryKey: ["spotify", "top-artists", artistsTimeRange],
        queryFn: () => getTopArtists(artistsTimeRange, 9),
    })

    const { data: recentlyPlayed, isLoading: isLoadingRecentlyPlayed } =
        useQuery({
            queryKey: ["spotify", "recently-played"],
            queryFn: () => getRecentlyPlayed(10),
        })

    const trackItems = topTracks?.items?.filter(
        (item): item is SpotifyApi.TrackObjectFull =>
            "duration_ms" in item && "name" in item,
    )
    const mostPopularTrack = trackItems?.reduce(
        (prev, current) => {
            if (!prev) return current
            return (current.popularity ?? 0) > (prev.popularity ?? 0)
                ? current
                : prev
        },
        undefined as SpotifyApi.TrackObjectFull | undefined,
    )

    const artistItems = topArtists?.items
        ?.filter((item) => "genres" in item && "name" in item)
        .map((item) => item as unknown as SpotifyApi.ArtistObjectFull) as
        | SpotifyApi.ArtistObjectFull[]
        | undefined

    return (
        <div className="dark from-background to-card text-foreground flex size-full flex-col gap-6 overflow-auto bg-linear-to-b">
            <div className="mx-auto flex w-xl flex-col gap-6 py-8">
                <div className="group flex cursor-default items-center gap-5">
                    <div className="bg-spotify-green/20 group-hover:bg-spotify-green/30 flex size-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                        <AudioLinesIcon animate className="text-spotify-green size-6" />
                    </div>
                    <h1 className="from-spotify-green bg-linear-to-r via-green-500 to-emerald-500 bg-clip-text text-4xl font-bold text-transparent transition-all duration-300 group-hover:scale-105">
                        Spotify Stats
                    </h1>
                </div>

                <SpotifyUserHeader user={user} isLoading={isLoadingUser} />

                <div className="grid grid-cols-1 gap-6">
                    <SpotifyTopTracks
                        tracks={trackItems}
                        mostPopularTrack={mostPopularTrack}
                        timeRange={tracksTimeRange}
                        onTimeRangeChange={setTracksTimeRange}
                        isLoading={isLoadingTracks}
                    />

                    <SpotifyTopArtists
                        artists={artistItems}
                        timeRange={artistsTimeRange}
                        onTimeRangeChange={setArtistsTimeRange}
                        isLoading={isLoadingArtists}
                    />

                    <SpotifyRecentlyPlayed
                        items={recentlyPlayed?.items}
                        isLoading={isLoadingRecentlyPlayed}
                    />
                </div>
            </div>
        </div>
    )
}

export default Spotify
