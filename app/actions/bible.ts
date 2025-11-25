"use server"

import { ESVPassageSchema, ESVSearchSchema } from "@/types/bible"

const ESV_API_URL = "https://api.esv.org/v3/passage"

export const getBiblePassage = async (
    passage: string,
    format: "html" | "text" = "html",
) => {
    const response = await fetch(`${ESV_API_URL}/${format}?q=${passage}`, {
        headers: {
            Authorization: `Token ${process.env.ESV_API_KEY}`,
        },
    })
    if (!response.ok) {
        throw new Error(`Failed to get Bible passage: ${response.statusText}`)
    }
    const data = await response.json()
    const parsed = ESVPassageSchema.parse(data)
    return parsed
}

export const getBibleSearch = async (query: string) => {
    const response = await fetch(`${ESV_API_URL}/search?q=${query}`, {
        headers: {
            Authorization: `Token ${process.env.ESV_API_KEY}`,
        },
    })
    if (!response.ok) {
        throw new Error(`Failed to get Bible search: ${response.statusText}`)
    }
    const data = await response.json()
    const parsed = ESVSearchSchema.parse(data)
    return parsed
}

export const getBiblePassageAudio = async (passage: string): Promise<string> => {
    const response = await fetch(`${ESV_API_URL}/audio?q=${passage}`, {
        headers: {
            Authorization: `Token ${process.env.ESV_API_KEY}`,
        },
    })
    if (!response.ok) {
        throw new Error(`Failed to get Bible passage audio: ${response.statusText}`)
    }
    const blob = await response.blob()
    
    // Convert blob to base64 data URL for use in HTML audio element
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    const mimeType = blob.type || 'audio/mpeg' // Default to MP3 if type not detected
    const dataUrl = `data:${mimeType};base64,${base64}`
    
    return dataUrl
}