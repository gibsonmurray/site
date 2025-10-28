import { Metadata } from "next"
import capitalize from "lodash/capitalize"
import { Suspense } from "react"
import App from "./app"

const description =
    "Hey everyone, welcome to my website! I'm Gibson, a design engineer."

const metadata: Metadata = {
    metadataBase: new URL("https://gibsonmurray.com"),
    title: { template: "%s | Gibson Murray", default: "Gibson Murray" },
    description,
    openGraph: {
        type: "website",
        title: "Gibson Murray",
        siteName: "Gibson Murray",
        url: "https://gibsonmurray.com",
        description,
        images: [{ url: "/og.jpg" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Gibson Murray",
        description,
        images: [{ url: "/og.jpg" }],
    },
    robots: {
        index: true,
        follow: true,
    },
}

type Args = {
    searchParams: Promise<{ apps?: string }>
}

export const generateMetadata = async ({ searchParams }: Args) => {
    const params = await searchParams
    const apps = params?.apps || ""

    // Optional: if q is required, you can set a default or use notFound
    if (!apps) {
        return metadata
    }

    const appsList = apps
        .split(",")
        .map((app) => capitalize(app.trim()))
        .join(", ")

    return {
        ...metadata,
        title: `Gibson Murray - ${appsList}`,
        description: `Gibson Murray - ${appsList}`,
    } satisfies Metadata
}

const Page = () => {
    return (
        <Suspense fallback={<div />}>
            <App />
        </Suspense>
    )
}

export default Page
