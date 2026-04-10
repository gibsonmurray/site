import { create } from "zustand"
import { BookFormat } from "./books"

export type BookPrices = Partial<Record<string, Partial<Record<BookFormat, number>>>>

type PricesStore = {
    prices: BookPrices
    setPrices: (prices: BookPrices) => void
    getPrice: (slug: string, format: BookFormat) => number | undefined
}

export const usePricesStore = create<PricesStore>((set, get) => ({
    prices: {},
    setPrices: (prices) => set({ prices }),
    getPrice: (slug, format) => get().prices[slug]?.[format],
}))
