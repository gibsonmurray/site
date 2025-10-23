"use client"

import GoogleMapReact from "google-map-react"
import { cn } from "@/lib/utils"

type GoogleMapProps = {
    className?: string
    style?: React.CSSProperties
}

// Custom marker component
const Marker = ({ text }: { text: string; lat?: number; lng?: number }) => (
    <div className="flex items-center justify-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white shadow-lg">
            {text}
        </div>
    </div>
)

const GoogleMap = ({ className, style }: GoogleMapProps) => {
    const defaultProps = {
        center: {
            lat: 38.9072,
            lng: -77.0369,
        },
        zoom: 12,
    }

    return (
        <div className={className} style={style}>
            <GoogleMapReact
                bootstrapURLKeys={{
                    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
                }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                options={{
                    disableDefaultUI: true,
                    zoomControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: false,
                    styles: [
                        {
                            featureType: "poi",
                            elementType: "labels",
                            stylers: [{ visibility: "off" }],
                        },
                    ],
                }}
            ></GoogleMapReact>
        </div>
    )
}

export default GoogleMap
