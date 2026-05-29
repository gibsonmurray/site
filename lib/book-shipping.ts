import { type CartItem } from "@/lib/cart-store"

const SHIPPING_TAX_CODE = "txcd_92010001"
const PHYSICAL_FORMATS = new Set<CartItem["format"]>(["paperback", "bundle"])
const REMOTE_ZIP_PREFIXES = [
    "006",
    "007",
    "008",
    "009",
    "090",
    "091",
    "092",
    "093",
    "094",
    "095",
    "096",
    "097",
    "098",
    "340",
    "967",
    "968",
    "969",
    "995",
    "996",
    "997",
    "998",
    "999",
]
const DEFAULT_SHIPPING_OPTIONS = [
    {
        amountEnv: "BOOK_SHIPPING_GROUND_BASE_CENTS",
        displayName: "USPS Ground Advantage",
        fallbackAmount: 599,
        id: "usps_ground_advantage",
        maxBusinessDays: 5,
        minBusinessDays: 2,
    },
    {
        amountEnv: "BOOK_SHIPPING_PRIORITY_BASE_CENTS",
        displayName: "USPS Priority Mail",
        fallbackAmount: 999,
        id: "usps_priority_mail",
        maxBusinessDays: 3,
        minBusinessDays: 1,
    },
    {
        amountEnv: "BOOK_SHIPPING_UPS_GROUND_BASE_CENTS",
        displayName: "UPS Ground",
        fallbackAmount: 1099,
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

export type BookShippingAddress = {
    city?: string | null
    country?: string | null
    line1?: string | null
    line2?: string | null
    postal_code?: string | null
    state?: string | null
}

export type BookShippingDetails = {
    address?: BookShippingAddress | null
    name?: string | null
}

type ShippingZone = "local" | "regional" | "national" | "non_contiguous"

export const isPhysicalBookFormat = (format: CartItem["format"]) =>
    PHYSICAL_FORMATS.has(format)

export const getPhysicalQuantity = (items: CartItem[]) =>
    items.reduce(
        (sum, item) =>
            isPhysicalBookFormat(item.format) ? sum + item.quantity : sum,
        0,
    )

export const getBookShippingOptions = (
    physicalQuantity: number,
    shippingDetails?: BookShippingDetails,
) => {
    const additionalAmount = parseEnvInteger(
        "BOOK_SHIPPING_ADDITIONAL_CENTS",
        100,
    )
    const additionalBooksAmount =
        Math.max(0, physicalQuantity - 1) * additionalAmount
    const shippingZone = getShippingZone(shippingDetails)
    const zoneSurcharge = getZoneSurcharge(shippingZone)

    const shippingOptions = DEFAULT_SHIPPING_OPTIONS.map((option) => {
        const fallbackAmount =
            option.id === "usps_ground_advantage"
                ? parseEnvInteger(
                      "BOOK_SHIPPING_BASE_CENTS",
                      option.fallbackAmount,
                  )
                : option.fallbackAmount
        const amount =
            parseEnvInteger(option.amountEnv, fallbackAmount) +
            additionalBooksAmount +
            zoneSurcharge

        return {
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
                fixed_amount: { amount: Math.max(0, amount), currency: "usd" },
                metadata: {
                    destination_zone: shippingZone,
                    estimated_postal_code:
                        normalizeUsPostalCode(
                            shippingDetails?.address?.postal_code,
                        ) ?? "unknown",
                    fulfillment: "pirate_ship",
                    physical_quantity: String(physicalQuantity),
                    service: option.id,
                },
                tax_behavior: "exclusive" as const,
                tax_code: SHIPPING_TAX_CODE,
                type: "fixed_amount" as const,
            } satisfies ShippingRateData,
        }
    }).filter((option) => option.shipping_rate_data.fixed_amount.amount > 0)

    if (shippingOptions.length > 0) return shippingOptions

    return [
        {
            shipping_rate_data: {
                display_name: "Shipping",
                fixed_amount: { amount: 0, currency: "usd" },
                tax_behavior: "exclusive" as const,
                tax_code: SHIPPING_TAX_CODE,
                type: "fixed_amount" as const,
            } satisfies ShippingRateData,
        },
    ]
}

export const getPendingShippingOptions = () => [
    {
        shipping_rate_data: {
            display_name: "Shipping calculated after address",
            fixed_amount: { amount: 0, currency: "usd" },
            tax_behavior: "exclusive" as const,
            tax_code: SHIPPING_TAX_CODE,
            type: "fixed_amount" as const,
        } satisfies ShippingRateData,
    },
]

export const validateBookShippingDetails = (
    shippingDetails: unknown,
): BookShippingDetails | null => {
    if (!shippingDetails || typeof shippingDetails !== "object") return null

    const details = shippingDetails as BookShippingDetails
    const country = details.address?.country?.trim().toUpperCase()
    const name = details.name?.trim()
    const line1 = details.address?.line1?.trim()
    const postalCode = normalizeUsPostalCode(details.address?.postal_code)

    if (country !== "US" || !name || !line1 || !postalCode) return null

    return {
        name,
        address: {
            city: details.address?.city?.trim() || undefined,
            country,
            line1,
            line2: details.address?.line2?.trim() || undefined,
            postal_code: postalCode,
            state: details.address?.state?.trim() || undefined,
        },
    }
}

const normalizeUsPostalCode = (value: unknown) => {
    if (typeof value !== "string") return null

    const digits = value.replace(/\D/g, "")
    if (digits.length < 5) return null

    return digits.slice(0, 5)
}

const getShippingZone = (
    shippingDetails?: BookShippingDetails,
): ShippingZone => {
    const postalCode = normalizeUsPostalCode(
        shippingDetails?.address?.postal_code,
    )
    if (!postalCode) return "local"
    const zipPrefix = postalCode.slice(0, 3)

    if (REMOTE_ZIP_PREFIXES.includes(zipPrefix)) return "non_contiguous"

    const firstDigit = Number.parseInt(postalCode[0] ?? "", 10)
    if (!Number.isFinite(firstDigit)) return "local"

    if (firstDigit <= 2) return "local"
    if (firstDigit <= 5) return "regional"
    return "national"
}

const getZoneSurcharge = (shippingZone: ShippingZone) => {
    if (shippingZone === "local") return 0
    if (shippingZone === "regional") {
        return parseEnvInteger("BOOK_SHIPPING_REGIONAL_SURCHARGE_CENTS", 200)
    }
    if (shippingZone === "national") {
        return parseEnvInteger("BOOK_SHIPPING_NATIONAL_SURCHARGE_CENTS", 400)
    }

    return parseEnvInteger("BOOK_SHIPPING_NONCONTIGUOUS_SURCHARGE_CENTS", 800)
}

const parseEnvInteger = (name: string, fallback: number) => {
    const value = process.env[name]
    if (!value) return fallback

    const parsed = Number.parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : fallback
}
