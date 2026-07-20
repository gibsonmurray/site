"use client"

import { motion } from "motion/react"

export function LogoMark() {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            viewBox="0 0 184 184"
            xmlns="http://www.w3.org/2000/svg"
        >
            <motion.path
                animate={{ pathLength: 1 }}
                d="M32.6521 150.895C-28.6999 89.5427 32.6518 7.74029 94.0039 7.74021C155.356 7.74012 109.342 156.007 68.4408 115.106C27.5395 74.2046 175.806 28.1912 175.806 89.5432C175.806 150.895 94.0041 212.247 32.6521 150.895Z"
                initial={{ pathLength: 0 }}
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="14.4608"
                transition={{ duration: 2, ease: [0.645, 0.045, 0.355, 1] }}
            />
        </svg>
    )
}
