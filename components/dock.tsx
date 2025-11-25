import DockIcon from "./dock-icon"
import { FC } from "react"
import { App } from "@/types"

type DockProps = {
    apps: Record<string, App>
    open: (app: string) => void
    close: (app: string) => void
    bringToFront: (app: string) => void
}

const Dock: FC<DockProps> = ({ apps, open, close, bringToFront }) => {
    return (
        <div className="bg-background/40 border-border/50 absolute bottom-1 left-1/2 z-100 flex -translate-x-1/2 rounded-3xl border px-3 py-2 backdrop-blur-xl">
            {Object.values(apps).map((app) => (
                <DockIcon
                    key={app.id}
                    app={app}
                    open={() => open(app.id)}
                    close={() => close(app.id)}
                    bringToFront={() => bringToFront(app.id)}
                />
            ))}
        </div>
    )
}

export default Dock
