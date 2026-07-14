"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { ArrowUpRight, X } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { WidgetHeader } from "@/components/widget-header"
import { cn, modalAccent } from "@/lib/widget-design"
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
            className="fixed inset-0 isolate z-[2147483000] grid place-items-center p-3"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
        >
            <button
                type="button"
                className="absolute inset-0 z-0 size-full cursor-default bg-black/35 backdrop-blur-[5px]"
                onClick={onClose}
                aria-label="Close expanded widget"
            />
            <motion.section
                ref={panelRef}
                layoutId={`widget-${widget.id}`}
                className={cn(
                    modalAccent({ accent: widget.accent ?? "slate" }),
                    "relative z-[1] flex max-h-[min(88svh,48rem)] w-[min(100%,43rem)] flex-col overflow-hidden rounded-[clamp(1.5rem,5vw,2rem)] border border-[#e8e8e6] bg-[color-mix(in_srgb,var(--widget-accent)_5%,#fff)] shadow-[0_28px_90px_rgba(0,0,0,0.2)]",
                )}
                data-accent={widget.accent ?? "slate"}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`modal-title-${widget.id}`}
                transition={
                    reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 190, damping: 24 }
                }
            >
                <header className="relative z-[3] shrink-0 border-b border-[#e8e8e6] bg-[color-mix(in_srgb,var(--widget-accent)_5%,#fff)] p-[clamp(1.25rem,4vw,1.8rem)]">
                    <WidgetHeader
                        widget={widget}
                        variant="modal"
                        titleId={`modal-title-${widget.id}`}
                    />
                    <button
                        ref={closeButtonRef}
                        type="button"
                        className="absolute top-4 right-4 z-[5] grid size-10 cursor-pointer place-items-center rounded-full border border-[#e8e8e6] bg-white [&>svg]:size-[1.1rem]"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X aria-hidden="true" />
                    </button>
                </header>

                <div
                    className="min-h-0 [scrollbar-gutter:stable] overflow-x-hidden overflow-y-auto [overscroll-behavior:contain] focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-[#087cff]/70"
                    tabIndex={0}
                    aria-label={`${widget.title} details`}
                >
                    {widget.image ? (
                        <motion.div
                            layoutId={`widget-${widget.id}-image`}
                            className="mx-[clamp(1.1rem,4vw,1.8rem)] mt-[clamp(1.1rem,4vw,1.8rem)] overflow-hidden rounded-[clamp(1rem,4vw,1.45rem)] border border-[#e8e8e6] bg-[#f7f7f6]"
                        >
                            <Image
                                src={widget.image}
                                alt={`${widget.title} preview`}
                                width={1600}
                                height={1200}
                                sizes="(max-width: 720px) 92vw, 39rem"
                                className="block h-auto max-h-96 w-full object-contain"
                            />
                        </motion.div>
                    ) : null}

                    <div className="flex flex-col items-start gap-[1.2rem] px-[clamp(1.4rem,6vw,3rem)] pt-[clamp(1.35rem,4vw,2rem)] pb-[clamp(1.6rem,5vw,2.5rem)]">
                        <div className="grid max-w-[37rem] gap-4">
                            {(
                                details?.body ??
                                (widget.summary ? [widget.summary] : [])
                            ).map((paragraph) => (
                                <p
                                    className="m-0 text-[clamp(0.98rem,3vw,1.13rem)] leading-[1.58] text-[#727272]"
                                    key={paragraph}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {details?.facts && (
                            <ul
                                className="m-0 flex list-none flex-wrap gap-[0.55rem] p-0"
                                aria-label="Highlights"
                            >
                                {details.facts.map((fact) => (
                                    <li
                                        className="rounded-full border border-[#e8e8e6] bg-white px-[0.78rem] py-[0.52rem] text-[0.74rem] font-[620] text-[#727272]"
                                        key={fact}
                                    >
                                        {fact}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {details?.links && (
                            <div className="flex flex-wrap gap-3">
                                {details.links.map((link) => (
                                    <a
                                        className="inline-flex items-center gap-[0.4rem] border-b border-[color-mix(in_srgb,var(--widget-accent)_35%,transparent)] py-[0.2rem] text-[0.72rem] leading-none font-[650] text-[var(--widget-accent)] [&>svg]:size-[0.82rem]"
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
                </div>
            </motion.section>
        </motion.div>,
        document.body,
    )
}
