"use client"

import { useEffect } from "react"
import { usePricesStore, type BookPrices } from "@/lib/prices-store"

export const PricesProvider = ({ prices }: { prices: BookPrices }) => {
    const setPrices = usePricesStore((s) => s.setPrices)
    useEffect(() => {
        setPrices(prices)
    }, [prices, setPrices])
    return null
}
