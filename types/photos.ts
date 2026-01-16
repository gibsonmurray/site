export interface PhotoDerivative {
    checksum: string
    fileSize: number
    width: number
    height: number
    url: string
}

export interface Photo {
    photoGuid: string
    caption?: string
    batchDateCreated: string
    dateCreated: string
    width: number
    height: number
    derivatives: {
        [key: string]: PhotoDerivative
    }
    contributorLastName?: string
    contributorFirstName?: string
    contributorFullName?: string
    batchGuid?: string
    mediaAssetType?: string
}

export interface Album {
    id: string
    name: string
    url: string
    token: string
    photos: Photo[]
    photoCount?: number
    lastFetched?: string
}

export interface PhotosState {
    albums: Album[]
    selectedAlbumId: string | null
    selectedPhotoIndex: number | null
    isLightboxOpen: boolean
    isAddingAlbum: boolean
    view: "grid" | "list"
}

// iCloud API response types
export interface ICloudPhotoResponse {
    photoGuids: string[]
    photos: {
        [guid: string]: Photo
    }
}

export interface ICloudAlbumResponse {
    streamCtag: string
    itemsReturned: number
    locations: Record<string, unknown>
    userFirstName: string
    userLastName: string
    streamName: string
    photos: ICloudPhotoResponse
}
