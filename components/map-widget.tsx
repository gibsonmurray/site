import { cn, widgetSurface } from "@/lib/widget-design"
import type { WidgetDefinition } from "@/lib/widgets"

type MapWidgetProps = {
    widget: WidgetDefinition
}

export function MapWidget({ widget }: MapWidgetProps) {
    const latitude = widget.coordinates?.lat ?? 38.9072
    const longitude = widget.coordinates?.lng ?? -77.0369
    const zoom = widget.coordinates?.zoom ?? 13
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${latitude},${longitude}&zoom=${zoom}&maptype=roadmap`
    return (
        <div
            className={cn(
                widgetSurface,
                "isolate overflow-hidden bg-[#e8eee6] p-0",
            )}
            aria-label={widget.title}
        >
            <iframe
                className="pointer-events-none absolute -inset-x-4 -inset-y-24 z-1 h-[calc(100%+12rem)] w-[calc(100%+2rem)] border-0 [filter:grayscale(0.15)_saturate(0.72)_contrast(0.92)_brightness(1.06)]"
                src={mapUrl}
                title={`Google map showing ${widget.title}`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                tabIndex={-1}
            />
            <span
                className="absolute top-1/2 left-[54%] z-3 size-[1.45rem] -translate-1/2 rounded-full border-[0.2rem] border-white bg-[#7185f5] shadow-[0_3px_14px_rgba(44,67,177,0.3)]"
                aria-hidden="true"
            />
        </div>
    )
}
