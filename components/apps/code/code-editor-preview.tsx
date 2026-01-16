"use client"

import { useEffect, useRef, useCallback } from "react"
import { MaximizeIcon, MinimizeIcon, RefreshCwIcon } from "lucide-react"
import type { ProjectData, ConsoleMessage } from "./code-editor-types"
import { generatePreviewHTML, generateId } from "./code-editor-utils"

type PreviewProps = {
    project: ProjectData
    isExpanded: boolean
    onToggleExpand: () => void
    onConsoleMessage: (message: ConsoleMessage) => void
}

export function Preview({
    project,
    isExpanded,
    onToggleExpand,
    onConsoleMessage,
}: PreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const runCode = useCallback(() => {
        if (!iframeRef.current) return

        const html = generatePreviewHTML(project)
        const iframe = iframeRef.current

        // Use srcdoc for better reliability
        iframe.srcdoc = html
    }, [project])

    // Listen for console messages from iframe
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "console") {
                onConsoleMessage({
                    id: generateId(),
                    type: event.data.consoleType,
                    content: event.data.content,
                    timestamp: event.data.timestamp || Date.now(),
                })
            }
        }

        window.addEventListener("message", handleMessage)
        return () => window.removeEventListener("message", handleMessage)
    }, [onConsoleMessage])

    // Auto-run on project change with debounce
    useEffect(() => {
        const timeout = setTimeout(runCode, 300)
        return () => clearTimeout(timeout)
    }, [project, runCode])

    return (
        <>
            {/* Preview Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-4 py-2">
                <span className="text-xs font-medium text-zinc-400">Preview</span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={runCode}
                        className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                        title="Refresh preview"
                    >
                        <RefreshCwIcon className="size-3.5" />
                    </button>
                    <button
                        onClick={onToggleExpand}
                        className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                        title={isExpanded ? "Minimize" : "Maximize"}
                    >
                        {isExpanded ? (
                            <MinimizeIcon className="size-3.5" />
                        ) : (
                            <MaximizeIcon className="size-3.5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Preview Content - iframe fills remaining space */}
            <div className="min-h-0 flex-1 bg-white">
                <iframe
                    ref={iframeRef}
                    title="Preview"
                    className="h-full w-full border-0"
                    sandbox="allow-scripts allow-modals"
                />
            </div>
        </>
    )
}
