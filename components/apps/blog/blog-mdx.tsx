"use client"

import { useEffect, useState, useMemo } from "react"
import * as runtime from "react/jsx-runtime"
import { evaluate } from "@mdx-js/mdx"

type BlogMDXProps = {
    content: string
}

export function BlogMDX({ content }: BlogMDXProps) {
    const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const compileMDX = async () => {
            try {
                const { default: Content } = await evaluate(content, {
                    ...runtime,
                    development: false,
                })
                setMDXContent(() => Content)
                setError(null)
            } catch (err) {
                console.error("MDX compilation error:", err)
                setError("Failed to render content")
            }
        }

        compileMDX()
    }, [content])

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
            </div>
        )
    }

    if (!MDXContent) {
        return (
            <div className="animate-pulse space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-4 rounded bg-neutral-200 dark:bg-neutral-800"
                        style={{ width: `${70 + Math.random() * 30}%` }}
                    />
                ))}
            </div>
        )
    }

    return <MDXContent />
}
