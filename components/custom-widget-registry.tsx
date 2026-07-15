import type { ComponentType } from "react"
import { ArticleWidget } from "@/components/article-widget"
import { ImageWidget } from "@/components/image-widget"
import { MapWidget } from "@/components/map-widget"
import { MessagesWidget } from "@/components/messages-widget"
import { QuoteWidget } from "@/components/quote-widget"
import { SocialWidget } from "@/components/social-widget"
import { SpotifyWidget } from "@/components/spotify-widget"
import { TextWidget } from "@/components/text-widget"
import type { WidgetDefinition, WidgetType } from "@/lib/widgets"

type CustomWidgetProps = {
    widget: WidgetDefinition
}

export const customWidgetRegistry: Record<
    WidgetType,
    ComponentType<CustomWidgetProps>
> = {
    article: ArticleWidget,
    image: ImageWidget,
    map: MapWidget,
    messages: MessagesWidget,
    quote: QuoteWidget,
    social: SocialWidget,
    spotify: SpotifyWidget,
    text: TextWidget,
}
