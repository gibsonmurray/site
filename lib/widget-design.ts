import { cva } from "class-variance-authority"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SIZE_MAP, type WidgetSize } from "@/lib/widgets"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * The four widget contracts used across the portfolio.
 * Components read these capabilities instead of hiding arbitrary content in CSS.
 */
export const WIDGET_SIZE_SYSTEM: Record<
    WidgetSize,
    {
        name: "compact" | "wide" | "tall" | "large"
        columns: 1 | 2
        rows: 1 | 2
        showSummary: boolean
        showMedia: boolean
        showBody: boolean
        showDetails: boolean
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
        showDetails: false,
        showAction: false,
    },
    "2x1": {
        name: "wide",
        columns: SIZE_MAP["2x1"].width,
        rows: SIZE_MAP["2x1"].height,
        showSummary: true,
        showMedia: true,
        showBody: false,
        showDetails: false,
        showAction: false,
    },
    "1x2": {
        name: "tall",
        columns: SIZE_MAP["1x2"].width,
        rows: SIZE_MAP["1x2"].height,
        showSummary: true,
        showMedia: true,
        showBody: true,
        showDetails: false,
        showAction: true,
    },
    "2x2": {
        name: "large",
        columns: SIZE_MAP["2x2"].width,
        rows: SIZE_MAP["2x2"].height,
        showSummary: true,
        showMedia: true,
        showBody: true,
        showDetails: true,
        showAction: true,
    },
}

export function getWidgetSize(size: WidgetSize) {
    return WIDGET_SIZE_SYSTEM[size]
}

export const widgetCard = cva(
    "group/widget relative z-[1] h-full min-w-0 overflow-hidden rounded-[clamp(1.35rem,4vw,1.8rem)] border border-[#e8e8e6] bg-[color-mix(in_srgb,var(--widget-accent)_7%,#fff)] shadow-[0_2px_4px_rgba(18,18,18,0.035),0_10px_26px_rgba(18,18,18,0.025)] [transform:translateZ(0)] transition-[border-color,background,box-shadow] duration-[450ms] ease-out",
    {
        variants: {
            accent: {
                blue: "[--widget-accent:#1689e8]",
                green: "[--widget-accent:#27b968]",
                orange: "[--widget-accent:#f17837]",
                pink: "[--widget-accent:#e54e8d]",
                purple: "[--widget-accent:#7046ee]",
                slate: "[--widget-accent:#282828]",
            },
            dragging: {
                true: "pointer-events-none z-20 shadow-[0_22px_55px_rgba(0,0,0,0.16)]",
                false: "",
            },
        },
        defaultVariants: {
            accent: "slate",
            dragging: false,
        },
    },
)

export const widgetSurface =
    "relative flex h-full w-full cursor-[inherit] flex-col items-stretch gap-3 overflow-hidden bg-transparent p-[clamp(0.95rem,3.6vw,1.25rem)] text-left focus-visible:-outline-offset-3 focus-visible:outline-3 focus-visible:outline-[#087cff]/70"

export const widgetEyebrow =
    "text-[0.7rem] font-[650] tracking-[0.02em] text-[color-mix(in_srgb,var(--widget-accent)_76%,#111)]"

export const widgetCopy = "relative z-[2] grid gap-[0.32rem]"

export const widgetTitle =
    "max-w-[17ch] text-[clamp(1.1rem,4.2vw,1.65rem)] leading-[1.02] font-[620] tracking-[-0.045em] text-balance"

export const widgetSummary =
    "text-[0.74rem] leading-[1.42] text-pretty text-[#727272]"

export const widgetPills = "mt-auto flex flex-wrap gap-[0.35rem]"

export const widgetPill =
    "rounded-full border border-[color-mix(in_srgb,var(--widget-accent)_16%,#e8e8e6)] bg-[color-mix(in_srgb,var(--widget-accent)_5%,#fff)] px-[0.55rem] py-[0.36rem] text-[0.62rem] font-semibold text-[#727272]"

export const modalAccent = cva("[--widget-accent:#282828]", {
    variants: {
        accent: {
            blue: "[--widget-accent:#1689e8]",
            green: "[--widget-accent:#27b968]",
            orange: "[--widget-accent:#f17837]",
            pink: "[--widget-accent:#e54e8d]",
            purple: "[--widget-accent:#7046ee]",
            slate: "[--widget-accent:#282828]",
        },
    },
    defaultVariants: { accent: "slate" },
})
