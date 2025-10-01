import { LiquidGlass, LiquidGlassContent } from "@/components/liquid-glass"

const Dock = () => {
    return (
        <LiquidGlass className="absolute bottom-0 left-1/2 -translate-x-1/2 p-3">
            <LiquidGlassContent>
                <img
                    src="https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/finder.png"
                    alt="Finder"
                    className="h-16"
                />
                <img
                    src="https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/map.png"
                    alt="Map"
                    className="h-16"
                />
                <img
                    src="https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/messages.png"
                    alt="Messages"
                    className="h-16"
                />
                <img
                    src="https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/notes.png"
                    alt="Notes"
                    className="h-16"
                />
                <img
                    src="https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/safari.png"
                    alt="Safari"
                    className="h-16"
                />
                <img
                    src="https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/books.png"
                    alt="Books"
                    className="h-16"
                />
            </LiquidGlassContent>
        </LiquidGlass>
    )
}

export default Dock
