import { baseUrl } from "@/app/sitemap"

export const SITE_NAME = "Gibson Murray"
export const AUTHOR_NAME = "Gibson Murray"
export const AUTHOR_URL = baseUrl

export const SITE_TITLE =
    "Gibson Murray | Christian Author and Biblical Fiction Writer"

export const SITE_DESCRIPTION =
    "Gibson Murray writes biblical fiction, biblical analysis, Christian reflections, essays on faith and story, and builds thoughtful software like Verbatim."

export const BOOKS_DESCRIPTION =
    "Book projects in biblical fiction from Gibson Murray, including Walls, a story of faith tested, unlikely mercy, and the fall of Jericho."

export const BLOG_DESCRIPTION =
    "Essays and reflections from Gibson Murray on Christian faith, biblical imagination, story, biblical analysis, and ordinary life."

export const VERBATIM_DESCRIPTION =
    "Verbatim is a minimalist Scripture memorization tool that helps you learn passages word for word with realtime typing feedback, and it works for any exact text."

export const SITE_KEYWORDS = [
    "Gibson Murray",
    "Christian author",
    "biblical fiction",
    "Christian fiction",
    "faith essays",
    "Scripture memorization app",
    "Bible verse memorization",
    "Verbatim typing memorization",
    "typing memorization app",
    "biblical reflections",
    "biblical analysis",
    "Walls book",
    "Christian storyteller",
]

export const AUTHOR_SAME_AS = [
    "https://github.com/gibsonmurray",
    "https://x.com/gibsonmurray",
]

export const SITE_LINKS = [
    {
        name: "Home",
        url: baseUrl,
    },
    {
        name: "Books",
        url: `${baseUrl}/books`,
    },
    {
        name: "Writing",
        url: `${baseUrl}/blog`,
    },
    {
        name: "Verbatim",
        url: `${baseUrl}/verbatim`,
    },
]

export const makeOgImage = ({
    title = SITE_NAME,
    subtitle,
    image,
}: {
    title?: string
    subtitle?: string
    image?: string
} = {}) => {
    const params = new URLSearchParams({ title })
    if (subtitle) params.set("subtitle", subtitle)
    if (image) params.set("image", image)
    return `${baseUrl}/og?${params.toString()}`
}

export const defaultOgImage = makeOgImage({
    title: SITE_NAME,
    image: "/books/walls-mock-1.png",
})

export const personSchema = {
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: AUTHOR_NAME,
    url: AUTHOR_URL,
    sameAs: AUTHOR_SAME_AS,
    jobTitle: "Christian author and software engineer",
    description: SITE_DESCRIPTION,
    knowsAbout: [
        "Biblical Fiction",
        "Biblical Analysis",
        "Christian theology",
        "Faith and writing",
        "Story craft",
        "Software design",
    ],
}

export const makeSiteNavigationSchema = (
    links: { name: string; url: string }[] = SITE_LINKS,
) => ({
    "@type": "ItemList",
    "@id": `${baseUrl}/#site-navigation`,
    name: `${SITE_NAME} site navigation`,
    itemListElement: links.map((link, index) => ({
        "@type": "SiteNavigationElement",
        position: index + 1,
        name: link.name,
        url: link.url,
    })),
})
