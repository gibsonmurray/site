"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { App } from "@/types"
import { sleep } from "@/lib/utils"

export function useApps(initialApps: App[]) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [apps, setApps] = useState<Record<string, App>>(
        Object.fromEntries(initialApps.map((app) => [app.id, app])),
    )

    const appsParam = searchParams.get("apps") || ""
    const targetOpenIds = useMemo(() => {
        const ids = appsParam
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean)
        return Array.from(new Set(ids))
    }, [appsParam])

    const open = async (appId: string) => {
        if (
            !apps[appId] ||
            apps[appId].state === "open" ||
            apps[appId].state === "launching"
        )
            return
        setApps((prev) => ({
            ...prev,
            [appId]: { ...prev[appId], state: "launching" },
        }))

        await sleep(Math.random() * 2000 + 1000)

        setApps((prev) => ({
            ...prev,
            [appId]: { ...prev[appId], state: "open" },
        }))
    }

    const close = (appId: string) => {
        if (
            !apps[appId] ||
            apps[appId].state === "closed" ||
            apps[appId].state === "closing"
        )
            return
        // mark closing to allow CSS exit animation
        setApps((prev) => ({
            ...prev,
            [appId]: { ...prev[appId], state: "closing" },
        }))
        // after transition duration, mark closed
        setTimeout(() => {
            setApps((prev) => ({
                ...prev,
                [appId]: { ...prev[appId], state: "closed" },
            }))
        }, 300) // keep in sync with Window exit transition duration
    }

    // URL -> state
    useEffect(() => {
        const currentOpenIds = Object.values(apps)
            .filter((a) => a.state === "open")
            .map((a) => a.id)
        targetOpenIds
            .filter((id) => !currentOpenIds.includes(id))
            .forEach((id) => {
                if (apps[id]) void open(id)
            })
        currentOpenIds
            .filter((id) => !targetOpenIds.includes(id))
            .forEach((id) => close(id))
    }, [appsParam])

    // state -> URL
    useEffect(() => {
        const openIds = Object.values(apps)
            .filter((a) => a.state === "open")
            .map((a) => a.id)
        const uniq = Array.from(new Set(openIds))
        const next = uniq.join(",")
        if (next === appsParam) return
        const url = next ? `/?apps=${next}` : "/"
        router.replace(url)
    }, [apps, appsParam, router])

    return { apps, open, close }
}
