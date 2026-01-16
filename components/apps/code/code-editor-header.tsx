"use client"

import { cn } from "@/lib/utils"
import {
    FileCode2Icon,
    PlayIcon,
    RotateCcwIcon,
    CopyIcon,
    CheckIcon,
    DownloadIcon,
    TerminalIcon,
    SaveIcon,
} from "lucide-react"

type HeaderProps = {
    saveStatus: "saved" | "saving" | null
    copied: boolean
    showConsole: boolean
    consoleHasErrors: boolean
    consoleCount: number
    onRun: () => void
    onCopy: () => void
    onDownload: () => void
    onReset: () => void
    onToggleConsole: () => void
}

export function Header({
    saveStatus,
    copied,
    showConsole,
    consoleHasErrors,
    consoleCount,
    onRun,
    onCopy,
    onDownload,
    onReset,
    onToggleConsole,
}: HeaderProps) {
    return (
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
            {/* Left side - Logo and title */}
            <div className="flex items-center gap-3">
                <div className="flex size-6 items-center justify-center rounded bg-linear-to-br from-indigo-500 to-purple-600">
                    <FileCode2Icon className="size-3.5" />
                </div>
                <span className="text-sm font-medium">Code Editor</span>
                {saveStatus && (
                    <span
                        className={cn(
                            "flex items-center gap-1 text-xs transition-opacity",
                            saveStatus === "saving" ? "text-yellow-400" : "text-green-400",
                        )}
                    >
                        <SaveIcon className="size-3" />
                        {saveStatus === "saving" ? "Saving..." : "Saved"}
                    </span>
                )}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-1">
                <button
                    onClick={onRun}
                    className="flex items-center gap-1.5 rounded-md bg-green-600 px-2.5 py-1 text-xs font-medium transition-colors hover:bg-green-500"
                >
                    <PlayIcon className="size-3" />
                    Run
                </button>

                <button
                    onClick={onToggleConsole}
                    className={cn(
                        "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                        showConsole
                            ? "bg-indigo-600 text-white"
                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white",
                        consoleHasErrors && !showConsole && "text-red-400",
                    )}
                >
                    <TerminalIcon className="size-3" />
                    Console
                    {consoleCount > 0 && (
                        <span className="rounded-full bg-zinc-700 px-1.5 text-[10px]">
                            {consoleCount}
                        </span>
                    )}
                </button>

                <div className="mx-1 h-4 w-px bg-zinc-700" />

                <button
                    onClick={onCopy}
                    className="flex items-center gap-1.5 rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium transition-colors hover:bg-zinc-700"
                    title="Copy HTML"
                >
                    {copied ? (
                        <>
                            <CheckIcon className="size-3" />
                            Copied
                        </>
                    ) : (
                        <>
                            <CopyIcon className="size-3" />
                            Copy
                        </>
                    )}
                </button>

                <button
                    onClick={onDownload}
                    className="flex items-center gap-1.5 rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium transition-colors hover:bg-zinc-700"
                    title="Download as HTML"
                >
                    <DownloadIcon className="size-3" />
                </button>

                <button
                    onClick={onReset}
                    className="flex items-center gap-1.5 rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium transition-colors hover:bg-zinc-700"
                    title="Reset to default"
                >
                    <RotateCcwIcon className="size-3" />
                </button>
            </div>
        </div>
    )
}
