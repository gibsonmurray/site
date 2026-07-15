import Image from "next/image"
import { cn, widgetSurface } from "@/lib/widget-design"
import type { WidgetDefinition } from "@/lib/widgets"

type ImageWidgetProps = {
    widget: WidgetDefinition
}

export function ImageWidget({ widget }: ImageWidgetProps) {
    if (!widget.image) return null

    const content = (
        <>
            <Image
                src={widget.image}
                alt={widget.title}
                fill
                draggable={false}
                sizes={
                    widget.size.startsWith("2")
                        ? "(max-width: 759px) 100vw, 30rem"
                        : "(max-width: 759px) 50vw, 15rem"
                }
                className="object-cover"
            />
            {widget.caption && (
                <span
                    className="pointer-events-none absolute bottom-[0.9rem] left-[0.9rem] z-4! grid gap-[0.12rem] rounded-[0.8rem] border border-black/10 bg-white/90 px-[0.68rem] py-[0.48rem] text-[0.72rem] leading-none font-[570] text-[#111] shadow-[0_4px_16px_rgba(18,18,18,0.1)] backdrop-blur-xl"
                    aria-hidden="true"
                >
                    <strong className="font-[inherit]">{widget.caption}</strong>
                    {widget.description && (
                        <small className="text-[0.6rem] font-medium text-[#727272]">
                            {widget.description}
                        </small>
                    )}
                </span>
            )}
        </>
    )

    if (widget.url) {
        return (
            <a
                className={cn(widgetSurface, "bg-white p-0")}
                href={widget.url}
                draggable={false}
                target="_blank"
                rel="noreferrer"
            >
                {content}
            </a>
        )
    }

    return <div className={cn(widgetSurface, "bg-white p-0")}>{content}</div>
}
