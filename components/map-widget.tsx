import { cn, getWidgetSize, widgetSurface } from "@/lib/widget-design"
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
    const size = getWidgetSize(widget.size)

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
                className="absolute top-1/2 left-[54%] z-3 size-[1.55rem] -translate-1/2"
                aria-hidden="true"
            >
                <span className="map-location-pulse absolute inset-[-0.3rem] rounded-full bg-[#0a84ff]" />
                <span className="absolute inset-0 rounded-full border-[0.2rem] border-white bg-[#0a84ff] shadow-[0_2px_10px_rgba(0,122,255,0.45),0_0_0_1px_rgba(0,0,0,0.08)]" />
            </span>
            <span className="absolute bottom-[0.9rem] left-[0.9rem] z-4! rounded-[0.8rem] border border-black/10 bg-white/90 px-[0.68rem] py-[0.48rem] text-[0.72rem] leading-none font-[570] text-[#111] shadow-[0_4px_16px_rgba(18,18,18,0.1)] backdrop-blur-xl">
                <span className="grid gap-[0.12rem]">
                    <span className="font-normal">📍 {widget.title}</span>
                    {size.showSummary && widget.description && (
                        <small className="text-[0.6rem] font-medium text-[#727272]">
                            {widget.description}
                        </small>
                    )}
                </span>
            </span>
        </div>
    )
}
