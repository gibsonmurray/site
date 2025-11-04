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
