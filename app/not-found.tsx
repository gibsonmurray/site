import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Home } from "lucide-react"

const NotFound = () => {
    return (
        <section className="editorial-page editorial-transaction mx-auto flex min-h-[calc(100svh-7rem)] max-w-4xl flex-col justify-center px-4 py-16 text-center sm:px-6">
            <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                404
            </p>
            <h1 className="text-foreground mt-5 text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                This page is not in the archive.
            </h1>
            <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg leading-8">
                The path may have moved, but the books and writing are still
                close by.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                    className="h-11 rounded-none px-5"
                    render={<Link href="/" />}
                >
                    <Home className="size-4" />
                    Home
                </Button>
                <Button
                    variant="outline"
                    className="h-11 rounded-none px-5"
                    render={<Link href="/books" />}
                >
                    <BookOpen className="size-4" />
                    Books
                </Button>
            </div>
        </section>
    )
}

export default NotFound
