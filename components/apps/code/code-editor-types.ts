export type EditorTab = "html" | "css" | "javascript"

export type ProjectData = {
    html: string
    css: string
    javascript: string
    lastModified: number
}

export type ConsoleMessage = {
    id: string
    type: "log" | "warn" | "error" | "info"
    content: string
    timestamp: number
}

export type TabConfig = {
    id: EditorTab
    label: string
    language: string
    color: string
    bgColor: string
}
