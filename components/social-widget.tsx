import Image from "next/image"
import { BrandLogo } from "@/components/brand-logo"
import { GithubContributionGraph } from "@/components/github-contribution-graph"
import { cn, getWidgetSize, widgetSurface } from "@/lib/widget-design"
import type { WidgetBrand, WidgetDefinition } from "@/lib/widgets"

type SocialWidgetProps = {
    widget: WidgetDefinition
}

const brandNames: Record<WidgetBrand, string> = {
    github: "GitHub",
    instagram: "Instagram",
    x: "X",
    substack: "Substack",
    youtube: "YouTube",
    spotify: "Spotify",
}

const callsToAction: Record<WidgetBrand, string> = {
    github: "View profile",
    instagram: "Follow",
    x: "Follow",
    substack: "Subscribe",
    youtube: "Subscribe",
    spotify: "Listen",
}

const brandSurface: Record<WidgetBrand, string> = {
    github: "[--brand-color:#24292f] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--brand-color)_9%,#fff),#fff)]",
    instagram:
        "[--brand-color:#d62976] bg-[linear-gradient(145deg,#fff6fb,#fffaf5)]",
    x: "[--brand-color:#111111] bg-[linear-gradient(145deg,#f5f5f5,#fff)]",
    substack: "[--brand-color:#ff6719] bg-[#fff7f3]",
    youtube: "[--brand-color:#ff0033] bg-[#fff5f6]",
    spotify: "[--brand-color:#1ed760] bg-[#effbf4]",
}

const instagramLogo =
    "bg-[radial-gradient(circle_at_32%_102%,#ffd600_0_18%,#ff7a00_30%,transparent_52%),radial-gradient(circle_at_4%_12%,#7638fa_0_24%,transparent_58%),linear-gradient(135deg,#d300c5,#ff3040_58%,#ff7a00)]"

export function SocialWidget({ widget }: SocialWidgetProps) {
    if (!widget.brand || !widget.href) return null

    const galleryLimit =
        widget.size === "2x2" ? 6 : widget.size === "1x2" ? 4 : 3
    const handle = widget.username
        ? `@${widget.username.replace(/^@/, "")}`
        : undefined
    const size = getWidgetSize(widget.size)
    const isWide = size.name === "wide"
    const featureClassName = cn(
        "relative z-[1] grid min-w-0",
        isWide && "col-start-2 row-span-2 row-start-1",
        (size.name === "tall" || size.name === "large") && "min-h-[6.5rem]",
        size.name === "large" && "min-h-36",
    )

    return (
        <a
            className={cn(
                widgetSurface,
                "isolate justify-start",
                brandSurface[widget.brand],
                isWide &&
                    "grid grid-cols-[minmax(8rem,0.9fr)_minmax(0,1.1fr)] grid-rows-[auto_1fr] gap-x-4 gap-y-[0.65rem]",
            )}
            data-brand={widget.brand}
            href={widget.href}
            draggable={false}
            target={widget.external ? "_blank" : undefined}
            rel={widget.external ? "noreferrer" : undefined}
            aria-label={`${widget.title} on ${brandNames[widget.brand]}${widget.external ? ", opens in a new tab" : ""}`}
        >
            <span className="relative z-[2] flex items-center gap-[0.55rem]">
                <span
                    className={cn(
                        "grid size-[2.55rem] shrink-0 place-items-center rounded-[0.76rem] bg-[var(--brand-color)] text-white shadow-[0_5px_13px_color-mix(in_srgb,var(--brand-color)_20%,transparent)] [&>svg]:size-[1.35rem]",
                        widget.brand === "instagram" && instagramLogo,
                    )}
                    aria-hidden="true"
                >
                    <BrandLogo brand={widget.brand} />
                </span>
                {/* {size.name !== "compact" && (
                    <span className="text-[0.66rem] font-[620] text-[#727272]">
                        {brandNames[widget.brand]}
                    </span>
                )} */}
            </span>

            <span
                className={cn(
                    "relative z-[2] grid gap-[0.2rem]",
                    size.name === "compact" && "mt-auto",
                    isWide && "self-end",
                )}
            >
                <strong className="text-[clamp(1rem,4vw,1.42rem)] leading-[1.04] font-[610] tracking-[-0.04em]">
                    {widget.title}
                </strong>
                {handle && (
                    <small className="text-[0.64rem] font-semibold text-[color-mix(in_srgb,var(--brand-color)_76%,#727272)]">
                        {handle}
                    </small>
                )}
                {size.showSummary && widget.summary && (
                    <span className="max-w-[30ch] text-[0.7rem] leading-[1.4] text-[#727272]">
                        {widget.summary}
                    </span>
                )}
            </span>

            {size.showMedia &&
                (widget.brand === "github" && widget.username ? (
                    <span
                        className={cn(
                            featureClassName,
                            "place-items-center overflow-hidden",
                        )}
                    >
                        <GithubContributionGraph username={widget.username} />
                    </span>
                ) : widget.brand === "instagram" && widget.gallery?.length ? (
                    <span
                        className={cn(
                            featureClassName,
                            "grid-cols-2 gap-[0.38rem]",
                            (isWide || size.name === "large") &&
                                "grid-cols-3 self-center",
                        )}
                        aria-hidden="true"
                    >
                        {widget.gallery.slice(0, galleryLimit).map((src) => (
                            <span
                                className="relative block aspect-square overflow-hidden rounded-[0.62rem] bg-[#f7f7f6]"
                                key={src}
                            >
                                <Image
                                    src={src}
                                    alt=""
                                    fill
                                    draggable={false}
                                    sizes="8rem"
                                    className="object-cover"
                                />
                            </span>
                        ))}
                    </span>
                ) : (
                    <span
                        className={cn(
                            featureClassName,
                            "grid-cols-4 place-content-center gap-[0.26rem]",
                            widget.brand === "substack" &&
                                "grid-cols-1 content-center",
                            widget.brand === "x" && "-rotate-4 opacity-80",
                        )}
                        aria-hidden="true"
                    >
                        {Array.from({ length: 8 }, (_, index) => (
                            <span
                                className={cn(
                                    "size-[0.48rem] rounded-[0.14rem] bg-[color-mix(in_srgb,var(--brand-color)_32%,#fff)]",
                                    widget.brand === "substack" &&
                                        "h-[0.24rem] w-[3.2rem] rounded-full",
                                )}
                                key={index}
                            />
                        ))}
                    </span>
                ))}

            {size.showAction && (
                <span
                    className="relative z-[2] mt-auto inline-flex items-center self-start rounded-full bg-[var(--brand-color)] px-[0.7rem] py-[0.48rem] text-[0.68rem] leading-none font-[650] text-white"
                    aria-hidden="true"
                >
                    <span>{callsToAction[widget.brand]}</span>
                    {widget.followers && (
                        <small className="ml-[0.4rem] font-[520] text-white/70">
                            {widget.followers}
                        </small>
                    )}
                </span>
            )}
        </a>
    )
}
