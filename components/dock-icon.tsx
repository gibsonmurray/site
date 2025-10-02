import { FC, useState } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverAnchor,
    PopoverContent,
    PopoverTrigger,
} from "./ui/popover"

type DockIconProps = {
    name: string
    icon: string
    isOpen: boolean
    openApp: () => void
    bringToFront: () => void
    closeApp: () => void
}

const DockIcon: FC<DockIconProps> = ({
    name,
    icon,
    isOpen,
    openApp,
    bringToFront,
    closeApp,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleClick = () => {
        openApp()
        bringToFront()
    }

    const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsMenuOpen(true)
    }

    return (
        <Tooltip>
            <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                {/* Main Icon */}
                <PopoverAnchor asChild>
                    <TooltipTrigger asChild>
                        <Button
                            variant="simple"
                            size="icon"
                            className="relative grid size-16 place-items-center p-9 px-10"
                            onClick={handleClick}
                            onContextMenu={handleContextMenu}
                        >
                            <Image
                                src={icon}
                                alt={name}
                                fill
                                priority
                                className="pointer-events-none object-contain select-none"
                            />

                            <div
                                className={cn(
                                    "absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-white/50 transition-opacity duration-300",
                                    isOpen ? "opacity-100" : "opacity-0",
                                )}
                            />
                        </Button>
                    </TooltipTrigger>
                </PopoverAnchor>

                {/* App Name */}
                <TooltipContent
                    sideOffset={5}
                    className="rounded-full font-medium opacity-75"
                >
                    {name}
                </TooltipContent>

                {/* Menu */}
                <PopoverContent
                    sideOffset={16}
                    align="start"
                    className="bg-foreground/50 border-border/20 flex flex-col gap-2 rounded-xl p-2 backdrop-blur"
                >
                    <Button variant="menu">Open</Button>
                </PopoverContent>
            </Popover>
        </Tooltip>
    )
}

export default DockIcon
