import type { WidgetDefinition } from "@/lib/widgets"
import { WidgetLayout } from "@/components/widget-layout"
import {
    cn,
    getWidgetSize,
    widgetCopy,
    widgetSummary,
    widgetSurface,
    widgetTitle,
} from "@/lib/widget-design"

type TextWidgetProps = {
    widget: WidgetDefinition
}

export function TextWidget({ widget }: TextWidgetProps) {
    const body = widget.body ?? []
    const size = getWidgetSize(widget.size)

    return (
        <div
            className={cn(
                widgetSurface,
                "justify-start bg-[radial-gradient(circle_at_92%_8%,color-mix(in_srgb,var(--widget-color)_18%,transparent),transparent_34%),color-mix(in_srgb,var(--widget-color)_4%,#fff)]",
            )}
        >
            <WidgetLayout
                size={widget.size}
                copy={
                    <span className={widgetCopy}>
                        <strong className={widgetTitle}>{widget.title}</strong>
                        {size.showSummary && widget.description && (
                            <span className={widgetSummary}>
                                {widget.description}
                            </span>
                        )}
                    </span>
                }
                feature={
                    size.showBody && body.length > 0 ? (
                        <span className="grid max-w-[42ch] gap-[0.65rem] text-[0.74rem] leading-[1.42] text-pretty text-[#727272]">
                            {body.slice(0, 2).map((paragraph) => (
                                <span key={paragraph}>{paragraph}</span>
                            ))}
                        </span>
                    ) : undefined
                }
            />
        </div>
    )
}
