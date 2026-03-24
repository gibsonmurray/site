import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

const NotFound = () => {
    const funMessages = [
        "Looks like this page took a wrong turn...",
        "Oops! You've discovered a digital dead end.",
        "This path leads nowhere (yet!).",
        "404: Page got lost in the internet.",
        "Houston, we have a 404 problem.",
    ]

    const jokes = [
        "Page not found, but your sense of humor wasn't lost 😄",
        "I tried to find this page, but I got a 404 right back.",
        "This page went to the error dimension. Come back to reality? 🌀",
        "The page you're looking for is in another castle. 🏰",
        "Error 404: Your destination called in sick today.",
        "You've found the secret 404 zone. Congrats, I guess? 🎉",
        "This page decided to take an unscheduled vacation.",
        "404: The page is not here, but I am. Need directions? 🗺️",
    ]

    const randomMessage =
        funMessages[Math.floor(Math.random() * funMessages.length)]
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)]

    return (
        <section className="page-shell">
            <div className="flex flex-col gap-8">
                <div>
                    <div className="mb-6 text-6xl">🫙</div>
                    <h1 className="mb-3 text-4xl font-semibold tracking-tighter">
                        404
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        {randomMessage}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Link href="/">
                        <Button className="gap-2">
                            <Home className="h-4 w-4" />
                            Back Home
                        </Button>
                    </Link>
                    <Link href="/blog">
                        <Button variant="outline">Check Out Blog</Button>
                    </Link>
                </div>

                <p className="text-muted-foreground/70 text-xs">{randomJoke}</p>
            </div>
        </section>
    )
}

export default NotFound
