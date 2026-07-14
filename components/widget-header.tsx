import {
    BookOpen,
    GitBranch,
    Mail,
    MessageCircle,
    PenLine,
    Sparkles,
    WandSparkles,
    type LucideIcon,
} from "lucide-react"
import { motion } from "motion/react"
import { BrandLogo } from "@/components/brand-logo"
import { cn, getWidgetSize } from "@/lib/widget-design"
import type { WidgetDefinition } from "@/lib/widgets"

const iconRegistry: Record<string, LucideIcon> = {
    book: BookOpen,
    github: GitBranch,
    mail: Mail,
    message: MessageCircle,
    pen: PenLine,
    sparkles: Sparkles,
    wand: WandSparkles,
}

type WidgetHeaderProps = {
    widget: WidgetDefinition
    variant: "card" | "modal"
    titleId?: string
}

export function WidgetHeader({ widget, variant, titleId }: WidgetHeaderProps) {
    const Icon = widget.icon ? iconRegistry[widget.icon] : undefined
    const size = getWidgetSize(widget.size)
    const appIconClassName = cn(
        "grid size-[2.35rem] shrink-0 place-items-center rounded-[0.72rem] bg-[var(--widget-accent)] text-white shadow-[0_2px_5px_color-mix(in_srgb,var(--widget-accent)_20%,transparent)] [&>svg]:size-[1.18rem] [&>svg]:stroke-2",
        size.name === "compact" && "size-8 rounded-[0.62rem]",
    )
    const identity = widget.brand ? (
        <span className={appIconClassName} data-brand={widget.brand}>
            <BrandLogo brand={widget.brand} />
        </span>
    ) : Icon ? (
        <span className={appIconClassName}>
            <Icon aria-hidden="true" />
        </span>
    ) : widget.eyebrow && size.name !== "compact" ? (
        <span className="text-[clamp(0.68rem,2vw,0.78rem)] leading-[1.25] font-[520] tracking-[-0.012em] text-[#111]">
            {widget.eyebrow}
        </span>
    ) : null

    if (variant === "modal") {
        return (
            <div className="grid gap-[0.9rem] pr-[3.25rem]">
                <motion.div
                    layoutId={`widget-${widget.id}-topline`}
                    className="flex items-center gap-[0.7rem]"
                >
                    {identity}
                </motion.div>
                <motion.div
                    layoutId={`widget-${widget.id}-copy`}
                    className="grid gap-[0.4rem]"
                >
                    <h2
                        className="m-0 text-[clamp(1.7rem,5vw,2.35rem)] leading-none font-[650] tracking-[-0.05em]"
                        id={titleId}
                    >
                        {widget.title}
                    </h2>
                    {widget.summary && (
                        <p className="m-0 max-w-[38rem] text-[0.92rem] leading-[1.45] text-[#727272]">
                            {widget.summary}
                        </p>
                    )}
                </motion.div>
            </div>
        )
    }

    return (
        <>
            <motion.span
                layoutId={`widget-${widget.id}-topline`}
                className="flex min-h-[1.4rem] items-center justify-start gap-[0.55rem] pr-8"
            >
                {identity}
            </motion.span>
            <motion.span
                layoutId={`widget-${widget.id}-copy`}
                className="relative z-[2] flex flex-col gap-1"
            >
                <strong className="max-w-[17ch] text-[clamp(1.02rem,4.1vw,1.55rem)] leading-[1.06] font-[570] tracking-[-0.035em] text-balance">
                    {widget.title}
                </strong>
                {size.showSummary && widget.summary && (
                    <span className="max-w-[29rem] text-[clamp(0.69rem,2.1vw,0.83rem)] leading-[1.32] text-pretty text-[#727272]">
                        {widget.summary}
                    </span>
                )}
            </motion.span>
        </>
    )
}
