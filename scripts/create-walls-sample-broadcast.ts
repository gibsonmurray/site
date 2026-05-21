import { loadEnvConfig } from "@next/env"
import { Resend } from "resend"
import Stripe from "stripe"
import { wallsSampleBroadcast } from "@/lib/emails/walls-sample-broadcast"

loadEnvConfig(process.cwd())

type Recipient = {
    email: string
    firstName?: string
    lastName?: string
    sources: Set<RecipientSource>
    stripeSessionIds: string[]
}

type RecipientSource = "resend-preorder-segment" | "stripe-preorder"

const args = new Set(process.argv.slice(2))
const shouldSend = args.has("--send")
const shouldCreateDraft = args.has("--create-draft")
const shouldSkipStripe = args.has("--skip-stripe")
const shouldShowHelp = args.has("--help") || args.has("-h")

if (shouldShowHelp) {
    console.log(
        [
            "Usage:",
            "  bun scripts/create-walls-sample-broadcast.ts",
            "  bun scripts/create-walls-sample-broadcast.ts --create-draft",
            "  bun scripts/create-walls-sample-broadcast.ts --send",
            "",
            "Default mode is a dry run. It collects Resend preorder segment contacts",
            "and Stripe completed Walls preorder buyers, then prints counts.",
            "",
            "Options:",
            "  --create-draft  Import Stripe preorder buyers into the Resend segment and create a draft broadcast.",
            "  --send          Import Stripe preorder buyers into the Resend segment and send the broadcast immediately.",
            "  --skip-stripe   Only use the existing Resend preorder segment.",
        ].join("\n"),
    )
    process.exit(0)
}

if (shouldSend && shouldCreateDraft) {
    throw new Error("Use either --send or --create-draft, not both.")
}

const apiKey = process.env.RESEND_API_KEY
const segmentId = process.env.RESEND_PREORDER_SEGMENT_ID
const stripeKey = process.env.STRIPE_SECRET_KEY

if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY")
}

if (!segmentId) {
    throw new Error("Missing RESEND_PREORDER_SEGMENT_ID")
}

if (!shouldSkipStripe && !stripeKey) {
    throw new Error("Missing STRIPE_SECRET_KEY")
}

const resend = new Resend(apiKey)
const stripe = stripeKey
    ? new Stripe(stripeKey, { apiVersion: "2026-04-22.dahlia" })
    : null

const recipients = new Map<string, Recipient>()

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const splitName = (name: string | null | undefined) => {
    if (!name) return {}
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return {}
    if (parts.length === 1) return { firstName: parts[0] }
    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(" "),
    }
}

const addRecipient = (
    email: string | null | undefined,
    source: RecipientSource,
    options: {
        name?: string | null
        firstName?: string | null
        lastName?: string | null
        stripeSessionId?: string
    } = {},
) => {
    if (!email) return

    const normalizedEmail = normalizeEmail(email)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return

    const existing = recipients.get(normalizedEmail)
    const parsedName = splitName(options.name)
    const recipient =
        existing ??
        ({
            email: normalizedEmail,
            firstName: options.firstName ?? parsedName.firstName,
            lastName: options.lastName ?? parsedName.lastName,
            sources: new Set(),
            stripeSessionIds: [],
        } satisfies Recipient)

    recipient.firstName ??= options.firstName ?? parsedName.firstName
    recipient.lastName ??= options.lastName ?? parsedName.lastName
    recipient.sources.add(source)

    if (options.stripeSessionId) {
        recipient.stripeSessionIds.push(options.stripeSessionId)
    }

    recipients.set(normalizedEmail, recipient)
}

const parseCheckoutItems = (metadata: Stripe.Metadata | null | undefined) => {
    const metadataItems = metadata?.items
    if (!metadataItems) {
        const bookId = metadata?.bookId
        return bookId ? [{ bookId }] : []
    }

    try {
        const parsed = JSON.parse(metadataItems)
        if (!Array.isArray(parsed)) return []
        return parsed.filter(
            (item): item is { bookId: string } =>
                typeof item?.bookId === "string",
        )
    } catch {
        return []
    }
}

