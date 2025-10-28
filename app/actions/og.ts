import * as cheerio from "cheerio"

const UA =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"

const pick = (og: Record<string, string>, keys: string[]) =>
    keys.find((k) => og[k]) ? og[keys.find((k) => og[k]) as string] : undefined

export const getOpenGraph = async (url: string) => {
    const r = await fetch(url, {
        headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
        redirect: "follow",
    })
    if (!r.ok) throw new Error(`fetch ${r.status}`)
    const html = await r.text()
    const $ = cheerio.load(html)

    const og: Record<string, string> = {}
    $('meta[property^="og:"], meta[name^="twitter:"]').each((_i, el) => {
        const key = $(el).attr("property") || $(el).attr("name")
        const val = $(el).attr("content")
        if (key && val) og[key] = val
    })

    const title =
        pick(og, ["og:title", "twitter:title"]) ||
        ($("title").first().text() || "").trim()
    const description =
        pick(og, ["og:description", "twitter:description"]) ||
        $('meta[name="description"]').attr("content") ||
        ""
    const image = pick(og, ["og:image", "twitter:image", "twitter:image:src"])
    const siteName = pick(og, ["og:site_name"]) || new URL(url).hostname

    return { url, title, description, image, siteName }
}
