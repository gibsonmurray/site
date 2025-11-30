import { FC, useRef, ReactNode, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
    ChevronsLeftRightIcon as MaximizeIcon,
    MinusIcon,
    ChevronsRightLeftIcon as UnmaximizeIcon,
    XIcon,
} from "lucide-react"
import Movable from "react-moveable"
import { WindowProvider, useWindowContext, type Size } from "./window-context"

type WindowProps = {
    children?: ReactNode
    className?: string
    close?: () => void
    isClosing?: boolean
    zIndex?: number
    onFocus?: () => void
    initialSize?: Size
}

const WindowContent: FC<Omit<WindowProps, "initialSize">> = ({
    children,
    className,
    close,
    isClosing,
    zIndex = 1,
    onFocus,
}) => {
    const handleRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const moveableRef = useRef<any>(null)
    const {
        size,
        setSize,
        innerSize,
        setInnerSize,
        isMaximized,
        setIsMaximized,
        maximize: contextMaximize,
        unmaximize: contextUnmaximize,
        handleMaximize: contextHandleMaximize,
    } = useWindowContext()

    // Update isMaximized state based on context size
    useEffect(() => {
        setIsMaximized(
            size.height === "calc(-95px + 100vh)" &&
                size.width === "100%" &&
                size.left === "0px" &&
                size.top === "0px",
        )
    }, [size, setIsMaximized])

    // Update Movable when context size changes (e.g., from maximize/unmaximize)
    useEffect(() => {
        moveableRef.current?.updateRect()
    }, [size])

    // Track inner content size (excluding chrome)
    useEffect(() => {
        if (!contentRef.current) return

        const updateInnerSize = () => {
            if (contentRef.current) {
                const rect = contentRef.current.getBoundingClientRect()
                setInnerSize({
                    width: rect.width,
                    height: rect.height,
                })
            }
        }

        // Initial measurement
        updateInnerSize()

        // Use ResizeObserver to track size changes
        const resizeObserver = new ResizeObserver(updateInnerSize)
        resizeObserver.observe(contentRef.current)

        return () => {
            resizeObserver.disconnect()
        }
    }, [setInnerSize, size])

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
        contextMaximize()
        moveableRef.current?.updateRect()
    }

    const unmaximize = () => {
        contextUnmaximize()
        moveableRef.current?.updateRect()
    }

    const handleMaximize = () => {
        contextHandleMaximize()
        moveableRef.current?.updateRect()
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
                    width: size.width,
                    height: size.height,
                    left: size.left,
                    top: size.top,
                    zIndex,
                }}
                onClick={() => onFocus?.()}
                onMouseDown={() => onFocus?.()}
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
                    <div
                        ref={contentRef}
                        className="relative size-full overflow-auto rounded-lg bg-white"
                    >
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
                    e.target.style.left = e.drag.left + "px"
                    e.target.style.top = e.drag.top + "px"
                    setSize({
                        width: e.target.style.width,
                        height: e.target.style.height,
                        left: e.target.style.left,
                        top: e.target.style.top,
                    })
                }}
                onResizeStart={() => {
                    removeTransition()
                    onFocus?.()
                }}
                onResizeEnd={() => {
                    addTransition()
                }}
                draggable
                onDrag={(e) => {
                    e.target.style.left = e.left + "px"
                    e.target.style.top = e.top + "px"
                    setSize({
                        ...size,
                        left: e.target.style.left,
                        top: e.target.style.top,
                    })
                }}
                onDragStart={() => {
                    removeTransition()
                    onFocus?.()
                }}
                onDragEnd={() => {
                    addTransition()
                }}
            />
        </>
    )
}

const Window: FC<WindowProps> = ({ children, initialSize, ...props }) => {
    return (
        <WindowProvider initialSize={initialSize}>
            <WindowContent {...props}>{children}</WindowContent>
        </WindowProvider>
    )
}

export default Window
