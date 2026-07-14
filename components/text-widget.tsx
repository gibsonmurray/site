import type { WidgetDefinition } from "@/lib/widgets"
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

type TextWidgetProps = {
    widget: WidgetDefinition
}

export function TextWidget({ widget }: TextWidgetProps) {
    const body = widget.details?.body ?? []
    const size = getWidgetSize(widget.size)

    return (
        <div
            className={cn(
                widgetSurface,
                "justify-start bg-[radial-gradient(circle_at_92%_8%,color-mix(in_srgb,var(--widget-accent)_18%,transparent),transparent_34%),color-mix(in_srgb,var(--widget-accent)_4%,#fff)]",
            )}
        >
            {widget.eyebrow && (
                <span className={widgetEyebrow}>{widget.eyebrow}</span>
            )}
            <span className={cn(widgetCopy, size.name === "wide" && "mt-auto")}>
                <strong className={widgetTitle}>{widget.title}</strong>
                {size.showSummary && widget.summary && (
                    <span className={widgetSummary}>{widget.summary}</span>
                )}
            </span>

            {size.showBody && body.length > 0 && (
                <span className="grid max-w-[42ch] gap-[0.65rem] text-[0.74rem] leading-[1.42] text-pretty text-[#727272]">
                    {body.slice(0, 2).map((paragraph) => (
                        <span key={paragraph}>{paragraph}</span>
                    ))}
                </span>
            )}

            {size.showDetails && widget.details?.facts && (
                <span className={widgetPills} aria-label="Highlights">
                    {widget.details.facts.map((fact) => (
                        <span className={widgetPill} key={fact}>
                            {fact}
                        </span>
                    ))}
                </span>
            )}
        </div>
    )
}
