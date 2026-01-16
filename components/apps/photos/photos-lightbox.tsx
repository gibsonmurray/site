"use client"

import { Photo } from "@/types/photos"
import { getMediumUrl, formatPhotoDate } from "./photos-utils"
import { cn } from "@/lib/utils"
import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import {
    XIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    InfoIcon,
    DownloadIcon,
    ZoomInIcon,
    ZoomOutIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

interface PhotosLightboxProps {
    photos: Photo[]
    currentIndex: number
    isOpen: boolean
    onClose: () => void
    onNavigate: (index: number) => void
}

export function PhotosLightbox({
    photos,
    currentIndex,
    isOpen,
    onClose,
    onNavigate,
}: PhotosLightboxProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [showInfo, setShowInfo] = useState(false)
    const [zoom, setZoom] = useState(1)

    const currentPhoto = photos[currentIndex]

    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            setIsLoading(true)
            setZoom(1)
            onNavigate(currentIndex - 1)
        }
    }, [currentIndex, onNavigate])

    const handleNext = useCallback(() => {
        if (currentIndex < photos.length - 1) {
            setIsLoading(true)
            setZoom(1)
            onNavigate(currentIndex + 1)
        }
    }, [currentIndex, photos.length, onNavigate])

    const handleDownload = () => {
        if (currentPhoto) {
            const url = getMediumUrl(currentPhoto)
            window.open(url, "_blank")
        }
    }

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.5, 3))
    }

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.5, 1))
    }

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowLeft":
                    handlePrevious()
                    break
                case "ArrowRight":
                    handleNext()
                    break
                case "Escape":
                    onClose()
                    break
                case "i":
                    setShowInfo((prev) => !prev)
                    break
                case "+":
                case "=":
                    handleZoomIn()
                    break
                case "-":
                    handleZoomOut()
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, handlePrevious, handleNext, onClose])

    if (!isOpen || !currentPhoto) return null

    const imageUrl = getMediumUrl(currentPhoto)

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-background/95 absolute inset-0 z-50 flex items-center justify-center backdrop-blur-xl rounded-lg"
                onClick={onClose}
            >
                {/* Top bar */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/40 p-3 backdrop-blur-sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors hover:bg-white/10"
                    >
                        <XIcon className="size-5" />
                    </button>

                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <span>
                            {currentIndex + 1} / {photos.length}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleZoomOut}
                            disabled={zoom <= 1}
                            className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors hover:bg-white/10 disabled:opacity-30"
                        >
                            <ZoomOutIcon className="size-4" />
                        </button>
                        <button
                            onClick={handleZoomIn}
                            disabled={zoom >= 3}
                            className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors hover:bg-white/10 disabled:opacity-30"
                        >
                            <ZoomInIcon className="size-4" />
                        </button>
                        <button
                            onClick={() => setShowInfo((prev) => !prev)}
                            className={cn(
                                "rounded-lg p-2 transition-colors hover:bg-white/10",
                                showInfo
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <InfoIcon className="size-4" />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors hover:bg-white/10"
                        >
                            <DownloadIcon className="size-4" />
                        </button>
                    </div>
                </motion.div>

                {/* Navigation buttons */}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        handlePrevious()
                    }}
                    disabled={currentIndex === 0}
                    className={cn(
                        "text-muted-foreground hover:text-foreground absolute left-4 z-10 rounded-full bg-black/40 p-3 backdrop-blur-sm transition-all",
                        "hover:bg-black/60",
                        "disabled:pointer-events-none disabled:opacity-0"
                    )}
                >
                    <ChevronLeftIcon className="size-6" />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        handleNext()
                    }}
                    disabled={currentIndex === photos.length - 1}
                    className={cn(
                        "text-muted-foreground hover:text-foreground absolute right-4 z-10 rounded-full bg-black/40 p-3 backdrop-blur-sm transition-all",
                        "hover:bg-black/60",
                        "disabled:pointer-events-none disabled:opacity-0"
                    )}
                >
                    <ChevronRightIcon className="size-6" />
                </button>

                {/* Image */}
                <motion.div
                    key={currentPhoto.photoGuid}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="relative flex size-full items-center justify-center p-16"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className="relative transition-transform duration-200"
                        style={{
                            transform: `scale(${zoom})`,
                            maxWidth: "100%",
                            maxHeight: "100%",
                        }}
                    >
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="size-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            </div>
                        )}
                        <Image
                            src={imageUrl}
                            alt={currentPhoto.caption || "Photo"}
                            width={currentPhoto.width}
                            height={currentPhoto.height}
                            className={cn(
                                "max-h-[calc(100vh-8rem)] max-w-full rounded-lg object-contain shadow-2xl transition-opacity duration-300",
                                isLoading ? "opacity-0" : "opacity-100"
                            )}
                            onLoad={() => setIsLoading(false)}
                            priority
                            unoptimized
                        />
                    </div>
                </motion.div>

                {/* Info panel */}
                <AnimatePresence>
                    {showInfo && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-card/80 absolute top-16 right-4 bottom-4 z-10 w-72 overflow-auto rounded-xl border border-white/10 p-4 backdrop-blur-xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-foreground mb-4 text-lg font-semibold">
                                Info
                            </h3>
                            <div className="flex flex-col gap-3 text-sm">
                                {currentPhoto.caption && (
                                    <div>
                                        <p className="text-muted-foreground">
                                            Caption
                                        </p>
                                        <p className="text-foreground">
                                            {currentPhoto.caption}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-muted-foreground">Date</p>
                                    <p className="text-foreground">
                                        {formatPhotoDate(currentPhoto.dateCreated)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">
                                        Dimensions
                                    </p>
                                    <p className="text-foreground">
                                        {currentPhoto.width} × {currentPhoto.height}
                                    </p>
                                </div>
                                {currentPhoto.contributorFullName && (
                                    <div>
                                        <p className="text-muted-foreground">
                                            Contributor
                                        </p>
                                        <p className="text-foreground">
                                            {currentPhoto.contributorFullName}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Thumbnail strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="absolute bottom-4 left-1/2 z-10 flex max-w-[80%] -translate-x-1/2 gap-1 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-2 backdrop-blur-sm"
                    onClick={(e) => e.stopPropagation()}
                >
                    {photos
                        .slice(
                            Math.max(0, currentIndex - 5),
                            Math.min(photos.length, currentIndex + 6)
                        )
                        .map((photo, i) => {
                            const actualIndex = Math.max(0, currentIndex - 5) + i
                            return (
                                <button
                                    key={photo.photoGuid}
                                    onClick={() => {
                                        setIsLoading(true)
                                        setZoom(1)
                                        onNavigate(actualIndex)
                                    }}
                                    className={cn(
                                        "relative size-12 shrink-0 overflow-hidden rounded-md transition-all",
                                        actualIndex === currentIndex
                                            ? "ring-2 ring-white"
                                            : "opacity-50 hover:opacity-80"
                                    )}
                                >
                                    <Image
                                        src={getMediumUrl(photo)}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                        unoptimized
                                    />
                                </button>
                            )
                        })}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
