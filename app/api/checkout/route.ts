import { NextRequest, NextResponse } from "next/server"
import type Stripe from "stripe"
import { books } from "@/lib/books"
import { type CartItem } from "@/lib/cart-store"
import { getStripe } from "@/lib/stripe-server"

type CheckoutSessionCreateParams = NonNullable<
    Parameters<
        ReturnType<typeof getStripe>["checkout"]["sessions"]["create"]
    >[0]
>
type CheckoutShippingOption = NonNullable<
    CheckoutSessionCreateParams["shipping_options"]
>[number]
type CheckoutAllowedCountry = NonNullable<
    CheckoutSessionCreateParams["shipping_address_collection"]
>["allowed_countries"][number]

const baseUrl =
    process.env.NODE_ENV === "production"
        ? "https://gibsonmurray.com"
        : "http://localhost:3000"

const PHYSICAL_FORMATS = new Set<CartItem["format"]>(["paperback", "bundle"])
const SHIPPING_TAX_CODE = "txcd_92010001"

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
    const stripe = getStripe()
    const body = await req.json()
    const items: CartItem[] = body.items

    if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json(
            { error: "No items provided" },
            { status: 400 },
        )
    }

    const lineItems: CheckoutLineItem[] = []
    const checkoutItems: CartItem[] = []
    let requiresShipping = false
    let physicalQuantity = 0

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
        checkoutItems.push({ bookId, format, quantity: normalizedQuantity })
        if (PHYSICAL_FORMATS.has(format)) {
            requiresShipping = true
            physicalQuantity += normalizedQuantity
        }
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        allow_promotion_codes: true,
        automatic_tax: { enabled: true },
        custom_fields: [
            {
                key: "gift_message",
                label: { type: "custom", custom: "Gift message (optional)" },
                type: "text",
                optional: true,
            },
        ],
        ...(requiresShipping
            ? {
                  shipping_address_collection: {
                      allowed_countries: getAllowedShippingCountries(),
                  },
                  shipping_options:
                      getManualFulfillmentShippingOptions(physicalQuantity),
              }
            : {}),
        phone_number_collection: { enabled: true },
        success_url: `${baseUrl}/books/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/books`,
        metadata: {
            items: JSON.stringify(checkoutItems),
        },
    })

    if (!session.url) {
        return NextResponse.json(
            { error: "Unable to create checkout session" },
            { status: 500 },
        )
    }

    return NextResponse.json({ url: session.url })
}

const getManualFulfillmentShippingOptions = (
    physicalQuantity: number,
): CheckoutShippingOption[] => {
    const baseAmount = parseEnvInteger("BOOK_SHIPPING_BASE_CENTS", 599)
    const additionalAmount = parseEnvInteger(
        "BOOK_SHIPPING_ADDITIONAL_CENTS",
        100,
    )
    const amount =
        baseAmount + Math.max(0, physicalQuantity - 1) * additionalAmount

    if (amount <= 0) {
        return [
            {
                shipping_rate_data: {
                    display_name: "Shipping",
                    fixed_amount: { amount: 0, currency: "usd" },
                    tax_behavior: "exclusive",
                    tax_code: SHIPPING_TAX_CODE,
                    type: "fixed_amount",
                },
            },
        ]
    }

    return [
        {
            shipping_rate_data: {
                display_name:
                    process.env.BOOK_SHIPPING_DISPLAY_NAME ??
                    "USPS shipping via Pirate Ship",
                fixed_amount: { amount, currency: "usd" },
                metadata: {
                    fulfillment: "pirate_ship",
                    physical_quantity: String(physicalQuantity),
                },
                tax_behavior: "exclusive",
                tax_code: SHIPPING_TAX_CODE,
                type: "fixed_amount",
            },
        },
    ]
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

const parseEnvInteger = (name: string, fallback: number) => {
    const value = process.env[name]
    if (!value) return fallback

    const parsed = Number.parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : fallback
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
