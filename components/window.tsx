import { FC, useRef, ReactNode, useState, useEffect } from "react"
import Resizable from "./resizable"
import { cn } from "@/lib/utils"
import {
    ChevronsLeftRightIcon as MaximizeIcon,
    ChevronsRightLeftIcon as UnmaximizeIcon,
} from "lucide-react"

type WindowProps = {
    children?: ReactNode
    className?: string
    close?: () => void
}

const Window: FC<WindowProps> = ({ children, className, close }) => {
    const handleRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [prevSize, setPrevSize] = useState<{
        height: string
        width: string
        left: string
        top: string
    }>({
        height: "500px",
        width: "800px",
        left: "100px",
        top: "100px",
    })
    const [isMaximized, setIsMaximized] = useState(false)

    useEffect(() => {
        setIsMaximized(
            containerRef.current?.style.height === "calc(-94px + 100vh)" &&
                containerRef.current?.style.width === "100%" &&
                containerRef.current?.style.left === "0px" &&
                containerRef.current?.style.top === "0px",
        )
    }, [
        containerRef.current?.style.height,
        containerRef.current?.style.width,
        containerRef.current?.style.left,
        containerRef.current?.style.top,
    ])

    const addTransition = () => {
        containerRef.current!.classList.add(
            "transition-[height,width,left,top]",
            "duration-300",
            "ease-in-out",
        )
    }

    const removeTransition = () => {
        containerRef.current!.classList.remove(
            "transition-[height,width,left,top]",
            "duration-300",
            "ease-in-out",
        )
    }

    const maximize = () => {
        containerRef.current!.style.height = "calc(-94px + 100vh)"
        containerRef.current!.style.width = "100%"
        containerRef.current!.style.left = "0px"
        containerRef.current!.style.top = "0px"
        setIsMaximized(true)
    }

    const unmaximize = () => {
        containerRef.current!.style.height = prevSize.height
        containerRef.current!.style.width = prevSize.width
        containerRef.current!.style.left = prevSize.left
        containerRef.current!.style.top = prevSize.top
        setIsMaximized(false)
    }

    const handleMaximize = () => {
        if (isMaximized) unmaximize()
        else maximize()
    }

    const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (!handleRef.current || !containerRef.current) return

        removeTransition()

        // Calculate offset between mouse position and window position
        const rect = containerRef.current!.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        const offsetY = e.clientY - rect.top

        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault()

            containerRef.current!.style.left = `${e.clientX - offsetX}px`
            containerRef.current!.style.top = `${e.clientY - offsetY}px`

            setPrevSize((prev) => ({
                ...prev,
                left: containerRef.current!.style.left,
                top: containerRef.current!.style.top,
            }))
        }

        const handleMouseUp = () => {
            addTransition()
            window.removeEventListener("mousemove", handleMouseMove)
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
    }

    return (
        <div
            ref={containerRef}
            className={cn(
                "bg-background/40 border-border/50 animate-in fade-in-0 zoom-in-65 absolute top-[100px] left-[100px] flex h-[500px] w-[800px] flex-col overflow-hidden rounded-2xl border backdrop-blur-xl transition-[height,width,left,top] duration-300 ease-in-out",
                className,
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-4 text-black/50">
                    <button
                        className="grid size-3 place-items-center rounded-full bg-red-400"
                        onClick={close}
                    ></button>
                    <button className="grid size-3 place-items-center rounded-full bg-yellow-400"></button>
                    <button
                        className="group grid size-3 place-items-center rounded-full bg-green-400 p-0.25"
                        onClick={handleMaximize}
                    >
                        {isMaximized ? (
                            <UnmaximizeIcon className="size-full rotate-45 stroke-3 opacity-0 group-hover:opacity-100" />
                        ) : (
                            <MaximizeIcon className="size-full rotate-45 stroke-3 opacity-0 group-hover:opacity-100" />
                        )}
                    </button>
                </div>
                <div
                    onDoubleClick={handleMaximize}
                    onMouseDown={handleDrag}
                    ref={handleRef}
                    className="size-full"
                ></div>
            </div>
            <div className="flex size-full items-center justify-center overflow-hidden rounded-lg px-1 pb-1">
                <div className="size-full rounded-lg bg-white/10">
                    {children}
                </div>
            </div>
            <Resizable containerRef={containerRef} setPrevSize={setPrevSize} />
        </div>
    )
}

export default Window
