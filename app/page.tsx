import { BlogPosts } from "@/components/posts"
import Link from "next/link"
import LogoIcon from "@/components/logo"
import Image from "next/image"
import LatestBookPopup from "@/components/latest-book-popup"
import { books } from "@/lib/books"
import { ArrowRight, BookOpen, CalendarClock } from "lucide-react"

const Home = () => {
    return (
        <section className="page-shell">
            <div className="mb-8 flex items-center gap-2">
                <LogoIcon className="text-primary size-6" />
                <h1 className="text-foreground text-2xl font-semibold tracking-tighter">
                    Gibson Murray
                </h1>
            </div>

            <div className="mb-4 flex flex-col-reverse items-start gap-6 sm:flex-row">
                <p className="prose text-foreground/90 prose-a:decoration-primary/40 prose-a:underline-offset-4 dark:prose-invert leading-7">
                    {`Hi, I'm Gibson, a front-end software engineer and aspiring author. I'm currently working at the `}
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
                <Image
                    src="/headshot.jpeg"
                    alt="Headshot of Gibson Murray"
                    // sizes="(max-width: 640px) 100vw, 128px"
                    height={1000}
                    width={1000}
                    className="aspect-3/4 w-32 rounded-2xl border object-cover sm:mx-0"
                    priority
                />
            </div>
            <div className="border-border/65 bg-background/80 my-8 rounded-xl border p-4 sm:p-5">
                <h2 className="border-primary/45 text-muted-foreground mb-4 border-l-2 pl-3 text-xs font-semibold tracking-[0.12em] uppercase">
                    Books
                </h2>
                <div className="space-y-1">
                    {books.map((book) => (
                        <Link
                            key={book.slug}
                            href={`/books/${book.slug}`}
                            className="group hover:bg-muted/30 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors"
                        >
                            <BookOpen className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-colors duration-200" />
                            <div className="flex min-w-0 flex-1 flex-col space-y-0.5">
                                <p className="text-foreground group-hover:text-primary tracking-tight transition-colors">
                                    {book.title}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                    {book.genre}
                                </p>
                            </div>
                            {book.status.type === "pre-order" && (
                                <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-xs">
                                    <CalendarClock className="size-3" />
                                    Pre-order
                                </span>
                            )}
                            {book.status.type === "coming-soon" && (
                                <span className="text-muted-foreground shrink-0 text-xs">
                                    {book.status.label}
                                </span>
                            )}
                            <ArrowRight className="text-muted-foreground/40 group-hover:text-primary/60 size-3.5 shrink-0 transition-colors duration-200" />
                        </Link>
                    ))}
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
