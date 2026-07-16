import { cva } from "class-variance-authority"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SIZE_MAP, type WidgetSize } from "@/lib/widgets"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * The five widget contracts used across the portfolio.
 * Components read these capabilities instead of hiding arbitrary content in CSS.
 */
const WIDGET_SIZE_SYSTEM: Record<
    WidgetSize,
    {
        name: "compact" | "wide" | "tall" | "large" | "feature"
        columns: 1 | 2
        rows: 1 | 2 | 3
        showSummary: boolean
        showMedia: boolean
        showBody: boolean
        showAction: boolean
    }
> = {
    "1x1": {
        name: "compact",
        columns: SIZE_MAP["1x1"].width,
        rows: SIZE_MAP["1x1"].height,
        showSummary: false,
        showMedia: false,
        showBody: false,
        showAction: false,
    },
    "2x1": {
        name: "wide",
        columns: SIZE_MAP["2x1"].width,
        rows: SIZE_MAP["2x1"].height,
        showSummary: true,
        showMedia: true,
        showBody: false,
        showAction: false,
    },
    "1x2": {
        name: "tall",
        columns: SIZE_MAP["1x2"].width,
        rows: SIZE_MAP["1x2"].height,
        showSummary: true,
        showMedia: true,
        showBody: true,
        showAction: true,
    },
    "2x2": {
        name: "large",
        columns: SIZE_MAP["2x2"].width,
        rows: SIZE_MAP["2x2"].height,
        showSummary: true,
        showMedia: true,
        showBody: true,
        showAction: true,
    },
    "2x3": {
        name: "feature",
        columns: SIZE_MAP["2x3"].width,
        rows: SIZE_MAP["2x3"].height,
        showSummary: true,
        showMedia: true,
        showBody: true,
        showAction: true,
    },
}

export function getWidgetSize(size: WidgetSize) {
    return WIDGET_SIZE_SYSTEM[size]
}

export const widgetCard = cva(
    "group/widget relative z-[1] h-full min-w-0 overflow-hidden rounded-[clamp(1.35rem,4vw,1.8rem)] border border-[#e2e2e3] bg-[#ececed] shadow-[0_2px_4px_rgba(18,18,18,0.035),0_10px_26px_rgba(18,18,18,0.025)] [transform:translateZ(0)] transition-[border-color,background,box-shadow] duration-[450ms] ease-out",
    {
        variants: {
            color: {
                blue: "[--widget-color:#1689e8]",
                green: "[--widget-color:#27b968]",
                orange: "[--widget-color:#f17837]",
                pink: "[--widget-color:#e54e8d]",
                purple: "[--widget-color:#7046ee]",
                slate: "[--widget-color:#282828]",
            },
        },
        defaultVariants: {
            color: "slate",
        },
    },
)

export const widgetSurface =
    "relative flex h-full w-full cursor-[inherit] flex-col items-stretch gap-3 overflow-hidden bg-[#ececed] p-[clamp(0.95rem,3.6vw,1.25rem)] text-left focus-visible:-outline-offset-3 focus-visible:outline-3 focus-visible:outline-[#087cff]/70"

export const widgetIcon =
    "grid size-[3.05rem] shrink-0 place-items-center rounded-[0.9rem] text-white"

export const widgetCopy = "relative z-[2] grid gap-[0.32rem]"

export const widgetTitle =
    "max-w-[17ch] text-[clamp(1.1rem,4.2vw,1.65rem)] leading-[1.02] font-[620] tracking-[-0.045em] text-balance"

export const widgetSummary =
    "text-[0.74rem] leading-[1.42] text-pretty text-[#727272]"
