import { BlogPosts } from "@/components/posts"
import Link from "next/link"
import Image from "next/image"
import { books, getFeaturedReviewHeadline, latestBook } from "@/lib/books"
import { currentlyReading } from "@/lib/currently-reading"
import { NewsletterSignup } from "@/components/newsletter-signup"
import {
    ArrowRight,
    BookMarked,
    BookOpenText,
    CalendarClock,
    Coffee,
    Feather,
    Library,
    Newspaper,
    Star,
} from "lucide-react"

const statusLabel =
    latestBook.status.type === "pre-order"
        ? (latestBook.status.label ?? "Pre-order")
        : latestBook.status.type === "coming-soon"
          ? latestBook.status.label
          : (latestBook.status.label ?? "Available now")

const releaseLabel =
    latestBook.status.type === "pre-order"
        ? latestBook.status.releaseDate
        : null

const latestBookReviewHeadline = getFeaturedReviewHeadline(latestBook)

const Home = () => {
    return (
        <section className="overflow-hidden">
            <div className="mx-auto grid min-h-[calc(100svh-3.5rem)] w-full max-w-6xl items-center gap-12 px-6 py-16 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:py-20">
                <div className="flex flex-col items-start">
                    <p className="text-primary mb-5 text-xs font-semibold tracking-[0.22em] uppercase">
                        Christian author and software engineer
                    </p>
                    <h1 className="text-foreground max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                        Stories shaped by Scripture. Built with care.
                    </h1>
                    <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-8 sm:text-xl">
                        I write biblical fiction, biblical analysis, and
                        reflections on faith from the overlap of Scripture,
                        story, and ordinary life.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Link
                            href="/books"
                            className="bg-foreground text-background hover:bg-foreground/85 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors"
                        >
                            Explore books
                            <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            href="/blog"
                            className="border-border bg-background text-foreground hover:bg-muted inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors"
                        >
                            <Newspaper className="size-4" />
                            Read latest
                        </Link>
                    </div>
                </div>

                <div className="relative mx-auto flex w-full max-w-xl items-center justify-center lg:max-w-none">
                    <div className="bg-foreground/10 absolute inset-x-8 bottom-8 h-16 rounded-full blur-2xl" />
                    <Image
                        src={latestBook.images?.[0] ?? latestBook.coverImageSrc}
                        alt={latestBook.coverImageAlt}
                        width={950}
                        height={950}
                        sizes="(min-width: 1024px) 48vw, 92vw"
                        className="relative z-10 w-full rounded-[2rem] object-contain"
                        priority
                    />
                </div>
            </div>

            <section className="bg-[#111] text-white">
                <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
                    <div className="order-2 flex justify-center lg:order-1">
                        <Image
                            src={latestBook.coverImageSrc}
                            alt={latestBook.coverImageAlt}
                            width={520}
                            height={780}
                            sizes="(min-width: 1024px) 34vw, 70vw"
                            className="w-full max-w-[18rem] rounded-2xl shadow-2xl shadow-black/40 sm:max-w-sm"
                        />
                    </div>
                    <div className="order-1 lg:order-2">
                        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium text-white/65">
                            <span className="rounded-full bg-white/10 px-3 py-1 text-white">
                                {statusLabel}
                            </span>
                            {releaseLabel && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
                                    <CalendarClock className="size-3.5" />
                                    {releaseLabel}
                                </span>
                            )}
                            <span className="rounded-full bg-white/10 px-3 py-1">
                                {latestBook.genre}
                            </span>
                        </div>
                        <h2 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
                            {latestBook.title}
                        </h2>
                        <p className="mt-5 max-w-2xl text-xl leading-8 text-white/72">
                            {latestBook.shortDescription}
                        </p>
                        {latestBookReviewHeadline ? (
                            <div className="mt-6 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5">
                                <div className="text-primary mb-2 flex items-center gap-1.5">
                                    {Array.from({ length: 5 }).map(
                                        (_, index) => (
                                            <Star
                                                key={index}
                                                className="size-3.5 fill-current"
                                            />
                                        ),
                                    )}
                                    <span className="ml-2 text-xs font-semibold tracking-[0.16em] text-white/48 uppercase">
                                        Reader praise
                                    </span>
                                </div>
                                <p className="text-base leading-7 font-medium text-white/86">
                                    “{latestBookReviewHeadline}”
                                </p>
                            </div>
                        ) : (
                            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55">
                                A biblical fiction story with a cinematic eye,
                                grounded in the strange courage of people caught
                                inside the promises of God.
                            </p>
                        )}
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <Link
                                href={`/books/${latestBook.slug}`}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#111] transition-colors hover:bg-white/90"
                            >
                                Learn more
                                <ArrowRight className="size-4" />
                            </Link>
                            <Link
                                href="/books"
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                            >
                                <Library className="size-4" />
                                View lineup
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-border/60 bg-background border-b">
                <div className="mx-auto grid max-w-6xl gap-8 px-6 py-18 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
                    <div>
                        <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                            Biblical reflection
                        </p>
                        <h2 className="text-foreground mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                            Scripture, story, and the life of faith.
                        </h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="app-panel-compact">
                            <BookMarked className="text-primary mb-6 size-5" />
                            <h3 className="app-panel-title-sm">Scripture</h3>
                            <p className="app-panel-copy-sm">
                                Reflections rooted in the Bible and the
                                character of God.
                            </p>
                        </div>
                        <div className="app-panel-compact">
                            <Feather className="text-primary mb-6 size-5" />
                            <h3 className="app-panel-title-sm">Story</h3>
                            <p className="app-panel-copy-sm">
                                Fiction and essays attentive to grace, courage,
                                weakness, and hope.
                            </p>
                        </div>
                        <div className="app-panel-compact">
                            <BookOpenText className="text-primary mb-6 size-5" />
                            <h3 className="app-panel-title-sm">Analysis</h3>
                            <p className="app-panel-copy-sm">
                                Interpretation shaped by close biblical reading,
                                context, and care.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="verbatim"
                className="border-border/60 scroll-mt-14 border-b bg-[#f6f7f4]"
            >
                <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-18 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:py-24">
                    <div>
                        <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                            New web app
                        </p>
                        <h2 className="text-foreground mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                            Verbatim turns Scripture memory into a live typing
                            practice.
                        </h2>
                        <p className="text-muted-foreground mt-5 max-w-xl text-base leading-7 sm:text-lg sm:leading-8">
                            Paste in the passage you want to carry, hide it,
                            then type it back from memory. Verbatim checks every
                            character in real time for Scripture, speeches,
                            poems, and anything that needs to come back word for
                            word.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Link
                                href="/verbatim"
                                className="bg-foreground text-background hover:bg-foreground/85 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors"
                            >
                                Explore Verbatim
                                <ArrowRight className="size-4" />
                            </Link>
                            <div className="text-muted-foreground inline-flex items-center gap-2 text-sm">
                                <img
                                    src="/verbatim-logo.svg"
                                    alt=""
                                    className="size-4 rounded-[0.25rem]"
                                    aria-hidden="true"
                                />
                                Scripture first, useful anywhere
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-primary/10 absolute inset-x-8 bottom-0 h-20 rounded-full blur-2xl" />
                        <Image
                            src="/verbatim/app-desktop.png"
                            alt="Verbatim app showing John 3:16 memorization practice in progress"
                            width={2880}
                            height={1920}
                            sizes="(min-width: 1024px) 54vw, 92vw"
                            className="ring-border/70 shadow-foreground/10 relative hidden rounded-[2rem] shadow-2xl ring-1 md:block"
                            unoptimized
                        />
                        <Image
                            src="/verbatim/app-mobile.png"
                            alt="Mobile Verbatim app showing John 3:16 memorization practice"
                            width={1170}
                            height={2532}
                            sizes="min(92vw, 24rem)"
                            className="ring-border/70 shadow-foreground/10 relative mx-auto w-full max-w-[24rem] rounded-[2rem] shadow-2xl ring-1 md:hidden"
                            unoptimized
                        />
                    </div>
                </div>
            </section>

            <section className="bg-muted/35">
                <div className="mx-auto max-w-6xl px-6 py-18 sm:px-8 lg:py-24">
                    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                                Books
                            </p>
                            <h2 className="text-foreground mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                                The lineup.
                            </h2>
                        </div>
                        <Link
                            href="/books"
                            className="text-primary hover:text-primary/75 inline-flex items-center gap-1 text-sm font-medium transition-colors"
                        >
                            See all books
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    <div
                        className={
                            books.length === 1
                                ? "mx-auto grid w-full max-w-4xl gap-5"
                                : "grid gap-5 md:grid-cols-2"
                        }
                    >
                        {books.map((book) => {
                            const reviewHeadline =
                                getFeaturedReviewHeadline(book)

                            return (
                                <Link
                                    key={book.slug}
                                    href={`/books/${book.slug}`}
                                    className="group bg-background ring-border/65 hover:shadow-foreground/10 grid min-h-72 overflow-hidden rounded-[2rem] p-8 ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:grid-cols-[0.58fr_1fr] sm:p-10"
                                >
                                    <div className="flex items-center justify-center">
                                        <Image
                                            src={book.coverImageSrc}
                                            alt={book.coverImageAlt}
                                            width={260}
                                            height={390}
                                            sizes="220px"
                                            className="shadow-foreground/15 max-h-64 w-auto rounded-xl object-contain shadow-xl transition duration-300 group-hover:scale-[1.03]"
                                        />
                                    </div>
                                    <div className="mt-6 flex flex-col justify-between gap-8 sm:mt-0">
                                        <div>
                                            <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                                                {book.genre}
                                            </p>
                                            <h3 className="text-foreground mt-3 text-3xl font-semibold tracking-tight">
                                                {book.title}
                                            </h3>
                                            <p className="text-muted-foreground mt-3 line-clamp-4 text-sm leading-6">
                                                {book.shortDescription}
                                            </p>
                                            {reviewHeadline && (
                                                <p className="border-border/70 text-foreground mt-5 border-l-2 pl-4 text-sm leading-6 font-medium">
                                                    “{reviewHeadline}”
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                                            Learn more
                                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                        </span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-background">
                <div className="mx-auto grid max-w-6xl gap-10 px-6 py-18 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
                    <div className="flex items-center gap-5">
                        <Image
                            src="/headshot.jpeg"
                            alt="Headshot of Gibson Murray"
                            height={240}
                            width={240}
                            sizes="112px"
                            className="ring-border size-28 shrink-0 rounded-full object-cover ring-1"
                        />
                        <div>
                            <p className="text-primary text-xs font-semibold tracking-[0.22em] uppercase">
                                About
                            </p>
                            <h2 className="text-foreground mt-3 text-4xl font-semibold tracking-tight">
                                Gibson Murray
                            </h2>
                        </div>
                    </div>
                    <div>
                        <p className="text-foreground/85 text-xl leading-8">
                            I am a Christian author and software engineer in DC,
                            writing books and reflections about Scripture,
                            faith, story, and the ordinary places where God
                            forms courage.
                        </p>
                        <p className="text-muted-foreground mt-5 text-sm leading-7">
                            On Sundays, I serve at Passion City Church DC. The
                            rest of the week, I am usually building software,
                            reading, drafting scenes, or working out how a
                            sentence can carry more truth with less noise.
                        </p>
                    </div>
                </div>
            </section>

            <section className="border-border/60 bg-muted/35 border-y">
                <div className="mx-auto grid max-w-6xl items-stretch gap-6 px-6 py-18 sm:px-8 lg:grid-cols-2 lg:py-24">
                    <BlogPosts recentOnly recentCount={2} variant="compact" />
                    {currentlyReading && (
                        <div className="app-panel-dark-solid h-full justify-between gap-8 overflow-hidden">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-background/60 text-xs font-semibold tracking-[0.22em] uppercase">
                                    Currently reading
                                </p>
                                {currentlyReading.finishedPercent !==
                                    undefined && (
                                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/65 tabular-nums">
                                        {currentlyReading.finishedPercent}%
                                    </span>
                                )}
                            </div>
                            <div className="grid flex-1 items-center gap-7 sm:grid-cols-[minmax(8rem,0.42fr)_1fr] sm:gap-8">
                                {currentlyReading.url ? (
                                    <Link
                                        href={currentlyReading.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 justify-self-start sm:justify-self-center"
                                    >
                                        <Image
                                            src={currentlyReading.coverImageSrc}
                                            alt={currentlyReading.coverImageAlt}
                                            width={200}
                                            height={300}
                                            className="h-56 w-auto rounded-[1.25rem] object-contain shadow-xl shadow-black/25 sm:h-60 lg:h-64"
                                        />
                                    </Link>
                                ) : (
                                    <Image
                                        src={currentlyReading.coverImageSrc}
                                        alt={currentlyReading.coverImageAlt}
                                        width={200}
                                        height={300}
                                        className="h-56 w-auto shrink-0 rounded-[1.25rem] object-contain shadow-xl shadow-black/25 sm:h-60 lg:h-64"
                                    />
                                )}
                                <div className="min-w-0">
                                    <h3 className="text-5xl font-semibold tracking-tight text-balance">
                                        {currentlyReading.title}
                                    </h3>
                                    <p className="text-background/65 mt-4 text-xl">
                                        {currentlyReading.author}
                                    </p>
                                </div>
                            </div>
                            {(currentlyReading.finishedPercent !== undefined ||
                                currentlyReading.url) && (
                                <div className="border-t border-white/10 pt-6">
                                    {currentlyReading.finishedPercent !==
                                        undefined && (
                                        <div className="flex items-center gap-3">
                                            <div className="bg-background/20 h-2 flex-1 overflow-hidden rounded-full">
                                                <div
                                                    className="bg-primary h-full rounded-full"
                                                    style={{
                                                        width: `${currentlyReading.finishedPercent}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {currentlyReading.url && (
                                        <Link
                                            href={currentlyReading.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary mt-5 inline-flex items-center gap-2 text-base font-medium"
                                        >
                                            <BookOpenText className="size-4" />
                                            Goodreads
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <section className="bg-background">
                <div className="mx-auto grid max-w-6xl gap-6 px-6 py-18 sm:px-8 lg:grid-cols-2 lg:py-24">
                    <NewsletterSignup />
                    <div className="app-panel min-h-[24rem] justify-center gap-8 sm:min-h-72 sm:justify-start">
                        <div className="flex flex-col">
                            <p className="app-eyebrow">Support</p>
                            <h2 className="app-panel-title">
                                Fuel the next chapter.
                            </h2>
                            <p className="app-panel-copy">
                                If the books, essays, or biblical reflections
                                are encouraging to you, you can support the work
                                with a coffee.
                            </p>
                        </div>
                        <Link
                            href="https://buymeacoffee.com/gibsonmurray"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary text-primary-foreground hover:bg-primary/85 mt-0 inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full px-5 text-base font-medium transition-colors sm:mt-auto"
                        >
                            <Coffee className="size-4" />
                            Buy me a coffee
                        </Link>
                    </div>
                </div>
            </section>
        </section>
    )
}

export default Home
