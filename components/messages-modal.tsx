"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { MessageCircle, X } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { MessageThread } from "@/components/message-thread"
import type { WidgetDefinition } from "@/lib/widgets"

type MessagesModalProps = {
    widget: WidgetDefinition
    onClose: () => void
}

export function MessagesModal({ widget, onClose }: MessagesModalProps) {
    const panelRef = useRef<HTMLElement>(null)
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const reduceMotion = useReducedMotion()

    useEffect(() => {
        const previousFocus = document.activeElement as HTMLElement | null
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        closeButtonRef.current?.focus()

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose()
                return
            }

            if (event.key !== "Tab" || !panelRef.current) return

            const focusable = Array.from(
                panelRef.current.querySelectorAll<HTMLElement>(
                    "button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])",
                ),
            )
            const first = focusable.at(0)
            const last = focusable.at(-1)

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last?.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first?.focus()
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener("keydown", handleKeyDown)
            previousFocus?.focus()
        }
    }, [onClose])

    return createPortal(
        <motion.div
            className="fixed inset-0 isolate z-[2147483000] grid place-items-center p-3"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
            <button
                type="button"
                className="absolute inset-0 z-0 size-full cursor-default bg-[rgba(8,12,18,0.42)] backdrop-blur-[9px]"
                onClick={onClose}
                aria-label="Close conversation"
            />

            <motion.section
                ref={panelRef}
                className="relative z-[1] flex h-[min(88svh,43rem)] min-h-[28rem] w-[min(100%,29rem)] flex-col overflow-hidden rounded-[clamp(1.5rem,5vw,2rem)] border border-black/10 bg-white shadow-[0_28px_90px_rgba(0,0,0,0.24)]"
                role="dialog"
                aria-modal="true"
                aria-labelledby={`messages-title-${widget.id}`}
                initial={
                    reduceMotion ? false : { opacity: 0, scale: 0.98, y: 16 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={
                    reduceMotion
                        ? undefined
                        : { opacity: 0, scale: 0.985, y: 10 }
                }
                transition={
                    reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 30 }
                }
            >
                <header className="flex shrink-0 items-center gap-3 border-b border-[#3c3c43]/10 bg-[#fafafc]/95 px-4 pt-4 pb-[0.9rem]">
                    <span
                        className="grid size-[2.45rem] shrink-0 place-items-center rounded-[0.82rem] bg-[#0a84ff] text-white shadow-[0_5px_14px_rgba(10,132,255,0.22)]"
                        aria-hidden="true"
                    >
                        <MessageCircle className="size-5 stroke-[2.25]" />
                    </span>
                    <span className="grid min-w-0 gap-[0.15rem]">
                        <strong
                            className="text-[0.95rem] font-[650] tracking-[-0.02em]"
                            id={`messages-title-${widget.id}`}
                        >
                            {widget.title}
                        </strong>
                        <span className="text-[0.68rem] text-[#818187]">
                            Usually replies by email
                        </span>
                    </span>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        className="ml-auto grid size-[2.15rem] cursor-pointer place-items-center rounded-full border border-[#3c3c43]/10 bg-[#efeff4] text-[#5a5a60] [&>svg]:size-[0.95rem]"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X aria-hidden="true" />
                    </button>
                </header>

                <div className="flex min-h-0 flex-1 [&>div]:h-full">
                    <MessageThread widget={widget} />
                </div>
            </motion.section>
        </motion.div>,
        document.body,
    )
}
