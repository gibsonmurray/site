import { baseUrl } from "@/app/sitemap"

export const SITE_NAME = "Gibson Murray"
export const AUTHOR_NAME = "Gibson Murray"
export const AUTHOR_URL = baseUrl

export const SITE_TITLE =
    "Gibson Murray | Christian Author and Biblical Fiction Writer"

export const SITE_DESCRIPTION =
    "Gibson Murray writes biblical fiction, biblical analysis, Christian reflections, and essays on faith, story, and ordinary life."

export const BOOKS_DESCRIPTION =
    "Book projects in biblical fiction from Gibson Murray, including Walls, a story of faith tested, unlikely mercy, and the fall of Jericho."

export const BLOG_DESCRIPTION =
    "Essays and reflections from Gibson Murray on Christian faith, biblical imagination, story, biblical analysis, and ordinary life."

export const SITE_KEYWORDS = [
    "Gibson Murray",
    "Christian author",
    "biblical fiction",
    "Christian fiction",
    "faith essays",
    "biblical reflections",
    "biblical analysis",
    "Walls book",
    "Christian storyteller",
]

export const AUTHOR_SAME_AS = [
    "https://github.com/gibsonmurray",
    "https://x.com/gibsonmurray",
]

export const makeOgImage = ({
    title = SITE_NAME,
    image,
}: {
    title?: string
    image?: string
} = {}) => {
    const params = new URLSearchParams({ title })
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
    ],
}
