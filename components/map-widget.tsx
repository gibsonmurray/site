import { SiGooglemaps } from "react-icons/si"
import { cn, getWidgetSize, widgetSurface } from "@/lib/widget-design"
import type { WidgetDefinition } from "@/lib/widgets"

type MapWidgetProps = {
    widget: WidgetDefinition
}

export function MapWidget({ widget }: MapWidgetProps) {
    const location = widget.location
    const latitude = location?.latitude ?? 38.9072
    const longitude = location?.longitude ?? -77.0369
    const zoom = location?.zoom ?? 11
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
                className="pointer-events-none absolute -inset-x-4 -inset-y-10 z-[1] h-[calc(100%+5rem)] w-[calc(100%+2rem)] border-0 [filter:saturate(0.9)_contrast(0.96)_brightness(1.03)]"
                src={mapUrl}
                title={`Google map showing ${location?.label ?? widget.title}`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                tabIndex={-1}
            />
            <span
                className="absolute top-1/2 left-[54%] z-[3] size-[1.45rem] -translate-1/2 rounded-full border-[0.2rem] border-white bg-[#7185f5] shadow-[0_3px_14px_rgba(44,67,177,0.3)]"
                aria-hidden="true"
            />
            <span className="absolute bottom-[0.9rem] left-[0.9rem] z-[4] inline-flex items-center gap-[0.38rem] rounded-[0.8rem] border border-black/10 bg-white/90 px-[0.68rem] py-[0.48rem] text-[0.72rem] leading-none font-[570] text-[#111] shadow-[0_4px_16px_rgba(18,18,18,0.1)] backdrop-blur-xl">
                <SiGooglemaps
                    className="size-4 shrink-0 text-[#4285f4]"
                    aria-hidden="true"
                />
                <span className="grid gap-[0.12rem]">
                    <strong className="font-[inherit]">
                        {location?.label ?? widget.title}
                    </strong>
                    {size.showSummary && location?.region && (
                        <small className="text-[0.6rem] font-medium text-[#727272]">
                            {location.region}
                        </small>
                    )}
                </span>
            </span>
        </div>
    )
}
