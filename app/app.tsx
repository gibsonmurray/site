"use client"

import Dock from "@/components/dock"
import Logo from "@/components/logo"
import Window from "@/components/window"
import { APPS } from "@/lib/constants"
import Image from "next/image"
import { useApps } from "@/hooks/use-apps"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, useEffect } from "react"

const queryClient = new QueryClient()

const App = () => {
    const { apps, open, close } = useApps(APPS)
    const [zIndices, setZIndices] = useState<Record<string, number>>({})
    const [maxZIndex, setMaxZIndex] = useState(1)

    const bringToFront = (appId: string) => {
        setMaxZIndex((prev) => {
            const newZIndex = prev + 1
            setZIndices((prevIndices) => ({
                ...prevIndices,
                [appId]: newZIndex,
            }))
            return newZIndex
        })
    }

    // Bring newly opened windows to the front
    useEffect(() => {
        Object.values(apps).forEach((app) => {
            if (app.state === "open" && !zIndices[app.id]) {
                bringToFront(app.id)
            }
        })
    }, [apps, zIndices, bringToFront])

    return (
        <QueryClientProvider client={queryClient}>
            <div className="relative flex min-h-svh w-screen items-center justify-center overflow-hidden">
                <Image
                    src="https://xs83fzgbku8yujf0.public.blob.vercel-storage.com/macOS-wallpaper.jpg"
                    alt="Background"
                    fill
                    priority
                    className="pointer-events-none object-cover select-none"
                />
                <Logo className="size-20 stroke-white opacity-60" />
                {Object.values(apps).map(
                    (app) =>
                        (app.state === "open" || app.state === "closing") && (
                            <Window
                                key={app.id}
                                close={() => close(app.id)}
                                isClosing={app.state === "closing"}
                                zIndex={zIndices[app.id] || 1}
                                onFocus={() => bringToFront(app.id)}
                            >
                                {app.component && <app.component />}
                            </Window>
                        ),
                )}
                <Dock
                    apps={apps}
                    open={open}
                    close={close}
                    bringToFront={bringToFront}
                />
            </div>
        </QueryClientProvider>
    )
}

export default App
