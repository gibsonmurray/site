"use client"

import { useState, useEffect } from "react"
import { Share2, Check, Link as LinkIcon } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

interface ShareButtonsProps {
    title: string
    slug: string
    description?: string
}

export const ShareButtons = ({
    title,
    slug,
    description,
}: ShareButtonsProps) => {
    const [copied, setCopied] = useState(false)
    const [url, setUrl] = useState("")

    useEffect(() => {
        // Construct URL only after client-side hydration
        const fullUrl = `${window.location.origin}/blog/${slug}`
        setUrl(fullUrl)
    }, [slug])

    const shareData = {
        x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }

    const openExternal = (targetUrl: string) => {
        window.open(targetUrl, "_blank", "noopener,noreferrer")
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    return (
        <div className="flex items-center gap-2">
            {url && (
                <div className="flex items-center gap-2 sm:hidden">
                    <button
                        onClick={() => openExternal(shareData.x)}
                        className="bg-muted/40 hover:bg-muted/60 inline-flex size-8 items-center justify-center rounded-md transition-all duration-200"
                        aria-label="Share on X"
                        title="Share on X"
                    >
                        <span className="text-sm font-bold text-black">𝕏</span>
                    </button>
                    <button
                        onClick={() => openExternal(shareData.linkedin)}
                        className="bg-muted/40 hover:bg-muted/60 inline-flex size-8 items-center justify-center rounded-md transition-all duration-200"
                        aria-label="Share on LinkedIn"
                        title="Share on LinkedIn"
                    >
                        <span className="text-sm font-bold text-blue-600">
                            in
                        </span>
                    </button>
                    <button
                        onClick={handleCopyLink}
                        className="bg-muted/40 hover:bg-muted/60 inline-flex size-8 items-center justify-center rounded-md transition-all duration-200"
                        aria-label={copied ? "Link copied" : "Copy link"}
                        title={copied ? "Copied" : "Copy link"}
                    >
                        {copied ? (
                            <Check className="size-4 text-green-600" />
                        ) : (
                            <LinkIcon className="size-4" />
                        )}
                    </button>
                </div>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger
                    className="bg-muted/40 hover:bg-muted/60 hidden items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium no-underline transition-all duration-200 hover:scale-105 sm:inline-flex"
                    title="Share this post"
                >
                    <Share2 className="size-4" />
                    <span>Share</span>
                </DropdownMenuTrigger>
                {url && (
                    <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="min-w-48"
                    >
                        <DropdownMenuItem
                            onClick={() => openExternal(shareData.x)}
                            className="flex cursor-pointer items-center gap-3 no-underline"
                        >
                            <span className="text-base font-bold text-black">
                                𝕏
                            </span>
                            <span className="font-medium">Share on X</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => openExternal(shareData.linkedin)}
                            className="flex cursor-pointer items-center gap-3 no-underline"
                        >
                            <span className="text-base font-bold text-blue-600">
                                in
                            </span>
                            <span className="font-medium">
                                Share on LinkedIn
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleCopyLink}
                            className="flex cursor-pointer items-center gap-3 no-underline"
                        >
                            {copied ? (
                                <>
                                    <Check className="size-4 shrink-0 text-green-600" />
                                    <span className="font-medium">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <LinkIcon className="size-4 shrink-0" />
                                    <span className="font-medium">
                                        Copy link
                                    </span>
                                </>
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                )}
            </DropdownMenu>
        </div>
    )
}
