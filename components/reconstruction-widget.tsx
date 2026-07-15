import type { WidgetDefinition } from "@/lib/widgets"

type ReconstructionWidgetProps = {
    widget: WidgetDefinition
}

export function ReconstructionWidget({ widget }: ReconstructionWidgetProps) {
    return (
        <div className="reconstruction-widget-content">
            <div className="unfinished-app-icon" aria-hidden="true">
                <span className="unfinished-app-icon__circle" />
            </div>

            <h1>
                {widget.title.split("(re)")[0]}
                <span>(re)</span>
                {widget.title.split("(re)")[1]}
            </h1>
        </div>
    )
}
