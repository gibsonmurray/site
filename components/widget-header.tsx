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
    const identity = widget.brand ? (
        <span className="widget-card__app-icon" data-brand={widget.brand}>
            <BrandLogo brand={widget.brand} />
        </span>
    ) : Icon ? (
        <span className="widget-card__app-icon">
            <Icon aria-hidden="true" />
        </span>
    ) : widget.eyebrow ? (
        <span className="widget-card__eyebrow">{widget.eyebrow}</span>
    ) : null

    if (variant === "modal") {
        return (
            <div className="widget-modal__identity">
                <motion.div
                    layoutId={`widget-${widget.id}-topline`}
                    className="widget-modal__topline"
                >
                    {identity}
                </motion.div>
                <motion.div
                    layoutId={`widget-${widget.id}-copy`}
                    className="widget-modal__identity-copy"
                >
                    <h2 id={titleId}>{widget.title}</h2>
                    {widget.summary && <p>{widget.summary}</p>}
                </motion.div>
            </div>
        )
    }

    return (
        <>
            <motion.span
                layoutId={`widget-${widget.id}-topline`}
                className="widget-card__topline"
            >
                {identity}
            </motion.span>
            <motion.span
                layoutId={`widget-${widget.id}-copy`}
                className="widget-card__copy"
            >
                <strong>{widget.title}</strong>
                {widget.summary && <span>{widget.summary}</span>}
            </motion.span>
        </>
    )
}
