import { App } from "@/types"
import { v4 as uuidv4 } from "uuid"
import Resume from "@/components/apps/resume/resume"

export const APPS: App[] = [
    {
        id: "apps",
        name: "Apps",
        icon: "/icons/launchpad.png",
    },
    {
        id: "bible",
        name: "Bible",
        icon: "/icons/bible.png",
    },
    // {
    //     name: "Warp",
    //     icon: "/icons/warp.png",
    // },
    {
        id: "resume",
        name: "Resume.docx",
        icon: "/icons/word.png",
        component: Resume,
    },
    {
        id: "code",
        name: "Live Code Editor",
        icon: "/icons/vscode.png",
    },
    {
        id: "books",
        name: "Books",
        icon: "/icons/books.png",
    },
    {
        id: "photos",
        name: "Photos",
        icon: "/icons/photos.png",
    },
    {
        id: "spotify",
        name: "Spotify",
        icon: "/icons/spotify.png",
    },
    {
        id: "settings",
        name: "Settings",
        icon: "/icons/settings.png",
    },
].map((app) => ({ ...app, state: "closed" }))
