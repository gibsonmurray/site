"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { LayoutGroup, MotionConfig } from "motion/react"
import ReactGridLayout, {
    type Layout,
    useContainerWidth,
    verticalCompactor,
} from "react-grid-layout"
import { WidgetCard } from "@/components/widget-card"
import { cn } from "@/lib/widget-design"
import {
    GRID_COLUMNS,
    SIZE_MAP,
    getDefaultOrder,
    packWidgets,
    type Breakpoint,
    type WidgetDefinition,
} from "@/lib/widgets"

const DESKTOP_GRID_MEDIA_QUERY = "(min-width: 1121.5px)"

type PortfolioGridProps = {
    widgets: WidgetDefinition[]
}

type GridLayouts = Record<Breakpoint, Layout>

function createDefaultLayout(
    widgets: WidgetDefinition[],
    breakpoint: Breakpoint,
): Layout {
    const columns = GRID_COLUMNS[breakpoint]
    const packed = packWidgets(
        widgets,
        getDefaultOrder(widgets, breakpoint),
        columns,
    )
    const fallbackById = new Map(packed.map((item) => [item.id, item]))

    const layout = widgets.map((widget) => {
        const fallback = fallbackById.get(widget.id)
        const position = widget.layout?.[breakpoint]
        const size = SIZE_MAP[widget.size]
        const width = Math.min(size.width, columns)

        return {
            i: widget.id,
            x: Math.max(
                0,
                Math.min(columns - width, position?.x ?? fallback?.x ?? 0),
            ),
            y: Math.max(0, position?.y ?? fallback?.y ?? 0),
            w: width,
            h: size.height,
        }
    })

    return verticalCompactor.compact(layout, columns)
}

export function PortfolioGrid({ widgets }: PortfolioGridProps) {
    const { width, containerRef, mounted } = useContainerWidth({
        measureBeforeMount: true,
    })
    const defaultLayouts = useMemo<GridLayouts>(
        () => ({
            mobile: createDefaultLayout(widgets, "mobile"),
            desktop: createDefaultLayout(widgets, "desktop"),
        }),
        [widgets],
    )
    const [breakpoint, setBreakpoint] = useState<Breakpoint>("mobile")
    const [ready, setReady] = useState(false)

    const columns = GRID_COLUMNS[breakpoint]
    const gap = breakpoint === "desktop" ? 18 : 13.5
    const rowHeight = Math.max(1, (width - gap * (columns - 1)) / columns)
    const widgetsById = useMemo(
        () => new Map(widgets.map((widget) => [widget.id, widget])),
        [widgets],
    )

    useEffect(() => {
        const media = window.matchMedia(DESKTOP_GRID_MEDIA_QUERY)
        const updateBreakpoint = () =>
            setBreakpoint(media.matches ? "desktop" : "mobile")
        updateBreakpoint()
        media.addEventListener("change", updateBreakpoint)

        const initializationFrame = window.requestAnimationFrame(() => {
            document.documentElement.removeAttribute("data-theme")
            document.documentElement.style.colorScheme = "light"
            setReady(true)
        })

        return () => {
            window.cancelAnimationFrame(initializationFrame)
            media.removeEventListener("change", updateBreakpoint)
        }
    }, [])

    return (
        <MotionConfig reducedMotion="user">
            <main
                className={cn(
                    "relative min-h-svh overflow-clip px-4 pt-5 pb-10 opacity-0 transition-opacity duration-300 min-[760px]:px-8 min-[760px]:pt-[clamp(1.5rem,3vw,2.5rem)] min-[760px]:pb-12",
                    ready && "opacity-100",
                )}
            >
                <header className="relative mx-auto flex w-[min(100%,32.203125rem)] items-center px-[0.15rem] pt-2 pb-20 text-[0.73rem] font-[560] tracking-[-0.01em] text-[#727272] min-[760px]:pb-24 min-[1121.5px]:w-[min(100%,66.09375rem)]">
                    <span className="flex items-center gap-[0.42rem]">
                        <Image
                            src="/gm-logo.svg"
                            alt="Gibson Murray"
                            width={14}
                            height={13}
                        />
                        <span aria-hidden="true">/</span>
                        <span>Portfolio</span>
                    </span>
                </header>

                <LayoutGroup id="portfolio-widgets">
                    <div
                        ref={containerRef}
                        className="relative mx-auto min-h-px w-[min(100%,32.203125rem)] min-[1121.5px]:w-[min(100%,66.09375rem)]"
                    >
                        {ready && mounted && (
                            <ReactGridLayout
                                key={breakpoint}
                                className={cn(
                                    "relative z-[1] block w-full transition-[height] duration-500 ease-[cubic-bezier(0.2,0.82,0.24,1)]",
                                    "[&>.react-grid-item]:transition-transform! [&>.react-grid-item]:duration-[520ms]! [&>.react-grid-item]:ease-[cubic-bezier(0.16,0.84,0.22,1)]!",
                                )}
                                width={width}
                                layout={defaultLayouts[breakpoint]}
                                gridConfig={{
                                    cols: columns,
                                    rowHeight,
                                    margin: [gap, gap],
                                    containerPadding: [0, 0],
                                }}
                                dragConfig={{
                                    enabled: false,
                                }}
                                resizeConfig={{ enabled: false }}
                                compactor={verticalCompactor}
                            >
                                {defaultLayouts[breakpoint].map((item) => {
                                    const widget = widgetsById.get(item.i)
                                    if (!widget) return null

                                    return (
                                        <div
                                            key={widget.id}
                                            className="[&>article]:size-full"
                                        >
                                            <WidgetCard widget={widget} />
                                        </div>
                                    )
                                })}
                            </ReactGridLayout>
                        )}
                    </div>
                </LayoutGroup>

                <footer className="relative mx-auto w-[min(100%,32.203125rem)] px-[0.2rem] pt-20 text-[0.69rem] text-[#727272] min-[760px]:pt-24 min-[1121.5px]:w-[min(100%,66.09375rem)]">
                    <div className="flex flex-col gap-4 min-[560px]:flex-row min-[560px]:items-end min-[560px]:justify-between">
                        <div className="flex items-start gap-2.5">
                            <Image
                                src="/gm-logo.svg"
                                alt=""
                                width={18}
                                height={17}
                                className="mt-px opacity-80"
                                aria-hidden="true"
                            />
                            <div>
                                <p className="m-0 font-[610] tracking-[-0.01em] text-[#3f3f3f]">
                                    Gibson Murray
                                </p>
                                <p className="mt-0.5 mb-0 text-[#858585]">
                                    Made with curiosity, care, and a little
                                    play.
                                </p>
                            </div>
                        </div>
                        <p className="m-0 text-[0.64rem] tracking-[0.015em] text-[#969696]">
                            &copy; 2026 Gibson Murray
                        </p>
                    </div>
                </footer>
            </main>
        </MotionConfig>
    )
}
