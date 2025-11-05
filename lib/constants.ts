import { App } from "@/types"
import Resume from "@/components/apps/resume/resume"
import {
    TypescriptOriginal,
    JavascriptOriginal,
    ReactOriginal,
    NextjsOriginal,
    TailwindcssOriginal,
    NodejsOriginal,
    NpmOriginal,
    GithubOriginal,
    BunOriginal,
    CodepenOriginal,
    Html5Original,
    Css3Original,
    JqueryOriginal,
    LodashOriginal,
    ReactrouterOriginal,
    SupabaseOriginal,
    TauriOriginal,
    VscodeOriginal,
    ZustandOriginal,
} from "devicons-react"

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

export const SKILLS = [
    {
        name: "TypeScript",
        Icon: TypescriptOriginal,
        link: "https://www.typescriptlang.org/",
    },
    {
        name: "JavaScript",
        Icon: JavascriptOriginal,
        link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    { name: "React", Icon: ReactOriginal, link: "https://react.dev/" },
    { name: "Next.js", Icon: NextjsOriginal, link: "https://nextjs.org/" },
    {
        name: "Tailwind CSS",
        Icon: TailwindcssOriginal,
        link: "https://tailwindcss.com/",
    },
    { name: "Node.js", Icon: NodejsOriginal, link: "https://nodejs.org/" },
    { name: "NPM", Icon: NpmOriginal, link: "https://www.npmjs.com/" },
    { name: "GitHub", Icon: GithubOriginal, link: "https://github.com/" },
    { name: "Bun", Icon: BunOriginal, link: "https://bun.sh/" },
    { name: "Codepen", Icon: CodepenOriginal, link: "https://codepen.io/" },
    {
        name: "HTML5",
        Icon: Html5Original,
        link: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    },
    {
        name: "CSS3",
        Icon: Css3Original,
        link: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    },
    { name: "jQuery", Icon: JqueryOriginal, link: "https://jquery.com/" },
    { name: "Lodash", Icon: LodashOriginal, link: "https://lodash.com/" },
    {
        name: "React Router",
        Icon: ReactrouterOriginal,
        link: "https://reactrouter.com/",
    },
    { name: "Supabase", Icon: SupabaseOriginal, link: "https://supabase.com/" },
    { name: "Tauri", Icon: TauriOriginal, link: "https://tauri.app/" },
    {
        name: "VSCode",
        Icon: VscodeOriginal,
        link: "https://code.visualstudio.com/",
    },
    { name: "Zustand", Icon: ZustandOriginal, link: "https://zustand.dev/" },
]

export const JOBS = [
    {
        name: "Republican National Committee",
        position: "Software Engineer",
        imgUrl: "https://images.unsplash.com/photo-1681938759305-7abe66927aa5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1000",
        date: { start: "2024", end: "Present" },
        iconUrl: "/icons/rnc.svg?url",
        link: "https://www.gop.com/",
        className: "row-span-2",
    },
    {
        name: "Pivotal",
        position: "Front End Engineering Intern",
        imgUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1000",
        date: { start: "2023", end: "2024" },
        iconUrl: "/icons/pivotal.svg?url",
        link: "https://www.pivotal-consulting-group.com/",
    },
    {
        name: "Cosmera",
        position: "Design Engineer",
        imgUrl: "https://images.unsplash.com/photo-1603274737277-f43f54446c7b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1000",
        date: { start: "2024", end: "2025" },
        iconUrl: "/icons/cosmera.svg?url",
        link: "https://www.linkedin.com/company/cosmerastudio/",
    },
]
