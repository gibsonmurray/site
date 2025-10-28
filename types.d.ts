import { type ElementType } from "react"

export type AppState = "open" | "closed" | "minimized" | "launching" | "closing"

export type App = {
    id: string
    name: string
    icon: string
    state: AppState
    component?: ElementType
}
