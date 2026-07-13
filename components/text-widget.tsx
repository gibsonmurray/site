import type { WidgetDefinition } from "@/lib/widgets"

type TextWidgetProps = {
    widget: WidgetDefinition
}

export function TextWidget({ widget }: TextWidgetProps) {
    const body = widget.details?.body ?? []

    return (
        <div className="widget-card__surface text-widget">
            <span className="text-widget__eyebrow">{widget.eyebrow}</span>
            <span className="text-widget__copy">
                <strong>{widget.title}</strong>
                {widget.summary && <span>{widget.summary}</span>}
            </span>

            {body.length > 0 && (
                <span className="text-widget__body">
                    {body.slice(0, 2).map((paragraph) => (
                        <span key={paragraph}>{paragraph}</span>
                    ))}
                </span>
            )}

            {widget.details?.facts && (
                <span className="text-widget__facts" aria-label="Highlights">
                    {widget.details.facts.map((fact) => (
                        <span key={fact}>{fact}</span>
                    ))}
                </span>
            )}
        </div>
    )
}
