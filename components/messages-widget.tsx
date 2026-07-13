import { ChevronRight, MessageCircle } from "lucide-react"
import type { WidgetDefinition } from "@/lib/widgets"

type MessagesWidgetProps = {
    widget: WidgetDefinition
    onOpen: () => void
}

export function MessagesWidget({ widget, onOpen }: MessagesWidgetProps) {
    const messages = widget.details?.messages?.slice(-2) ?? []

    return (
        <button
            type="button"
            className="widget-card__surface messages-widget"
            onClick={onOpen}
            aria-label={`Open ${widget.title}`}
        >
            <span className="messages-widget__topline">
                <span className="messages-widget__icon">
                    <MessageCircle aria-hidden="true" />
                </span>
                <span>Messages</span>
                <span className="messages-widget__open" aria-hidden="true">
                    <ChevronRight />
                </span>
            </span>

            <span className="messages-widget__preview" aria-hidden="true">
                <span className="messages-widget__bubbles">
                    {messages.map((message) => (
                        <span
                            key={message.text}
                            className={`messages-widget__bubble is-${message.side}`}
                        >
                            {message.text}
                        </span>
                    ))}
                </span>
                <span className="messages-widget__typing">
                    <span />
                    <span />
                    <span />
                </span>
            </span>

            <span className="messages-widget__copy">
                <strong>{widget.title}</strong>
                {widget.summary && <span>{widget.summary}</span>}
            </span>
        </button>
    )
}
