"use client"

import Dock from "@/components/dock"
import Logo from "@/components/logo"
import Window from "@/components/window"
import { APPS } from "@/lib/constants"
import { App } from "@/types"
import { sleep } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"

const Home = () => {
    const [apps, setApps] = useState<Record<string, App>>(
        Object.fromEntries(APPS.map((app) => [app.id, app])),
    )

    const open = async (app: string) => {
        setApps((prev) => ({
            ...prev,
            [app]: { ...prev[app], state: "launching" },
        }))

        // somewhere between 1 and 3 seconds
        await sleep(Math.random() * 2000 + 1000)

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
            {Object.values(apps).map(
                (app) =>
                    app.state === "open" && (
                        <Window key={app.id} close={() => close(app.id)}>
                            {/* <div className="flex items-center justify-center"> */}
                                <h1>{app.name}</h1>
                                {/* <Image
                                    src={app.icon}
                                    alt={app.name}
                                    width={20}
                                    height={20}
                                /> */}
                            {/* </div> */}
                        </Window>
                    ),
            )}
            <Dock apps={apps} open={open} close={close} />
        </div>
    )
}

export default Home
