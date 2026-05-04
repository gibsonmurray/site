"use client"

import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { books, type BookFormat } from "@/lib/books"
import { type CartItem } from "@/lib/cart-store"
import { usePricesStore } from "@/lib/prices-store"

export const FORMAT_LABELS: Record<BookFormat, string> = {
    paperback: "Paperback",
    ebook: "eBook",
    audiobook: "Audiobook",
}

export const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(cents / 100)

type CartLineItemProps = {
    item: CartItem
    onRemove: () => void
    onQuantityChange: (qty: number) => void
}

export const CartLineItem = ({
    item,
    onRemove,
    onQuantityChange,
}: CartLineItemProps) => {
    const book = books.find((b) => b.slug === item.bookId)
    const getPrice = usePricesStore((s) => s.getPrice)
    if (!book) return null

    const unitPrice = getPrice(book.slug, item.format)
    const lineTotal =
        unitPrice !== undefined ? unitPrice * item.quantity : undefined

    return (
        <li className="flex gap-3 py-5">
            <div className="bg-muted relative aspect-5/8 w-14 shrink-0 overflow-hidden rounded-xl shadow-sm">
                <Image
                    src={book.coverImageSrc}
                    alt={book.coverImageAlt}
                    fill
                    sizes="44px"
                    className="object-contain"
                />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-foreground truncate text-sm leading-tight font-semibold">
                            {book.title}
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                            {FORMAT_LABELS[item.format]}
                            {unitPrice !== undefined && (
                                <span className="text-muted-foreground/60">
                                    {" "}
                                    · {fmt(unitPrice)} ea.
                                </span>
                            )}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={onRemove}
                        className="text-muted-foreground hover:text-destructive mt-0.5 shrink-0 rounded-full"
                        aria-label="Remove item"
                    >
                        <Trash2 className="size-3.5" />
                    </Button>
                </div>
                <div className="flex items-center justify-between">
                    <div className="bg-muted/60 flex items-center gap-1 rounded-full p-1">
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => onQuantityChange(item.quantity - 1)}
                            className="rounded-full"
                            aria-label="Decrease quantity"
                        >
                            <Minus className="size-3" />
                        </Button>
                        <span className="text-foreground w-6 text-center text-xs font-semibold tabular-nums">
                            {item.quantity}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => onQuantityChange(item.quantity + 1)}
                            className="rounded-full"
                            aria-label="Increase quantity"
                        >
                            <Plus className="size-3" />
                        </Button>
                    </div>
                    {lineTotal !== undefined && (
                        <span className="text-foreground text-sm font-semibold tabular-nums">
                            {fmt(lineTotal)}
                        </span>
                    )}
                </div>
            </div>
        </li>
    )
}
