"use client"

import { SearchIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type BlogSearchProps = {
    value: string
    onChange: (value: string) => void
    className?: string
}

export function BlogSearch({ value, onChange, className }: BlogSearchProps) {
    return (
        <div className={cn("relative", className)}>
            <SearchIcon className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search posts..."
                className="border-input bg-background text-foreground placeholder:text-muted-foreground h-10 w-full rounded-full border py-2 pr-10 pl-10 text-sm outline-none transition-colors focus:border-neutral-400 dark:focus:border-neutral-600"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                >
                    <XIcon className="size-4" />
                </button>
            )}
        </div>
    )
}
