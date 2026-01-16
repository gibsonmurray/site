"use client"

import { cn } from "@/lib/utils"
import { FileCode2Icon, PaletteIcon, BracesIcon } from "lucide-react"
import type { EditorTab, TabConfig } from "./code-editor-types"

type TabsProps = {
    tabs: TabConfig[]
    activeTab: EditorTab
    onTabChange: (tab: EditorTab) => void
}

const TAB_ICONS: Record<EditorTab, typeof FileCode2Icon> = {
    html: FileCode2Icon,
    css: PaletteIcon,
    javascript: BracesIcon,
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
    return (
        <div className="flex border-b border-zinc-800">
            {tabs.map((tab) => {
                const Icon = TAB_ICONS[tab.id]
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors",
                            activeTab === tab.id
                                ? `border-b-2 border-indigo-500 ${tab.bgColor} text-white`
                                : "text-zinc-400 hover:bg-zinc-900 hover:text-white",
                        )}
                    >
                        <Icon className={cn("size-3.5", tab.color)} />
                        {tab.label}
                    </button>
                )
            })}
        </div>
    )
}
