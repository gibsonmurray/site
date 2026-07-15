"use client"

import { forwardRef, useImperativeHandle, useState } from "react"
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { customWidgetRegistry } from "@/components/custom-widget-registry"
import { widgetCard } from "@/lib/widget-design"
import type { WidgetDefinition } from "@/lib/widgets"

export type WidgetCardHandle = {
    startDrag: () => void
    updateTilt: (tilt: number) => void
    settleDrag: () => void
    stopDrag: () => void
}

type WidgetCardProps = {
    widget: WidgetDefinition
    onKeyboardMove: (direction: -1 | 1) => void
}

export const WidgetCard = forwardRef<WidgetCardHandle, WidgetCardProps>(
    function WidgetCard({ widget, onKeyboardMove }, ref) {
        const reduceMotion = useReducedMotion()
        const [dragging, setDragging] = useState(false)
        const tiltTarget = useMotionValue(0)
        const scaleTarget = useMotionValue(1)
        const yTarget = useMotionValue(0)
        const rotate = useSpring(tiltTarget, {
            stiffness: 115,
            damping: 17,
            mass: 0.8,
        })
        const scale = useSpring(scaleTarget, {
            stiffness: 145,
            damping: 20,
            mass: 0.9,
        })
        const y = useSpring(yTarget, {
            stiffness: 135,
            damping: 19,
            mass: 0.9,
        })
        const CustomWidget = customWidgetRegistry[widget.type]
        const externalUrl =
            widget.type !== "spotify" &&
            widget.url &&
            /^https?:\/\//i.test(widget.url)
                ? widget.url
                : undefined

        useImperativeHandle(
            ref,
            () => ({
                startDrag() {
                    setDragging(true)
                    if (reduceMotion) return
                    scaleTarget.set(1.012)
                    yTarget.set(-3)
                },
                updateTilt(tilt) {
                    if (!reduceMotion) tiltTarget.set(tilt)
                },
                settleDrag() {
                    tiltTarget.set(0)
                    scaleTarget.set(1)
                    yTarget.set(0)
                },
                stopDrag() {
                    tiltTarget.set(0)
                    scaleTarget.set(1)
                    yTarget.set(0)
                    setDragging(false)
                },
            }),
            [reduceMotion, scaleTarget, tiltTarget, yTarget],
        )

        return (
            <motion.article
                layoutId={`widget-${widget.id}`}
                data-widget-id={widget.id}
                data-size={widget.size}
                data-type={widget.type}
                data-color={widget.color ?? "slate"}
                className={widgetCard({
                    color: widget.color ?? "slate",
                    dragging,
                })}
                style={{ rotate, scale, y }}
                onKeyDown={(event) => {
                    if (!event.altKey) return
                    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                        event.preventDefault()
                        onKeyboardMove(-1)
                    }
                    if (
                        event.key === "ArrowRight" ||
                        event.key === "ArrowDown"
                    ) {
                        event.preventDefault()
                        onKeyboardMove(1)
                    }
                }}
            >
                <CustomWidget widget={widget} />
                {externalUrl && (
                    <a
                        className="widget-interactive absolute top-[clamp(0.9rem,3.4vw,1.15rem)] right-[clamp(0.9rem,3.4vw,1.15rem)] z-10 grid size-[2.1rem] place-items-center rounded-full border border-black/[0.06] bg-white/55 text-[#777] backdrop-blur-md transition-[color,border-color,background,transform] duration-200 hover:scale-[1.03] hover:border-black/10 hover:bg-white/80 hover:text-[#444] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#087cff]/70"
                        href={externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        draggable={false}
                        aria-label={`Open ${widget.title} in a new tab`}
                        onPointerDownCapture={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <ArrowUpRight
                            className="size-[1.05rem] stroke-[2.15]"
                            aria-hidden="true"
                        />
                    </a>
                )}
            </motion.article>
        )
    },
)
