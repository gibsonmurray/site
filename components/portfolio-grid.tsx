"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, LayoutGroup, MotionConfig } from "motion/react"
import { RotateCcw } from "lucide-react"
import ReactGridLayout, {
    type Layout,
    type LayoutItem,
    useContainerWidth,
    verticalCompactor,
} from "react-grid-layout"
import { WidgetCard, type WidgetCardHandle } from "@/components/widget-card"
import { MessagesModal } from "@/components/messages-modal"
import { WidgetModal } from "@/components/widget-modal"
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
const DESKTOP_GRID_MEDIA_QUERY = "(min-width: 1004px)"

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
        const position = widget.position?.[breakpoint]
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
    const [activeWidget, setActiveWidget] = useState<WidgetDefinition | null>(
        null,
    )
    const [settlingSlot, setSettlingSlot] = useState<SettlingSlot | null>(null)
    const [ready, setReady] = useState(false)

    const columns = GRID_COLUMNS[breakpoint]
    const gap = breakpoint === "desktop" ? 16 : 12
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
                        : 340

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
            <main className={ready ? "portfolio is-ready" : "portfolio"}>
                <div className="portfolio__ambient" aria-hidden="true" />
                <header className="portfolio__intro">
                    <span>GM / Portfolio</span>
                    <p>Drag any widget to rearrange this space.</p>
                </header>

                <LayoutGroup id="portfolio-widgets">
                    <div
                        ref={containerRef}
                        className="widget-grid-shell"
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
                                    className="widget-grid__settling-placeholder"
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
                                className="widget-grid"
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
                                            className={
                                                settlingSlot?.breakpoint ===
                                                    breakpoint &&
                                                settlingSlot.item.i ===
                                                    widget.id
                                                    ? "widget-grid__item is-settling"
                                                    : "widget-grid__item"
                                            }
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
                                                onOpen={setActiveWidget}
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

                    <AnimatePresence>
                        {activeWidget &&
                            (activeWidget.presentation === "messages" ? (
                                <MessagesModal
                                    key={activeWidget.id}
                                    widget={activeWidget}
                                    onClose={() => setActiveWidget(null)}
                                />
                            ) : (
                                <WidgetModal
                                    key={activeWidget.id}
                                    widget={activeWidget}
                                    onClose={() => setActiveWidget(null)}
                                />
                            ))}
                    </AnimatePresence>
                </LayoutGroup>

                <footer className="portfolio__footer">
                    <span>Your layout is saved on this device.</span>
                    <button type="button" onClick={resetLayout}>
                        <RotateCcw aria-hidden="true" />
                        Reset layout
                    </button>
                </footer>
            </main>
        </MotionConfig>
    )
}
