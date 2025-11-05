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
    InfoIcon,
    LinkedinIcon,
    MailIcon,
    MapPinIcon,
    PhoneIcon,
} from "lucide-react"
import { motion } from "motion/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticker } from "motion-plus/react"
import { JOBS, SKILLS } from "@/lib/constants"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"
import { cn } from "@/lib/utils"
import ResumeCard from "@/components/resume-card"

const Resume = () => {
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

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
                <div className="mt-5 flex w-full flex-col items-center justify-center gap-2">
                    <div className="relative w-full overflow-hidden">
                        <Ticker
                            items={SKILLS.map((item) => (
                                <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <item.Icon
                                            size={40}
                                            className={cn(
                                                "grayscale transition-all duration-300",
                                                hoveredSkill === item.name
                                                    ? "grayscale-0"
                                                    : "grayscale-100",
                                            )}
                                            onMouseEnter={() =>
                                                setHoveredSkill(item.name)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredSkill(null)
                                            }
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="bottom"
                                        sideOffset={4}
                                        arrow={false}
                                        className="bg-transparent font-bold"
                                        onMouseEnter={() =>
                                            setHoveredSkill(item.name)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredSkill(null)
                                        }
                                    >
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            className="hover:underline"
                                        >
                                            {item.name}
                                        </a>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                            hoverFactor={0}
                        />
                        <div className="from-background absolute top-0 left-0 h-full w-10 bg-linear-to-r to-transparent" />
                        <div className="from-background absolute top-0 right-0 h-full w-10 bg-linear-to-l to-transparent" />
                    </div>

                    <div className="mt-10 grid h-150 w-full grid-cols-2 grid-rows-2 gap-4">
                        {JOBS.map((job, idx) => (
                            <ResumeCard
                                key={job.name + job.position + idx}
                                imageUrl={job.imgUrl}
                                company={job.name}
                                position={job.position}
                                date={job.date}
                                iconUrl={job.iconUrl}
                                link={job.link}
                                className={job.className}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Resume
