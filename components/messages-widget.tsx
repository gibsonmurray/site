"use client"

import Image from "next/image"
import { useState, type FormEvent } from "react"
import { ArrowUp, Mail } from "lucide-react"
import { cn, widgetSurface } from "@/lib/widget-design"
import type { WidgetDefinition } from "@/lib/widgets"

type MessagesWidgetProps = {
    widget: WidgetDefinition
}

const CONTACT_EMAIL = "hi@gibsonmurray.com"

function MessageTail({ side }: { side: "incoming" | "outgoing" }) {
    return (
        <svg
            viewBox="0 0 12 14"
            className={cn(
                "absolute bottom-0 h-3.5 w-3 fill-current",
                side === "outgoing"
                    ? "-right-[0.42rem] text-[#0a84ff]"
                    : "-left-[0.42rem] scale-x-[-1] text-[#e5e5ea]",
            )}
            aria-hidden="true"
        >
            <path d="M0 0h4v5.5c0 3.2 2.7 5.9 7.5 7.2C6.8 13.7 2.7 12.2 0 9V0Z" />
        </svg>
    )
}

export function MessagesWidget({ widget }: MessagesWidgetProps) {
    const [draft, setDraft] = useState("")
    const [sendState, setSendState] = useState<
        "idle" | "sending" | "sent" | "error"
    >("idle")
    const incomingMessages = widget.messages?.filter(
        (message) => message.side === "incoming",
    ) ?? [{ side: "incoming", text: "hey! stoked you're here." }]

    const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const message = draft.trim()
        if (!message || sendState === "sending") return

        setSendState("sending")

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            })

            if (!response.ok) throw new Error("Message delivery failed")

            setDraft("")
            setSendState("sent")
        } catch {
            setSendState("error")
        }
    }

    return (
        <div
            className={cn(
                widgetSurface,
                "cursor-default justify-between gap-2.5 p-[clamp(0.8rem,3vw,1.05rem)]",
            )}
        >
            <div className="flex min-h-0 flex-1 flex-col justify-center gap-2.5">
                <div className="flex items-end gap-2">
                    <div className="relative size-9 shrink-0 overflow-hidden rounded-full ring-1 ring-black/5">
                        <Image
                            src={
                                widget.image ??
                                "/media/gibson-murray-headshot.jpeg"
                            }
                            alt="Gibson Murray"
                            fill
                            sizes="36px"
                            className="object-cover object-[50%_42%]"
                        />
                    </div>

                    <div className="min-w-0 max-w-[78%]">
                        <p className="mb-1 pl-2 text-[0.62rem] leading-none font-[520] text-[#8e8e93]">
                            Gibson
                        </p>
                        <div className="flex flex-col items-start gap-[0.15rem]">
                            {incomingMessages.map((message, index) => (
                                <p
                                    className="relative rounded-[1.05rem] bg-[#e5e5ea] px-3 py-1.5 text-[clamp(0.72rem,2.4vw,0.88rem)] leading-[1.22] font-[450] tracking-[-0.02em] text-black"
                                    key={`${message.text}-${index}`}
                                >
                                    <span className="relative z-10">
                                        {message.text}
                                    </span>
                                    {index === incomingMessages.length - 1 && (
                                        <MessageTail side="incoming" />
                                    )}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="relative ml-auto mr-2 max-w-[52%] rounded-[1.05rem] bg-[#0a84ff] px-3 py-2 text-[clamp(0.72rem,2.4vw,0.88rem)] leading-none font-[450] tracking-[-0.02em] text-white">
                    <span className="relative z-10">sounds good 🙏</span>
                    <MessageTail side="outgoing" />
                </p>
            </div>

            <div className="flex items-center gap-2.5">
                <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    aria-label={`Email ${CONTACT_EMAIL}`}
                    aria-describedby="contact-email-tooltip"
                    className="widget-interactive group/mail relative grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-[#9b9b9f] transition-colors duration-200 hover:text-[#0a84ff] focus-visible:text-[#0a84ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff]"
                >
                    <Mail
                        className="size-[1.4rem] stroke-[2.2]"
                        aria-hidden="true"
                    />
                    <span
                        id="contact-email-tooltip"
                        role="tooltip"
                        className="pointer-events-none absolute bottom-[calc(100%+0.55rem)] left-1/2 z-20 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[0.48rem] bg-black px-2.5 py-1.5 text-[0.65rem] font-[560] tracking-[-0.01em] text-white opacity-0 shadow-[0_6px_16px_rgba(0,0,0,0.16)] transition-[opacity,transform] duration-150 after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-x-[0.3rem] after:border-t-[0.35rem] after:border-x-transparent after:border-t-black after:content-[''] group-hover/mail:translate-y-0 group-hover/mail:opacity-100 group-focus-visible/mail:translate-y-0 group-focus-visible/mail:opacity-100"
                    >
                        {CONTACT_EMAIL}
                    </span>
                </a>

                <form
                    className="widget-interactive flex h-8 min-w-0 flex-1 items-center rounded-full border-[1.5px] border-[#d4d4d8] bg-white/35 pl-3 focus-within:border-[#0a84ff]/55"
                    onSubmit={sendMessage}
                >
                    <label htmlFor={`message-${widget.id}`} className="sr-only">
                        Message Gibson Murray
                    </label>
                    <input
                        id={`message-${widget.id}`}
                        value={draft}
                        onChange={(event) => {
                            setDraft(event.target.value)
                            if (sendState !== "idle") setSendState("idle")
                        }}
                        placeholder={
                            sendState === "sent"
                                ? "Sent — thank you!"
                                : sendState === "error"
                                  ? "Couldn’t send — try again"
                                  : "iMessage"
                        }
                        maxLength={2000}
                        autoComplete="off"
                        className="min-w-0 flex-1 bg-transparent text-[0.68rem] text-[#111] outline-none placeholder:text-[#c7c7cc]"
                    />
                    <button
                        type="submit"
                        disabled={!draft.trim() || sendState === "sending"}
                        aria-label="Send message to Gibson Murray"
                        className="mr-0.5 grid size-6 shrink-0 cursor-pointer place-items-center rounded-full bg-[#0a84ff] text-white transition-[background,opacity,transform] duration-150 active:scale-90 disabled:cursor-default disabled:bg-[#c7c7cc]"
                    >
                        <ArrowUp
                            className="size-4 stroke-[3]"
                            aria-hidden="true"
                        />
                    </button>
                    <span className="sr-only" role="status" aria-live="polite">
                        {sendState === "sent"
                            ? "Message sent"
                            : sendState === "error"
                              ? "Message could not be sent"
                              : ""}
                    </span>
                </form>
            </div>
        </div>
    )
}
