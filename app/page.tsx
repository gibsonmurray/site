import { BlogPosts } from "@/components/posts"
import Link from "next/link"
import LogoIcon from "@/components/logo"
import Image from "next/image"
import LatestBookPopup from "@/components/latest-book-popup"
import { books } from "@/lib/books"
import { ArrowRight, CalendarClock } from "lucide-react"

const Home = () => {
    return (
        <section className="page-shell">
            <div className="mb-6 flex items-center gap-4">
                <Image
                    src="/headshot.jpeg"
                    alt="Headshot of Gibson Murray"
                    height={1000}
                    width={1000}
                    className="size-20 shrink-0 rounded-full border object-cover"
                    priority
                />
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <LogoIcon className="text-primary size-6 shrink-0" />
                        <h1 className="text-foreground text-2xl font-semibold tracking-tighter">
                            Gibson Murray
                        </h1>
                    </div>
                    <p className="text-muted-foreground">
                        Author & Software Engineer
                    </p>
                </div>
            </div>

            <p className="prose text-foreground/90 prose-a:decoration-primary/40 prose-a:underline-offset-4 dark:prose-invert mb-4 leading-7">
                {`Hi, I'm Gibson, an author and front-end software engineer. I'm currently working at the `}
                <Link
                    href="https://www.gop.com"
                    target="_blank"
                    className="hover:text-primary"
                >
                    Republican National Committee
                </Link>
                {` 🇺🇸. On Sundays, I volunteer at `}
                <Link
                    href="https://passioncitychurch.com/dc"
                    target="_blank"
                    className="hover:text-primary"
                >
                    Passion City Church DC
                </Link>
                {` ✝️. I enjoy reading, writing, movies, TV, gaming, and music. Thanks for stopping by!`}
            </p>
            <div className="border-border/65 bg-background/80 my-8 rounded-xl border p-4 sm:p-5">
                <h2 className="border-primary/45 text-muted-foreground mb-4 border-l-2 pl-3 text-xs font-semibold tracking-[0.12em] uppercase">
                    Books
                </h2>
                <div className="space-y-3">
                    {books.map((book) => {
                        const isPreOrder = book.status.type === "pre-order"
                        const isComingSoon = book.status.type === "coming-soon"
                        const purchasable = book.purchasable !== false
                        return (
                            <Link
                                key={book.slug}
                                href={`/books/${book.slug}`}
                                className="group hover:bg-muted/40 flex gap-4 rounded-xl p-3 transition-colors"
                            >
                                <Image
                                    src={book.coverImageSrc}
                                    alt={book.coverImageAlt}
                                    width={200}
                                    height={300}
                                    className="h-20 w-auto shrink-0 rounded-md object-contain shadow-md transition-transform duration-200 group-hover:scale-[1.03]"
                                />
                                <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-foreground group-hover:text-primary font-semibold tracking-tight transition-colors leading-tight">
                                                {book.title}
                                            </p>
                                            {(isPreOrder || isComingSoon) && (
                                                <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs pt-0.5">
                                                    <CalendarClock className="size-3" />
                                                    {isPreOrder
                                                        ? purchasable
                                                            ? "Pre-order"
                                                            : "Coming soon"
                                                        : book.status.label}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground text-xs">
                                            {book.genre}
                                        </p>
                                        <p className="text-muted-foreground mt-1 text-xs leading-relaxed line-clamp-2">
                                            {book.shortDescription}
                                        </p>
                                    </div>
                                    <span className="text-primary group-hover:text-primary/80 flex items-center gap-1 text-xs font-medium transition-colors">
                                        Learn more
                                        <ArrowRight className="size-3" />
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
            <div className="border-border/65 bg-background/80 mb-8 rounded-xl border p-4 sm:p-5">
                <BlogPosts recentOnly recentCount={3} />
            </div>
            <LatestBookPopup />
        </section>
    )
}

export default Home
