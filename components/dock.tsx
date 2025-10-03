import { APPS } from "@/lib/constants"
import DockIcon from "./dock-icon"
import { FC } from "react"

type DockProps = {
    openApps: string[]
    setOpenApps: (apps: string[]) => void
    bringToFront: (app: string) => void
    closeApp: (app: string) => void
}

const Dock: FC<DockProps> = ({
    openApps,
    setOpenApps,
    bringToFront,
    closeApp,
}) => {
    return (
        <div className="bg-background/40 border-border/50 absolute bottom-1 left-1/2 z-100 flex -translate-x-1/2 rounded-3xl border px-3 py-2 backdrop-blur-xl">
            {APPS.map((app) => (
                <DockIcon
                    key={app.name}
                    name={app.name}
                    icon={app.icon}
                    isOpen={openApps.includes(app.name)}
                    openApp={() => setOpenApps([...openApps, app.name])}
                    bringToFront={() => bringToFront(app.name)}
                    closeApp={() => closeApp(app.name)}
                />
            ))}
        </div>
    )
}

export default Dock
