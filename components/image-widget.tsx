import Image from "next/image"
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
            className="image-widget__image"
        />
    )

    if (widget.action === "open-link" && widget.href) {
        return (
            <a
                className="widget-card__surface image-widget"
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
                className="widget-card__surface image-widget"
                onClick={onOpen}
            >
                {image}
            </button>
        )
    }

    return <div className="widget-card__surface image-widget">{image}</div>
}
