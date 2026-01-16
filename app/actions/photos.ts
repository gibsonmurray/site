"use server"

import { Photo, Album } from "@/types/photos"
import { ICLOUD_ALBUM_URL } from "@/lib/constants"

const ICLOUD_BASE_URL = "https://p23-sharedstreams.icloud.com"

interface StreamResponse {
    "X-Apple-MMe-Host"?: string
}

interface PhotoMetadata {
    photoGuid: string
    dateCreated: string
    caption?: string
    batchDateCreated?: string
    width?: number
    height?: number
    mediaAssetType?: string
    derivatives: {
        [key: string]: {
            checksum: string
            fileSize: number
            width: number
            height: number
        }
    }
}

interface WebStreamResponse {
    streamCtag?: string
    itemsReturned?: number
    streamName?: string
    userFirstName?: string
    userLastName?: string
    photos?: PhotoMetadata[]
}

interface AssetUrlsResponse {
    items: {
        [checksum: string]: {
            url_location: string
            url_path: string
        }
    }
}

/**
 * Extract the album token from an iCloud shared album URL
 */
function extractAlbumToken(url: string): string | null {
    try {
        if (url.includes("#")) {
            const parts = url.split("#")
            return parts[1] || null
        }
        if (/^[A-Za-z0-9]+$/.test(url)) {
            return url
        }
        return null
    } catch {
        return null
    }
}

/**
 * Get the correct iCloud host for the album (handles 330 redirects)
 */
async function getAlbumHost(token: string): Promise<string> {
    try {
        const response = await fetch(
            `${ICLOUD_BASE_URL}/${token}/sharedstreams/webstream`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain",
                    Origin: "https://www.icloud.com",
                },
                body: JSON.stringify({ streamCtag: null }),
            }
        )

        if (response.status === 330) {
            const data = (await response.json()) as StreamResponse
            if (data["X-Apple-MMe-Host"]) {
                return `https://${data["X-Apple-MMe-Host"]}`
            }
        }

        const text = await response.text()
        try {
            const data = JSON.parse(text) as StreamResponse
            if (data["X-Apple-MMe-Host"]) {
                return `https://${data["X-Apple-MMe-Host"]}`
            }
        } catch {
            // Not JSON, continue with default
        }

        return ICLOUD_BASE_URL
    } catch (error) {
        console.error("Error getting album host:", error)
        return ICLOUD_BASE_URL
    }
}

/**
 * Fetch album metadata and photos from iCloud
 */
async function fetchAlbumData(
    token: string,
    baseUrl: string
): Promise<WebStreamResponse> {
    const response = await fetch(
        `${baseUrl}/${token}/sharedstreams/webstream`,
        {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                Origin: "https://www.icloud.com",
            },
            body: JSON.stringify({ streamCtag: null }),
        }
    )

    const text = await response.text()
    let data: WebStreamResponse & StreamResponse

    try {
        data = JSON.parse(text)
    } catch {
        throw new Error(`Invalid response from iCloud`)
    }

    if (data["X-Apple-MMe-Host"]) {
        const newBaseUrl = `https://${data["X-Apple-MMe-Host"]}`
        return fetchAlbumData(token, newBaseUrl)
    }

    if (!response.ok && !data.photos) {
        throw new Error(`Failed to fetch album: ${response.status}`)
    }

    return data
}

/**
 * Fetch asset URLs for the photos
 */
async function fetchAssetUrls(
    token: string,
    baseUrl: string,
    photoGuids: string[]
): Promise<AssetUrlsResponse> {
    const response = await fetch(
        `${baseUrl}/${token}/sharedstreams/webasseturls`,
        {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                Origin: "https://www.icloud.com",
            },
            body: JSON.stringify({ photoGuids }),
        }
    )

    if (!response.ok) {
        throw new Error(`Failed to fetch asset URLs: ${response.status}`)
    }

    return response.json()
}

/**
 * Build the full URL for a photo derivative
 */
function buildPhotoUrl(location: string, path: string): string {
    return `https://${location}${path}`
}

/**
 * Fetch all photos from the configured iCloud shared album
 */
export async function fetchICloudAlbum(): Promise<
    { success: true; album: Album } | { success: false; error: string }
> {
    try {
        const token = extractAlbumToken(ICLOUD_ALBUM_URL)
        if (!token) {
            return { success: false, error: "Invalid iCloud album URL configured" }
        }

        // Get the correct host (handles redirects)
        const baseUrl = await getAlbumHost(token)

        // Fetch album data
        const albumData = await fetchAlbumData(token, baseUrl)

        const photosArray = Array.isArray(albumData.photos)
            ? albumData.photos
            : []

        if (photosArray.length === 0) {
            return {
                success: true,
                album: {
                    id: token,
                    name: albumData.streamName || "Photos",
                    url: ICLOUD_ALBUM_URL,
                    token,
                    photos: [],
                    photoCount: 0,
                    lastFetched: new Date().toISOString(),
                },
            }
        }

        // Collect all photo guids
        const photoGuids = photosArray.map((p) => p.photoGuid)

        // Fetch asset URLs
        const assetData = await fetchAssetUrls(token, baseUrl, photoGuids)

        // Map photos with their URLs
        const photos: Photo[] = photosArray.map((photoMeta) => {
            const derivatives: Photo["derivatives"] = {}

            if (photoMeta.derivatives) {
                Object.entries(photoMeta.derivatives).forEach(([key, deriv]) => {
                    const assetInfo = assetData.items?.[deriv.checksum]
                    derivatives[key] = {
                        checksum: deriv.checksum,
                        fileSize: deriv.fileSize,
                        width: deriv.width,
                        height: deriv.height,
                        url: assetInfo
                            ? buildPhotoUrl(assetInfo.url_location, assetInfo.url_path)
                            : "",
                    }
                })
            }

            return {
                photoGuid: photoMeta.photoGuid,
                caption: photoMeta.caption,
                batchDateCreated: photoMeta.batchDateCreated || photoMeta.dateCreated,
                dateCreated: photoMeta.dateCreated,
                width: photoMeta.width || 0,
                height: photoMeta.height || 0,
                derivatives,
                mediaAssetType: photoMeta.mediaAssetType,
            }
        })

        // Sort by date (newest first)
        photos.sort(
            (a, b) =>
                new Date(b.dateCreated).getTime() -
                new Date(a.dateCreated).getTime()
        )

        const album: Album = {
            id: token,
            name: albumData.streamName || "Photos",
            url: ICLOUD_ALBUM_URL,
            token,
            photos,
            photoCount: photos.length,
            lastFetched: new Date().toISOString(),
        }

        return { success: true, album }
    } catch (error) {
        console.error("Error fetching iCloud album:", error)
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to fetch album",
        }
    }
}
