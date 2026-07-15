"use client"

import Image from "next/image"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { LayoutGroup, MotionConfig } from "motion/react"
import { RotateCcw } from "lucide-react"
import ReactGridLayout, {
    type Layout,
    type LayoutItem,
    useContainerWidth,
    verticalCompactor,
} from "react-grid-layout"
import { WidgetCard, type WidgetCardHandle } from "@/components/widget-card"
import { cn } from "@/lib/widget-design"
import {
    GRID_COLUMNS,
    SIZE_MAP,
    getDefaultOrder,
    packWidgets,
    type Breakpoint,
    type WidgetDefinition,
} from "@/lib/widgets"

const LAYOUT_STORAGE_KEY = "gm-bento-layout-v6"
const STALE_LAYOUT_STORAGE_KEYS = [
    "gm-bento-layout-v1",
    "gm-bento-layout-v2",
    "gm-bento-layout-v3",
    "gm-bento-layout-v4",
    "gm-bento-layout-v5",
]
const STALE_THEME_STORAGE_KEY = "gm-bento-theme"
const DESKTOP_GRID_MEDIA_QUERY = "(min-width: 1121.5px)"
const GRID_PLACEHOLDER_CLASSES =
    "overflow-hidden rounded-[clamp(1.35rem,4vw,1.8rem)] border border-white/10 bg-[#404040] opacity-[0.94] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-14px_30px_rgba(0,0,0,0.14),0_12px_28px_rgba(0,0,0,0.12)] transition-all duration-200 ease-[cubic-bezier(0.16,0.84,0.22,1)] after:absolute after:inset-[0.65rem] after:rounded-[clamp(0.8rem,3vw,1.25rem)] after:border after:border-dashed after:border-white/20 after:content-['']"

type PortfolioGridProps = {
    widgets: WidgetDefinition[]
}

type GridLayouts = Record<Breakpoint, Layout>

type StoredLayout = {
    version: 6
    layouts: GridLayouts
}

type SettlingSlot = {
    breakpoint: Breakpoint
    item: LayoutItem
}

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

function normalizeLayout(
    input: readonly Partial<LayoutItem>[] | undefined,
    widgets: WidgetDefinition[],
    breakpoint: Breakpoint,
    fallback: Layout,
): Layout {
    const columns = GRID_COLUMNS[breakpoint]
    const byId = new Map(input?.map((item) => [item.i, item]))
    const fallbackById = new Map(fallback.map((item) => [item.i, item]))

    const normalized = widgets.map((widget) => {
        const stored = byId.get(widget.id)
        const defaultItem = fallbackById.get(widget.id)
        const size = SIZE_MAP[widget.size]
        const width = Math.min(size.width, columns)

        return {
            i: widget.id,
            x: Math.max(
                0,
                Math.min(
                    columns - width,
                    Number.isFinite(stored?.x)
                        ? Number(stored?.x)
                        : (defaultItem?.x ?? 0),
                ),
            ),
            y: Math.max(
                0,
                Number.isFinite(stored?.y)
                    ? Number(stored?.y)
                    : (defaultItem?.y ?? 0),
            ),
            w: width,
            h: size.height,
        }
    })

    return verticalCompactor.compact(normalized, columns)
}

function layoutsMatch(a: Layout, b: Layout) {
    if (a.length !== b.length) return false
    const byId = new Map(a.map((item) => [item.i, item]))

    return b.every((item) => {
        const current = byId.get(item.i)
        return (
            current?.x === item.x &&
            current.y === item.y &&
            current.w === item.w &&
            current.h === item.h
        )
    })
}

function clamp(value: number, minimum: number, maximum: number) {
    return Math.min(maximum, Math.max(minimum, value))
}

