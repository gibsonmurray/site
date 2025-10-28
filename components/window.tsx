import { FC, useRef, ReactNode, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
    ChevronsLeftRightIcon as MaximizeIcon,
    MinusIcon,
    ChevronsRightLeftIcon as UnmaximizeIcon,
    XIcon,
} from "lucide-react"
import Movable from "react-moveable"

type WindowProps = {
    children?: ReactNode
    className?: string
    close?: () => void
    isClosing?: boolean
}

type Size = {
    height: string
    width: string
    left: string
    top: string
    transform: string
}

const Window: FC<WindowProps> = ({ children, className, close, isClosing }) => {
    const handleRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const moveableRef = useRef<any>(null)
    const [prevSize, setPrevSize] = useState<Size>({
        height: "500px",
        width: "800px",
        left: "100px",
        top: "100px",
        transform: "none",
    })
    const [isMaximized, setIsMaximized] = useState(false)

    useEffect(() => {
        setIsMaximized(
            containerRef.current?.style.height === "calc(-94px + 100vh)" &&
                containerRef.current?.style.width === "100%" &&
                containerRef.current?.style.left === "0px" &&
                containerRef.current?.style.top === "0px" &&
                containerRef.current?.style.transform === "none",
        )
    }, [
        containerRef.current?.style.height,
        containerRef.current?.style.width,
        containerRef.current?.style.left,
        containerRef.current?.style.top,
        containerRef.current?.style.transform,
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
        containerRef.current!.style.transform = "none"
        moveableRef.current?.updateRect()
        setIsMaximized(true)
    }

    const unmaximize = () => {
        containerRef.current!.style.height = prevSize.height
        containerRef.current!.style.width = prevSize.width
        containerRef.current!.style.left = prevSize.left
        containerRef.current!.style.top = prevSize.top
        containerRef.current!.style.transform = prevSize.transform
        moveableRef.current?.updateRect()
        setIsMaximized(false)
    }

    const handleMaximize = () => {
        if (isMaximized) unmaximize()
        else maximize()
    }

    const handleMinimize = () => {
        console.log("minimize")
    }

    return (
        <>
            <div
                ref={containerRef}
                className={cn(
                    "bg-background/40 border-border/50 absolute flex flex-col overflow-hidden rounded-2xl border backdrop-blur-xl",
                    isClosing
                        ? "animate-out fade-out-0 zoom-out-75"
                        : "animate-in fade-in-0 zoom-in-75",
                    "transition-[height,width,left,top] duration-300 ease-in-out",
                    isClosing && "pointer-events-none",
                    className,
                )}
                style={{
                    width: prevSize.width,
                    height: prevSize.height,
                    left: prevSize.left,
                    top: prevSize.top,
                    transform: prevSize.transform,
                }}
            >
                <div
                    className="flex items-center justify-between"
                    ref={handleRef}
                    onDoubleClick={handleMaximize}
                >
                    <div className="group flex items-center gap-2 px-3 py-4 text-black/50">
                        <button
                            className="grid size-3 place-items-center rounded-full bg-red-400 p-0.25"
                            onClick={close}
                        >
                            <XIcon className="size-full stroke-3 opacity-0 group-hover:opacity-100" />
                        </button>
                        <button
                            className="grid size-3 place-items-center rounded-full bg-yellow-400 p-0.25"
                            onClick={handleMinimize}
                        >
                            <MinusIcon className="size-full stroke-3 opacity-0 group-hover:opacity-100" />
                        </button>
                        <button
                            className="grid size-3 place-items-center rounded-full bg-green-400 p-0.25"
                            onClick={handleMaximize}
                        >
                            {isMaximized ? (
                                <UnmaximizeIcon className="size-full rotate-45 stroke-3 opacity-0 group-hover:opacity-100" />
                            ) : (
                                <MaximizeIcon className="size-full rotate-45 stroke-3 opacity-0 group-hover:opacity-100" />
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex size-full items-center justify-center overflow-hidden rounded-lg px-1 pb-1">
                    <div className="size-full overflow-auto rounded-lg bg-white">
                        {children}
                    </div>
                </div>
            </div>
            <Movable
                ref={moveableRef}
                linePadding={6}
                target={containerRef}
                dragTarget={handleRef}
                resizable={{
                    edge: ["n", "e", "s", "w"],
                }}
                renderDirections
                triggerAblesSimultaneously
                hideDefaultLines
                useResizeObserver
                onResize={(e) => {
                    e.target.style.width = e.width + "px"
                    e.target.style.height = e.height + "px"
                    e.target.style.transform = e.drag.transform
                    setPrevSize({
                        ...prevSize,
                        width: e.target.style.width,
                        height: e.target.style.height,
                        transform: e.target.style.transform,
                    })
                }}
                onResizeStart={() => {
                    removeTransition()
                }}
                onResizeEnd={() => {
                    addTransition()
                }}
                draggable
                onDrag={(e) => {
                    e.target.style.left = e.left + "px"
                    e.target.style.top = e.top + "px"
                    setPrevSize({
                        ...prevSize,
                        left: e.target.style.left,
                        top: e.target.style.top,
                        transform: e.target.style.transform,
                    })
                }}
                onDragStart={() => {
                    removeTransition()
                }}
                onDragEnd={() => {
                    addTransition()
                }}
            />
        </>
    )
}

export default Window
