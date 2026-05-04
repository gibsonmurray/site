import { baseUrl } from "@/app/sitemap"
import { getBlogPosts } from "@/app/blog/utils"
import { BLOG_DESCRIPTION, SITE_NAME } from "@/lib/seo"

const escapeXml = (value: string) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;")

export const GET = async () => {
    let allBlogs = getBlogPosts()

    const itemsXml = allBlogs
        .sort((a, b) => {
            if (
                new Date(a.metadata.publishedAt) >
                new Date(b.metadata.publishedAt)
            ) {
                return -1
            }
            return 1
        })
        .map(
            (post) =>
                `<item>
          <title>${escapeXml(post.metadata.title)}</title>
          <link>${baseUrl}/blog/${post.slug}</link>
          <guid>${baseUrl}/blog/${post.slug}</guid>
          <description>${escapeXml(post.metadata.summary || "")}</description>
          <pubDate>${new Date(
              post.metadata.publishedAt,
          ).toUTCString()}</pubDate>
        </item>`,
        )
        .join("\n")

    const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>${escapeXml(SITE_NAME)}</title>
        <link>${baseUrl}</link>
        <description>${escapeXml(BLOG_DESCRIPTION)}</description>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${itemsXml}
    </channel>
  </rss>`

    return new Response(rssFeed, {
        headers: {
            "Content-Type": "text/xml",
        },
    })
}
