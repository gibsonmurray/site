import { FastAverageColor } from "fast-average-color"

export type GlowColor = {
    red: number
    green: number
    blue: number
}

export const DEFAULT_GLOW: GlowColor = {
    red: 96,
    green: 96,
    blue: 128,
}

const clampChannel = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value)))

const averageColor = new FastAverageColor()

export const mixWithWhite = (color: GlowColor, amount: number): GlowColor => ({
    red: clampChannel(color.red + (255 - color.red) * amount),
    green: clampChannel(color.green + (255 - color.green) * amount),
    blue: clampChannel(color.blue + (255 - color.blue) * amount),
})

export const mixWithBlack = (color: GlowColor, amount: number): GlowColor => ({
    red: clampChannel(color.red * (1 - amount)),
    green: clampChannel(color.green * (1 - amount)),
    blue: clampChannel(color.blue * (1 - amount)),
})

export const sampleGlowColor = async (
    imageElement: HTMLImageElement,
): Promise<GlowColor> => {
    try {
        const { value } = await averageColor.getColorAsync(imageElement, {
            algorithm: "dominant",
            mode: "precision",
            step: 1,
            silent: true,
        })

        return {
            red: clampChannel(value[0]),
            green: clampChannel(value[1]),
            blue: clampChannel(value[2]),
        }
    } catch {
        return DEFAULT_GLOW
    }
}

export const glowRgb = (color: GlowColor) =>
    `${color.red}, ${color.green}, ${color.blue}`
