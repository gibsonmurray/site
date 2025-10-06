import { FC, useEffect, SetStateAction, Dispatch, RefObject } from "react"

type ResizableProps = {
    containerRef: RefObject<HTMLDivElement | null>
    setPrevSize: Dispatch<
        SetStateAction<{
            height: string
            width: string
            left: string
            top: string
        }>
    >
}

const Resizable: FC<ResizableProps> = ({ containerRef, setPrevSize }) => {
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

    useEffect(() => {
        if (!containerRef.current) return

        const handleMouseDown = (e: MouseEvent) => {
            e.preventDefault()
            removeTransition()

            const currentResizer = e.target as HTMLElement
            let prevX = (e as MouseEvent).clientX
            let prevY = (e as MouseEvent).clientY

            const handleMouseMove = (e: MouseEvent) => {
                e.preventDefault()
                const rect = containerRef.current!.getBoundingClientRect()

                if (currentResizer.dataset.bar === "br") {
                    containerRef.current!.style.width =
                        rect.width + (e.clientX - prevX) + "px"
                    containerRef.current!.style.height =
                        rect.height + (e.clientY - prevY) + "px"
                } else if (currentResizer.dataset.bar === "bl") {
                    containerRef.current!.style.width =
                        rect.width + (prevX - e.clientX) + "px"
                    containerRef.current!.style.height =
                        rect.height + (e.clientY - prevY) + "px"
                    containerRef.current!.style.left =
                        rect.left + (e.clientX - prevX) + "px"
                } else if (currentResizer.dataset.bar === "tr") {
                    containerRef.current!.style.width =
                        rect.width + (e.clientX - prevX) + "px"
                    containerRef.current!.style.height =
                        rect.height + (prevY - e.clientY) + "px"
                    containerRef.current!.style.top =
                        rect.top + (e.clientY - prevY) + "px"
                } else if (currentResizer.dataset.bar === "tl") {
                    containerRef.current!.style.width =
                        rect.width + (prevX - e.clientX) + "px"
                    containerRef.current!.style.height =
                        rect.height + (prevY - e.clientY) + "px"
                    containerRef.current!.style.top =
                        rect.top + (e.clientY - prevY) + "px"
                    containerRef.current!.style.left =
                        rect.left + (e.clientX - prevX) + "px"
                } else if (currentResizer.dataset.bar === "t") {
                    containerRef.current!.style.height =
                        rect.height + (prevY - e.clientY) + "px"
                    containerRef.current!.style.top =
                        rect.top + (e.clientY - prevY) + "px"
                } else if (currentResizer.dataset.bar === "b") {
                    containerRef.current!.style.height =
                        rect.height + (e.clientY - prevY) + "px"
                } else if (currentResizer.dataset.bar === "l") {
                    containerRef.current!.style.width =
                        rect.width + (prevX - e.clientX) + "px"
                    containerRef.current!.style.left =
                        rect.left + (e.clientX - prevX) + "px"
                } else if (currentResizer.dataset.bar === "r") {
                    containerRef.current!.style.width =
                        rect.width + (e.clientX - prevX) + "px"
                }
                prevX = e.clientX
                prevY = e.clientY
                setPrevSize({
                    top: containerRef.current!.style.top,
                    left: containerRef.current!.style.left,
                    height: containerRef.current!.style.height,
                    width: containerRef.current!.style.width,
                })
            }

            const handleMouseUp = () => {
                addTransition()
                window.removeEventListener(
                    "mousemove",
                    handleMouseMove as EventListener,
                )
                window.removeEventListener(
                    "mouseup",
                    handleMouseUp as EventListener,
                )
            }

            window.addEventListener(
                "mousemove",
                handleMouseMove as EventListener,
            )
            window.addEventListener("mouseup", handleMouseUp as EventListener)
        }

        containerRef.current!.querySelectorAll(".handle").forEach((handle) => {
            handle.addEventListener(
                "mousedown",
                handleMouseDown as EventListener,
            )
        })
    }, [containerRef])

    return (
        <>
            <div
                data-bar="t"
                className="handle absolute top-0 z-10 h-1 w-full cursor-n-resize"
            ></div>
            <div
                data-bar="b"
                className="handle absolute bottom-0 z-10 h-1 w-full cursor-s-resize"
            ></div>
            <div
                data-bar="l"
                className="handle absolute left-0 z-10 h-full w-1 cursor-w-resize"
            ></div>
            <div
                data-bar="r"
                className="handle absolute right-0 z-10 h-full w-1 cursor-e-resize"
            ></div>

            <div
                data-bar="br"
                className="handle absolute right-0 bottom-0 z-10 size-3 cursor-se-resize"
            ></div>
            <div
                data-bar="bl"
                className="handle absolute bottom-0 left-0 z-10 size-3 cursor-sw-resize"
            ></div>
            <div
                data-bar="tr"
                className="handle absolute top-0 right-0 z-10 size-3 cursor-ne-resize"
            ></div>
            <div
                data-bar="tl"
                className="handle absolute top-0 left-0 z-10 size-3 cursor-nw-resize"
            ></div>
        </>
    )
}

export default Resizable
