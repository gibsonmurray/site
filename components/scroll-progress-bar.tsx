"use client"

import { useEffect, useState } from "react"

export const ScrollProgressBar = () => {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const update = () => {
            const scrollTop = window.scrollY
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight
            setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
        }

        update()
        window.addEventListener("scroll", update, { passive: true })
        return () => window.removeEventListener("scroll", update)
    }, [])

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5">
            <div
                className="bg-primary h-full transition-[width] duration-75 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}
