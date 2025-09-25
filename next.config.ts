import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    experimental: {
        reactCompiler: true,
    },
    turbopack: {
        rules: { "*.svg": { loaders: ["@svgr/webpack"], as: "*.js" } },
    },
    images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
    poweredByHeader: false,
    reactStrictMode: true,
    devIndicators: false,
}

export default nextConfig
