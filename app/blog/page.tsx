import { BlogPosts } from "@/components/posts"
import { Metadata } from "next"
import { baseUrl } from "@/app/sitemap"
import { getBlogPosts } from "@/app/blog/utils"
import { BlogSearch } from "@/components/blog-search"
import {
    AUTHOR_NAME,
    BLOG_DESCRIPTION,
    SITE_NAME,
    makeBreadcrumbSchema,
    makeOgImage,
} from "@/lib/seo"

export const metadata: Metadata = {
    title: {
        absolute: `${SITE_NAME} Writing`,
    },
    description: BLOG_DESCRIPTION,
    authors: [{ name: AUTHOR_NAME, url: baseUrl }],
    keywords: [
        "Gibson Murray blog",
        "Christian essays",
        "biblical reflections",
        "faith writing",
        "Christian author blog",
        "biblical fiction craft",
    ],
    alternates: {
        canonical: `${baseUrl}/writings`,
        types: {
            "application/rss+xml": `${baseUrl}/rss`,
        },
    },
    openGraph: {
        title: `${SITE_NAME} Writing`,
        description: BLOG_DESCRIPTION,
        url: `${baseUrl}/writings`,
        type: "website",
        images: [
            {
                url: makeOgImage({
                    title: `${SITE_NAME} Writing`,
                    image: "/books/walls-mock-2.png",
                }),
                alt: `${SITE_NAME} writing on faith, story, and ordinary life`,
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_NAME} Writing`,
        description: BLOG_DESCRIPTION,
        images: [
            makeOgImage({
                title: `${SITE_NAME} Writing`,
                image: "/books/walls-mock-2.png",
            }),
        ],
    },
}

const BlogPage = () => {
    const posts = getBlogPosts()
    const searchablePosts = posts.map((p) => ({
        slug: p.slug,
        title: p.metadata.title,
        summary: p.metadata.summary,
        publishedAt: p.metadata.publishedAt,
        tags: p.metadata.tags,
    }))
    const blogUrl = `${baseUrl}/writings`
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": `${blogUrl}#webpage`,
                url: blogUrl,
                name: `${SITE_NAME} Writing`,
                description: BLOG_DESCRIPTION,
                inLanguage: "en-US",
                isPartOf: {
                    "@id": `${baseUrl}/#website`,
                },
                mainEntity: {
                    "@id": `${blogUrl}#blog`,
                },
            },
            {
                "@type": "Blog",
                "@id": `${blogUrl}#blog`,
                name: `${SITE_NAME} Writing`,
                url: blogUrl,
                description: BLOG_DESCRIPTION,
                inLanguage: "en-US",
                publisher: {
                    "@id": `${baseUrl}/#person`,
                },
                blogPost: posts.map((post) => ({
                    "@type": "BlogPosting",
                    "@id": `${blogUrl}/${post.slug}#article`,
                    headline: post.metadata.title,
                    url: `${blogUrl}/${post.slug}`,
                    datePublished: post.metadata.publishedAt,
                    dateModified: post.metadata.publishedAt,
                    description: post.metadata.summary,
                    author: {
                        "@id": `${baseUrl}/#person`,
                    },
                })),
            },
            {
                "@type": "ItemList",
                "@id": `${blogUrl}#posts`,
                name: `${SITE_NAME} writing archive`,
                itemListElement: posts.map((post, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    url: `${blogUrl}/${post.slug}`,
                    name: post.metadata.title,
                })),
            },
            makeBreadcrumbSchema(
                [
                    {
                        name: SITE_NAME,
                        url: baseUrl,
                    },
                    {
                        name: "Writing",
                        url: blogUrl,
                    },
                ],
                `${blogUrl}#breadcrumb`,
            ),
        ],
    }

    return (
        <section className="editorial-page bg-background overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <header className="editorial-archive-header">
                <div className="editorial-archive-title">
                    <p className="app-eyebrow">Writing archive</p>
                    <h1>
                        Faith, story, and <em>ordinary life.</em>
                    </h1>
                </div>
                <div className="editorial-archive-intro">
                    <p>
                        Essays and reflections from the place where Christian
                        conviction meets daily attention.
                    </p>
                    <BlogSearch posts={searchablePosts} />
                </div>
            </header>

            <section className="editorial-archive-index">
                <BlogPosts />
            </section>
        </section>
    )
}

export default BlogPage
