import { baseUrl } from "@/app/sitemap"

const robots = () => {
    return {
        rules: [
            {
                userAgent: "*",
                disallow: ["/books/success"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}

export default robots
