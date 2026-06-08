import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

export default defineConfig([
    ...nextVitals,
    ...nextTypescript,
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "react-hooks/set-state-in-effect": "off",
        },
    },
    globalIgnores([".next/**", "next-env.d.ts"]),
])
