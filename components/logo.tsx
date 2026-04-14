"use client"

import { createLucideIcon, type IconNode } from "lucide-react"

// Original path scaled from viewBox 0 0 184 184 to 24×24 (scale 24/184)
const logoIconNode: IconNode = [
    [
        "path",
        {
            d: "M4.26 19.68C-3.74 11.68 4.26 1.01 12.26 1.01C20.26 1.01 14.26 20.35 8.92 15.01C3.59 9.67 22.92 3.67 22.92 11.67C22.92 19.68 12.26 27.66 4.26 19.68Z",
            strokeLinecap: "round",
            key: "logo",
        },
    ],
]

export const LogoIcon = createLucideIcon("logo", logoIconNode)