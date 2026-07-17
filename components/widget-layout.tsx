import type { ReactNode } from "react"
import { cn } from "@/lib/widget-design"
import type { WidgetSize } from "@/lib/widgets"

type WidgetLayoutProps = {
    as?: "div" | "span"
    size: WidgetSize
    header?: ReactNode
    copy?: ReactNode
    feature?: ReactNode
    footer?: ReactNode
}

export function WidgetLayout({
    as: Element = "div",
    size,
    header,
    copy,
    feature,
    footer,
}: WidgetLayoutProps) {
    const isCompact = size === "1x1"
    const isWide = size === "2x1"

    return (
        <Element
            className={cn(
                "relative flex h-full min-h-0 w-full min-w-0 flex-col gap-3",
                isWide &&
                    "grid grid-cols-[minmax(6.25rem,0.72fr)_minmax(0,1.28fr)] grid-rows-[auto_minmax(0,1fr)] gap-x-3 gap-y-[0.65rem] min-[420px]:grid-cols-[minmax(8rem,0.7fr)_minmax(0,1.3fr)] min-[420px]:gap-x-4",
            )}
        >
            {header && (
                <Element
                    className={cn(
                        "relative z-[2] flex min-w-0 items-center",
                        isWide && "col-start-1 row-start-1",
                    )}
                >
                    {header}
                </Element>
            )}

            {copy && (
                <Element
                    className={cn(
                        "relative z-[2] min-w-0",
                        isCompact && "mt-auto",
                        isWide && "col-start-1 row-start-2 self-end",
                    )}
                >
                    {copy}
                </Element>
            )}

            {feature && (
                <Element
                    className={cn(
                        "relative z-[1] min-h-0 min-w-0 flex-1",
                        isWide && "col-start-2 row-span-2 row-start-1 h-full",
                    )}
                >
                    {feature}
                </Element>
            )}

            {footer && !isWide && (
                <Element className="relative z-[2] mt-auto min-w-0">
                    {footer}
                </Element>
            )}
        </Element>
    )
}
