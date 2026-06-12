import { type CartItem } from "@/lib/cart-store"

const SHIPPING_TAX_CODE = "txcd_92010001"
const PHYSICAL_FORMATS = new Set<CartItem["format"]>([
    "paperback",
    "hardback",
    "bundle",
])
const SHIPPING_OPTIONS = [
    {
        amount: 599,
        displayName: "USPS Ground Advantage",
        id: "usps_ground_advantage",
        maxBusinessDays: 5,
        minBusinessDays: 2,
    },
    {
        amount: 999,
        displayName: "USPS Priority Mail",
        id: "usps_priority_mail",
        maxBusinessDays: 3,
        minBusinessDays: 1,
    },
    {
        amount: 1099,
        displayName: "UPS Ground",
        id: "ups_ground",
        maxBusinessDays: 5,
        minBusinessDays: 1,
    },
]

type ShippingRateData = {
    delivery_estimate?: {
        maximum?: { unit: "business_day"; value: number }
        minimum?: { unit: "business_day"; value: number }
    }
    display_name: string
    fixed_amount?: { amount: number; currency: "usd" }
    metadata?: Record<string, string>
    tax_behavior?: "exclusive"
    tax_code?: string
    type?: "fixed_amount"
}

export const isPhysicalBookFormat = (format: CartItem["format"]) =>
    PHYSICAL_FORMATS.has(format)

export const getPhysicalQuantity = (items: CartItem[]) =>
    items.reduce(
        (sum, item) =>
            isPhysicalBookFormat(item.format) ? sum + item.quantity : sum,
        0,
    )

export const getBookShippingOptions = () =>
    SHIPPING_OPTIONS.map((option) => ({
        shipping_rate_data: {
            delivery_estimate: {
                maximum: {
                    unit: "business_day" as const,
                    value: option.maxBusinessDays,
                },
                minimum: {
                    unit: "business_day" as const,
                    value: option.minBusinessDays,
                },
            },
            display_name: option.displayName,
            fixed_amount: { amount: option.amount, currency: "usd" },
            metadata: {
                fulfillment: "pirate_ship",
                service: option.id,
            },
            tax_behavior: "exclusive" as const,
            tax_code: SHIPPING_TAX_CODE,
            type: "fixed_amount" as const,
        } satisfies ShippingRateData,
    }))
