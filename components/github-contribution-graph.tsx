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

const levelClasses = [
    "bg-[#ebedf0]",
    "bg-[#9be9a8]",
    "bg-[#40c463]",
    "bg-[#30a14e]",
    "bg-[#216e39]",
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
                if (data.days?.length) setDays(data.days.slice(-63))
            } catch {
                // The compact fallback keeps the card complete when GitHub is unavailable.
            }
        }

        void loadContributions()
        return () => controller.abort()
    }, [username])

    const levels = days.length ? days.map((day) => day.level) : FALLBACK_LEVELS

    return (
        <span
            className="relative z-[1] grid auto-cols-[0.58rem] grid-flow-col grid-rows-7 gap-[0.24rem] place-self-center"
            role="img"
            aria-label={`Recent GitHub contribution activity for ${username}`}
        >
            {levels.map((level, index) => (
                <span
                    className={`size-[0.58rem] rounded-[0.14rem] border border-[rgba(27,31,36,0.035)] ${levelClasses[level] ?? levelClasses[0]}`}
                    key={days[index]?.date ?? index}
                />
            ))}
        </span>
    )
}
