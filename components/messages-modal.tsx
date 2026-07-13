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
            className="messages-modal"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
            <button
                type="button"
                className="messages-modal__backdrop"
                onClick={onClose}
                aria-label="Close conversation"
            />

            <motion.section
                ref={panelRef}
                className="messages-modal__panel"
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
                <header className="messages-modal__header">
                    <span className="messages-modal__icon" aria-hidden="true">
                        <MessageCircle />
                    </span>
                    <span className="messages-modal__identity">
                        <strong id={`messages-title-${widget.id}`}>
                            {widget.title}
                        </strong>
                        <span>Usually replies by email</span>
                    </span>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        className="messages-modal__close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X aria-hidden="true" />
                    </button>
                </header>

                <div className="messages-modal__body">
                    <MessageThread widget={widget} />
                </div>
            </motion.section>
        </motion.div>,
        document.body,
    )
}
