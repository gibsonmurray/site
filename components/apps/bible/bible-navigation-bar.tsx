import { BookMarkedIcon, SearchIcon, Settings2Icon, HeadphonesIcon, HeadphoneOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BibleNavigationBarProps {
    search: string
    onSearchChange: (value: string) => void
    showAudioPlayer: boolean
    onToggleAudioPlayer: () => void
}

export const BibleNavigationBar = ({
    search,
    onSearchChange,
    showAudioPlayer,
    onToggleAudioPlayer,
}: BibleNavigationBarProps) => {
    return (
        <nav className="bg-background/50 sticky top-0 z-10 flex w-full items-center justify-between gap-4 px-4 py-2 backdrop-blur-xs">
            <Button variant="ghost" size="icon" className="rounded-full">
                <BookMarkedIcon className="size-4" />
            </Button>

            <div className="relative flex w-full items-center">
                <Input
                    type="search"
                    placeholder="Search for a passage..."
                    className="w-full rounded-full ps-9"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 rounded-full"
                >
                    <SearchIcon className="size-4" />
                </Button>
            </div>

            <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onToggleAudioPlayer}
            >
                {showAudioPlayer ? (
                    <HeadphonesIcon className="size-4" />
                ) : (
                    <HeadphoneOffIcon className="size-4" />
                )}
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full">
                <Settings2Icon className="size-4" />
            </Button>
        </nav>
    )
}

