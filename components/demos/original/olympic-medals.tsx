"use client"

import { useEffect, useState } from "react"
import Image, { type StaticImageData } from "next/image"
import { motion } from "motion/react"

import aus from "@/public/assets/demos/olympic-medals/aus.png"
import chn from "@/public/assets/demos/olympic-medals/chn.png"
import jpn from "@/public/assets/demos/olympic-medals/jpn.png"
import usa from "@/public/assets/demos/olympic-medals/usa.png"

import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
} from "./carousel"
import { Progress } from "./progress"

const data = [
    { country: "USA", id: 0, gold: 40, silver: 44, bronze: 42, img: usa },
    { country: "China", id: 1, gold: 40, silver: 27, bronze: 24, img: chn },
    { country: "Japan", id: 2, gold: 20, silver: 12, bronze: 13, img: jpn },
    {
        country: "Austrailia",
        id: 3,
        gold: 18,
        silver: 19,
        bronze: 16,
        img: aus,
    },
] as const

const medalColors = {
    gold: {
        topBg: "bg-[#FCC861]",
        baseBg: "bg-[#FBB832]",
        border: "border-[#FA9B10]/60",
        text: "text-[#FA9B10]",
    },
    silver: {
        topBg: "bg-[#C7C7C7]",
        baseBg: "bg-[#B8B8B8]",
        border: "border-[#9A9A9A]/60",
        text: "text-[#9A9A9A]",
    },
    bronze: {
        topBg: "bg-[#DEB289]",
        baseBg: "bg-[#CE9A5E]",
        border: "border-[#BF7424]/60",
        text: "text-[#BF7424]",
    },
} as const

const medalLetter = { gold: "G", silver: "S", bronze: "B" } as const
const delay = { gold: 0, silver: 0.2, bronze: 0.4 } as const

function Cylinder(props: {
    medal: "gold" | "silver" | "bronze"
    countryIdx: number
    active?: boolean
    height?: number
}) {
    return (
        <motion.div
            animate={{
                height: props.active ? props.height : 0,
                opacity: props.active ? 1 : 0,
            }}
            className={`relative w-11 ${medalColors[props.medal].baseBg} perspective-500`}
            transition={{ delay: 0.2 + delay[props.medal] }}
        >
            <span className="absolute w-full -translate-y-8 text-center text-sm tracking-normal text-zinc-700">
                {data[props.countryIdx][props.medal]}
            </span>
            <div
                className={`absolute flex h-11 w-full items-center justify-center rounded-full border ${medalColors[props.medal].border} ${medalColors[props.medal].topBg} -translate-y-[22px] rotate-x-[65deg]`}
            >
                <span
                    className={`text-xl font-bold tracking-normal ${medalColors[props.medal].text}`}
                >
                    {medalLetter[props.medal]}
                </span>
            </div>
        </motion.div>
    )
}

function CountryCard(props: {
    country: {
        id: number
        gold: number
        silver: number
        bronze: number
        img: StaticImageData
    }
    activeCountryIdx: number
}) {
    return (
        <div className="relative flex translate-y-5 cursor-grab flex-col items-center justify-center active:cursor-grabbing">
            <Image
                alt="Country Flag"
                className="original-olympic-flag absolute -top-4 w-14 rounded-lg border-4 border-zinc-100 bg-zinc-100 object-contain saturate-150 filter"
                src={props.country.img}
            />
            <div className="flex h-36 w-56 flex-col items-center justify-end overflow-hidden rounded-2xl bg-zinc-100 shadow-xl shadow-zinc-950/20">
                <div className="flex items-end justify-center gap-1">
                    <Cylinder
                        active={props.activeCountryIdx === props.country.id}
                        countryIdx={props.country.id}
                        height={props.country.silver * 1.4}
                        medal="silver"
                    />
                    <Cylinder
                        active={props.activeCountryIdx === props.country.id}
                        countryIdx={props.country.id}
                        height={props.country.gold * 1.4}
                        medal="gold"
                    />
                    <Cylinder
                        active={props.activeCountryIdx === props.country.id}
                        countryIdx={props.country.id}
                        height={props.country.bronze * 1.4}
                        medal="bronze"
                    />
                </div>
                <div className="flex h-8 w-full items-center justify-center border-t-[0.5px] border-zinc-300 bg-zinc-200">
                    <motion.span
                        animate={{
                            opacity:
                                props.activeCountryIdx === props.country.id ? 1 : 0,
                        }}
                        className="text-sm font-extrabold text-zinc-400"
                        transition={{ delay: 0.2 }}
                    >
                        TOTAL:{" "}
                        {props.country.gold +
                            props.country.silver +
                            props.country.bronze}
                    </motion.span>
                </div>
            </div>
        </div>
    )
}

export function OriginalOlympicMedals() {
    const [activeCountryIdx, setActiveCountryIdx] = useState(0)
    const [progress, setProgress] = useState(0)
    const [api, setApi] = useState<CarouselApi>()

    useEffect(() => {
        if (!api) return

        const interval = setInterval(() => {
            setProgress((prev) => (prev === 100 ? 0 : prev + 1))
        }, 50)

        if (progress === 100) {
            // Preserve the original demo's timer-driven carousel progression.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveCountryIdx((prev) =>
                prev === data.length - 1 ? 0 : prev + 1,
            )
            setProgress(0)
            api.scrollNext()
        }

        api.on("select", () => {
            setActiveCountryIdx(api.selectedScrollSnap())
            setProgress(0)
        })

        return () => clearInterval(interval)
    }, [progress, api])

    return (
        <div className="original-olympic">
            <main className="relative flex aspect-square h-[280px] flex-col items-center justify-center gap-52 overflow-hidden rounded-[40px] border border-zinc-300 bg-zinc-200 font-bold tracking-widest select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    alt="Olympic rings"
                    className="h-8"
                    src="/assets/demos/olympic-medals/olympics.svg"
                />

                <Carousel
                    className="absolute original-olympic-carousel"
                    opts={{ align: "start", loop: true }}
                    setApi={setApi}
                >
                    <CarouselContent>
                        {data.map((country, i) => (
                            <CarouselItem className="w-20" key={i}>
                                <CountryCard
                                    activeCountryIdx={activeCountryIdx}
                                    country={country}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                <div className="flex items-center justify-center gap-2">
                    {data.map((_, i) => (
                        <motion.div
                            animate={{ width: i === activeCountryIdx ? 30 : 8 }}
                            className="h-2 w-2"
                            key={i}
                        >
                            <Progress
                                className="bg-zinc-400/50"
                                value={i === activeCountryIdx ? progress : 0}
                            />
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    )
}
