"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowUp, Mail } from "lucide-react"
import { cn, widgetSurface } from "@/lib/widget-design"
import type { WidgetDefinition, WidgetMessage } from "@/lib/widgets"

type MessagesWidgetProps = {
    widget: WidgetDefinition
}

const CONTACT_EMAIL = "hi@gibsonmurray.com"
const AUTO_REPLY =
    "got it — thanks for reaching out! i'll get back to you soon."

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
    const [conversation, setConversation] = useState<WidgetMessage[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [sendState, setSendState] = useState<
        "idle" | "sending" | "sent" | "error"
    >("idle")
    const replyTimers = useRef(new Set<number>())
    const initialMessages = widget.messages ?? [
        { side: "incoming" as const, text: "hey! stoked you're here." },
        { side: "incoming" as const, text: "what's up?" },
    ]
    const visibleMessages = [...initialMessages, ...conversation].slice(
        isTyping ? -3 : -4,
    )

    useEffect(
        () => () => {
            for (const timer of replyTimers.current) {
                window.clearTimeout(timer)
            }
        },
        [],
    )

    const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const message = draft.trim()
        if (!message || sendState === "sending" || isTyping) return

        setSendState("sending")

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            })

            if (!response.ok) throw new Error("Message delivery failed")

            setConversation((current) => [
                ...current,
                { side: "outgoing", text: message },
            ])
            setDraft("")
            setSendState("sent")
            setIsTyping(true)

            const replyTimer = window.setTimeout(() => {
                setIsTyping(false)
                setConversation((current) => [
                    ...current,
                    { side: "incoming", text: AUTO_REPLY },
                ])
                replyTimers.current.delete(replyTimer)
            }, 1600)
            replyTimers.current.add(replyTimer)
        } catch {
            setSendState("error")
        }
    }

    return (
        <div
            className={cn(
                widgetSurface,
                "cursor-default justify-between gap-2.5 bg-[#f7f7f9] p-[clamp(0.8rem,3vw,1.05rem)]",
            )}
        >
            <div
                className="flex min-h-0 flex-1 flex-col justify-end gap-[0.15rem]"
                role="log"
                aria-label="Conversation with Gibson"
                aria-live="polite"
            >
                {visibleMessages.map((message, index) => {
                    const startsGroup =
                        index === 0 ||
                        visibleMessages[index - 1]?.side !== message.side
                    const endsGroup =
                        index === visibleMessages.length - 1 ||
                        visibleMessages[index + 1]?.side !== message.side
                    const messageKey = `${message.side}-${message.text}-${index}`

                    if (message.side === "outgoing") {
                        return (
                            <p
                                className="relative mr-2 ml-auto max-w-[62%] rounded-[1.05rem] bg-[#0a84ff] px-3 py-1.5 text-[clamp(0.72rem,2.4vw,0.88rem)] leading-[1.22] font-[450] tracking-[-0.02em] text-white"
                                key={messageKey}
                            >
                                <span className="relative z-10 line-clamp-2">
                                    {message.text}
                                </span>
                                {endsGroup && <MessageTail side="outgoing" />}
                            </p>
                        )
                    }

                    return (
                        <div className="flex items-end gap-2" key={messageKey}>
                            {endsGroup ? (
                                <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
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
                            ) : (
                                <span className="size-9 shrink-0" />
                            )}

                            <div className="max-w-[78%] min-w-0">
                                {startsGroup && (
                                    <p className="mb-1 pl-2 text-[0.62rem] leading-none font-[520] text-[#8e8e93]">
                                        Gibson
                                    </p>
                                )}
                                <p className="relative rounded-[1.05rem] bg-[#e5e5ea] px-3 py-1.5 text-[clamp(0.72rem,2.4vw,0.88rem)] leading-[1.22] font-[450] tracking-[-0.02em] text-black">
                                    <span className="relative z-10 line-clamp-2">
                                        {message.text}
                                    </span>
                                    {endsGroup && (
                                        <MessageTail side="incoming" />
                                    )}
                                </p>
                            </div>
                        </div>
                    )
                })}
                {isTyping && (
                    <div
                        className="flex items-end gap-2"
                        role="status"
                        aria-label="Gibson is typing"
                    >
                        <div className="relative size-9 shrink-0 overflow-hidden rounded-full">
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
                        <div className="min-w-0">
                            <p className="mb-1 pl-2 text-[0.62rem] leading-none font-[520] text-[#8e8e93]">
                                Gibson
                            </p>
                            <div className="relative flex h-[1.8rem] items-center gap-[0.2rem] rounded-[1.05rem] bg-[#e5e5ea] px-3">
                                <span
                                    className="size-[0.32rem] animate-bounce rounded-full bg-[#8e8e93] [animation-delay:-0.3s] [animation-duration:0.9s]"
                                    aria-hidden="true"
                                />
                                <span
                                    className="size-[0.32rem] animate-bounce rounded-full bg-[#8e8e93] [animation-delay:-0.15s] [animation-duration:0.9s]"
                                    aria-hidden="true"
                                />
                                <span
                                    className="size-[0.32rem] animate-bounce rounded-full bg-[#8e8e93] [animation-duration:0.9s]"
                                    aria-hidden="true"
                                />
                                <MessageTail side="incoming" />
                            </div>
                        </div>
                    </div>
                )}
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
                        className="pointer-events-none absolute bottom-[calc(100%+0.55rem)] left-0 z-20 translate-y-1 rounded-[0.48rem] bg-black px-2.5 py-1.5 text-[0.65rem] font-[560] tracking-[-0.01em] whitespace-nowrap text-white opacity-0 shadow-[0_6px_16px_rgba(0,0,0,0.16)] transition-[opacity,transform] duration-150 group-hover/mail:translate-y-0 group-hover/mail:opacity-100 group-focus-visible/mail:translate-y-0 group-focus-visible/mail:opacity-100 after:absolute after:top-full after:left-4 after:-translate-x-1/2 after:border-x-[0.3rem] after:border-t-[0.35rem] after:border-x-transparent after:border-t-black after:content-['']"
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
                        className="min-w-0 flex-1 bg-transparent text-[0.82rem] text-[#111] outline-none placeholder:text-[#c7c7cc]"
                    />
                    <button
                        type="submit"
                        disabled={
                            !draft.trim() ||
                            sendState === "sending" ||
                            isTyping
                        }
                        aria-label="Send message to Gibson Murray"
                        className="mr-1 grid size-6 shrink-0 cursor-pointer place-items-center rounded-full bg-[#0a84ff] text-white transition-[background,opacity,transform] duration-150 active:scale-90 disabled:cursor-default disabled:bg-[#c7c7cc]"
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
