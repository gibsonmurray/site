import Image from "next/image"
import { BrandLogo } from "@/components/brand-logo"
import { GithubContributionGraph } from "@/components/github-contribution-graph"
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

export function SocialWidget({ widget }: SocialWidgetProps) {
    if (!widget.brand || !widget.href) return null

    const galleryLimit =
        widget.size === "2x2" ? 6 : widget.size === "1x2" ? 4 : 3
    const handle = widget.username
        ? `@${widget.username.replace(/^@/, "")}`
        : undefined

    return (
        <a
            className="widget-card__surface social-widget"
            data-brand={widget.brand}
            href={widget.href}
            draggable={false}
            target={widget.external ? "_blank" : undefined}
            rel={widget.external ? "noreferrer" : undefined}
            aria-label={`${widget.title} on ${brandNames[widget.brand]}${widget.external ? ", opens in a new tab" : ""}`}
        >
            <span className="social-widget__identity">
                <span className="social-widget__logo" aria-hidden="true">
                    <BrandLogo brand={widget.brand} />
                </span>
                <span className="social-widget__network">
                    {brandNames[widget.brand]}
                </span>
            </span>

            <span className="social-widget__copy">
                <strong>{widget.title}</strong>
                {handle && <small>{handle}</small>}
                {widget.summary && <span>{widget.summary}</span>}
            </span>

            {widget.brand === "github" && widget.username ? (
                <span className="social-widget__feature social-widget__feature--github">
                    <GithubContributionGraph username={widget.username} />
                </span>
            ) : widget.brand === "instagram" && widget.gallery?.length ? (
                <span
                    className="social-widget__feature social-widget__gallery"
                    aria-hidden="true"
                >
                    {widget.gallery.slice(0, galleryLimit).map((src) => (
                        <span className="social-widget__thumbnail" key={src}>
                            <Image
                                src={src}
                                alt=""
                                fill
                                draggable={false}
                                sizes="8rem"
                            />
                        </span>
                    ))}
                </span>
            ) : (
                <span
                    className="social-widget__feature social-widget__signal"
                    aria-hidden="true"
                >
                    {Array.from({ length: 8 }, (_, index) => (
                        <span key={index} />
                    ))}
                </span>
            )}

            <span className="social-widget__footer" aria-hidden="true">
                <span>{callsToAction[widget.brand]}</span>
                {widget.followers && <small>{widget.followers}</small>}
            </span>
        </a>
    )
}
