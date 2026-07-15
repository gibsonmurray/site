export type WidgetSize = "1x1" | "2x1" | "1x2" | "2x2" | "2x3"
export type Breakpoint = "mobile" | "desktop"
type WidgetColor =
    | "blue"
    | "green"
    | "orange"
    | "pink"
    | "purple"
    | "slate"
export type SocialNetwork =
    | "github"
    | "instagram"
    | "x"
    | "substack"
    | "tiktok"
    | "youtube"
export type BrandName = SocialNetwork | "spotify"

type GridCoordinate = {
    x: number
    y: number
}

export type WidgetMessage = {
    side: "incoming" | "outgoing"
    text: string
}

type WidgetSocialLink = {
    network: SocialNetwork
    url: string
    label: string
}

type MapCoordinates = {
    lat: number
    lng: number
    zoom?: number
}

export type WidgetType =
    | "text"
    | "verse"
    | "social"
    | "image"
    | "map"
    | "messages"
    | "quote"
    | "spotify"

export type WidgetDefinition = {
    id: string
    type: WidgetType
    size: WidgetSize
    title: string
    description?: string
    color?: WidgetColor
    network?: SocialNetwork
    url?: string
    playlist?: string[]
    handle?: string
    image?: string
    caption?: string
    body?: string[]
    attribution?: string
    messages?: WidgetMessage[]
    socials?: WidgetSocialLink[]
    gallery?: string[]
    coordinates?: MapCoordinates
    layout?: Partial<Record<Breakpoint, GridCoordinate>>
}

type GridPlacement = GridCoordinate & {
    id: string
    width: number
    height: number
}

export const GRID_COLUMNS: Record<Breakpoint, number> = {
    mobile: 2,
    desktop: 4,
}

export const SIZE_MAP = {
    "1x1": { width: 1, height: 1 },
    "2x1": { width: 2, height: 1 },
    "1x2": { width: 1, height: 2 },
    "2x2": { width: 2, height: 2 },
    "2x3": { width: 2, height: 3 },
} as const satisfies Record<WidgetSize, { width: number; height: number }>

export function getDefaultOrder(
    widgets: WidgetDefinition[],
    breakpoint: Breakpoint,
) {
    return [...widgets]
        .sort((a, b) => {
            const aPosition = a.layout?.[breakpoint]
            const bPosition = b.layout?.[breakpoint]

            if (!aPosition && !bPosition) return 0
            if (!aPosition) return 1
            if (!bPosition) return -1

            return aPosition.y - bPosition.y || aPosition.x - bPosition.x
        })
        .map((widget) => widget.id)
}

export function packWidgets(
    widgets: WidgetDefinition[],
    order: string[],
    columns: number,
) {
    const byId = new Map(widgets.map((widget) => [widget.id, widget]))
    const occupied = new Set<string>()
    const placements: GridPlacement[] = []

    for (const id of order) {
        const widget = byId.get(id)
        if (!widget) continue

        const size = SIZE_MAP[widget.size]
        const width = Math.min(size.width, columns)
        const height = size.height
        let y = 0
        let placed = false

        while (!placed) {
            for (let x = 0; x <= columns - width; x += 1) {
                let fits = true

                for (let row = y; row < y + height && fits; row += 1) {
                    for (let column = x; column < x + width; column += 1) {
                        if (occupied.has(`${column}:${row}`)) {
                            fits = false
                            break
                        }
                    }
                }

                if (!fits) continue

                for (let row = y; row < y + height; row += 1) {
                    for (let column = x; column < x + width; column += 1) {
                        occupied.add(`${column}:${row}`)
                    }
                }

                placements.push({ id, x, y, width, height })
                placed = true
                break
            }

            y += 1
        }
    }

    return placements
}
