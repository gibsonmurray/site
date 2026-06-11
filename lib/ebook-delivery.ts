import { get } from "@vercel/blob"
import type { Resend } from "resend"
import type Stripe from "stripe"
import { books } from "@/lib/books"
import {
    getEbookBookIds,
    getEbookDeliveryMarker,
    parseOrderItems,
} from "@/lib/book-orders"
import { getEbookDeliveryEmail } from "@/lib/emails/ebook-delivery"

const privateEpubPathnames: Record<string, string> = {
    walls: "ebooks/walls.epub",
}

type EbookAsset = {
    content: Buffer
    contentType: string
    filename: string
}

const ebookAssets = new Map<string, Promise<EbookAsset>>()

export const getEbookAsset = async (bookId: string) => {
    const book = books.find((candidate) => candidate.slug === bookId)
    if (!book) {
        throw new Error(`Unknown book: ${bookId}`)
    }

    const pathname = privateEpubPathnames[bookId]
    if (!pathname) {
        throw new Error(`Missing private EPUB pathname for ${bookId}`)
    }

    const existingAsset = ebookAssets.get(bookId)
    if (existingAsset) return existingAsset

    const asset = (async () => {
        const token = process.env.BLOB_READ_WRITE_TOKEN
        if (!token) {
            throw new Error("Missing BLOB_READ_WRITE_TOKEN")
        }

        const result = await get(pathname, {
            access: "private",
            token,
        })
        if (!result || result.statusCode !== 200) {
            throw new Error(`Private EPUB not found: ${pathname}`)
        }

        return {
            content: Buffer.from(
                await new Response(result.stream).arrayBuffer(),
            ),
            contentType: result.blob.contentType,
            filename: `${book.title} - Gibson Murray.epub`,
        }
    })()

    ebookAssets.set(bookId, asset)
    asset.catch(() => ebookAssets.delete(bookId))
    return asset
}

type DeliverEbookOptions = {
    bookId: string
    customerEmail: string
    customerName?: string | null
    idempotencyKey: string
    resend: Resend
}

export const deliverEbook = async ({
    bookId,
    customerEmail,
    customerName,
    idempotencyKey,
    resend,
}: DeliverEbookOptions) => {
    const email = getEbookDeliveryEmail({ bookId, customerName })
    const asset = await getEbookAsset(bookId)
    const response = await resend.emails.send(
        {
            ...email,
            to: customerEmail,
            attachments: [
                {
                    content: asset.content,
                    filename: asset.filename,
                    contentType: asset.contentType,
                },
            ],
            tags: [
                { name: "category", value: "ebook_delivery" },
                { name: "book", value: bookId },
            ],
        },
        { idempotencyKey },
    )

    if (response.error) {
        throw new Error(response.error.message)
    }

    return response.data
}

type DeliverSessionEbooksOptions = {
    resend: Resend
    session: Stripe.Checkout.Session
    stripe: Stripe
}

export const deliverSessionEbooks = async ({
    resend,
    session,
    stripe,
}: DeliverSessionEbooksOptions) => {
    const currentSession = await stripe.checkout.sessions.retrieve(session.id)
    const bookIds = getEbookBookIds(parseOrderItems(currentSession.metadata))
    if (bookIds.length === 0) return []

    const customerEmail =
        currentSession.customer_details?.email ??
        session.customer_details?.email
    if (!customerEmail) {
        throw new Error(
            `Missing customer email for Stripe session ${session.id}`,
        )
    }

    const deliveredBookIds: string[] = []

    for (const bookId of bookIds) {
        const marker = getEbookDeliveryMarker(bookId)
        if (currentSession.metadata?.[marker]) continue

        await deliverEbook({
            bookId,
            customerEmail,
            customerName:
                currentSession.customer_details?.name ??
                session.customer_details?.name,
            idempotencyKey: `ebook-delivery-${bookId}-${session.id}`,
            resend,
        })
        await stripe.checkout.sessions.update(session.id, {
            metadata: { [marker]: new Date().toISOString() },
        })
        deliveredBookIds.push(bookId)
    }

    return deliveredBookIds
}
