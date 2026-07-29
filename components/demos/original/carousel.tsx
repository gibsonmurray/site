"use client"

import * as React from "react"
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react"

export type CarouselApi = UseEmblaCarouselType[1]

type CarouselProps = {
    opts?: Parameters<typeof useEmblaCarousel>[0]
    setApi?: (api: CarouselApi) => void
}

const CarouselContext = React.createContext<{
    carouselRef: ReturnType<typeof useEmblaCarousel>[0]
} | null>(null)

export function Carousel({
    children,
    className,
    opts,
    setApi,
}: React.HTMLAttributes<HTMLDivElement> & CarouselProps) {
    const [carouselRef, api] = useEmblaCarousel(opts)

    React.useEffect(() => {
        if (api && setApi) setApi(api)
    }, [api, setApi])

    return (
        <CarouselContext.Provider value={{ carouselRef }}>
            <div className={`relative ${className ?? ""}`} role="region">
                {children}
            </div>
        </CarouselContext.Provider>
    )
}

export function CarouselContent({
    children,
}: React.HTMLAttributes<HTMLDivElement>) {
    const context = React.useContext(CarouselContext)
    if (!context) throw new Error("CarouselContent must be used inside Carousel")

    return (
        // This is the original Embla viewport ref wiring from the historical demo.
        // eslint-disable-next-line react-hooks/refs
        <div className="overflow-hidden" ref={context.carouselRef}>
            <div className="flex -ml-4">{children}</div>
        </div>
    )
}

export function CarouselItem({
    children,
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`min-w-0 shrink-0 grow-0 basis-full pl-4 ${className ?? ""}`}>
            {children}
        </div>
    )
}
