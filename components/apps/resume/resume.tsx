import Image from "next/image"
import logo from "@/public/gm-logo.png"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import GoogleMap from "@/components/google-map"
import {
    Globe2Icon,
    LinkedinIcon,
    MailIcon,
    MapPinIcon,
    PhoneIcon,
} from "lucide-react"
import { motion } from "motion/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const icons = [
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
]

const Resume = () => {
    return (
        <div className="flex size-full max-w-none flex-col items-center justify-start gap-2 p-10">
            <div className="flex flex-col items-center justify-center gap-4 lg:max-w-3xl">
                <motion.div
                    whileHover={{
                        rotate: 360,
                        transition: {
                            type: "spring",
                            stiffness: 100,
                            damping: 20,
                        },
                    }}
                >
                    <Image
                        src={logo}
                        alt="Gibson Murray Logo"
                        className="size-10"
                    />
                </motion.div>
                <h1 className="text-3xl font-bold">GIBSON MURRAY</h1>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <a
                        href="mailto:gibmurrays@gmail.com"
                        target="_blank"
                        className="flex items-center gap-2 hover:underline"
                    >
                        <MailIcon className="size-4" />
                        gibmurrays@gmail.com
                    </a>
                    <a
                        href="https://gibsonmurray.com"
                        target="_blank"
                        className="flex items-center gap-2 hover:underline"
                    >
                        <Globe2Icon className="size-4" />
                        gibsonmurray.com
                    </a>
                    <a
                        href="https://linkedin.com/in/gibsonmurray"
                        target="_blank"
                        className="flex items-center gap-2 hover:underline"
                    >
                        <LinkedinIcon className="size-4" />
                        linkedin.com/in/gibsonmurray
                    </a>
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <span className="flex cursor-pointer items-center gap-2 hover:underline">
                                <MapPinIcon className="size-4" />
                                Washington, D.C., USA
                            </span>
                        </HoverCardTrigger>
                        <HoverCardContent className="size-52 p-0">
                            <GoogleMap className="size-full overflow-hidden rounded-md border" />
                        </HoverCardContent>
                    </HoverCard>
                    <a
                        href="tel:4433039045"
                        target="_blank"
                        className="flex items-center gap-2 hover:underline"
                    >
                        <PhoneIcon className="size-4" />
                        (443) 303-9045
                    </a>
                </div>
                <div className="flex w-full flex-col items-center justify-center gap-2">
                    <Card className="h-min-fit relative w-full">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">
                                My Expertise
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap items-center justify-center gap-2">
                            {icons.map((Icon, index) => (
                                <Icon key={index} size={64} />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Resume
