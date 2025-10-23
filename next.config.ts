import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    turbopack: {
        rules: { "*.svg": { loaders: ["@svgr/webpack"], as: "*.js" } },
    },
    reactCompiler: true,
    images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
    poweredByHeader: false,
    reactStrictMode: true,
    devIndicators: false,
}

export default nextConfig
