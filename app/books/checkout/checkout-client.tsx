"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
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
                label="Book order"
                title="Your bag is empty."
                body="Add a book before starting checkout."
            />
        )
    }

    if (checkoutError) {
        return (
            <CheckoutMessage
                label="Checkout"
                title="Checkout needs attention."
                body={checkoutError}
            />
        )
    }

    return (
        <CheckoutMessage
            label="Secure checkout"
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

const CheckoutMessage = ({
    label,
    title,
    body,
}: {
    label: string
    title: string
    body: string
}) => {
    return (
        <div className="editorial-transaction-state border-border/65 mx-auto flex min-h-[28rem] max-w-3xl flex-col items-center justify-center border-y px-4 py-16 text-center">
            <div className="text-primary mb-6 flex items-center gap-3 text-[0.68rem] font-bold tracking-[0.19em] uppercase">
                <span className="bg-primary h-px w-10" />
                <p>{label}</p>
                <span className="bg-primary h-px w-10" />
            </div>
            <h1 className="text-foreground text-3xl font-semibold tracking-tight">
                {title}
            </h1>
            <p className="text-muted-foreground mt-3 leading-7">{body}</p>
            <Link href="/books" className="editorial-back-link mt-7">
                <ChevronLeft />
                Back to books
            </Link>
        </div>
    )
}
