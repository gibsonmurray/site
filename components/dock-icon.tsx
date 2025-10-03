import { FC, useState } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn, sleep } from "@/lib/utils"
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover"
import { motion } from "motion/react"

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
    const [isOpenning, setIsOpenning] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleClick = async () => {
        if (!isOpen && !isOpenning) {
            setIsOpenning(true)
            await sleep(2000) // play loading animation
            openApp()
            setIsOpenning(false)
        }
        bringToFront()
    }

    const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setIsMenuOpen(true)
    }

    const handleOpen = () => {
        openApp()
        setIsMenuOpen(false)
    }

    const handleQuit = () => {
        closeApp()
        setIsMenuOpen(false)
    }

    const handleShow = () => {
        bringToFront()
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
                            onClick={handleClick}
                            onContextMenu={handleContextMenu}
                        >
                            <motion.div
                                style={{ transformOrigin: "bottom center" }}
                                className="absolute inset-0"
                                animate={
                                    isOpenning ? { y: [0, -20, 0] } : { y: 0 }
                                }
                                transition={
                                    isOpenning
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
                                    src={icon}
                                    alt={name}
                                    fill
                                    priority
                                    className="pointer-events-none object-contain select-none"
                                />
                            </motion.div>

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
                    className="bg-background/50 border-border/20 flex w-40 flex-col rounded-xl p-2 backdrop-blur"
                >
                    {!isOpen ? (
                        <Button variant="menu" onClick={handleOpen}>
                            Open
                        </Button>
                    ) : (
                        <>
                            <Button variant="menu" onClick={handleShow}>
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
