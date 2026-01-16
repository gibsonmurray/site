"use client"

import { useState, useEffect, useCallback } from "react"
import { Album } from "@/types/photos"
import { fetchICloudAlbum } from "@/app/actions/photos"
import { PhotosGrid } from "./photos-grid"
import { PhotosLightbox } from "./photos-lightbox"
import { PhotoGridSkeleton } from "./photos-skeletons"
import {
    ImageIcon,
    CloudOffIcon,
    RefreshCwIcon,
    CalendarIcon,
    GridIcon,
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const Photos = () => {
    const [album, setAlbum] = useState<Album | null>(null)
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
        null
    )
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<"grid" | "days">("grid")

    const fetchAlbum = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const result = await fetchICloudAlbum()

            if (!result.success) {
                setError(result.error)
                return
            }

            setAlbum(result.album)
        } catch {
            setError("Failed to load photos. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Load album on mount
    useEffect(() => {
        fetchAlbum()
    }, [fetchAlbum])

    const currentPhotos = album?.photos || []

    const handlePhotoClick = useCallback((index: number) => {
        setSelectedPhotoIndex(index)
        setIsLightboxOpen(true)
    }, [])

    const handleLightboxClose = useCallback(() => {
        setIsLightboxOpen(false)
        setSelectedPhotoIndex(null)
    }, [])

    const handleLightboxNavigate = useCallback((index: number) => {
        setSelectedPhotoIndex(index)
    }, [])

    return (
        <div className="dark from-background to-card text-foreground flex size-full flex-col bg-linear-to-b">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-3">
                    <Image
                        src="/icons/photos.png"
                        alt="Photos"
                        width={32}
                        height={32}
                        className="size-8"
                    />
                    <div className="flex flex-col">
                        <h1 className="text-lg font-semibold text-white">
                            {album?.name || "Photos"}
                        </h1>
                        {album && (
                            <span className="text-muted-foreground text-xs">
                                {album.photos.length} photo
                                {album.photos.length !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* View mode toggle */}
                    <div className="flex gap-0.5 rounded-lg bg-white/5 p-0.5">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "flex items-center justify-center rounded-md px-2.5 py-1.5 text-xs transition-colors",
                                viewMode === "grid"
                                    ? "bg-white/10 text-white"
                                    : "text-white/60 hover:text-white"
                            )}
                        >
                            <GridIcon className="size-3.5" />
                        </button>
                        <button
                            onClick={() => setViewMode("days")}
                            className={cn(
                                "flex items-center justify-center rounded-md px-2.5 py-1.5 text-xs transition-colors",
                                viewMode === "days"
                                    ? "bg-white/10 text-white"
                                    : "text-white/60 hover:text-white"
                            )}
                        >
                            <CalendarIcon className="size-3.5" />
                        </button>
                    </div>

                    {/* Refresh button */}
                    <button
                        onClick={fetchAlbum}
                        disabled={isLoading}
                        className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors hover:bg-white/5 disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCwIcon
                            className={cn("size-4", isLoading && "animate-spin")}
                        />
                    </button>
                </div>
            </div>

            {/* Error banner */}
            {error && (
                <div className="flex items-center gap-2 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                    <CloudOffIcon className="size-4" />
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-400/60 hover:text-red-400"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Content area */}
            <div className="flex-1 overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb:hover]:bg-white/25">
                {isLoading ? (
                    <PhotoGridSkeleton count={24} />
                ) : currentPhotos.length === 0 ? (
                    <div className="flex size-full flex-col items-center justify-center gap-4">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-white/5">
                            <ImageIcon className="text-muted-foreground size-8" />
                        </div>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <p className="text-foreground font-medium">
                                No photos yet
                            </p>
                            <p className="text-muted-foreground text-sm">
                                Photos will appear here once the album is
                                configured
                            </p>
                        </div>
                    </div>
                ) : (
                    <PhotosGrid
                        photos={currentPhotos}
                        onPhotoClick={handlePhotoClick}
                        viewMode={viewMode}
                    />
                )}
            </div>

            {/* Lightbox */}
            <PhotosLightbox
                photos={currentPhotos}
                currentIndex={selectedPhotoIndex ?? 0}
                isOpen={isLightboxOpen}
                onClose={handleLightboxClose}
                onNavigate={handleLightboxNavigate}
            />
        </div>
    )
}

export default Photos
