import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: "/",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "ALLOWALL",
                    },
                ],
            },
        ]
    },
    async redirects() {
        return [
            {
                source: "/blog/:path*",
                destination: "https://substack.com/@gibsonmurray",
                permanent: false,
            },
            {
                source: "/writings/:path*",
                destination: "https://substack.com/@gibsonmurray",
                permanent: false,
            },
            {
                source: "/books/:path*",
                destination:
                    "https://www.amazon.com/Walls-Gibson-Murray/dp/B0H29YDQ61",
                permanent: false,
            },
            {
                source: "/apps/:path*",
                destination: "https://verbatim.gibsonmurray.com",
                permanent: false,
            },
            {
                source: "/verbatim/:path*",
                destination: "https://verbatim.gibsonmurray.com",
                permanent: false,
            },
        ]
    },
}

export default nextConfig
