"use client"

import Dock from "@/components/dock"
import Logo from "@/components/logo"
import Image from "next/image"
import { useState } from "react"

const Home = () => {
    const [openApps, setOpenApps] = useState<string[]>([])

    const bringToFront = (app: string) => {
        setOpenApps([...openApps.filter((a) => a !== app), app])
    }

    const closeApp = (app: string) => {
        setOpenApps(openApps.filter((a) => a !== app))
    }

    return (
        <div className="relative flex min-h-svh w-screen items-center justify-center overflow-hidden">
            <Image
                src="https://xs83fzgbku8yujf0.public.blob.vercel-storage.com/macOS-wallpaper.jpg"
                alt="Background"
                fill
                priority
                className="pointer-events-none object-cover select-none"
            />
            <Logo className="size-20 stroke-white opacity-60" />
            {/* open apps here */}
            <Dock
                openApps={openApps}
                setOpenApps={setOpenApps}
                bringToFront={bringToFront}
                closeApp={closeApp}
            />
        </div>
    )
}

export default Home
