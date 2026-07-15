import type { WidgetDefinition } from "@/lib/widgets"
import { WidgetLayout } from "@/components/widget-layout"
import { cn, getWidgetSize, widgetSurface } from "@/lib/widget-design"

type QuoteWidgetProps = {
    widget: WidgetDefinition
}

export function QuoteWidget({ widget }: QuoteWidgetProps) {
    if (!widget.body?.length || !widget.attribution) return null
    const size = getWidgetSize(widget.size)
    const paragraphs = widget.body.slice(
        0,
        size.name === "compact" ? 1 : size.name === "wide" ? 2 : undefined,
    )

    return (
        <div className={cn(widgetSurface, "justify-start")}>
            <WidgetLayout
                size={widget.size}
                header={
                    <span
                        className="h-10 font-serif text-[4.5rem] leading-[0.85] font-extrabold tracking-[-0.16em] text-[#050505]"
                        aria-hidden="true"
                    >
                        “
                    </span>
                }
                feature={
                    <blockquote className="m-0 flex size-full min-h-0 flex-col gap-4">
                        <span className="grid gap-[clamp(0.9rem,3vw,1.35rem)]">
                            {paragraphs.map((paragraph) => (
                                <span
                                    className="w-full font-serif text-[clamp(1.15rem,4.4vw,1.55rem)] leading-[1.3] font-[430] tracking-[-0.022em] text-[#111] italic"
                                    key={paragraph}
                                >
                                    {paragraph}
                                </span>
                            ))}
                        </span>
                        <footer className="mt-auto w-full text-right font-[family-name:var(--font-geist-sans)] text-[clamp(0.85rem,3vw,1rem)] leading-[1.35] text-[#8c8c8c] not-italic">
                            —{" "}
                            <cite className="not-italic">
                                {widget.attribution}
                            </cite>
                        </footer>
                    </blockquote>
                }
            />
        </div>
    )
}
