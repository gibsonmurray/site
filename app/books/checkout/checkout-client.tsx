"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
    EmbeddedCheckout,
    EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { type CartItem, useCartStore } from "@/lib/cart-store"

const publishableKey =
    process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

export const CheckoutClient = ({
    directItems,
}: {
    directItems?: CartItem[]
}) => {
    const cartItems = useCartStore((state) => state.items)
    const items = directItems ?? cartItems
    const checkoutMode = directItems === undefined ? "cart" : "direct"
    const checkoutKey = JSON.stringify(items)
    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [checkoutError, setCheckoutError] = useState<string | null>(null)

    useEffect(() => {
        if (items.length === 0) return

        let isCurrent = true
        setClientSecret(null)
        setCheckoutError(null)

        void (async () => {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, checkoutMode }),
            })
            const data = await readJson(res)
            const nextClientSecret =
                typeof data.clientSecret === "string" ? data.clientSecret : null
            const error = typeof data.error === "string" ? data.error : null

            if (!isCurrent) return

            if (!res.ok || !nextClientSecret) {
                setCheckoutError(error ?? "Unable to start checkout.")
                return
            }

            if (hasStripeModeMismatch(nextClientSecret, publishableKey)) {
                setCheckoutError(
                    "Stripe checkout keys are mismatched. Use a publishable key from the same Stripe mode as the checkout secret key.",
                )
                return
            }

            setClientSecret(nextClientSecret)
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

    const options = useMemo(
        () => ({
            clientSecret,
            onShippingDetailsChange: async (event: {
                checkoutSessionId: string
                shippingDetails: unknown
            }) => {
                const res = await fetch("/api/checkout/shipping-options", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        checkout_session_id: event.checkoutSessionId,
                        shipping_details: event.shippingDetails,
                    }),
                })
                const data = await readJson(res)
                const error = typeof data.error === "string" ? data.error : null

                if (!res.ok) {
                    return {
                        type: "reject" as const,
                        errorMessage:
                            error ?? "Unable to calculate shipping options.",
                    }
                }

                return { type: "accept" as const }
            },
        }),
        [clientSecret],
    )

    if (!publishableKey || !stripePromise) {
        return (
            <CheckoutMessage
                title="Checkout is not configured."
                body="Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to enable embedded Checkout."
            />
        )
    }

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

    if (!clientSecret) {
        return (
            <CheckoutMessage
                title="Starting checkout..."
                body="Preparing your secure Stripe checkout."
            />
        )
    }

    return (
        <div className="mx-auto max-w-4xl">
            <EmbeddedCheckoutProvider
                key={checkoutKey}
                stripe={stripePromise}
                options={options}
            >
                <EmbeddedCheckout className="min-h-[42rem]" />
            </EmbeddedCheckoutProvider>
        </div>
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

const hasStripeModeMismatch = (
    clientSecret: string,
    key: string | undefined,
) => {
    if (!key) return false

    return (
        (clientSecret.startsWith("cs_live_") && key.startsWith("pk_test_")) ||
        (clientSecret.startsWith("cs_test_") && key.startsWith("pk_live_"))
    )
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
