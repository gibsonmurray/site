"use client"

import { Photo } from "@/types/photos"
import { getThumbnailUrl, groupPhotosByDate } from "./photos-utils"
import { cn } from "@/lib/utils"
import { useState, useMemo } from "react"
import Image from "next/image"

interface PhotosGridProps {
    photos: Photo[]
    onPhotoClick: (index: number) => void
    viewMode?: "grid" | "days"
}

export function PhotosGrid({
    photos,
    onPhotoClick,
    viewMode = "grid",
}: PhotosGridProps) {
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

    const groupedPhotos = useMemo(() => {
        if (viewMode === "days") {
            return groupPhotosByDate(photos)
        }
        return null
    }, [photos, viewMode])

    const handleImageLoad = (guid: string) => {
        setLoadedImages((prev) => new Set(prev).add(guid))
    }

    if (viewMode === "days" && groupedPhotos) {
        let globalIndex = 0

        return (
            <div className="flex flex-col">
                {Array.from(groupedPhotos.entries()).map(
                    ([date, datePhotos]) => {
                        const startIndex = globalIndex
                        globalIndex += datePhotos.length

                        return (
                            <div key={date} className="flex flex-col">
                                <div className="bg-background/80 sticky top-0 z-10 px-4 py-2 backdrop-blur-sm">
                                    <h3 className="text-muted-foreground text-sm font-medium">
                                        {date}
                                    </h3>
                                </div>
                                <div className="grid grid-cols-3 gap-0.5 p-0.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                                    {datePhotos.map((photo, i) => (
                                        <PhotoTile
                                            key={photo.photoGuid}
                                            photo={photo}
                                            index={startIndex + i}
                                            isLoaded={loadedImages.has(
                                                photo.photoGuid
                                            )}
                                            onLoad={() =>
                                                handleImageLoad(photo.photoGuid)
                                            }
                                            onClick={() =>
                                                onPhotoClick(startIndex + i)
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    }
                )}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-3 gap-0.5 p-0.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {photos.map((photo, index) => (
                <PhotoTile
                    key={photo.photoGuid}
                    photo={photo}
                    index={index}
                    isLoaded={loadedImages.has(photo.photoGuid)}
                    onLoad={() => handleImageLoad(photo.photoGuid)}
                    onClick={() => onPhotoClick(index)}
                />
            ))}
        </div>
    )
}

interface PhotoTileProps {
    photo: Photo
    index: number
    isLoaded: boolean
    onLoad: () => void
    onClick: () => void
}

function PhotoTile({ photo, isLoaded, onLoad, onClick }: PhotoTileProps) {
    const thumbnailUrl = getThumbnailUrl(photo)

    return (
        <button
            onClick={onClick}
            className={cn(
                "bg-muted/50 group relative aspect-square overflow-hidden",
                "cursor-pointer transition-transform duration-200",
                "hover:z-10 hover:scale-[1.02]",
                "focus-visible:z-10 focus-visible:scale-[1.02] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            )}
        >
            {thumbnailUrl && (
                <Image
                    src={thumbnailUrl}
                    alt={photo.caption || "Photo"}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                    className={cn(
                        "object-cover transition-all duration-300",
                        isLoaded ? "opacity-100" : "opacity-0",
                        "group-hover:brightness-110"
                    )}
                    onLoad={onLoad}
                />
            )}
            {!isLoaded && (
                <div className="bg-muted/30 absolute inset-0 animate-pulse" />
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
        </button>
    )
}
