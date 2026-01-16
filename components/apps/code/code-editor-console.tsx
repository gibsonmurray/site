"use client"

import { RotateCcwIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ConsoleMessage } from "./code-editor-types"

type ConsoleProps = {
    messages: ConsoleMessage[]
    onClear: () => void
    onClose: () => void
}

const CONSOLE_ICONS: Record<ConsoleMessage["type"], string> = {
    log: "›",
    info: "ℹ",
    warn: "⚠",
    error: "✕",
}

const CONSOLE_STYLES: Record<ConsoleMessage["type"], string> = {
    log: "text-zinc-300",
    info: "bg-blue-500/10 text-blue-400",
    warn: "bg-yellow-500/10 text-yellow-400",
    error: "bg-red-500/10 text-red-400",
}

export function Console({ messages, onClear, onClose }: ConsoleProps) {
    return (
        <div className="flex max-h-48 flex-col border-t border-zinc-800 bg-zinc-900">
            {/* Console Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-1.5">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-zinc-400">Console</span>
                    {messages.length > 0 && (
                        <span className="rounded-full bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                            {messages.length}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={onClear}
                        className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
                        title="Clear console"
                    >
                        <RotateCcwIcon className="size-3" />
                    </button>
                    <button
                        onClick={onClose}
                        className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
                        title="Close console"
                    >
                        <XIcon className="size-3" />
                    </button>
                </div>
            </div>

            {/* Console Messages */}
            <div className="flex-1 overflow-auto p-2 font-mono text-xs">
                {messages.length === 0 ? (
                    <div className="text-zinc-600">Console output will appear here...</div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex items-start gap-2 rounded px-2 py-1",
                                CONSOLE_STYLES[msg.type],
                            )}
                        >
                            <span className="shrink-0 text-zinc-600">
                                {CONSOLE_ICONS[msg.type]}
                            </span>
                            <span className="wrap-break-word whitespace-pre-wrap">{msg.content}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
