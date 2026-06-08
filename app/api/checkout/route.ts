import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { books } from "@/lib/books"
import { type CartItem } from "@/lib/cart-store"
import {
    getPendingShippingOptions,
    getPhysicalQuantity,
    isPhysicalBookFormat,
} from "@/lib/book-shipping"
import { getCheckoutStripe } from "@/lib/stripe-server"

type CheckoutSessionCreateParams = NonNullable<
    Parameters<
        ReturnType<typeof getCheckoutStripe>["checkout"]["sessions"]["create"]
    >[0]
>
type CheckoutAllowedCountry = NonNullable<
    CheckoutSessionCreateParams["shipping_address_collection"]
>["allowed_countries"][number]

const baseUrl =
    process.env.NODE_ENV === "production"
        ? "https://gibsonmurray.com"
        : "http://localhost:3000"

type CheckoutLineItem =
    | { price: string; quantity: number }
    | {
          price_data: {
              currency: "usd"
              product: string
              unit_amount: number
          }
          quantity: number
      }

export async function POST(req: NextRequest) {
    try {
        const stripe = getCheckoutStripe()
        const body = await req.json()
        const items: CartItem[] = body.items
        const checkoutMode = body.checkoutMode === "direct" ? "direct" : "cart"

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "No items provided" },
                { status: 400 },
            )
        }

        const lineItems: CheckoutLineItem[] = []
        const checkoutItems: CartItem[] = []
        let requiresShipping = false

        for (const { bookId, format, quantity } of items) {
            if (!Number.isFinite(quantity)) {
                return NextResponse.json(
                    { error: "Invalid item quantity" },
                    { status: 400 },
                )
            }

            const book = books.find((b) => b.slug === bookId)
            if (!book || book.status.type === "coming-soon") {
                return NextResponse.json(
                    { error: "Book not available for purchase" },
                    { status: 400 },
                )
            }

            const formatOption = book.formats[format]
            if (!formatOption?.available) {
                return NextResponse.json(
                    { error: `Format "${format}" is not available` },
                    { status: 400 },
                )
            }

            if (!formatOption.productId) {
                return NextResponse.json(
                    { error: `Stripe product not configured for "${format}"` },
                    { status: 500 },
                )
            }

            const normalizedQuantity = Math.max(1, Math.min(99, quantity))
            const defaultPriceId =
                formatOption.priceCents === undefined
                    ? await getDefaultPriceId(stripe, formatOption.productId)
                    : null

            if (formatOption.priceCents === undefined && !defaultPriceId) {
                return NextResponse.json(
                    { error: "Book price not configured in Stripe" },
                    { status: 500 },
                )
            }

            const lineItem: CheckoutLineItem =
                formatOption.priceCents !== undefined
                    ? {
                          price_data: {
                              currency: "usd",
                              product: formatOption.productId,
                              unit_amount: formatOption.priceCents,
                          },
                          quantity: normalizedQuantity,
                      }
                    : {
                          price: defaultPriceId!,
                          quantity: normalizedQuantity,
                      }

            lineItems.push(lineItem)
            checkoutItems.push({
                bookId,
                format,
                quantity: normalizedQuantity,
            })
            if (isPhysicalBookFormat(format)) {
                requiresShipping = true
            }
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            ui_mode: "embedded_page",
            line_items: lineItems,
            allow_promotion_codes: true,
            automatic_tax: { enabled: true },
            custom_fields: [
                {
                    key: "gift_message",
                    label: {
                        type: "custom",
                        custom: "Gift message (optional)",
                    },
                    type: "text",
                    optional: true,
                },
            ],
            ...(requiresShipping
                ? {
                      shipping_address_collection: {
                          allowed_countries: getAllowedShippingCountries(),
                      },
                      permissions: {
                          update_shipping_details: "server_only" as const,
                      },
                      shipping_options: getPendingShippingOptions(),
                  }
                : {}),
            phone_number_collection: { enabled: true },
            return_url: `${baseUrl}/books/success?session_id={CHECKOUT_SESSION_ID}&checkout=${checkoutMode}`,
            metadata: {
                items: JSON.stringify(checkoutItems),
                checkout_mode: checkoutMode,
                physical_quantity: String(getPhysicalQuantity(checkoutItems)),
            },
        })

        if (!session.client_secret) {
            return NextResponse.json(
                { error: "Unable to create checkout session" },
                { status: 500 },
            )
        }

        return NextResponse.json({ clientSecret: session.client_secret })
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unable to create checkout session.",
            },
            { status: 500 },
        )
    }
}

const getAllowedShippingCountries = () => {
    const value = process.env.BOOK_SHIPPING_ALLOWED_COUNTRIES ?? "US"
    const countries = value
        .split(",")
        .map((country) => country.trim().toUpperCase())
        .filter(Boolean)

    return (
        countries.length > 0 ? countries : ["US"]
    ) as CheckoutAllowedCountry[]
}

const getDefaultPriceId = async (stripe: Stripe, productId: string) => {
    const product = await stripe.products.retrieve(productId, {
        expand: ["default_price"],
    })
    const defaultPrice = product.default_price
    if (!defaultPrice || typeof defaultPrice === "string") {
        return null
    }

    return defaultPrice.id
}
