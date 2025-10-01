import { cn } from "@/lib/utils"
import { FC, ReactNode } from "react"

export const LiquidGlassEffect = () => {
    return (
        <>
            <div
                className="absolute inset-0 isolate z-0 overflow-hidden"
                style={{
                    backdropFilter: `url(#glass-distortion) brightness(1.1) saturate(1.5)`,
                }}
            ></div>
            <svg className="hidden">
                <filter
                    id="glass-distortion"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                    filterUnits="objectBoundingBox"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.01 0.01"
                        numOctaves="1"
                        seed="2"
                        result="turbulence"
                    />
                    {/* Map turbulence into channels similar to the pen */}
                    <feComponentTransfer in="turbulence" result="mapped">
                        <feFuncR
                            type="gamma"
                            amplitude="1"
                            exponent="1.5"
                            offset="0.5"
                        />
                        <feFuncG
                            type="gamma"
                            amplitude="0"
                            exponent="1"
                            offset="0"
                        />
                        <feFuncB
                            type="gamma"
                            amplitude="0"
                            exponent="1"
                            offset="0.5"
                        />
                    </feComponentTransfer>

                    {/* Directional maps for Tahoe dock bias */}
                    <feGaussianBlur
                        in="mapped"
                        stdDeviation="10 0"
                        result="xMap"
                    />
                    <feGaussianBlur
                        in="mapped"
                        stdDeviation="0 10"
                        result="yMap"
                    />

                    {/* Chromatic displacement passes */}
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="xMap"
                        id="redchannel"
                        xChannelSelector="R"
                        yChannelSelector="B"
                        result="dispRed"
                        scale="-160"
                    />
                    <feColorMatrix
                        in="dispRed"
                        type="matrix"
                        values="1 0 0 0 0
                                0 0 0 0 0
                                0 0 0 0 0
                                0 0 0 1 0"
                        result="red"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="xMap"
                        id="greenchannel"
                        xChannelSelector="R"
                        yChannelSelector="B"
                        result="dispGreen"
                        scale="-160"
                    />
                    <feColorMatrix
                        in="dispGreen"
                        type="matrix"
                        values="0 0 0 0 0
                                0 1 0 0 0
                                0 0 0 0 0
                                0 0 0 1 0"
                        result="green"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="yMap"
                        id="bluechannel"
                        xChannelSelector="R"
                        yChannelSelector="B"
                        result="dispBlue"
                        scale="-160"
                    />
                    <feColorMatrix
                        in="dispBlue"
                        type="matrix"
                        values="0 0 0 0 0
                                0 0 0 0 0
                                0 0 1 0 0
                                0 0 0 1 0"
                        result="blue"
                    />

                    {/* Blend channels back together */}
                    <feBlend in="red" in2="green" mode="screen" result="rg" />
                    <feBlend in="rg" in2="blue" mode="screen" result="output" />

                    {/* Reduce saturation to merge visible RGB fringes */}
                    <feColorMatrix
                        in="output"
                        type="saturate"
                        values="0.2"
                        result="merged"
                    />

                    {/* Soften output slightly like the pen */}
                    <feGaussianBlur in="merged" stdDeviation="2" />
                </filter>
            </svg>
        </>
    )
}

export const LiquidGlassTint = () => {
    return (
        <div className="absolute inset-0 z-10 rounded-[inherit] bg-white/15"></div>
    )
}

export const LiquidGlassShine = () => {
    return (
        <div className="absolute inset-0 z-20 overflow-hidden rounded-[inherit] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.25),inset_-1px_-1px_1px_rgba(255,255,255,0.25)]"></div>
    )
}

type LiquidGlassContentProps = {
    children?: ReactNode
    className?: string
}

export const LiquidGlassContent: FC<LiquidGlassContentProps> = ({
    children,
    className,
}) => {
    return (
        <div
            className={cn(
                "z-30 flex items-center justify-center gap-2",
                className,
            )}
        >
            {children}
        </div>
    )
}

export const LiquidGlass: FC<LiquidGlassContentProps> = ({
    children,
    className,
}) => {
    return (
        <div
            className={cn(
                "relative flex overflow-hidden rounded-3xl shadow-md",
                className,
            )}
        >
            <LiquidGlassEffect />
            {/* <LiquidGlassTint /> */}
            <LiquidGlassShine />
            {children}
        </div>
    )
}
