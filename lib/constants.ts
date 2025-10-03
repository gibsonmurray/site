import { App } from "@/types"
import { v4 as uuidv4 } from "uuid"

export const APPS: App[] = [
    {
        name: "Apps",
        icon: "/icons/launchpad.png",
    },
    {
        name: "Bible",
        icon: "/icons/bible.png",
    },
    // {
    //     name: "Warp",
    //     icon: "/icons/warp.png",
    // },
    {
        name: "Resume.docx",
        icon: "/icons/word.png",
    },
    {
        name: "Live Code Editor",
        icon: "/icons/vscode.png",
    },
    {
        name: "Books",
        icon: "/icons/books.png",
    },
    {
        name: "Photos",
        icon: "/icons/photos.png",
    },
    {
        name: "Spotify",
        icon: "/icons/spotify.png",
    },
    {
        name: "Settings",
        icon: "/icons/settings.png",
    },
].map((app) => ({ ...app, id: uuidv4(), state: "closed" }))
