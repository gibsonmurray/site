import { loadEnvConfig } from "@next/env"
import { Resend } from "resend"
import Stripe from "stripe"
import { books } from "@/lib/books"
import {
    getEbookBookIds,
    getEbookDeliveryMarker,
    parseOrderItems,
} from "@/lib/book-orders"
import { deliverEbook, getEbookAsset } from "@/lib/ebook-delivery"

loadEnvConfig(process.cwd())

type Recipient = {
    email: string
    name?: string | null
    sessionIds: string[]
}

const args = process.argv.slice(2)
const shouldSend = args.includes("--send")
const shouldShowHelp = args.includes("--help") || args.includes("-h")
const bookId = getArgValue("--book") ?? "walls"
const since = getArgValue("--since")
const previewEmail = getArgValue("--preview")

if (shouldShowHelp) {
    console.log(
        [
            "Usage:",
            "  bun run ebooks:deliver",
            "  bun run ebooks:deliver -- --send",
            "  bun run ebooks:deliver -- --preview you@example.com",
            "  bun run ebooks:deliver -- --book walls --since 2026-05-01",
            "",
            "Default mode is a dry run. It finds paid Stripe orders containing the",
            "ebook or bundle, skips sessions already marked as delivered, and prints",
            "the recipients that would receive the EPUB.",
            "",
            "Options:",
            "  --send             Deliver to all eligible buyers and mark their Stripe sessions.",
            "  --preview <email>  Send one untracked preview email without querying Stripe.",
            "  --book <slug>      Deliver a specific book. Defaults to walls.",
            "  --since <date>     Only include orders created on or after YYYY-MM-DD.",
        ].join("\n"),
    )
    process.exit(0)
}

if (!books.some((book) => book.slug === bookId)) {
    throw new Error(`Unknown book: ${bookId}`)
}

const resendApiKey = process.env.RESEND_API_KEY
const stripeKey =
    process.env.STRIPE_LIVE_KEY ??
    process.env.STRIPE_CHECKOUT_SECRET_KEY ??
    process.env.STRIPE_SECRET_KEY

if (!resendApiKey) {
    throw new Error("Missing RESEND_API_KEY")
}

const resend = new Resend(resendApiKey)

if (previewEmail) {
    await getEbookAsset(bookId)
    await deliverEbook({
        bookId,
        customerEmail: previewEmail,
        customerName: "Reader",
        idempotencyKey: `ebook-preview-${bookId}-${Date.now()}`,
        resend,
    })
    console.log(`Preview sent to ${previewEmail}.`)
    process.exit(0)
}

if (!stripeKey) {
    throw new Error("Missing Stripe secret key")
}

if (shouldSend) {
    await getEbookAsset(bookId)
}

const stripe = new Stripe(stripeKey)
const marker = getEbookDeliveryMarker(bookId)
const recipients = new Map<string, Recipient>()
let paidSessions = 0
let eligibleSessions = 0
let alreadyDeliveredSessions = 0

const sessions = stripe.checkout.sessions.list({
    limit: 100,
    status: "complete",
    ...(since ? { created: { gte: parseDateArg(since) } } : {}),
})

for await (const session of sessions) {
    if (session.payment_status !== "paid") continue
    paidSessions += 1

    const bookIds = getEbookBookIds(parseOrderItems(session.metadata))
    if (!bookIds.includes(bookId)) continue
    if (session.metadata?.[marker]) {
        alreadyDeliveredSessions += 1
        continue
    }

    const email = session.customer_details?.email?.trim().toLowerCase()
    if (!email) {
        console.warn(`Skipping ${session.id}: no customer email.`)
        continue
    }

    eligibleSessions += 1
    const recipient = recipients.get(email) ?? {
        email,
        name: session.customer_details?.name,
        sessionIds: [],
    }
    recipient.name ??= session.customer_details?.name
    recipient.sessionIds.push(session.id)
    recipients.set(email, recipient)
}

console.log(
    [
        `Book: ${bookId}`,
        `Mode: ${shouldSend ? "send" : "dry run"}`,
        `Paid sessions scanned: ${paidSessions}`,
        `Eligible undelivered sessions: ${eligibleSessions}`,
        `Already delivered sessions: ${alreadyDeliveredSessions}`,
        `Unique recipients: ${recipients.size}`,
    ].join("\n"),
)

if (!shouldSend) {
    for (const recipient of recipients.values()) {
        console.log(
            `  ${recipient.email} (${recipient.sessionIds.length} order${recipient.sessionIds.length === 1 ? "" : "s"})`,
        )
    }
    console.log("\nDry run only. Add --send to deliver the EPUB.")
    process.exit(0)
}

let sent = 0
const failures: string[] = []

for (const recipient of recipients.values()) {
    try {
        await deliverEbook({
            bookId,
            customerEmail: recipient.email,
            customerName: recipient.name,
            idempotencyKey: `ebook-delivery-${bookId}-${recipient.sessionIds[0]}`,
            resend,
        })

        for (const sessionId of recipient.sessionIds) {
            await stripe.checkout.sessions.update(sessionId, {
                metadata: { [marker]: new Date().toISOString() },
            })
        }

        sent += 1
        console.log(`Sent ${sent}/${recipients.size}: ${recipient.email}`)
        await sleep(600)
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        failures.push(`${recipient.email}: ${message}`)
        console.error(`Failed: ${recipient.email}: ${message}`)
    }
}

console.log(`\nDelivered: ${sent}`)
console.log(`Failed: ${failures.length}`)

if (failures.length > 0) {
    process.exitCode = 1
}

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

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
