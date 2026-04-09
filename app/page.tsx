import { BlogPosts } from "@/components/posts"
import Link from "next/link"
import LogoIcon from "@/components/logo"
import Image from "next/image"
import LatestBookPopup from "@/components/latest-book-popup"

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
                <BlogPosts recentOnly recentCount={3} />
            </div>
            <LatestBookPopup />
        </section>
    )
}

export default Home
