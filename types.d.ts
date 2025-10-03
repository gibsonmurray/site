export type AppState = "open" | "closed" | "minimized" | "launching"

export type App = {
    id: string
    name: string
    icon: string
    state: AppState
}