export function PortfolioGrid({ widgets }: PortfolioGridProps) {
    const { width, containerRef, mounted } = useContainerWidth({
        measureBeforeMount: true,
    })
    const dragSampleRef = useRef({ x: 0, time: 0 })
    const dragControllersRef = useRef(new Map<string, WidgetCardHandle>())
    const suppressClickUntilRef = useRef(0)
    const settlingTimerRef = useRef<number | null>(null)
    const settlingWidgetIdRef = useRef<string | null>(null)
    const defaultLayouts = useMemo<GridLayouts>(
        () => ({
            mobile: createDefaultLayout(widgets, "mobile"),
            desktop: createDefaultLayout(widgets, "desktop"),
        }),
        [widgets],
    )
    const [layouts, setLayouts] = useState<GridLayouts>(defaultLayouts)
    const [breakpoint, setBreakpoint] = useState<Breakpoint>("mobile")
    const [settlingSlot, setSettlingSlot] = useState<SettlingSlot | null>(null)
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
            try {
                document.documentElement.removeAttribute("data-theme")
                document.documentElement.style.colorScheme = "light"
                window.localStorage.removeItem(STALE_THEME_STORAGE_KEY)

                const storedLayout =
                    window.localStorage.getItem(LAYOUT_STORAGE_KEY)
                if (storedLayout) {
                    const parsed = JSON.parse(
                        storedLayout,
                    ) as Partial<StoredLayout>
                    if (parsed.version === 6 && parsed.layouts) {
                        setLayouts({
                            mobile: normalizeLayout(
                                parsed.layouts.mobile,
                                widgets,
                                "mobile",
                                defaultLayouts.mobile,
                            ),
                            desktop: normalizeLayout(
                                parsed.layouts.desktop,
                                widgets,
                                "desktop",
                                defaultLayouts.desktop,
                            ),
                        })
                    }
                }

                for (const key of STALE_LAYOUT_STORAGE_KEYS) {
                    window.localStorage.removeItem(key)
                }
            } catch {
                setLayouts(defaultLayouts)
            }

            setReady(true)
        })

        return () => {
            window.cancelAnimationFrame(initializationFrame)
            media.removeEventListener("change", updateBreakpoint)
        }
    }, [defaultLayouts, widgets])

    useEffect(() => {
        if (!ready) return

        const stored: StoredLayout = { version: 6, layouts }
        try {
            window.localStorage.setItem(
                LAYOUT_STORAGE_KEY,
                JSON.stringify(stored),
            )
        } catch {
            // The experience still works when storage is unavailable.
        }
    }, [layouts, ready])

    useEffect(
        () => () => {
            if (settlingTimerRef.current !== null) {
                window.clearTimeout(settlingTimerRef.current)
            }
        },
        [],
    )

    const updateActiveLayout = useCallback(
        (nextLayout: Layout) => {
            setLayouts((current) => {
                const normalized = normalizeLayout(
                    nextLayout,
                    widgets,
                    breakpoint,
                    defaultLayouts[breakpoint],
                )
                if (layoutsMatch(current[breakpoint], normalized))
                    return current
                return { ...current, [breakpoint]: normalized }
            })
        },
        [breakpoint, defaultLayouts, widgets],
    )

    const handleDragStart = useCallback(
        (
            _layout: Layout,
            _oldItem: LayoutItem | null,
            item: LayoutItem | null,
            _placeholder: LayoutItem | null,
            _event: Event,
            element: HTMLElement | null,
        ) => {
            if (!item) return
            if (settlingTimerRef.current !== null) {
                window.clearTimeout(settlingTimerRef.current)
                settlingTimerRef.current = null
            }
            if (settlingWidgetIdRef.current) {
                dragControllersRef.current
                    .get(settlingWidgetIdRef.current)
                    ?.stopDrag()
                settlingWidgetIdRef.current = null
            }
            setSettlingSlot(null)

            const now = performance.now()
            dragSampleRef.current = {
                x: element?.getBoundingClientRect().left ?? 0,
                time: now,
            }
            dragControllersRef.current.get(item.i)?.startDrag()
        },
        [],
    )

    const handleDrag = useCallback(
        (
            _layout: Layout,
            _oldItem: LayoutItem | null,
            item: LayoutItem | null,
            _placeholder: LayoutItem | null,
            _event: Event,
            element: HTMLElement | null,
        ) => {
            if (!item || !element) return
            const now = performance.now()
            const x = element.getBoundingClientRect().left
            const elapsed = Math.max(8, now - dragSampleRef.current.time)
            const velocity = ((x - dragSampleRef.current.x) / elapsed) * 1000
            const tilt = clamp(velocity / 220, -3.5, 3.5)
            dragSampleRef.current = { x, time: now }
            dragControllersRef.current.get(item.i)?.updateTilt(tilt)
        },
        [],
    )

    const handleDragStop = useCallback(
        (
            layout: Layout,
            _oldItem: LayoutItem | null,
            item: LayoutItem | null,
        ) => {
            if (item) {
                dragControllersRef.current.get(item.i)?.settleDrag()

                const normalized = normalizeLayout(
                    layout,
                    widgets,
                    breakpoint,
                    defaultLayouts[breakpoint],
                )
                const target = normalized.find(
                    (candidate) => candidate.i === item.i,
                )

                setLayouts((current) =>
                    layoutsMatch(current[breakpoint], normalized)
                        ? current
                        : { ...current, [breakpoint]: normalized },
                )

                if (target) {
                    setSettlingSlot({ breakpoint, item: { ...target } })
                    settlingWidgetIdRef.current = item.i

                    const settleDuration = window.matchMedia(
                        "(prefers-reduced-motion: reduce)",
                    ).matches
                        ? 0
                        : 260

                    settlingTimerRef.current = window.setTimeout(() => {
                        dragControllersRef.current.get(item.i)?.stopDrag()
                        setSettlingSlot(null)
                        settlingTimerRef.current = null
                        settlingWidgetIdRef.current = null
                    }, settleDuration)
                } else {
                    dragControllersRef.current.get(item.i)?.stopDrag()
                }
            }
            suppressClickUntilRef.current = performance.now() + 180
        },
        [breakpoint, defaultLayouts, widgets],
    )

    const handleKeyboardMove = useCallback(
        (id: string, direction: -1 | 1) => {
            setLayouts((current) => {
                const ordered = [...current[breakpoint]].sort(
                    (a, b) => a.y - b.y || a.x - b.x,
                )
                const index = ordered.findIndex((item) => item.i === id)
                const nextIndex = clamp(
                    index + direction,
                    0,
                    ordered.length - 1,
                )
                if (index < 0 || nextIndex === index) return current

                const source = ordered[index]
                const target = ordered[nextIndex]
                const swapped = current[breakpoint].map((item) => {
                    if (item.i === source.i)
                        return { ...item, x: target.x, y: target.y }
                    if (item.i === target.i)
                        return { ...item, x: source.x, y: source.y }
                    return item
                })

                return {
                    ...current,
                    [breakpoint]: verticalCompactor.compact(swapped, columns),
                }
            })
        },
        [breakpoint, columns],
    )

    const resetLayout = () => {
        setLayouts(defaultLayouts)
        try {
            window.localStorage.removeItem(LAYOUT_STORAGE_KEY)
            for (const key of STALE_LAYOUT_STORAGE_KEYS) {
                window.localStorage.removeItem(key)
            }
        } catch {
            // Nothing else to reset when storage is unavailable.
        }
    }

    return (
        <MotionConfig reducedMotion="user">
            <main
                className={cn(
                    "relative flex min-h-svh flex-col overflow-clip px-4 pt-5 pb-10 opacity-0 transition-opacity duration-300 min-[760px]:px-8 min-[760px]:pt-[clamp(1.5rem,3vw,2.5rem)] min-[760px]:pb-12",
                    ready && "opacity-100",
                )}
            >
                <header className="relative mx-auto flex w-[min(100%,32.203125rem)] items-center justify-between gap-4 px-[0.15rem] pt-2 pb-5 text-[0.73rem] font-[560] tracking-[-0.01em] text-[#727272] min-[1121.5px]:w-[min(100%,66.09375rem)]">
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
                    <p className="m-0 text-right text-[0.65rem] font-[530] tracking-[0.02em]">
                        Drag any widget to rearrange this space.
                    </p>
                </header>

                <LayoutGroup id="portfolio-widgets">
                    <div
                        ref={containerRef}
                        className="relative mx-auto my-8 min-h-px w-[min(17.5rem,calc(100vw-2.5rem))] min-[760px]:my-12"
                        onClickCapture={(event) => {
                            if (
                                performance.now() >=
                                suppressClickUntilRef.current
                            )
                                return
                            event.preventDefault()
                            event.stopPropagation()
                        }}
                    >
                        {ready &&
                            mounted &&
                            settlingSlot?.breakpoint === breakpoint && (
                                <div
                                    className={cn(
                                        GRID_PLACEHOLDER_CLASSES,
                                        "pointer-events-none absolute top-0 left-0 z-0",
                                    )}
                                    style={{
                                        width:
                                            settlingSlot.item.w * rowHeight +
                                            (settlingSlot.item.w - 1) * gap,
                                        height:
                                            settlingSlot.item.h * rowHeight +
                                            (settlingSlot.item.h - 1) * gap,
                                        transform: `translate(${settlingSlot.item.x * (rowHeight + gap)}px, ${settlingSlot.item.y * (rowHeight + gap)}px)`,
                                    }}
                                    aria-hidden="true"
                                />
                            )}
                        {ready && mounted && (
                            <ReactGridLayout
                                key={breakpoint}
                                className={cn(
                                    "relative z-[1] block w-full transition-[height] duration-500 ease-[cubic-bezier(0.2,0.82,0.24,1)]",
                                    "[&>.react-grid-item]:cursor-grab [&>.react-grid-item]:touch-none",
                                    "[&>.react-grid-item.react-draggable-dragging]:z-50! [&>.react-grid-item.react-draggable-dragging]:cursor-grabbing",
                                    "[&>.react-grid-item:not(.react-draggable-dragging)]:transition-transform! [&>.react-grid-item:not(.react-draggable-dragging)]:duration-[520ms]! [&>.react-grid-item:not(.react-draggable-dragging)]:ease-[cubic-bezier(0.16,0.84,0.22,1)]! [&>.react-grid-item:not(.react-draggable-dragging)]:will-change-transform!",
                                    "[&>.react-grid-item.react-grid-placeholder]:z-[2]! [&>.react-grid-item.react-grid-placeholder]:overflow-hidden [&>.react-grid-item.react-grid-placeholder]:rounded-[clamp(1.35rem,4vw,1.8rem)] [&>.react-grid-item.react-grid-placeholder]:border [&>.react-grid-item.react-grid-placeholder]:border-white/10 [&>.react-grid-item.react-grid-placeholder]:bg-[#404040]! [&>.react-grid-item.react-grid-placeholder]:opacity-[0.94]! [&>.react-grid-item.react-grid-placeholder]:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-14px_30px_rgba(0,0,0,0.14),0_12px_28px_rgba(0,0,0,0.12)] [&>.react-grid-item.react-grid-placeholder]:duration-200!",
                                    "[&>.react-grid-item.react-grid-placeholder]:after:absolute [&>.react-grid-item.react-grid-placeholder]:after:inset-[0.65rem] [&>.react-grid-item.react-grid-placeholder]:after:rounded-[clamp(0.8rem,3vw,1.25rem)] [&>.react-grid-item.react-grid-placeholder]:after:border [&>.react-grid-item.react-grid-placeholder]:after:border-dashed [&>.react-grid-item.react-grid-placeholder]:after:border-white/20 [&>.react-grid-item.react-grid-placeholder]:after:content-['']",
                                )}
                                width={width}
                                layout={layouts[breakpoint]}
                                gridConfig={{
                                    cols: columns,
                                    rowHeight,
                                    margin: [gap, gap],
                                    containerPadding: [0, 0],
                                }}
                                dragConfig={{
                                    enabled: true,
                                    bounded: false,
                                    cancel: ".widget-interactive",
                                    threshold: 3,
                                }}
                                resizeConfig={{ enabled: false }}
                                compactor={verticalCompactor}
                                onLayoutChange={updateActiveLayout}
                                onDragStart={handleDragStart}
                                onDrag={handleDrag}
                                onDragStop={handleDragStop}
                            >
                                {layouts[breakpoint].map((item) => {
                                    const widget = widgetsById.get(item.i)
                                    if (!widget) return null

                                    return (
                                        <div
                                            key={widget.id}
                                            className={cn(
                                                "[&>article]:size-full",
                                                settlingSlot?.breakpoint ===
                                                    breakpoint &&
                                                    settlingSlot.item.i ===
                                                        widget.id &&
                                                    "z-50 duration-[260ms]! ease-[cubic-bezier(0.32,0.08,0.22,1)]! [&>article]:shadow-[0_2px_4px_rgba(18,18,18,0.035),0_10px_26px_rgba(18,18,18,0.025)]",
                                            )}
                                        >
                                            <WidgetCard
                                                ref={(controller) => {
                                                    if (controller) {
                                                        dragControllersRef.current.set(
                                                            widget.id,
                                                            controller,
                                                        )
                                                    } else {
                                                        dragControllersRef.current.delete(
                                                            widget.id,
                                                        )
                                                    }
                                                }}
                                                widget={widget}
                                                onKeyboardMove={(direction) =>
                                                    handleKeyboardMove(
                                                        widget.id,
                                                        direction,
                                                    )
                                                }
                                            />
                                        </div>
                                    )
                                })}
                            </ReactGridLayout>
                        )}
                    </div>
                </LayoutGroup>

                <footer className="relative mx-auto mt-auto w-[min(100%,32.203125rem)] px-[0.2rem] pt-10 text-[0.69rem] text-[#727272] min-[760px]:pt-12 min-[1121.5px]:w-[min(100%,66.09375rem)]">
                    <div className="flex items-center justify-between gap-4 border-b border-[#ededeb] pb-5">
                        <span>Your layout is saved on this device.</span>
                        <button
                            type="button"
                            className="inline-flex shrink-0 cursor-pointer items-center gap-[0.35rem] rounded-full border border-[#e8e8e6] bg-white px-[0.68rem] py-[0.48rem] text-[#727272] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#087cff]/70"
                            onClick={resetLayout}
                        >
                            <RotateCcw
                                className="size-[0.85rem]"
                                aria-hidden="true"
                            />
                            Reset layout
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 pt-5 min-[560px]:flex-row min-[560px]:items-end min-[560px]:justify-between">
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
                                    Made with curiosity, care, and a little play.
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
