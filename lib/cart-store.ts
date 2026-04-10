import { create } from "zustand"
import { persist } from "zustand/middleware"
import { BookFormat } from "@/lib/books"

export type CartItem = {
    bookId: string
    format: BookFormat
    quantity: number
}

type CartState = {
    items: CartItem[]
    isOpen: boolean
    addItem: (bookId: string, format: BookFormat, quantity?: number) => void
    removeItem: (bookId: string, format: BookFormat) => void
    updateQuantity: (bookId: string, format: BookFormat, quantity: number) => void
    clearCart: () => void
    openCart: () => void
    closeCart: () => void
}

export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            isOpen: false,
            addItem: (bookId, format, quantity = 1) =>
                set((state) => {
                    const existing = state.items.find(
                        (i) => i.bookId === bookId && i.format === format,
                    )
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.bookId === bookId && i.format === format
                                    ? { ...i, quantity: i.quantity + quantity }
                                    : i,
                            ),
                        }
                    }
                    return {
                        items: [...state.items, { bookId, format, quantity }],
                    }
                }),
            removeItem: (bookId, format) =>
                set((state) => ({
                    items: state.items.filter(
                        (i) => !(i.bookId === bookId && i.format === format),
                    ),
                })),
            updateQuantity: (bookId, format, quantity) =>
                set((state) => ({
                    items:
                        quantity <= 0
                            ? state.items.filter(
                                  (i) =>
                                      !(
                                          i.bookId === bookId &&
                                          i.format === format
                                      ),
                              )
                            : state.items.map((i) =>
                                  i.bookId === bookId && i.format === format
                                      ? { ...i, quantity }
                                      : i,
                              ),
                })),
            clearCart: () => set({ items: [] }),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),
        }),
        {
            name: "cart-storage",
            partialize: (state) => ({ items: state.items }),
        },
    ),
)
