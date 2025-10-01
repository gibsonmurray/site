import { LiquidGlass, LiquidGlassContent } from "@/components/liquid-glass"
import Image from "next/image"

const apps = [
    {
        name: "Apps",
        icon: "/icons/launchpad.png",
    },
    {
        name: "Bible",
        icon: "/icons/bible.png",
    },
    {
        name: "Terminal",
        icon: "/icons/terminal.png",
    },
    {
        name: "Word",
        icon: "/icons/word.png",
    },
    {
        name: "VS Code",
        icon: "/icons/vscode.png",
    },
    {
        name: "Books",
        icon: "/icons/books.png",
    },
    {
        name: "Photos",
        icon: "/icons/photos.png",
    },
    {
        name: "Spotify",
        icon: "/icons/spotify.png",
    },
    {
        name: "Settings",
        icon: "/icons/settings.png",
    }
]

const Dock = () => {
    return (
        <LiquidGlass className="absolute bottom-1 left-1/2 -translate-x-1/2 px-3 py-2">
            <LiquidGlassContent className="flex items-center gap-2">
                {apps.map((app) => (
                    <button
                        key={app.name}
                        className="relative grid size-16 place-items-center"
                    >
                        <Image
                            src={app.icon}
                            alt={app.name}
                            fill
                            priority
                            className="object-contain"
                        />
                    </button>
                ))}
            </LiquidGlassContent>
        </LiquidGlass>
    )
}

export default Dock
