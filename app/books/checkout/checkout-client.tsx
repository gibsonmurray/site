"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { type CartItem, useCartStore } from "@/lib/cart-store"

export const CheckoutClient = ({
    directItems,
}: {
    directItems?: CartItem[]
}) => {
    const cartItems = useCartStore((state) => state.items)
    const items = directItems ?? cartItems
    const checkoutMode = directItems === undefined ? "cart" : "direct"
    const checkoutKey = JSON.stringify(items)
    const [checkoutError, setCheckoutError] = useState<string | null>(null)

    useEffect(() => {
        if (items.length === 0) return

        let isCurrent = true
        setCheckoutError(null)

        void (async () => {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, checkoutMode }),
            })
            const data = await readJson(res)
            const checkoutUrl = typeof data.url === "string" ? data.url : null
            const error = typeof data.error === "string" ? data.error : null

            if (!isCurrent) return

            if (!res.ok || !checkoutUrl) {
                setCheckoutError(error ?? "Unable to start checkout.")
                return
            }

            window.location.assign(checkoutUrl)
        })().catch((error) => {
            if (!isCurrent) return
            setCheckoutError(
                error instanceof Error
                    ? error.message
                    : "Unable to start checkout.",
            )
        })

        return () => {
            isCurrent = false
        }
    }, [checkoutKey, checkoutMode, items])

    if (items.length === 0) {
        return (
            <CheckoutMessage
                title="Your bag is empty."
                body="Add a book before starting checkout."
            />
        )
    }

    if (checkoutError) {
        return (
            <CheckoutMessage
                title="Checkout needs attention."
                body={checkoutError}
            />
        )
    }

    return (
        <CheckoutMessage
            title="Opening checkout..."
            body="Taking you to Stripe's secure checkout."
        />
    )
}

const readJson = async (res: Response) => {
    const text = await res.text()
    if (!text) return {}

    try {
        return JSON.parse(text) as Record<string, unknown>
    } catch {
        return { error: text }
    }
}

const CheckoutMessage = ({ title, body }: { title: string; body: string }) => {
    return (
        <div className="mx-auto flex min-h-[28rem] max-w-lg flex-col items-center justify-center text-center">
            <h1 className="text-foreground text-3xl font-semibold tracking-tight">
                {title}
            </h1>
            <p className="text-muted-foreground mt-3 leading-7">{body}</p>
            <Link
                href="/books"
                className="border-border bg-background hover:bg-muted text-foreground mt-7 inline-flex h-9 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors"
            >
                Back to books
            </Link>
        </div>
    )
}
