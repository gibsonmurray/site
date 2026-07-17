import Image from "next/image"
import type { WidgetDefinition } from "@/lib/widgets"
import { WidgetLayout } from "@/components/widget-layout"
import {
    cn,
    getWidgetSize,
    widgetCopy,
    widgetSummary,
    widgetSurface,
    widgetTitle,
} from "@/lib/widget-design"

type TextWidgetProps = {
    widget: WidgetDefinition
}

const photoPositions = [
    "top-4 -left-[2%] z-[1] -rotate-[7deg] min-[760px]:top-0",
    "bottom-0 left-[17%] z-[2] rotate-[4deg]",
    "top-4 left-[36%] z-[3] -rotate-[1deg] min-[760px]:top-0",
    "bottom-0 left-[55%] z-[4] rotate-[8deg]",
    "top-4 left-[72%] z-[5] -rotate-[5deg] min-[760px]:-top-8",
] as const

export function TextWidget({ widget }: TextWidgetProps) {
    const body = widget.body ?? []
    const gallery = widget.gallery ?? []
    const size = getWidgetSize(widget.size)
    const isFeature = size.name === "feature"

    return (
        <div className={cn(widgetSurface, "justify-start")}>
            <WidgetLayout
                size={widget.size}
                copy={
                    <span className={cn(widgetCopy, isFeature && "gap-2")}>
                        <strong
                            className={cn(
                                widgetTitle,
                                isFeature &&
                                    "max-w-none text-[clamp(1.9rem,7vw,3rem)] tracking-[-0.06em]",
                            )}
                        >
                            {widget.title}
                        </strong>
                        {size.showSummary && widget.description && (
                            <span
                                className={cn(
                                    widgetSummary,
                                    isFeature &&
                                        "max-w-[28ch] text-[clamp(0.9rem,3.2vw,1.08rem)] leading-[1.45] font-[520] text-[#4f4f4f]",
                                )}
                            >
                                {widget.description}
                            </span>
                        )}
                    </span>
                }
                feature={
                    size.showBody && body.length > 0 ? (
                        isFeature ? (
                            <span className="flex size-full min-h-0 flex-col">
                                <span className="grid max-w-[39ch] content-start gap-3 border-t border-black/[0.06] pt-4 text-[clamp(0.82rem,2.8vw,0.96rem)] leading-[1.58] text-pretty text-[#727272]">
                                    {body.slice(0, 3).map((paragraph) => (
                                        <span key={paragraph}>{paragraph}</span>
                                    ))}
                                </span>

                                {gallery.length > 0 && (
                                    <span
                                        className="relative mt-auto block h-[15.5rem] w-full shrink-0 min-[560px]:h-[18rem] min-[760px]:h-[21rem]"
                                        aria-hidden="true"
                                    >
                                        {gallery
                                            .slice(0, 5)
                                            .map((image, index) => (
                                                <span
                                                    className={cn(
                                                        "absolute aspect-[2/3] w-[31%] cursor-default overflow-hidden rounded-[clamp(0.75rem,3vw,1rem)] bg-[#d8d8d8] shadow-[0_7px_18px_rgba(18,18,18,0.16)] min-[560px]:w-[32%]",
                                                        photoPositions[index],
                                                    )}
                                                    key={image}
                                                >
                                                    <Image
                                                        src={image}
                                                        alt=""
                                                        fill
                                                        draggable={false}
                                                        sizes="(max-width: 759px) 32vw, 10rem"
                                                        className="object-cover"
                                                    />
                                                </span>
                                            ))}
                                    </span>
                                )}
                            </span>
                        ) : (
                            <span className="grid max-w-[42ch] gap-[0.65rem] text-[0.74rem] leading-[1.42] text-pretty text-[#727272]">
                                {body.slice(0, 2).map((paragraph) => (
                                    <span key={paragraph}>{paragraph}</span>
                                ))}
                            </span>
                        )
                    ) : undefined
                }
                footer={
                    isFeature && widget.caption ? (
                        <span className="inline-flex items-center gap-2 text-[0.7rem] font-[580] text-[#737373]">
                            <span
                                className="size-1.5 rounded-full bg-[var(--widget-color)]"
                                aria-hidden="true"
                            />
                            {widget.caption}
                        </span>
                    ) : undefined
                }
            />
        </div>
    )
}
