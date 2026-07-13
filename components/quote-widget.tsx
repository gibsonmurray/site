import type { WidgetDefinition } from "@/lib/widgets"

type QuoteWidgetProps = {
    widget: WidgetDefinition
}

export function QuoteWidget({ widget }: QuoteWidgetProps) {
    if (!widget.quote) return null

    return (
        <div className="widget-card__surface quote-widget">
            <span className="quote-widget__mark" aria-hidden="true">
                “
            </span>
            <blockquote>
                <div className="quote-widget__body">
                    {widget.quote.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </div>
                <footer>
                    — <cite>{widget.quote.attribution}</cite>
                </footer>
            </blockquote>
        </div>
    )
}
