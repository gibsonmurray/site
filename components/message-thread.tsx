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
        <div className="message-thread">
            <div
                ref={messagesRef}
                className="message-thread__messages"
                role="log"
                aria-label="Conversation"
                aria-live="polite"
            >
                {messages.map((message, index) => (
                    <p
                        key={`${message.side}-${index}-${message.text}`}
                        className={`message-thread__bubble is-${message.side}`}
                    >
                        {message.text}
                    </p>
                ))}
            </div>

            <form className="message-thread__composer" onSubmit={sendMessage}>
                <label htmlFor={`message-${widget.id}`} className="sr-only">
                    Write a message
                </label>
                <input
                    id={`message-${widget.id}`}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="iMessage"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Send message preview"
                >
                    <ArrowUp aria-hidden="true" />
                </button>
            </form>
        </div>
    )
}
