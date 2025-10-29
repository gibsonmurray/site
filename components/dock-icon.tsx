import { FC, useState } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover"
import { motion } from "motion/react"
import { App } from "@/types"

type DockIconProps = {
    app: App
    open: () => void
    close: () => void
}

const DockIcon: FC<DockIconProps> = ({ app, open, close }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsMenuOpen(true)
    }

    const handleOpen = () => {
        open()
        setIsMenuOpen(false)
    }

    const handleQuit = () => {
        close()
        setIsMenuOpen(false)
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
                            onClick={open}
                            onContextMenu={handleContextMenu}
                        >
                            <motion.div
                                style={{ transformOrigin: "bottom center" }}
                                className="absolute inset-0"
                                animate={
                                    app.state === "launching"
                                        ? { y: [0, -20, 0] }
                                        : { y: 0 }
                                }
                                transition={
                                    app.state === "launching"
                                        ? {
                                              duration: 0.8,
                                              times: [0, 0.5, 1],
                                              ease: [
                                                  [0, 0, 0.2, 1],
                                                  [0.8, 0, 1, 1],
                                              ],
                                              repeat: Infinity,
                                              repeatType: "loop",
                                          }
                                        : { duration: 0.2, ease: "circIn" }
                                }
                            >
                                <Image
                                    src={app.icon}
                                    alt={app.name}
                                    fill
                                    priority
                                    className="pointer-events-none object-contain select-none"
                                />
                            </motion.div>

                            <div
                                className={cn(
                                    "absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-white/50 transition-opacity duration-300",
                                    app.state === "open"
                                        ? "opacity-100"
                                        : "opacity-0",
                                )}
                            />
                        </Button>
                    </TooltipTrigger>
                </PopoverAnchor>

                {/* App Name */}
                <TooltipContent
                    sideOffset={5}
                    className="rounded-full font-medium opacity-75 shadow-xl border border-border/50"
                >
                    {app.name}
                </TooltipContent>

                {/* Menu */}
                <PopoverContent
                    sideOffset={16}
                    align="start"
                    className="bg-background/50 border-border/20 flex w-40 flex-col rounded-xl p-2 backdrop-blur"
                >
                    {app.state === "closed" ? (
                        <Button variant="menu" onClick={handleOpen}>
                            Open
                        </Button>
                    ) : (
                        <>
                            <Button variant="menu" onClick={open}>
                                Show
                            </Button>
                            <Button variant="menu" onClick={handleQuit}>
                                Quit
                            </Button>
                        </>
                    )}
                </PopoverContent>
            </Popover>
        </Tooltip>
    )
}

export default DockIcon
