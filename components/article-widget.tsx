import Image from "next/image"
import { motion } from "motion/react"
import { MessagesWidget } from "@/components/messages-widget"
import type { WidgetDefinition } from "@/lib/widgets"

type ArticleWidgetProps = {
    widget: WidgetDefinition
    onOpen: () => void
}

export function ArticleWidget({ widget, onOpen }: ArticleWidgetProps) {
    if (widget.presentation === "messages") {
        return <MessagesWidget widget={widget} onOpen={onOpen} />
    }

    return (
        <button
            type="button"
            className="widget-card__surface article-widget"
            onClick={onOpen}
            aria-label={`Open ${widget.title}`}
        >
            <motion.span
                layoutId={`widget-${widget.id}-topline`}
                className="article-widget__eyebrow"
            >
                {widget.eyebrow ?? "Article"}
            </motion.span>

            <motion.span
                layoutId={`widget-${widget.id}-copy`}
                className="article-widget__copy"
            >
                <strong>{widget.title}</strong>
                {widget.summary && <span>{widget.summary}</span>}
            </motion.span>

            {widget.image && (
                <motion.span
                    layoutId={`widget-${widget.id}-image`}
                    className="article-widget__image"
                    aria-hidden="true"
                >
                    <Image
                        src={widget.image}
                        alt=""
                        fill
                        draggable={false}
                        loading={widget.id === "verbatim" ? "eager" : "lazy"}
                        sizes="(max-width: 759px) 90vw, 30rem"
                    />
                </motion.span>
            )}

            {widget.details?.facts && (
                <span className="article-widget__facts" aria-hidden="true">
                    {widget.details.facts.slice(0, 3).map((fact) => (
                        <span key={fact}>{fact}</span>
                    ))}
                </span>
            )}
        </button>
    )
}