const isWallsSession = (session: Stripe.Checkout.Session) => {
    if (session.payment_status !== "paid") return false
    return parseCheckoutItems(session.metadata).some(
        (item) => item.bookId === "walls",
    )
}

const listPreorderSegmentContacts = async () => {
    let after: string | undefined

    do {
        const response = await resend.contacts.list({
            segmentId,
            limit: 100,
            ...(after ? { after } : {}),
        })

        if (response.error) {
            throw new Error(response.error.message)
        }

        const contacts = response.data?.data ?? []
        for (const contact of contacts) {
            addRecipient(contact.email, "resend-preorder-segment", {
                firstName: contact.first_name,
                lastName: contact.last_name,
            })
        }

        after = contacts.at(-1)?.id
        if (!response.data?.has_more || !after) break
    } while (after)
}

const listStripePreorderBuyers = async () => {
    if (!stripe || shouldSkipStripe) return

    await stripe.checkout.sessions
        .list({ limit: 100, status: "complete" })
        .autoPagingEach(async (session) => {
            if (!isWallsSession(session)) return

            addRecipient(session.customer_details?.email, "stripe-preorder", {
                name: session.customer_details?.name,
                stripeSessionId: session.id,
            })
        })
}

const importStripeBuyersToSegment = async () => {
    const buyers = [...recipients.values()].filter((recipient) =>
        recipient.sources.has("stripe-preorder"),
    )

    for (const buyer of buyers) {
        const createResult = await resend.contacts.create({
            email: buyer.email,
            firstName: buyer.firstName,
            lastName: buyer.lastName,
            unsubscribed: false,
            segments: [{ id: segmentId }],
            properties: {
                book_slug: "walls",
                source: "stripe_preorder",
                stripe_session_ids: buyer.stripeSessionIds.join(","),
            },
        })

        if (!createResult.error) continue

        const alreadyExists =
            createResult.error.statusCode === 409 ||
            /already|exist/i.test(createResult.error.message)

        if (!alreadyExists) {
            throw new Error(
                `Unable to create contact ${buyer.email}: ${createResult.error.message}`,
            )
        }

        const addSegmentResult = await resend.contacts.segments.add({
            email: buyer.email,
            segmentId,
        })

        if (
            addSegmentResult.error &&
            !/already|exist/i.test(addSegmentResult.error.message)
        ) {
            throw new Error(
                `Unable to add ${buyer.email} to segment: ${addSegmentResult.error.message}`,
            )
        }
    }
}

await listPreorderSegmentContacts()
await listStripePreorderBuyers()

const segmentContactCount = [...recipients.values()].filter((recipient) =>
    recipient.sources.has("resend-preorder-segment"),
).length
const stripeBuyerCount = [...recipients.values()].filter((recipient) =>
    recipient.sources.has("stripe-preorder"),
).length
const overlapCount = [...recipients.values()].filter(
    (recipient) =>
        recipient.sources.has("resend-preorder-segment") &&
        recipient.sources.has("stripe-preorder"),
).length

console.log(
    [
        `Resend preorder segment contacts: ${segmentContactCount}`,
        `Stripe Walls preorder buyers: ${stripeBuyerCount}`,
        `Already in both groups: ${overlapCount}`,
        `Total unique recipients after import: ${recipients.size}`,
    ].join("\n"),
)

if (!shouldCreateDraft && !shouldSend) {
    console.log("\nDry run only. Use --create-draft or --send to continue.")
    process.exit(0)
}

await importStripeBuyersToSegment()

const broadcastPayload = {
    segmentId,
    ...wallsSampleBroadcast,
    ...(shouldSend ? { send: true as const } : { send: false as const }),
}

const { data, error } = await resend.broadcasts.create(broadcastPayload)

if (error) {
    throw new Error(error.message)
}

console.log(
    shouldSend
        ? `Sent broadcast: ${data?.id}`
        : `Created draft broadcast: ${data?.id}`,
)
