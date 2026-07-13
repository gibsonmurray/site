"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { ArrowUpRight, X } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { WidgetHeader } from "@/components/widget-header"
import { MessageThread } from "@/components/message-thread"
import type { WidgetDefinition } from "@/lib/widgets"

type WidgetModalProps = {
    widget: WidgetDefinition
    onClose: () => void
}

export function WidgetModal({ widget, onClose }: WidgetModalProps) {
    const closeButtonRef = useRef<HTMLButtonElement>(null)
    const panelRef = useRef<HTMLElement>(null)
    const reduceMotion = useReducedMotion()
    const details = widget.details
    const isMessages = widget.presentation === "messages"

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
                    "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])",
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
            className="widget-modal"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
        >
            <button
                type="button"
                className="widget-modal__backdrop"
                onClick={onClose}
                aria-label="Close expanded widget"
            />
            <motion.section
                ref={panelRef}
                layoutId={`widget-${widget.id}`}
                className={
                    isMessages
                        ? "widget-modal__panel is-messages"
                        : "widget-modal__panel"
                }
                data-accent={widget.accent ?? "slate"}
                role="dialog"
                aria-modal="true"
                aria-label={
                    isMessages ? `${widget.title} conversation` : undefined
                }
                aria-labelledby={
                    isMessages ? undefined : `modal-title-${widget.id}`
                }
                transition={
                    reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 190, damping: 24 }
                }
            >
                {!isMessages && (
                    <header className="widget-modal__header">
                        <WidgetHeader
                            widget={widget}
                            variant="modal"
                            titleId={`modal-title-${widget.id}`}
                        />
                        <button
                            ref={closeButtonRef}
                            type="button"
                            className="widget-modal__close"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <X aria-hidden="true" />
                        </button>
                    </header>
                )}

                {isMessages && (
                    <button
                        ref={closeButtonRef}
                        type="button"
                        className="widget-modal__close widget-modal__close--floating"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X aria-hidden="true" />
                    </button>
                )}

                <div
                    className={
                        isMessages
                            ? "widget-modal__scroller is-messages"
                            : "widget-modal__scroller"
                    }
                    tabIndex={isMessages ? undefined : 0}
                    aria-label={
                        isMessages ? "Conversation" : `${widget.title} details`
                    }
                >
                    {isMessages ? (
                        <MessageThread widget={widget} />
                    ) : widget.image ? (
                        <motion.div
                            layoutId={`widget-${widget.id}-image`}
                            className="widget-modal__image"
                        >
                            <Image
                                src={widget.image}
                                alt={`${widget.title} preview`}
                                width={1600}
                                height={1200}
                                sizes="(max-width: 720px) 92vw, 39rem"
                            />
                        </motion.div>
                    ) : null}

                    {!isMessages && (
                        <div className="widget-modal__content">
                            <div className="widget-modal__body">
                                {(
                                    details?.body ??
                                    (widget.summary ? [widget.summary] : [])
                                ).map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>

                            {details?.facts && (
                                <ul
                                    className="widget-modal__facts"
                                    aria-label="Highlights"
                                >
                                    {details.facts.map((fact) => (
                                        <li key={fact}>{fact}</li>
                                    ))}
                                </ul>
                            )}

                            {details?.links && (
                                <div className="widget-modal__links">
                                    {details.links.map((link) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            target={
                                                link.href.startsWith("http")
                                                    ? "_blank"
                                                    : undefined
                                            }
                                            rel={
                                                link.href.startsWith("http")
                                                    ? "noreferrer"
                                                    : undefined
                                            }
                                        >
                                            {link.label}
                                            <ArrowUpRight aria-hidden="true" />
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.section>
        </motion.div>,
        document.body,
    )
}
