import Image from "next/image"
import { motion } from "motion/react"
import { MessagesWidget } from "@/components/messages-widget"
import {
    cn,
    getWidgetSize,
    widgetCopy,
    widgetEyebrow,
    widgetPill,
    widgetPills,
    widgetSummary,
    widgetSurface,
    widgetTitle,
} from "@/lib/widget-design"
import type { WidgetDefinition } from "@/lib/widgets"

type ArticleWidgetProps = {
    widget: WidgetDefinition
    onOpen: () => void
}

export function ArticleWidget({ widget, onOpen }: ArticleWidgetProps) {
    if (widget.presentation === "messages") {
        return <MessagesWidget widget={widget} onOpen={onOpen} />
    }
    const size = getWidgetSize(widget.size)
    const isWide = size.name === "wide"

    return (
        <button
            type="button"
            className={cn(
                widgetSurface,
                "isolate justify-start bg-[color-mix(in_srgb,var(--widget-accent)_5%,#fff)]",
                isWide &&
                    "grid grid-cols-[minmax(0,0.9fr)_minmax(7rem,1.1fr)] grid-rows-[auto_1fr] gap-x-4 gap-y-[0.65rem]",
            )}
            onClick={onOpen}
            aria-label={`Open ${widget.title}`}
        >
            <motion.span
                layoutId={`widget-${widget.id}-topline`}
                className={cn(widgetEyebrow, "relative z-[2]")}
            >
                {widget.eyebrow ?? "Article"}
            </motion.span>

            <motion.span
                layoutId={`widget-${widget.id}-copy`}
                className={cn(
                    widgetCopy,
                    isWide && "self-end",
                    size.name === "compact" && "mt-auto",
                )}
            >
                <strong className={widgetTitle}>{widget.title}</strong>
                {size.showSummary && widget.summary && (
                    <span className={widgetSummary}>{widget.summary}</span>
                )}
            </motion.span>

            {size.showMedia && widget.image && (
                <motion.span
                    layoutId={`widget-${widget.id}-image`}
                    className={cn(
                        "relative z-[1] block min-h-0 flex-1 overflow-hidden rounded-2xl border border-black/8 bg-[#f7f7f6]",
                        isWide && "col-start-2 row-span-2 row-start-1",
                    )}
                    aria-hidden="true"
                >
                    <Image
                        src={widget.image}
                        alt=""
                        fill
                        draggable={false}
                        loading={widget.id === "verbatim" ? "eager" : "lazy"}
                        sizes="(max-width: 759px) 90vw, 30rem"
                        className={cn(
                            "object-cover",
                            (size.name === "tall" || widget.id === "walls") &&
                                "object-contain p-2",
                        )}
                    />
                </motion.span>
            )}

            {size.showDetails && widget.details?.facts && (
                <span
                    className={cn(widgetPills, "relative z-[2]")}
                    aria-hidden="true"
                >
                    {widget.details.facts.slice(0, 3).map((fact) => (
                        <span className={widgetPill} key={fact}>
                            {fact}
                        </span>
                    ))}
                </span>
            )}
        </button>
    )
}
