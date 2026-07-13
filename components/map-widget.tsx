import { SiGooglemaps } from "react-icons/si"
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

    return (
        <div
            className="widget-card__surface map-widget"
            aria-label={widget.title}
        >
            <iframe
                className="map-widget__embed"
                src={mapUrl}
                title={`Google map showing ${location?.label ?? widget.title}`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                tabIndex={-1}
            />
            <span className="map-widget__marker" aria-hidden="true" />
            <span className="map-widget__caption">
                <SiGooglemaps aria-hidden="true" />
                <span className="map-widget__copy">
                    <strong>{location?.label ?? widget.title}</strong>
                    {location?.region && <small>{location.region}</small>}
                </span>
            </span>
        </div>
    )
}
