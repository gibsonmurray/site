import { BrandLogo } from "@/components/brand-logo"
import { GithubContributionGraph } from "@/components/github-contribution-graph"
import { WidgetLayout } from "@/components/widget-layout"
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
    youtube: "YouTube",
}

const callsToAction: Record<SocialNetwork, string> = {
    github: "View profile",
    instagram: "Follow",
    x: "Follow",
    substack: "Subscribe",
    youtube: "Subscribe",
}

const brandSurface: Record<SocialNetwork, string> = {
    github: "[--brand-color:#24292f] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--brand-color)_9%,#fff),#fff)]",
    instagram:
        "[--brand-color:#d62976] bg-[linear-gradient(145deg,#fff6fb,#fffaf5)]",
    x: "[--brand-color:#111111] bg-[linear-gradient(145deg,#f5f5f5,#fff)]",
    substack: "[--brand-color:#ff6719] bg-[#fff7f3]",
    youtube: "[--brand-color:#ff0033] bg-[#fff5f6]",
}

const instagramLogo =
    "bg-[radial-gradient(circle_at_32%_102%,#ffd600_0_18%,#ff7a00_30%,transparent_52%),radial-gradient(circle_at_4%_12%,#7638fa_0_24%,transparent_58%),linear-gradient(135deg,#d300c5,#ff3040_58%,#ff7a00)]"

export function SocialWidget({ widget }: SocialWidgetProps) {
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
                            widget.network === "instagram" && instagramLogo,
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
