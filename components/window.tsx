import { FC, useRef, useEffect, ReactNode } from "react"
import Resizable from "./resizable"
import { cn } from "@/lib/utils"

type WindowProps = {
    children?: ReactNode
    className?: string
}

const Window: FC<WindowProps> = ({ children, className }) => {
    const handleRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!handleRef.current || !containerRef.current) return

        handleRef.current.addEventListener("mousedown", (e) => {
            e.preventDefault()

            // Calculate offset between mouse position and window position
            const rect = containerRef.current!.getBoundingClientRect()
            const offsetX = e.clientX - rect.left
            const offsetY = e.clientY - rect.top

            const handleMouseMove = (e: MouseEvent) => {
                e.preventDefault()
                containerRef.current!.style.left = `${e.clientX - offsetX}px`
                containerRef.current!.style.top = `${e.clientY - offsetY}px`
            }
            const handleMouseUp = () => {
                window.removeEventListener("mousemove", handleMouseMove)
            }

            window.addEventListener("mousemove", handleMouseMove)
            window.addEventListener("mouseup", handleMouseUp)
        })
    }, [handleRef, containerRef])

    return (
        <div
            ref={containerRef}
            className={cn(
                "bg-background/40 border-border/50 absolute flex h-[500px] w-[800px] flex-col rounded-2xl border backdrop-blur-xl",
                className,
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-4">
                    <button className="size-3 rounded-full bg-red-400"></button>
                    <button className="size-3 rounded-full bg-yellow-400"></button>
                    <button className="size-3 rounded-full bg-green-400"></button>
                </div>
                <div
                    ref={handleRef}
                    className="size-full cursor-grab active:cursor-grabbing"
                ></div>
            </div>
            <div className="flex size-full items-center justify-center overflow-hidden rounded-lg px-1 pb-1">
                <div className="size-full rounded-lg bg-white/10">
                    {children}
                </div>
            </div>
            <Resizable containerRef={containerRef} />
        </div>
    )
}

export default Window
