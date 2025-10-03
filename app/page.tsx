"use client"

import Dock from "@/components/dock"
import Logo from "@/components/logo"
import { APPS } from "@/lib/constants"
import { App } from "@/types"
import { sleep } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"

const Home = () => {
    const [apps, setApps] = useState<Record<string, App>>(
        Object.fromEntries(APPS.map((app) => [app.id, app])),
    )

    console.log(apps)

    const open = async (app: string) => {
        setApps((prev) => ({
            ...prev,
            [app]: { ...prev[app], state: "launching" },
        }))

        // somewhere between 1.5 and 3 seconds
        await sleep(Math.random() * 1500 + 1500)

        setApps((prev) => ({
            ...prev,
            [app]: { ...prev[app], state: "open" },
        }))
    }

    const close = (app: string) => {
        setApps((prev) => ({
            ...prev,
            [app]: { ...prev[app], state: "closed" },
        }))
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
            <Dock apps={apps} open={open} close={close} />
        </div>
    )
}

export default Home
