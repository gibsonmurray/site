import { PortfolioGrid } from "@/components/portfolio-grid"
import widgets from "@/data/widgets.json"
import type { WidgetDefinition } from "@/lib/widgets"

export default function Page() {
    return (
        <PortfolioGrid
            widgets={widgets as unknown as WidgetDefinition[]}
        />
    )
}
