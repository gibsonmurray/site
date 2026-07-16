"use client"

import { motion } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { customWidgetRegistry } from "@/components/custom-widget-registry"
import { widgetCard } from "@/lib/widget-design"
import type { WidgetDefinition } from "@/lib/widgets"

type WidgetCardProps = {
    widget: WidgetDefinition
}

export function WidgetCard({ widget }: WidgetCardProps) {
    const CustomWidget = customWidgetRegistry[widget.type]
    const externalUrl =
        widget.type !== "spotify" &&
        widget.url &&
        /^https?:\/\//i.test(widget.url)
            ? widget.url
            : undefined

    return (
        <motion.article
            layoutId={`widget-${widget.id}`}
            data-widget-id={widget.id}
            data-size={widget.size}
            data-type={widget.type}
            data-color={widget.color ?? "slate"}
            className={widgetCard({ color: widget.color ?? "slate" })}
        >
            <CustomWidget widget={widget} />
            {externalUrl && (
                <a
                    className="widget-interactive absolute top-[clamp(0.9rem,3.4vw,1.15rem)] right-[clamp(0.9rem,3.4vw,1.15rem)] z-10 grid size-[2.1rem] place-items-center rounded-full border border-black/[0.06] bg-white/55 text-[#777] backdrop-blur-md transition-[color,border-color,background,transform] duration-200 hover:scale-[1.03] hover:border-black/10 hover:bg-white/80 hover:text-[#444] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#087cff]/70"
                    href={externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    draggable={false}
                    aria-label={`Open ${widget.title} in a new tab`}
                    onPointerDownCapture={(event) => event.stopPropagation()}
                >
                    <ArrowUpRight
                        className="size-[1.05rem] stroke-[2.15]"
                        aria-hidden="true"
                    />
                </a>
            )}
        </motion.article>
    )
}
