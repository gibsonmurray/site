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
const audienceId =
    process.env.RESEND_AUDIENCE_ID ?? "652a20bd-5f37-4ad1-9579-3c9ec60748f1"
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
const stripe = stripeKey ? new Stripe(stripeKey) : null

const recipients = new Map<string, Recipient>()
const contactSettleDelayMs = 1_250

const normalizeEmail = (email: string) => email.trim().toLowerCase()
const sleep = (ms: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms)
    })

const isRateLimitError = (error: {
    message: string
    statusCode?: number | null
}) =>
    error.statusCode === 429 ||
    /too many requests|rate limit/i.test(error.message)

const withResendRetry = async <
    T extends {
        error: { message: string; statusCode?: number | null } | null
    },
>(
    operation: () => Promise<T>,
) => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const response = await operation()
        if (!response.error || !isRateLimitError(response.error))
            return response

        await sleep(1_000 * (attempt + 1))
    }

    return operation()
}

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

const isAlreadyExistsError = (error: {
    message: string
    statusCode?: number | null
}) => error.statusCode === 409 || /already|exist/i.test(error.message)

const isNotFoundError = (error: {
    message: string
    statusCode?: number | null
}) => error.statusCode === 404 || /not found/i.test(error.message)

const findContactId = async (email: string) => {
    const globalContact = await withResendRetry(() =>
        resend.contacts.get({ email }),
    )
    if (globalContact.data?.id) return globalContact.data.id

    const audienceContact = await withResendRetry(() =>
        resend.contacts.get({ audienceId, email }),
    )
    if (audienceContact.data?.id) return audienceContact.data.id

    let after: string | undefined

    do {
        const response = await withResendRetry(() =>
            resend.contacts.list({
                limit: 100,
                ...(after ? { after } : {}),
            }),
        )

        if (response.error) break

        const contacts = response.data?.data ?? []
        const matchingContact = contacts.find(
            (contact) => normalizeEmail(contact.email) === email,
        )

        if (matchingContact) return matchingContact.id

        after = contacts.at(-1)?.id
        if (!response.data?.has_more || !after) break
    } while (after)

    return null
}

const resendApi = async <T>(
    path: string,
    options: RequestInit = {},
): Promise<{
    data: T | null
    error: { message: string; statusCode?: number } | null
}> => {
    const response = await fetch(`https://api.resend.com${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    })
    const data = (await response.json().catch(() => null)) as
        | { message?: string; name?: string }
        | T
        | null

    if (!response.ok) {
        const message =
            data &&
            typeof data === "object" &&
            "message" in data &&
            typeof data.message === "string"
                ? data.message
                : response.statusText

        return {
            data: null,
            error: {
                message,
                statusCode: response.status,
            },
        }
    }

    return { data: data as T, error: null }
}

const resendApiWithRetry = async <T>(
    path: string,
    options: RequestInit = {},
) => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const response = await resendApi<T>(path, options)
        if (!response.error || !isRateLimitError(response.error))
            return response

        await sleep(1_000 * (attempt + 1))
    }

    return resendApi<T>(path, options)
}

const createContactInSegment = async (recipient: Recipient) =>
    withResendRetry(() =>
        resend.contacts.create({
            email: recipient.email,
            firstName: recipient.firstName,
            lastName: recipient.lastName,
            unsubscribed: false,
            segments: [{ id: segmentId }],
            properties: {
                book_slug: "walls",
                source: "stripe_preorder",
                stripe_session_ids: recipient.stripeSessionIds.join(","),
            },
        }),
    )

const addContactToSegment = async (recipient: Recipient) => {
    const { email } = recipient
    const encodedEmail = encodeURIComponent(email)
    const rawAddByEmail = await resendApiWithRetry<{ id: string }>(
        `/contacts/${encodedEmail}/segments/${segmentId}`,
        { method: "POST" },
    )

    if (!rawAddByEmail.error || isAlreadyExistsError(rawAddByEmail.error))
        return

    const addByEmail = await withResendRetry(() =>
        resend.contacts.segments.add({
            email,
            segmentId,
        }),
    )

    if (!addByEmail.error || isAlreadyExistsError(addByEmail.error)) return

    if (!isNotFoundError(addByEmail.error)) {
        throw new Error(
            `Unable to add ${email} to segment: ${addByEmail.error.message}`,
        )
    }

    const contactId = await findContactId(email)
    if (!contactId) {
        const recreateResult = await createContactInSegment(recipient)
        if (
            recreateResult.error &&
            !isAlreadyExistsError(recreateResult.error)
        ) {
            throw new Error(
                `Unable to add ${email} to segment: ${recreateResult.error.message}`,
            )
        }

        await sleep(contactSettleDelayMs)

        const retryAddByEmail = await withResendRetry(() =>
            resend.contacts.segments.add({
                email,
                segmentId,
            }),
        )

        if (
            !retryAddByEmail.error ||
            isAlreadyExistsError(retryAddByEmail.error)
        ) {
            return
        }

        const retryContactId = await findContactId(email)
        if (retryContactId) {
            const retryAddById = await withResendRetry(() =>
                resend.contacts.segments.add({
                    contactId: retryContactId,
                    segmentId,
                }),
            )

            if (
                !retryAddById.error ||
                isAlreadyExistsError(retryAddById.error)
            ) {
                return
            }
        }

        throw new Error(
            `Unable to add ${email} to segment: ${addByEmail.error.message}`,
        )
    }

    const addById = await withResendRetry(() =>
        resend.contacts.segments.add({
            contactId,
            segmentId,
        }),
    )

    if (addById.error && !isAlreadyExistsError(addById.error)) {
        throw new Error(
            `Unable to add ${email} to segment by contact id ${contactId}: ${addById.error.message}`,
        )
    }
}

const listPreorderSegmentContacts = async () => {
    let after: string | undefined

    do {
        const response = await withResendRetry(() =>
            resend.contacts.list({
                segmentId,
                limit: 100,
                ...(after ? { after } : {}),
            }),
        )

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
        const createResult = await createContactInSegment(buyer)

        if (createResult.error && !isAlreadyExistsError(createResult.error)) {
            throw new Error(
                `Unable to create contact ${buyer.email}: ${createResult.error.message}`,
            )
        }

        await sleep(contactSettleDelayMs)
        await addContactToSegment(buyer)
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
await listPreorderSegmentContacts()

const postImportSegmentContactCount = [...recipients.values()].filter(
    (recipient) => recipient.sources.has("resend-preorder-segment"),
).length

console.log(
    `Resend preorder segment contacts after import: ${postImportSegmentContactCount}`,
)

const broadcastPayload = {
    segmentId,
    ...wallsSampleBroadcast,
    ...(shouldSend ? { send: true as const } : { send: false as const }),
}

const { data, error } = await withResendRetry(() =>
    resend.broadcasts.create(broadcastPayload),
)

if (error) {
    throw new Error(error.message)
}

console.log(
    shouldSend
        ? `Sent broadcast: ${data?.id}`
        : `Created draft broadcast: ${data?.id}`,
)
