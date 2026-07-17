"use client"

import { useEffect, useState } from "react"

type ContributionDay = {
    date: string
    level: number
}

type ContributionResponse = {
    days?: ContributionDay[]
}

type GithubContributionGraphProps = {
    username: string
}

const FALLBACK_LEVELS = [
    0, 1, 0, 2, 0, 0, 1, 0, 0, 3, 1, 0, 0, 2, 1, 0, 4, 2, 0, 1, 0, 0, 2, 3, 1,
    0, 0, 1, 0, 2, 0, 0, 3, 1, 0, 2, 4, 1, 0, 0, 2, 0, 1, 3, 0, 0, 1, 2, 0, 4,
    2, 0, 1, 0, 0, 2, 1, 0, 3, 0, 1, 0, 2,
]

const FALLBACK_DAYS = Array.from(
    { length: 126 },
    (_, index) => FALLBACK_LEVELS[index % FALLBACK_LEVELS.length],
)

const levelClasses = [
    "bg-[#cfd3d7]",
    "bg-[#7ee787]",
    "bg-[#39d353]",
    "bg-[#26a641]",
    "bg-[#006d32]",
] as const

export function GithubContributionGraph({
    username,
}: GithubContributionGraphProps) {
    const [days, setDays] = useState<ContributionDay[]>([])

    useEffect(() => {
        const controller = new AbortController()

        async function loadContributions() {
            try {
                const response = await fetch(
                    `/api/github-contributions?username=${encodeURIComponent(username)}`,
                    { signal: controller.signal },
                )
                if (!response.ok) return

                const data = (await response.json()) as ContributionResponse
                if (data.days?.length) setDays(data.days.slice(-126))
            } catch {
                // The compact fallback keeps the card complete when GitHub is unavailable.
            }
        }

        void loadContributions()
        return () => controller.abort()
    }, [username])

    const levels = days.length ? days.map((day) => day.level) : FALLBACK_DAYS

    return (
        <span
            className="relative z-1 grid auto-cols-[clamp(0.35rem,1.9vw,0.8rem)] grid-flow-col grid-rows-7 gap-[clamp(0.09rem,0.48vw,0.22rem)] place-self-center"
            role="img"
            aria-label={`Recent GitHub contribution activity for ${username}`}
        >
            {levels.map((level, index) => (
                <span
                    className={`size-[clamp(0.35rem,1.9vw,0.8rem)] rounded-[clamp(0.1rem,0.4vw,0.18rem)] border border-[rgba(27,31,36,0.07)] ${levelClasses[level] ?? levelClasses[0]}`}
                    key={days[index]?.date ?? index}
                />
            ))}
        </span>
    )
}
