"use client"

import { useEffect } from "react"
import { useCartStore } from "@/lib/cart-store"

export const ClearCart = () => {
    const clearCart = useCartStore((s) => s.clearCart)
    useEffect(() => {
        clearCart()
    }, [clearCart])
    return null
}
