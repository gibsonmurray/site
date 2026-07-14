"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowUp } from "lucide-react"
import type { WidgetDefinition, WidgetMessage } from "@/lib/widgets"

type MessageThreadProps = {
    widget: WidgetDefinition
}

export function MessageThread({ widget }: MessageThreadProps) {
    const [draft, setDraft] = useState("")
    const [sentMessages, setSentMessages] = useState<WidgetMessage[]>([])
    const messagesRef = useRef<HTMLDivElement>(null)
    const messages = [...(widget.details?.messages ?? []), ...sentMessages]
    const messageCount = messages.length

    useEffect(() => {
        const container = messagesRef.current
        if (!container) return
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" })
    }, [messageCount])

    const sendMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const message = draft.trim()
        if (!message) return

        setSentMessages((current) => [
            ...current,
            { side: "outgoing", text: message },
        ])
        setDraft("")
    }

    return (
        <div className="grid min-h-0 w-full grid-rows-[minmax(0,1fr)_auto] gap-3 bg-white p-4">
            <div
                ref={messagesRef}
                className="flex min-h-0 [scrollbar-width:none] flex-col justify-end gap-[0.3rem] overflow-x-hidden overflow-y-auto [overscroll-behavior:contain] px-[0.15rem] pt-14 pb-[0.35rem] [&::-webkit-scrollbar]:hidden"
                role="log"
                aria-label="Conversation"
                aria-live="polite"
            >
                {messages.map((message, index) => (
                    <p
                        key={`${message.side}-${index}-${message.text}`}
                        className={
                            message.side === "outgoing"
                                ? "m-0 max-w-[min(78%,25rem)] self-end rounded-[1.08rem_1.08rem_0.32rem_1.08rem] bg-[#0a84ff] px-[0.82rem] py-[0.62rem] text-[0.87rem] leading-[1.35] text-white"
                                : "m-0 max-w-[min(78%,25rem)] rounded-[1.08rem_1.08rem_1.08rem_0.32rem] bg-[#e9e9eb] px-[0.82rem] py-[0.62rem] text-[0.87rem] leading-[1.35] text-[#111]"
                        }
                    >
                        {message.text}
                    </p>
                ))}
            </div>

            <form
                className="flex items-center gap-[0.4rem] rounded-full border border-[#c7c7cc] bg-white py-[0.3rem] pr-[0.32rem] pl-[0.82rem]"
                onSubmit={sendMessage}
            >
                <label htmlFor={`message-${widget.id}`} className="sr-only">
                    Write a message
                </label>
                <input
                    id={`message-${widget.id}`}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="iMessage"
                    autoComplete="off"
                    className="min-w-0 flex-1 border-0 bg-transparent text-[0.86rem] text-[#111] outline-0 placeholder:text-[#9a9a9f]"
                />
                <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Send message preview"
                    className="grid size-[1.9rem] shrink-0 cursor-pointer place-items-center rounded-full bg-[#0a84ff] text-white transition-[opacity,transform] duration-200 active:scale-90 disabled:cursor-default disabled:opacity-30 [&>svg]:size-4 [&>svg]:stroke-[2.5]"
                >
                    <ArrowUp aria-hidden="true" />
                </button>
            </form>
        </div>
    )
}
