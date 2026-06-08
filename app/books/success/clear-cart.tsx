"use client"

import { useEffect } from "react"
import { useCartStore } from "@/lib/cart-store"

export const ClearCart = ({ enabled = true }: { enabled?: boolean }) => {
    const clearCart = useCartStore((s) => s.clearCart)
    useEffect(() => {
        if (enabled) clearCart()
    }, [clearCart, enabled])
    return null
}
