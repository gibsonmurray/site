import type { NextConfig } from "next"
import createMDX from "@next/mdx"

const nextConfig: NextConfig = {
    turbopack: {
        rules: { "*.svg": { loaders: ["@svgr/webpack"], as: "*.js" } },
    },
    reactCompiler: true,
    images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
    poweredByHeader: false,
    reactStrictMode: true,
    devIndicators: false,
    pageExtensions: ["js", "jsx", "mdx", "md", "ts", "tsx"],
}

const withMDX = createMDX({
    // Add markdown plugins here, as desired
    options: {
        remarkPlugins: ["remark-gfm"],
    },
})

export default withMDX(nextConfig)
