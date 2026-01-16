"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Editor, { OnMount, BeforeMount } from "@monaco-editor/react"
import { cn } from "@/lib/utils"

import type { EditorTab, ProjectData, ConsoleMessage } from "./code-editor-types"
import {
    STORAGE_KEY,
    BLANK_PROJECT,
    TAB_CONFIG,
    MONACO_OPTIONS,
} from "./code-editor-constants"
import { generateExportHTML, downloadFile } from "./code-editor-utils"
import { Header } from "./code-editor-header"
import { Tabs } from "./code-editor-tabs"
import { Preview } from "./code-editor-preview"
import { Console } from "./code-editor-console"

export default function CodeEditor() {
    const [activeTab, setActiveTab] = useState<EditorTab>("html")
    const [project, setProject] = useState<ProjectData>(BLANK_PROJECT)
    const [copied, setCopied] = useState(false)
    const [isPreviewExpanded, setIsPreviewExpanded] = useState(false)
    const [showConsole, setShowConsole] = useState(false)
    const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([])
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
    const previewKeyRef = useRef(0)

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as ProjectData
                setProject(parsed)
            } catch {
                // If parsing fails, use blank project
            }
        }
        setIsLoaded(true)
    }, [])

    // Save to localStorage when project changes
    useEffect(() => {
        if (!isLoaded) return

        setSaveStatus("saving")
        const timeout = setTimeout(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
            setSaveStatus("saved")
            setTimeout(() => setSaveStatus(null), 1500)
        }, 500)

        return () => clearTimeout(timeout)
    }, [project, isLoaded])

    // Configure Monaco before mount
    const handleEditorWillMount: BeforeMount = (monaco) => {
        // Set the theme
        monaco.editor.defineTheme("custom-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [
                { token: "comment", foreground: "6b7280", fontStyle: "italic" },
                { token: "keyword", foreground: "f472b6" },
                { token: "string", foreground: "4ade80" },
                { token: "number", foreground: "c084fc" },
                { token: "tag", foreground: "f472b6" },
                { token: "attribute.name", foreground: "fbbf24" },
                { token: "attribute.value", foreground: "4ade80" },
                { token: "delimiter", foreground: "9ca3af" },
            ],
            colors: {
                "editor.background": "#18181b",
                "editor.foreground": "#e4e4e7",
                "editor.lineHighlightBackground": "#27272a",
                "editor.selectionBackground": "#3f3f46",
                "editorCursor.foreground": "#a78bfa",
                "editorLineNumber.foreground": "#52525b",
                "editorLineNumber.activeForeground": "#a1a1aa",
                "editor.inactiveSelectionBackground": "#3f3f4680",
            },
        })
    }

    // Handle editor mount
    const handleEditorMount: OnMount = (editor, monaco) => {
        editorRef.current = editor
        monaco.editor.setTheme("custom-dark")

        // Add keyboard shortcuts
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            // Save is automatic, but give visual feedback
            setSaveStatus("saving")
            setTimeout(() => {
                setSaveStatus("saved")
                setTimeout(() => setSaveStatus(null), 1500)
            }, 200)
        })
    }

    // Update code for current tab
    const handleCodeChange = useCallback(
        (value: string | undefined) => {
            if (value === undefined) return
            setProject((prev) => ({
                ...prev,
                [activeTab]: value,
                lastModified: Date.now(),
            }))
        },
        [activeTab],
    )

    // Force preview refresh
    const handleRun = useCallback(() => {
        setConsoleMessages([])
        previewKeyRef.current += 1
        // Force a re-render by updating the project timestamp
        setProject((prev) => ({ ...prev, lastModified: Date.now() }))
    }, [])

    // Copy full HTML
    const handleCopy = useCallback(() => {
        const html = generateExportHTML(project)
        navigator.clipboard.writeText(html)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }, [project])

    // Download project
    const handleDownload = useCallback(() => {
        const html = generateExportHTML(project)
        downloadFile(html, "project.html", "text/html")
    }, [project])

    // Reset project
    const handleReset = useCallback(() => {
        if (window.confirm("Reset all code to default? This cannot be undone.")) {
            setProject({ ...BLANK_PROJECT, lastModified: Date.now() })
            setConsoleMessages([])
        }
    }, [])

    // Add console message
    const handleConsoleMessage = useCallback((message: ConsoleMessage) => {
        setConsoleMessages((prev) => [...prev, message])
    }, [])

    // Clear console
    const handleClearConsole = useCallback(() => {
        setConsoleMessages([])
    }, [])

    const hasConsoleErrors = consoleMessages.some((m) => m.type === "error")

    return (
        <div className="flex size-full flex-col bg-zinc-950 text-white">
            <Header
                saveStatus={saveStatus}
                copied={copied}
                showConsole={showConsole}
                consoleHasErrors={hasConsoleErrors}
                consoleCount={consoleMessages.length}
                onRun={handleRun}
                onCopy={handleCopy}
                onDownload={handleDownload}
                onReset={handleReset}
                onToggleConsole={() => setShowConsole(!showConsole)}
            />

            <div className="flex min-h-0 flex-1">
                {/* Editor Panel */}
                <div
                    className={cn(
                        "flex flex-col border-r border-zinc-800 transition-all duration-200",
                        isPreviewExpanded ? "w-0 overflow-hidden" : "w-1/2",
                    )}
                >
                    <Tabs
                        tabs={TAB_CONFIG}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Monaco Editor */}
                    <div className="flex-1 overflow-hidden">
                        {isLoaded && (
                            <Editor
                                height="100%"
                                language={activeTab}
                                value={project[activeTab]}
                                onChange={handleCodeChange}
                                beforeMount={handleEditorWillMount}
                                onMount={handleEditorMount}
                                options={MONACO_OPTIONS}
                                loading={
                                    <div className="flex size-full items-center justify-center bg-zinc-900">
                                        <div className="text-sm text-zinc-500">Loading editor...</div>
                                    </div>
                                }
                            />
                        )}
                    </div>

                    {/* Shortcuts hint */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-zinc-800 px-3 py-1.5 text-[10px] text-zinc-500">
                        <span>Ctrl+S: Save</span>
                        <span>Ctrl+/: Comment</span>
                        <span>Ctrl+D: Duplicate</span>
                        <span>Ctrl+Z/Y: Undo/Redo</span>
                        <span>Tab: Indent</span>
                    </div>
                </div>

                {/* Preview Panel */}
                <div
                    className={cn(
                        "flex min-h-0 flex-col transition-all duration-200",
                        isPreviewExpanded ? "flex-1" : "w-1/2",
                    )}
                >
                    {/* Preview takes available space, shrinks when console is open */}
                    <div className="flex min-h-0 flex-1 flex-col">
                        <Preview
                            key={previewKeyRef.current}
                            project={project}
                            isExpanded={isPreviewExpanded}
                            onToggleExpand={() => setIsPreviewExpanded(!isPreviewExpanded)}
                            onConsoleMessage={handleConsoleMessage}
                        />
                    </div>

                    {showConsole && (
                        <Console
                            messages={consoleMessages}
                            onClear={handleClearConsole}
                            onClose={() => setShowConsole(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}
