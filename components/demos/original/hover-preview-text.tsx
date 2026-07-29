"use client"

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Toaster, toast } from "sonner"

const assetRoot =
    "https://raw.githubusercontent.com/gibsonmurray/site/96047a909cf0b9ab12eb042f619410bcd32386e7/public/assets/demos/fun-text"

const data: Record<
    string,
    Array<{ src: string; offsetX: number; offsetY: number; rotate: number }>
> = {
    interstellar: [
        { src: `${assetRoot}/interstellar-1.gif`, offsetX: -460, offsetY: -190, rotate: -8 },
        { src: `${assetRoot}/interstellar-2.gif`, offsetX: -10, offsetY: -300, rotate: 2 },
        { src: `${assetRoot}/interstellar-3.gif`, offsetX: 430, offsetY: -100, rotate: -4 },
    ],
    prestige: [
        { src: `${assetRoot}/the-prestige-1.gif`, offsetX: -500, offsetY: -100, rotate: 3 },
        { src: `${assetRoot}/the-prestige-2.gif`, offsetX: -10, offsetY: -270, rotate: -4 },
        { src: `${assetRoot}/the-prestige-3.gif`, offsetX: 400, offsetY: -70, rotate: -2 },
    ],
    oppenheimer: [
        { src: `${assetRoot}/oppenheimer-1.gif`, offsetX: -420, offsetY: -110, rotate: -5 },
        { src: `${assetRoot}/oppenheimer-2.gif`, offsetX: 50, offsetY: -200, rotate: 4 },
        { src: `${assetRoot}/oppenheimer-3.gif`, offsetX: 450, offsetY: 20, rotate: 10 },
    ],
    darkKnight: [
        { src: `${assetRoot}/dark-knight-1.gif`, offsetX: -500, offsetY: -10, rotate: -5 },
        { src: `${assetRoot}/dark-knight-2.gif`, offsetX: -10, offsetY: -100, rotate: 3 },
        { src: `${assetRoot}/dark-knight-3.gif`, offsetX: 370, offsetY: 200, rotate: -7 },
    ],
    inception: [
        { src: `${assetRoot}/inception-1.gif`, offsetX: -450, offsetY: 100, rotate: -2 },
        { src: `${assetRoot}/inception-2.gif`, offsetX: -100, offsetY: -20, rotate: -3 },
        { src: `${assetRoot}/inception-3.gif`, offsetX: 350, offsetY: 250, rotate: 2 },
    ],
}

export function OriginalHoverPreviewText() {
    const [hoveredText, setHoveredText] = useState<string | null>(null)
    const [normalizedMousePosition, setNormalizedMousePosition] = useState({
        x: 0,
        y: 0,
    })

    const handleHoverOverText = (event: React.MouseEvent<HTMLSpanElement>) => {
        setHoveredText(event.currentTarget.dataset.text!)
    }

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const normalizer = 4
            setNormalizedMousePosition({
                x: (event.clientX - window.innerWidth / 2) / normalizer,
                y: (event.clientY - window.innerHeight / 2) / normalizer,
            })
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    useEffect(() => {
        const mobileToast = () => {
            if (window.innerWidth < 768) {
                toast.warning("The demo may not work as expected on smaller screens.")
            }
        }
        const timeout = setTimeout(mobileToast, 1000)

        window.addEventListener("resize", mobileToast)
        return () => {
            clearTimeout(timeout)
            window.removeEventListener("resize", mobileToast)
        }
    }, [])

    const initialScaleY = 1.15
    const hoverScaleY = 1.3
    const transition = {
        type: "spring" as const,
        stiffness: 300,
        damping: 10,
        mass: 0.8,
    }

    const films = [
        ["interstellar", "interstellar"],
        ["prestige", "the prestige"],
        ["oppenheimer", "oppenheimer"],
        ["darkKnight", "the dark knight"],
        ["inception", "inception"],
    ] as const

    return (
        <div className="original-hover">
            <Toaster position="bottom-center" />
            <div className="relative flex w-screen flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-1 text-5xl font-black text-nowrap text-zinc-300 uppercase original-hover-list">
                    {films.map(([key, label]) => (
                        <motion.span
                            animate={{ scaleY: initialScaleY }}
                            className="transition-colors duration-300 hover:text-zinc-500"
                            data-text={key}
                            key={key}
                            onMouseEnter={handleHoverOverText}
                            onMouseLeave={() => setHoveredText(null)}
                            onMouseMove={handleHoverOverText}
                            transition={transition}
                            whileHover={{ scaleY: hoverScaleY }}
                        >
                            {label}
                        </motion.span>
                    ))}
                </div>
                <AnimatePresence>
                    {hoveredText &&
                        data[hoveredText].map((item, index) => (
                            <motion.div
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    x:
                                        item.offsetX +
                                        (index === 1
                                            ? normalizedMousePosition.x / 2
                                            : normalizedMousePosition.x),
                                    y: item.offsetY + normalizedMousePosition.y,
                                    rotate: item.rotate,
                                }}
                                className="absolute flex aspect-[3/2] w-64 items-center justify-center overflow-hidden rounded-xl shadow-xl original-hover-image"
                                exit={{ scale: 0, opacity: 0 }}
                                initial={{
                                    scale: 0,
                                    opacity: 0,
                                    x: item.offsetX,
                                    y: item.offsetY,
                                    rotate: item.rotate,
                                }}
                                key={index}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 10,
                                    mass: 0.6,
                                }}
                            >
                                <img alt={hoveredText} src={item.src} />
                            </motion.div>
                        ))}
                </AnimatePresence>
            </div>
        </div>
    )
}
