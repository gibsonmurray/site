import { BrandLogo } from "@/components/brand-logo"
import { GithubContributionGraph } from "@/components/github-contribution-graph"
import { WidgetLayout } from "@/components/widget-layout"
import type { CSSProperties } from "react"
import {
    cn,
    getWidgetSize,
    widgetIcon,
    widgetSurface,
} from "@/lib/widget-design"
import type { SocialNetwork, WidgetDefinition } from "@/lib/widgets"

type SocialWidgetProps = {
    widget: WidgetDefinition
}

const brandNames: Record<SocialNetwork, string> = {
    github: "GitHub",
    instagram: "Instagram",
    x: "X",
    substack: "Substack",
    tiktok: "TikTok",
    youtube: "YouTube",
}

const callsToAction: Record<SocialNetwork, string> = {
    github: "View profile",
    instagram: "Follow",
    x: "Follow",
    substack: "Subscribe",
    tiktok: "Follow",
    youtube: "Subscribe",
}

const brandSurface: Record<SocialNetwork, string> = {
    github: "[--brand-color:#24292f]",
    instagram: "[--brand-color:#d62976]",
    x: "[--brand-color:#111111]",
    substack: "[--brand-color:#ff6719]",
    tiktok: "[--brand-color:#111111]",
    youtube: "[--brand-color:#ff0033]",
}

const brandColors: Record<SocialNetwork, string> = {
    github: "#24292f",
    instagram: "#d62976",
    x: "#111111",
    substack: "#ff6719",
    tiktok: "#111111",
    youtube: "#ff0033",
}

export function SocialWidget({ widget }: SocialWidgetProps) {
    if (widget.socials?.length) {
        const isCompact = widget.size === "1x1"

        return (
            <div
                className={cn(
                    widgetSurface,
                    isCompact
                        ? "justify-start gap-5"
                        : "grid grid-cols-[minmax(0,0.8fr)_minmax(10rem,1.2fr)] items-center gap-[clamp(0.75rem,3vw,1.25rem)]",
                )}
            >
                <span className="grid min-w-0 gap-1">
                    <strong
                        className={cn(
                            "leading-[1.02] font-[620] tracking-[-0.045em] text-balance",
                            isCompact
                                ? "text-[clamp(1rem,4vw,1.25rem)]"
                                : "text-[clamp(1.08rem,4vw,1.5rem)]",
                        )}
                    >
                        {widget.title}
                    </strong>
                    {!isCompact && widget.description && (
                        <span className="text-[0.7rem] leading-[1.35] text-[#727272]">
                            {widget.description}
                        </span>
                    )}
                </span>
                <span
                    className={cn(
                        "grid min-w-0 gap-[clamp(0.38rem,1.5vw,0.62rem)]",
                        isCompact
                            ? "my-auto w-fit self-center grid-cols-2 grid-rows-2 place-items-center gap-[0.65rem]"
                            : "grid-cols-4",
                    )}
                >
                    {widget.socials.map((social) => (
                        <a
                            className={cn(
                                "widget-interactive grid place-items-center overflow-hidden rounded-[0.9rem] bg-[var(--brand-color)] text-white shadow-[0_6px_16px_color-mix(in_srgb,var(--brand-color)_16%,transparent)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#087cff]/70",
                                isCompact
                                    ? "size-[3.05rem]"
                                    : "aspect-square min-w-0",
                                social.network === "instagram" &&
                                    "bg-transparent",
                            )}
                            style={
                                {
                                    "--brand-color":
                                        brandColors[social.network],
                                } as CSSProperties
                            }
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                            draggable={false}
                            aria-label={`${social.label}, opens in a new tab`}
                            key={social.network}
                        >
                            <BrandLogo brand={social.network} />
                        </a>
                    ))}
                </span>
            </div>
        )
    }

    if (!widget.network || !widget.url) return null

    const handle = widget.handle
        ? `@${widget.handle.replace(/^@/, "")}`
        : undefined
    const size = getWidgetSize(widget.size)
    const featureClassName = cn(
        "relative z-[1] grid size-full min-h-0 min-w-0",
        (size.name === "tall" || size.name === "large") && "min-h-[6.5rem]",
        size.name === "large" && "min-h-36",
    )

    return (
        <a
            className={cn(
                widgetSurface,
                "isolate justify-start",
                brandSurface[widget.network],
            )}
            data-brand={widget.network}
            href={widget.url}
            draggable={false}
            target="_blank"
            rel="noreferrer"
            aria-label={`${widget.title} on ${brandNames[widget.network]}, opens in a new tab`}
        >
            <WidgetLayout
                size={widget.size}
                header={
                    <span
                        className={cn(
                            widgetIcon,
                            "bg-[var(--brand-color)] shadow-[0_5px_13px_color-mix(in_srgb,var(--brand-color)_20%,transparent)]",
                            widget.network === "instagram" && "bg-white",
                        )}
                        aria-hidden="true"
                    >
                        <BrandLogo brand={widget.network} />
                    </span>
                }
                copy={
                    <span className="grid gap-[0.2rem]">
                        <strong className="text-[clamp(1rem,4vw,1.42rem)] leading-[1.04] font-[610] tracking-[-0.04em]">
                            {widget.title}
                        </strong>
                        {handle && (
                            <small className="text-[0.64rem] font-semibold text-[color-mix(in_srgb,var(--brand-color)_76%,#727272)]">
                                {handle}
                            </small>
                        )}
                        {size.showSummary && widget.description && (
                            <span className="max-w-[30ch] text-[0.7rem] leading-[1.4] text-[#727272]">
                                {widget.description}
                            </span>
                        )}
                    </span>
                }
                feature={
                    size.showMedia ? (
                        widget.network === "github" && widget.handle ? (
                            <span
                                className={cn(
                                    featureClassName,
                                    "place-items-center overflow-hidden",
                                )}
                            >
                                <GithubContributionGraph
                                    username={widget.handle}
                                />
                            </span>
                        ) : (
                            <span
                                className={cn(
                                    featureClassName,
                                    "grid-cols-4 place-content-center gap-[0.26rem]",
                                    widget.network === "substack" &&
                                        "grid-cols-1 content-center",
                                    widget.network === "x" &&
                                        "-rotate-4 opacity-80",
                                )}
                                aria-hidden="true"
                            >
                                {Array.from({ length: 8 }, (_, index) => (
                                    <span
                                        className={cn(
                                            "size-[0.48rem] rounded-[0.14rem] bg-[color-mix(in_srgb,var(--brand-color)_32%,#fff)]",
                                            widget.network === "substack" &&
                                                "h-[0.24rem] w-[3.2rem] rounded-full",
                                        )}
                                        key={index}
                                    />
                                ))}
                            </span>
                        )
                    ) : undefined
                }
                footer={
                    size.showAction ? (
                        <span
                            className="inline-flex items-center self-start rounded-full bg-[var(--brand-color)] px-[0.7rem] py-[0.48rem] text-[0.68rem] leading-none font-[650] text-white"
                            aria-hidden="true"
                        >
                            <span>{callsToAction[widget.network]}</span>
                        </span>
                    ) : undefined
                }
            />
        </a>
    )
}
