import Image from "next/image"
import { motion } from "motion/react"
import { WidgetLayout } from "@/components/widget-layout"
import {
    cn,
    getWidgetSize,
    widgetCopy,
    widgetSummary,
    widgetSurface,
    widgetTitle,
} from "@/lib/widget-design"
import type { WidgetDefinition } from "@/lib/widgets"

type ArticleWidgetProps = {
    widget: WidgetDefinition
}

export function ArticleWidget({ widget }: ArticleWidgetProps) {
    const size = getWidgetSize(widget.size)

    return (
        <div
            className={cn(
                widgetSurface,
                "isolate cursor-default justify-start bg-[color-mix(in_srgb,var(--widget-color)_5%,#fff)]",
            )}
        >
            <WidgetLayout
                size={widget.size}
                copy={
                    <motion.span
                        layoutId={`widget-${widget.id}-copy`}
                        className={widgetCopy}
                    >
                        <strong className={widgetTitle}>{widget.title}</strong>
                        {size.showSummary && widget.description && (
                            <span className={widgetSummary}>
                                {widget.description}
                            </span>
                        )}
                    </motion.span>
                }
                feature={
                    size.showMedia && widget.image ? (
                        <motion.span
                            layoutId={`widget-${widget.id}-image`}
                            className="relative block size-full min-h-0 overflow-hidden rounded-2xl bg-[#f7f7f6]"
                            aria-hidden="true"
                        >
                            <Image
                                src={widget.image}
                                alt=""
                                fill
                                draggable={false}
                                loading={
                                    widget.id === "verbatim" ? "eager" : "lazy"
                                }
                                sizes="(max-width: 759px) 90vw, 30rem"
                                className="object-cover"
                            />
                        </motion.span>
                    ) : undefined
                }
            />
        </div>
    )
}
