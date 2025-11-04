import { FC, useState } from "react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { InfoIcon } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

type ResumeCardProps = {
    imageUrl: string
    company: string
    position: string
    desc?: string
    date: {
        start: string
        end: string
    }
    iconUrl: string
}

const ResumeCard: FC<ResumeCardProps> = ({
    imageUrl,
    company,
    position,
    date,
    iconUrl,
}) => {
    const [infoHovered, setInfoHovered] = useState(false)

    return (
        <Card className="relative h-100 overflow-hidden rounded-3xl border-none pb-0 shadow-none">
            <Image
                src={imageUrl}
                alt={company}
                fill
                className="absolute inset-0 size-full object-cover"
            />
            <motion.div
                layout
                initial={false}
                className="bg-background/50 absolute top-0 left-0 m-3 flex items-center justify-center gap-2 overflow-hidden p-1.5 backdrop-blur-sm"
                onMouseEnter={() => setInfoHovered(true)}
                onMouseLeave={() => setInfoHovered(false)}
                style={{ borderRadius: "9999px" }}
            >
                <AnimatePresence mode="popLayout">
                    <motion.div layout="position">
                        <InfoIcon className="text-muted-foreground size-4 shrink-0" />
                    </motion.div>
                    {infoHovered && (
                        <motion.p
                            key="date"
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-muted-foreground pr-1 text-xs font-medium whitespace-nowrap"
                        >
                            {date.start} - {date.end}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
            <div className="mt-auto p-2">
                <div className="bg-background/50 flex justify-between gap-2 rounded-3xl px-2 py-4 backdrop-blur-sm">
                    <Image
                        src={iconUrl}
                        alt={company}
                        className="size-12"
                        width={100}
                        height={100}
                    />
                    <div className="my-auto flex grow flex-col">
                        <h3 className="text-lg font-bold">{company}</h3>
                        <p className="text-accent-foreground text-sm">
                            {position}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default ResumeCard
