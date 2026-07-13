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
    0, 1, 0, 2, 0, 0, 1, 0, 0, 3, 1, 0, 0, 2, 1, 0, 4, 2, 0, 1, 0, 0, 2, 3,
    1, 0, 0, 1, 0, 2, 0, 0, 3, 1, 0, 2, 4, 1, 0, 0, 2, 0, 1, 3, 0, 0, 1, 2,
    0, 4, 2, 0, 1, 0, 0, 2, 1, 0, 3, 0, 1, 0, 2,
]

export function GithubContributionGraph({ username }: GithubContributionGraphProps) {
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
            className="github-contribution-graph"
            role="img"
            aria-label={`Recent GitHub contribution activity for ${username}`}
        >
            {levels.map((level, index) => (
                <span key={days[index]?.date ?? index} data-level={level} />
            ))}
        </span>
    )
}
