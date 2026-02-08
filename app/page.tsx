import { BlogPosts } from "@/app/components/posts"
import Link from "next/link"
import Image from "next/image"

const Home = () => {
    return (
        <section>
            <div className="flex items-center gap-2 mb-8">
                <Image src="/gm-logo.png" alt="Gibson Murray Logo" width={24} height={24} />
                <h1 className="text-2xl font-semibold tracking-tighter">
                    Gibson Murray
                </h1>
            </div>

            <p className="prose mb-4">
                {`Hi, I'm Gibson. I'm a front end software engineer. I'm currently working at the `}
                <Link href="https://www.gop.com" target="_blank">
                    Republican National Committee
                </Link>
                {`. On Sundays, I volunteer at `}
                <Link href="https://passioncitychurch.com/dc" target="_blank">
                    Passion City Church DC
                </Link>
                {`. I enjoy reading, writing, movies, tv, gaming, and music! You can see some of my work here.`}
            </p>
            <div className="my-8">
                <BlogPosts />
            </div>
        </section>
    )
}

export default Home
