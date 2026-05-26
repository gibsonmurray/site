export type AppProject = {
    slug: string
    name: string
    eyebrow: string
    tagline: string
    description: string
    href: string
    externalUrl: string
    logoSrc: string
    desktopImageSrc: string
    mobileImageSrc: string
    imageAlt: string
    category: string
    keywords: string[]
}

export const apps: AppProject[] = [
    {
        slug: "verbatim",
        name: "Verbatim",
        eyebrow: "Scripture memory",
        tagline: "Memorize Scripture, exactly.",
        description:
            "Verbatim is a minimalist Scripture memorization tool that helps you learn passages word for word with realtime typing feedback, and it works for any exact text.",
        href: "/verbatim",
        externalUrl: "https://verbatim.gibsonmurray.com",
        logoSrc: "/verbatim-logo.svg",
        desktopImageSrc: "/verbatim/app-desktop.png",
        mobileImageSrc: "/verbatim/app-mobile.png",
        imageAlt:
            "Verbatim app showing John 3:16 memorization practice in progress",
        category: "EducationalApplication",
        keywords: [
            "Scripture memorization app",
            "Bible verse memorization",
            "typing memorization app",
            "exact text memorization",
        ],
    },
]

export const featuredApp = apps[0]
