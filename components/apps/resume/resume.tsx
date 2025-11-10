import Image from "next/image"
import logo from "@/public/gm-logo.png"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import GoogleMap from "@/components/google-map"
import {
    DownloadIcon,
    FileDownIcon,
    LinkedinIcon,
    MailIcon,
    MapPinIcon,
} from "lucide-react"
import { motion } from "motion/react"
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
import PassionLogo from "@/public/passion-logo-big.svg"
import GibsonMurrayLogo from "@/public/gm-logo.svg"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Resume = () => {
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

    return (
        <div className="flex size-full max-w-none flex-col items-center justify-start gap-2 p-10">
            <div className="flex flex-col items-center justify-center gap-4 lg:max-w-3xl">
                <div className="flex items-center justify-center">
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
                    <h1 className="font-bumbbled text-4xl">IBSON</h1>
                </div>
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
                </div>

                <div className="mt-5 flex w-full flex-col items-center justify-center gap-10">
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

                    <div className="grid h-150 w-full grid-cols-2 grid-rows-2 gap-4">
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

                    <div className="relative flex aspect-video h-130 w-full items-center justify-center">
                        <Image
                            src="/tv.jpg"
                            alt="TV Background"
                            fill
                            className="w-full translate-x-0.5 object-contain lg:object-cover"
                        />
                        <iframe
                            src="https://www.youtube.com/embed/Ho5ueQcoQ-c?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=Ho5ueQcoQ-c"
                            className="pointer-events-none absolute top-12.5 aspect-video w-114 lg:top-11 lg:w-117"
                            title="UMD Football Highlights"
                        />
                        <div className="absolute bottom-0 flex w-full flex-col items-center justify-center gap-2 px-4 py-10">
                            <span className="text-2xl font-bold">
                                University of Maryland, College Park
                            </span>
                            <span className="text-muted-foreground text-lg">
                                Bachelor's of Science in Computer Science
                            </span>
                        </div>
                    </div>

                    <div className="relative h-110 w-full overflow-hidden rounded-3xl">
                        <Image
                            src="https://images.unsplash.com/photo-1515162305285-0293e4767cc2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2342"
                            alt="Church"
                            className="absolute inset-0 size-full object-cover"
                            fill
                        />
                        <div className="absolute top-1/5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center justify-center">
                            <span className="text-xl font-bold">
                                Volunteer on Sundays at
                            </span>
                            <PassionLogo className="h-20" />
                        </div>
                    </div>
                    <div className="text-muted-foreground relative flex h-30 w-full items-center justify-between gap-2 text-sm font-medium">
                        <span>
                            Copyright © 2025 Gibson Murray{" "}
                            <GibsonMurrayLogo className="stroke-muted-foreground mx-1 inline-block size-4" />
                            All rights reserved.
                        </span>

                        <Button
                            variant="link"
                            size="sm"
                            asChild
                            className="text-muted-foreground"
                        >
                            <Link
                                href="https://xs83fzgbku8yujf0.public.blob.vercel-storage.com/Resume%20-%20Gibson%20Murray.pdf"
                                target="_blank"
                            >
                                Download as PDF
                                <DownloadIcon className="size-4" />
                            </Link>
                        </Button>

                        <div className="flex items-center gap-1">
                            Made in the USA 🇺🇸
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Resume
