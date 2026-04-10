"use client"

import { useEffect } from "react"
import confetti from "canvas-confetti"

export function SuccessConfetti() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return
        }

        const shoot = (originX: number, delay: number = 0) => {
            const timeout = window.setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 80,
                    startVelocity: 50,
                    ticks: 200,
                    scalar: 1.2,
                    origin: { x: originX, y: 0.3 },
                    colors: [
                        "#f59e0b",
                        "#ef4444",
                        "#22c55e",
                        "#3b82f6",
                        "#ec4899",
                        "#8b5cf6",
                    ],
                    gravity: 0.8,
                })
            }, delay)
            return timeout
        }

        const timers = [0, 250, 500].map((delay, index) =>
            shoot(0.25 + index * 0.25, delay),
        )

        return () => timers.forEach((timer) => window.clearTimeout(timer))
    }, [])

    return null
}
