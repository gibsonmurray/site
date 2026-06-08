"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { books } from "@/lib/books"
import { useCartStore } from "@/lib/cart-store"
import { usePricesStore } from "@/lib/prices-store"
import { cn } from "@/lib/utils"
import { CartLineItem, FORMAT_LABELS, fmt } from "@/components/cart-line-item"

export const CartDrawer = () => {
    const router = useRouter()
    const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart } =
        useCartStore()

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const getPrice = usePricesStore((s) => s.getPrice)

    const subtotal = items.reduce((sum, item) => {
        const book = books.find((b) => b.slug === item.bookId)
        if (!book) return sum
        const price = getPrice(book.slug, item.format)
        return price !== undefined ? sum + price * item.quantity : sum
    }, 0)

    const allPriced = items.every((item) => {
        const book = books.find((b) => b.slug === item.bookId)
        return (
            book !== undefined && getPrice(book.slug, item.format) !== undefined
        )
    })

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : ""
        return () => {
            document.body.style.overflow = ""
        }
    }, [isOpen])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeCart()
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [closeCart])

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
                    isOpen
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0",
                )}
                onClick={closeCart}
                aria-hidden="true"
            />

            <aside
                className={cn(
                    "site-cart-drawer border-foreground/12 bg-background fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l shadow-2xl transition-transform duration-300 ease-in-out",
                    isOpen ? "translate-x-0" : "translate-x-full",
                )}
                aria-label="Shopping cart"
            >
                <div className="site-cart-header border-foreground/12 flex items-center justify-between border-b px-6 py-5">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="size-4" />
                        <span className="site-cart-title text-foreground font-[Georgia] text-2xl font-normal tracking-[-0.045em]">
                            Bag
                        </span>
                        {totalItems > 0 && (
                            <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full text-xs font-bold">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={closeCart}
                        className="text-muted-foreground hover:text-foreground rounded-none"
                        aria-label="Close cart"
                    >
                        <X className="size-5" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="site-cart-empty flex min-h-80 flex-col items-center justify-center gap-4 px-8 text-center">
                            <div className="bg-primary mb-2 h-px w-10" />
                            <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-[0.25rem]">
                                <ShoppingCart className="size-6" />
                            </div>
                            <div>
                                <p className="site-cart-empty-title text-foreground font-[Georgia] text-4xl leading-none font-normal tracking-[-0.045em]">
                                    Your bag is empty.
                                </p>
                                <p className="text-muted-foreground mt-2 text-sm leading-6">
                                    Books and pre-orders will appear here.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <ul className="divide-border divide-y px-5">
                            {items.map((item) => (
                                <CartLineItem
                                    key={`${item.bookId}-${item.format}`}
                                    item={item}
                                    onRemove={() =>
                                        removeItem(item.bookId, item.format)
                                    }
                                    onQuantityChange={(qty) =>
                                        updateQuantity(
                                            item.bookId,
                                            item.format,
                                            qty,
                                        )
                                    }
                                />
                            ))}
                        </ul>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="border-foreground/12 space-y-5 border-t px-6 py-5">
                        <div className="flex flex-col gap-2">
                            {items.map((item) => {
                                const book = books.find(
                                    (b) => b.slug === item.bookId,
                                )
                                const price = book
                                    ? getPrice(book.slug, item.format)
                                    : undefined
                                if (!book || price === undefined) return null
                                return (
                                    <div
                                        key={`${item.bookId}-${item.format}`}
                                        className="flex items-center justify-between gap-2"
                                    >
                                        <span className="text-muted-foreground truncate text-xs">
                                            {book.title}{" "}
                                            <span className="text-muted-foreground/60">
                                                ({FORMAT_LABELS[item.format]} x{" "}
                                                {item.quantity})
                                            </span>
                                        </span>
                                        <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                                            {fmt(price * item.quantity)}
                                        </span>
                                    </div>
                                )
                            })}
                            <div className="border-border/60 mt-2 border-t pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-foreground text-sm font-semibold">
                                        {allPriced
                                            ? "Subtotal"
                                            : "Est. subtotal"}
                                    </span>
                                    <span className="text-foreground text-sm font-semibold tabular-nums">
                                        {allPriced
                                            ? fmt(subtotal)
                                            : `~${fmt(subtotal)}`}
                                    </span>
                                </div>
                                <p className="text-muted-foreground/60 mt-1 text-xs">
                                    Flat-rate shipping and tax shown at
                                    checkout.
                                </p>
                            </div>
                        </div>

                        <Button
                            className="h-11 w-full rounded-none font-semibold"
                            size="lg"
                            onClick={() => {
                                closeCart()
                                router.push("/books/checkout")
                            }}
                        >
                            Checkout
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={clearCart}
                            className="mx-auto flex h-auto w-fit rounded-none border-b border-transparent px-0 py-1 text-xs hover:border-current hover:bg-transparent"
                        >
                            Clear bag
                        </Button>
                    </div>
                )}
            </aside>
        </>
    )
}
