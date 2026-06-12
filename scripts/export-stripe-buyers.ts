import { loadEnvConfig } from "@next/env"
import Stripe from "stripe"
import { books, type BookFormat } from "@/lib/books"

loadEnvConfig(process.cwd())

type OrderItem = {
    bookId: string
    format: BookFormat
    quantity: number
}

type CheckoutSessionWithShipping = Stripe.Checkout.Session & {
    shipping_details?: {
        name?: string | null
        address?: Stripe.Address | null
    } | null
    collected_information?: {
        shipping_details?: {
            name?: string | null
            address?: Stripe.Address | null
        } | null
    } | null
}

type ExportRow = Record<(typeof csvHeaders)[number], string>

const csvHeaders = [
    "Fulfillment ID",
    "Stripe Session",
    "Stripe Payment Intent",
    "Purchased At",
    "Name",
    "Email",
    "Phone",
    "Address Line 1",
    "Address Line 2",
    "City",
    "State",
    "Zip",
    "Country",
    "Items",
    "Physical Quantity",
    "Gift Message",
] as const

const formatLabels: Record<BookFormat, string> = {
    paperback: "Paperback",
    hardback: "Hardback",
    ebook: "eBook",
    audiobook: "Audiobook",
    bundle: "Complete bundle",
}

const physicalFormats = new Set<BookFormat>(["paperback", "hardback", "bundle"])

const args = process.argv.slice(2)
const shouldShowHelp = args.includes("--help") || args.includes("-h")

if (shouldShowHelp) {
    console.log(
        [
            "Usage:",
            "  bun run orders:buyers",
            "  bun run orders:buyers -- --book walls > buyers.csv",
            "  bun run orders:buyers -- --since 2026-05-01 > buyers.csv",
            "  bun run orders:buyers -- --all > all-buyers.csv",
            "",
            "By default this exports paid physical-book orders only, one row per",
            "Stripe Checkout Session. Use Fulfillment ID to spot duplicate labels.",
            "",
            "Options:",
            "  --book <slug>   Only include orders containing a specific book.",
            "  --since <date>  Only include orders created on or after YYYY-MM-DD.",
            "  --all           Include digital-only orders too.",
        ].join("\n"),
    )
    process.exit(0)
}

const stripeKey = process.env.STRIPE_LIVE_KEY
if (!stripeKey) {
    throw new Error("Missing STRIPE_LIVE_KEY")
}

const stripe = new Stripe(stripeKey, { apiVersion: "2026-04-22.dahlia" })
const bookSlug = getArgValue("--book")
const since = getArgValue("--since")
const includeAllOrders = args.includes("--all")

const sessions = stripe.checkout.sessions.list({
    limit: 100,
    status: "complete",
    ...(since ? { created: { gte: parseDateArg(since) } } : {}),
})

const rows: ExportRow[] = []

for await (const session of sessions) {
    if (session.payment_status !== "paid") continue

    const orderItems = parseOrderItems(session)
    if (bookSlug && !orderItems.some((item) => item.bookId === bookSlug)) {
        continue
    }

    const physicalItems = orderItems.filter((item) =>
        physicalFormats.has(item.format),
    )
    if (!includeAllOrders && physicalItems.length === 0) continue

    const fulfillmentId = `stripe:${session.id}`
    const shipping = getShippingDetails(session)
    const customerAddress = session.customer_details?.address
    const address = shipping?.address ?? customerAddress
    const customer = session.customer_details
    const exportedItems = includeAllOrders ? orderItems : physicalItems
    const giftMessage = session.custom_fields?.find(
        (field) => field.key === "gift_message",
    )?.text?.value

    rows.push({
        "Fulfillment ID": fulfillmentId,
        "Stripe Session": session.id,
        "Stripe Payment Intent": getPaymentIntentId(session),
        "Purchased At": new Date(session.created * 1000).toISOString(),
        Name: shipping?.name ?? customer?.name ?? "",
        Email: customer?.email ?? "",
        Phone: customer?.phone ?? "",
        "Address Line 1": address?.line1 ?? "",
        "Address Line 2": address?.line2 ?? "",
        City: address?.city ?? "",
        State: address?.state ?? "",
        Zip: address?.postal_code ?? "",
        Country: address?.country ?? "",
        Items: exportedItems.map(formatItem).join("; "),
        "Physical Quantity": String(sumQuantity(physicalItems)),
        "Gift Message": giftMessage ?? "",
    })
}

function getShippingDetails(session: Stripe.Checkout.Session) {
    const sessionWithShipping = session as CheckoutSessionWithShipping
    return (
        sessionWithShipping.collected_information?.shipping_details ??
        sessionWithShipping.shipping_details
    )
}

console.log(toCsv(rows))

function getArgValue(name: string) {
    const index = args.indexOf(name)
    return index >= 0 ? args[index + 1] : undefined
}

function parseDateArg(value: string) {
    const timestamp = Date.parse(`${value}T00:00:00.000Z`)
    if (Number.isNaN(timestamp)) {
        throw new Error(`Invalid date for --since: ${value}`)
    }

    return Math.floor(timestamp / 1000)
}

function parseOrderItems(session: Stripe.Checkout.Session): OrderItem[] {
    const metadataItems = session.metadata?.items
    if (!metadataItems) {
        const bookId = session.metadata?.bookId
        return bookId ? [{ bookId, format: "paperback", quantity: 1 }] : []
    }

    try {
        const items = JSON.parse(metadataItems)
        if (!Array.isArray(items)) return []

        return items.flatMap((item): OrderItem[] => {
            if (
                typeof item?.bookId !== "string" ||
                typeof item?.format !== "string" ||
                typeof item?.quantity !== "number" ||
                !isBookFormat(item.format)
            ) {
                return []
            }

            return [
                {
                    bookId: item.bookId,
                    format: item.format,
                    quantity: item.quantity,
                },
            ]
        })
    } catch {
        return []
    }
}

function isBookFormat(format: string): format is BookFormat {
    return ["paperback", "hardback", "ebook", "audiobook", "bundle"].includes(
        format,
    )
}

function formatItem(item: OrderItem) {
    const book = books.find((candidate) => candidate.slug === item.bookId)
    const title = book?.title ?? item.bookId
    return `${title} - ${formatLabels[item.format]} x ${item.quantity}`
}

function sumQuantity(items: OrderItem[]) {
    return items.reduce((total, item) => total + item.quantity, 0)
}

function getPaymentIntentId(session: Stripe.Checkout.Session) {
    const paymentIntent = session.payment_intent
    if (!paymentIntent) return ""
    return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id
}

function toCsv(rows: ExportRow[]) {
    return [
        csvHeaders.join(","),
        ...rows.map((row) =>
            csvHeaders.map((header) => escapeCsvValue(row[header])).join(","),
        ),
    ].join("\n")
}

function escapeCsvValue(value: string) {
    if (!/[",\n\r]/.test(value)) return value
    return `"${value.replaceAll('"', '""')}"`
}
