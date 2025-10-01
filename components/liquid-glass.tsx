import { cn } from "@/lib/utils"
import { FC, ReactNode } from "react"

export const LiquidGlassEffect = () => {
    return (
        <>
            <div className="absolute inset-0 isolate z-0 overflow-hidden filter-[url(#glass-distortion)] backdrop-blur-xs"></div>
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
                        seed="5"
                        result="turbulence"
                    />
                    {/* Seeds: 14, 17,  */}

                    <feComponentTransfer in="turbulence" result="mapped">
                        <feFuncR
                            type="gamma"
                            amplitude="1"
                            exponent="10"
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

                    <feGaussianBlur
                        in="turbulence"
                        stdDeviation="3"
                        result="softMap"
                    />

                    <feSpecularLighting
                        in="softMap"
                        surfaceScale="5"
                        specularConstant="1"
                        specularExponent="100"
                        lightingColor="white"
                        result="specLight"
                    >
                        <fePointLight x="-200" y="-200" z="300" />
                    </feSpecularLighting>

                    <feComposite
                        in="specLight"
                        operator="arithmetic"
                        k1="0"
                        k2="1"
                        k3="1"
                        k4="0"
                        result="litImage"
                    />

                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="softMap"
                        scale="150"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>
        </>
    )
}

export const LiquidGlassTint = () => {
    return (
        <div className="absolute inset-0 z-10 rounded-[inherit] bg-white/25"></div>
    )
}

export const LiquidGlassShine = () => {
    return (
        <div className="absolute inset-0 z-20 overflow-hidden rounded-[inherit] shadow-[inset_2px_2px_1px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_rgba(255,255,255,0.5)]"></div>
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
            <LiquidGlassTint />
            <LiquidGlassShine />
            {children}
        </div>
    )
}
