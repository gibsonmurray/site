"use client"

import * as ProgressPrimitive from "@radix-ui/react-progress"

export function Progress({
    className,
    value,
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
    return (
        <ProgressPrimitive.Root
            className={`progress-root ${className ?? ""}`}
            value={value}
        >
            <ProgressPrimitive.Indicator
                className="progress-indicator"
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    )
}
