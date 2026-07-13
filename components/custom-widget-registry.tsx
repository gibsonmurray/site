import type { ComponentType } from "react"
import { ArticleWidget } from "@/components/article-widget"
import { ImageWidget } from "@/components/image-widget"
import { MapWidget } from "@/components/map-widget"
import { QuoteWidget } from "@/components/quote-widget"
import { SocialWidget } from "@/components/social-widget"
import { SpotifyWidget } from "@/components/spotify-widget"
import { TextWidget } from "@/components/text-widget"
import type { WidgetDefinition, WidgetKind } from "@/lib/widgets"

type CustomWidgetProps = {
    widget: WidgetDefinition
    onOpen: () => void
}

export const customWidgetRegistry: Record<
    WidgetKind,
    ComponentType<CustomWidgetProps>
> = {
    article: ArticleWidget,
    image: ImageWidget,
    map: MapWidget,
    quote: QuoteWidget,
    social: SocialWidget,
    "spotify-media": SpotifyWidget,
    text: TextWidget,
}
