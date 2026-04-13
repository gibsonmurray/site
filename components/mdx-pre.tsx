"use client"

import React, { FC, useState } from "react"
import { Button } from "@/components/ui/button"

export const Pre: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (typeof children === "object" && children) {
            // Extract text from code element
            const codeEl = React.Children.toArray(children).find(
                (child) => React.isValidElement(child) && child.type === "code",
            ) as React.ReactElement | undefined
            if (codeEl && (codeEl.props as any)?.children) {
                const text = (codeEl.props as any).children
                try {
                    await navigator.clipboard.writeText(text)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                } catch (err) {
                    console.error("Failed to copy:", err)
                }
            }
        }
    }

    return (
        <pre className="bg-muted/40 border-border/50 group relative overflow-x-auto rounded-lg border p-4">
            <Button
                variant="ghost"
                size="xs"
                onClick={handleCopy}
                className="bg-muted/50 hover:bg-muted absolute top-2 right-2 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:opacity-100"
                title="Copy code"
                aria-label="Copy code"
            >
                {copied ? "Copied!" : "Copy"}
            </Button>
            {children}
        </pre>
    )
}
