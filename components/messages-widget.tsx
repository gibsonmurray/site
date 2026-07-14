import { ChevronRight, MessageCircle } from "lucide-react"
import { cn, getWidgetSize, widgetSurface } from "@/lib/widget-design"
import type { WidgetDefinition } from "@/lib/widgets"

type MessagesWidgetProps = {
    widget: WidgetDefinition
    onOpen: () => void
}

export function MessagesWidget({ widget, onOpen }: MessagesWidgetProps) {
    const messages = widget.details?.messages?.slice(-2) ?? []
    const size = getWidgetSize(widget.size)
    const isCompact = size.name === "compact"
    const isTall = size.name === "tall"

    return (
        <button
            type="button"
            className={cn(
                widgetSurface,
                "isolate grid grid-cols-[minmax(0,0.82fr)_minmax(9rem,1.18fr)] grid-rows-[auto_1fr] gap-x-4 gap-y-[0.8rem] bg-[radial-gradient(circle_at_92%_12%,rgba(10,132,255,0.16),transparent_31%),linear-gradient(145deg,#f8fbff,#edf6ff)]",
                (isCompact || isTall) && "flex flex-col",
                isTall && "gap-[0.85rem]",
                size.name === "large" &&
                    "grid-cols-[minmax(10rem,0.8fr)_minmax(0,1.2fr)] gap-x-6 gap-y-4 p-6",
            )}
            onClick={onOpen}
            aria-label={`Open ${widget.title}`}
        >
            <span className="relative z-[2] col-span-full flex items-center gap-[0.55rem] text-[0.67rem] font-[650] text-[#41719f]">
                <span className="grid size-[2.35rem] place-items-center rounded-[0.78rem] bg-[#0a84ff] text-white shadow-[0_6px_16px_rgba(10,132,255,0.24)]">
                    <MessageCircle
                        className="size-[1.2rem] stroke-[2.25]"
                        aria-hidden="true"
                    />
                </span>
                {!isCompact && <span>Messages</span>}
                <span
                    className="ml-auto grid size-[1.65rem] place-items-center rounded-full border border-[#0a84ff]/12 bg-white/70 text-[#0a84ff]"
                    aria-hidden="true"
                >
                    <ChevronRight className="size-[0.8rem] stroke-[2.4]" />
                </span>
            </span>

            {size.showMedia && (
                <span
                    className={cn(
                        "col-start-2 row-start-2 flex min-w-0 flex-col justify-center gap-[0.42rem] rounded-2xl border border-[#0a84ff]/10 bg-white/70 p-[0.68rem] shadow-[0_8px_24px_rgba(37,91,143,0.06)]",
                        isTall && "order-3 flex-1",
                    )}
                    aria-hidden="true"
                >
                    <span className="flex min-w-0 flex-col gap-[0.35rem]">
                        {messages.map((message) => (
                            <span
                                key={message.text}
                                className={cn(
                                    "max-w-full self-start rounded-[0.85rem_0.85rem_0.85rem_0.25rem] bg-[#e8e8ed] px-[0.62rem] py-[0.45rem] text-[0.62rem] leading-[1.28] text-[#111]",
                                    message.side === "outgoing" &&
                                        "self-end rounded-[0.85rem_0.85rem_0.25rem_0.85rem] bg-[#0a84ff] text-white",
                                    size.name === "large" &&
                                        "px-[0.8rem] py-[0.62rem] text-[0.78rem]",
                                )}
                            >
                                {message.text}
                            </span>
                        ))}
                    </span>
                    <span className="flex w-max gap-[0.18rem] rounded-full bg-[#e8e8ed] px-[0.48rem] py-[0.38rem]">
                        {[0, 1, 2].map((dot) => (
                            <span
                                className="size-[0.22rem] rounded-full bg-[#9b9ba1]"
                                key={dot}
                            />
                        ))}
                    </span>
                </span>
            )}

            <span
                className={cn(
                    "col-start-1 flex flex-col gap-1 self-end",
                    isCompact && "mt-auto",
                    isTall && "order-2",
                )}
            >
                <strong className="text-[clamp(1rem,4vw,1.45rem)] font-[640] tracking-[-0.04em]">
                    {widget.title}
                </strong>
                {size.showSummary && widget.summary && (
                    <span className="text-[0.69rem] text-[#727272]">
                        {widget.summary}
                    </span>
                )}
            </span>
        </button>
    )
}
