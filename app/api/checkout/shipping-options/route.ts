import { NextRequest, NextResponse } from "next/server"
import { type CartItem } from "@/lib/cart-store"
import {
    getBookShippingOptions,
    getPhysicalQuantity,
    validateBookShippingDetails,
} from "@/lib/book-shipping"
import { getCheckoutStripe } from "@/lib/stripe-server"

export async function POST(req: NextRequest) {
    const stripe = getCheckoutStripe()
    const body = await req.json()
    const checkoutSessionId = body.checkout_session_id

    if (typeof checkoutSessionId !== "string") {
        return NextResponse.json(
            { error: "Missing Checkout Session ID." },
            { status: 400 },
        )
    }

    const shippingDetails = validateBookShippingDetails(body.shipping_details)
    if (!shippingDetails) {
        return NextResponse.json(
            { error: "Enter a complete US shipping address." },
            { status: 400 },
        )
    }

    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId)
    const physicalQuantity = getPhysicalQuantity(parseCheckoutItems(session))

    if (physicalQuantity <= 0) {
        return NextResponse.json({ ok: true })
    }

    await stripe.checkout.sessions.update(checkoutSessionId, {
        collected_information: {
            shipping_details: {
                address: {
                    city: shippingDetails.address?.city ?? undefined,
                    country: "US",
                    line1: shippingDetails.address?.line1 ?? "",
                    line2: shippingDetails.address?.line2 ?? undefined,
                    postal_code:
                        shippingDetails.address?.postal_code ?? undefined,
                    state: shippingDetails.address?.state ?? undefined,
                },
                name: shippingDetails.name ?? "",
            },
        },
        shipping_options: getBookShippingOptions(
            physicalQuantity,
            shippingDetails,
        ),
    })

    return NextResponse.json({ ok: true })
}

const parseCheckoutItems = (session: {
    metadata?: Record<string, string> | null
}) => {
    const rawItems = session.metadata?.items
    if (!rawItems) return []

    try {
        const items = JSON.parse(rawItems)
        return Array.isArray(items) ? (items as CartItem[]) : []
    } catch {
        return []
    }
}
