import type { WidgetDefinition } from "@/lib/widgets"
import { cn, getWidgetSize, widgetSurface } from "@/lib/widget-design"

type QuoteWidgetProps = {
    widget: WidgetDefinition
}

export function QuoteWidget({ widget }: QuoteWidgetProps) {
    if (!widget.quote) return null
    const size = getWidgetSize(widget.size)
    const paragraphs = widget.quote.paragraphs.slice(
        0,
        size.name === "compact" ? 1 : size.name === "wide" ? 2 : undefined,
    )

    return (
        <div
            className={cn(
                widgetSurface,
                "justify-start bg-[#fcfcfc] p-[clamp(1.35rem,5vw,2rem)]",
                size.name === "compact" && "gap-[0.35rem] p-4",
                size.name === "wide" &&
                    "grid grid-cols-[auto_1fr] gap-[0.8rem] px-5 py-[1.1rem]",
            )}
        >
            <span
                className={cn(
                    "h-10 font-serif text-[4.5rem] leading-[0.85] font-extrabold tracking-[-0.16em] text-[#050505]",
                    size.name === "compact" && "h-[1.7rem] text-[3.2rem]",
                )}
                aria-hidden="true"
            >
                “
            </span>
            <blockquote className="m-0 flex min-h-0 flex-1 flex-col gap-4">
                <div
                    className={cn(
                        "grid gap-[clamp(0.9rem,3vw,1.35rem)]",
                        size.name === "wide" && "gap-[0.45rem]",
                    )}
                >
                    {paragraphs.map((paragraph) => (
                        <p
                            className={cn(
                                "m-0 max-w-[26ch] text-[clamp(1rem,3.8vw,1.32rem)] leading-[1.38] font-[430] tracking-[-0.018em] text-[#111] italic",
                                size.name === "compact" &&
                                    "text-[0.9rem] leading-[1.3]",
                                size.name === "wide" && "text-[0.86rem]",
                            )}
                            key={paragraph}
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
                <footer
                    className={cn(
                        "mt-auto text-[clamp(0.85rem,3vw,1rem)] leading-[1.35] text-[#8c8c8c] italic",
                        size.name === "compact" && "text-[0.66rem]",
                        size.name === "wide" && "text-[0.7rem]",
                    )}
                >
                    — <cite className="italic">{widget.quote.attribution}</cite>
                </footer>
            </blockquote>
        </div>
    )
}
