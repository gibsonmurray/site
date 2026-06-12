import type Stripe from "stripe"
import { type BookFormat } from "@/lib/books"

export type OrderItem = {
    bookId: string
    format: BookFormat
    quantity: number
}

const bookFormats = new Set<BookFormat>([
    "paperback",
    "hardback",
    "ebook",
    "audiobook",
    "bundle",
])
const ebookFormats = new Set<BookFormat>(["ebook", "bundle"])

export const parseOrderItems = (
    metadata?: Stripe.Metadata | null,
): OrderItem[] => {
    const metadataItems = metadata?.items
    if (!metadataItems) {
        const bookId = metadata?.bookId
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
                !bookFormats.has(item.format as BookFormat)
            ) {
                return []
            }

            return [
                {
                    bookId: item.bookId,
                    format: item.format as BookFormat,
                    quantity: item.quantity,
                },
            ]
        })
    } catch {
        return []
    }
}

export const getEbookBookIds = (items: OrderItem[]) => [
    ...new Set(
        items
            .filter((item) => ebookFormats.has(item.format))
            .map((item) => item.bookId),
    ),
]

export const getEbookDeliveryMarker = (bookId: string) =>
    `ebook_delivered_${bookId.replaceAll("-", "_")}`
