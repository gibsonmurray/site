import Image from "next/image"
import { cn, widgetSurface } from "@/lib/widget-design"
import type { WidgetDefinition } from "@/lib/widgets"

type ImageWidgetProps = {
    widget: WidgetDefinition
    onOpen: () => void
}

export function ImageWidget({ widget, onOpen }: ImageWidgetProps) {
    if (!widget.image) return null

    const image = (
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
    )

    if (widget.action === "open-link" && widget.href) {
        return (
            <a
                className={cn(widgetSurface, "bg-white p-0")}
                href={widget.href}
                draggable={false}
                target={widget.external ? "_blank" : undefined}
                rel={widget.external ? "noreferrer" : undefined}
            >
                {image}
            </a>
        )
    }

    if (widget.action === "expand") {
        return (
            <button
                type="button"
                className={cn(widgetSurface, "bg-white p-0")}
                onClick={onOpen}
            >
                {image}
            </button>
        )
    }

    return <div className={cn(widgetSurface, "bg-white p-0")}>{image}</div>
}
