"use server"

import { ESVPassage, ESVSearch } from "@/types/bible"

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
    const data = await response.json() as ESVPassage
    return data
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
    const data = await response.json() as ESVSearch
    return data
}

export const getBiblePassageAudio = async (passage: string) => {
    const response = await fetch(`${ESV_API_URL}/audio?q=${passage}`, {
        headers: {
            Authorization: `Token ${process.env.ESV_API_KEY}`,
        },
    })
    if (!response.ok) {
        throw new Error(`Failed to get Bible passage audio: ${response.statusText}`)
    }
    const data = await response.blob() 

    return data
}