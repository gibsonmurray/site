"use client"

import { createContext, useContext, useState, ReactNode, FC } from "react"

export type Size = {
    height: string
    width: string
    left: string
    top: string
}

export type InnerSize = {
    height: number
    width: number
}

type WindowContextValue = {
    size: Size
    setSize: (size: Size) => void
    innerSize: InnerSize
    setInnerSize: (innerSize: InnerSize) => void
    isMaximized: boolean
    setIsMaximized: (isMaximized: boolean) => void
    prevSizeBeforeMaximize: Size | null
    setPrevSizeBeforeMaximize: (size: Size | null) => void
    maximize: () => void
    unmaximize: () => void
    handleMaximize: () => void
}

const WindowContext = createContext<WindowContextValue | null>(null)

export function useWindowContext() {
    const context = useContext(WindowContext)
    if (!context) {
        throw new Error("useWindowContext must be used within a WindowProvider")
    }
    return context
}

type WindowProviderProps = {
    children: ReactNode
    initialSize?: Size
}

export const WindowProvider: FC<WindowProviderProps> = ({
    children,
    initialSize = {
        height: "500px",
        width: "800px",
        left: "100px",
        top: "100px",
    },
}) => {
    const [size, setSize] = useState<Size>(initialSize)
    const [innerSize, setInnerSize] = useState<InnerSize>({
        height: 0,
        width: 0,
    })
    const [isMaximized, setIsMaximized] = useState(false)
    const [prevSizeBeforeMaximize, setPrevSizeBeforeMaximize] =
        useState<Size | null>(null)

    const maximize = () => {
        // Store current size before maximizing
        setPrevSizeBeforeMaximize(size)
        setSize({
            height: "calc(-95px + 100vh)",
            width: "100%",
            left: "0px",
            top: "0px",
        })
        setIsMaximized(true)
    }

    const unmaximize = () => {
        if (prevSizeBeforeMaximize) {
            setSize(prevSizeBeforeMaximize)
            setPrevSizeBeforeMaximize(null)
        }
        setIsMaximized(false)
    }

    const handleMaximize = () => {
        if (isMaximized) unmaximize()
        else maximize()
    }

    return (
        <WindowContext.Provider
            value={{
                size,
                setSize,
                innerSize,
                setInnerSize,
                isMaximized,
                setIsMaximized,
                prevSizeBeforeMaximize,
                setPrevSizeBeforeMaximize,
                maximize,
                unmaximize,
                handleMaximize,
            }}
        >
            {children}
        </WindowContext.Provider>
    )
}
