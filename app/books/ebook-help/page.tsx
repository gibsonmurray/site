import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
    ArrowDown,
    ArrowRight,
    BookOpen,
    Check,
    ChevronLeft,
    Download,
    ExternalLink,
    HelpCircle,
    Laptop,
    Mail,
    Smartphone,
    Tablet,
} from "lucide-react"
import { publicContactEmail } from "@/lib/contact"
import { baseUrl } from "@/app/sitemap"

const pagePath = "/books/ebook-help"
const pageUrl = `${baseUrl}${pagePath}`
const sendToKindleUrl = "https://www.amazon.com/sendtokindle"
const playBooksUrl = "https://play.google.com/books/uploads"

export const metadata: Metadata = {
    title: "How to Read Your Ebook",
    description:
        "Simple step-by-step instructions for opening your EPUB ebook on Kindle, Apple Books, Google Play Books, Kobo, and other reading devices.",
    alternates: { canonical: pageUrl },
    openGraph: {
        title: "How to Read Your Ebook",
        description:
            "Easy, illustrated steps for getting your EPUB onto the device you already use.",
        url: pageUrl,
        type: "article",
    },
}

const OptionLink = ({
    href,
    title,
    description,
    icon: Icon,
}: {
    href: string
    title: string
    description: string
    icon: typeof Tablet
}) => (
    <Link href={href} className="ebook-help-option">
        <Icon aria-hidden="true" />
        <span>
            <strong>{title}</strong>
            <small>{description}</small>
        </span>
        <ArrowDown aria-hidden="true" />
    </Link>
)

const Step = ({
    number,
    title,
    children,
}: {
    number: string
    title: string
    children: React.ReactNode
}) => (
    <li className="ebook-help-step">
        <span>{number}</span>
        <div>
            <h3>{title}</h3>
            <p>{children}</p>
        </div>
    </li>
)

const Screenshot = ({
    src,
    alt,
    caption,
}: {
    src: string
    alt: string
    caption: string
}) => (
    <figure className="ebook-help-screenshot">
        <Image
            src={src}
            alt={alt}
            width={960}
            height={620}
            loading="eager"
            unoptimized
        />
        <figcaption>{caption}</figcaption>
    </figure>
)

const EbookHelpPage = () => (
    <main className="editorial-page ebook-help-page">
        <header className="ebook-help-hero">
            <div className="site-page-container">
                <Link href="/books" className="editorial-back-link">
                    <ChevronLeft aria-hidden="true" />
                    Books
                </Link>
                <div className="ebook-help-hero-grid">
                    <div>
                        <p className="ebook-help-label">Ebook help</p>
                        <h1>Your book is only a few taps away.</h1>
                    </div>
                    <div className="ebook-help-hero-copy">
                        <p>
                            You received an <strong>EPUB</strong>, the standard
                            ebook file used by Kindle, Apple Books, Kobo, and
                            most reading apps. Pick your device below and follow
                            the pictures.
                        </p>
                        <p>
                            You will not need to buy the book again. These steps
                            simply add the copy you already own to your reader.
                        </p>
                    </div>
                </div>
                <nav
                    className="ebook-help-options"
                    aria-label="Choose a reader"
                >
                    <OptionLink
                        href="#kindle"
                        title="Kindle"
                        description="Kindle device or app"
                        icon={BookOpen}
                    />
                    <OptionLink
                        href="#apple-books"
                        title="Apple Books"
                        description="iPhone, iPad, or Mac"
                        icon={Smartphone}
                    />
                    <OptionLink
                        href="#other-readers"
                        title="Another reader"
                        description="Android, Kobo, or EPUB app"
                        icon={Tablet}
                    />
                </nav>
            </div>
        </header>

        <section className="ebook-help-section ebook-help-start">
            <div className="site-page-container ebook-help-section-grid">
                <div className="ebook-help-section-copy">
                    <p className="ebook-help-label">Start here</p>
                    <h2>Find the book file in your email.</h2>
                    <p className="ebook-help-intro">
                        Open the delivery email with the subject{" "}
                        <strong>Your ebook copy of Walls</strong>. Near the
                        bottom, look for the attachment ending in{" "}
                        <strong>.epub</strong>.
                    </p>
                    <ol className="ebook-help-steps">
                        <Step number="01" title="Open your delivery email">
                            Search your inbox for “Your ebook copy of Walls.”
                        </Step>
                        <Step number="02" title="Find the EPUB attachment">
                            It is named “Walls - Gibson Murray.epub.”
                        </Step>
                        <Step number="03" title="Tap or download it">
                            Keep the file open while you follow the instructions
                            for your reader below.
                        </Step>
                    </ol>
                </div>
                <Screenshot
                    src="/books/ebook-help/find-attachment.png"
                    alt="The actual Walls delivery email showing the real book cover and attached EPUB"
                    caption="Your delivery email includes the EPUB attachment and the Walls cover shown here."
                />
            </div>
        </section>

        <section id="kindle" className="ebook-help-section scroll-mt-16">
            <div className="site-page-container">
                <div className="ebook-help-section-heading">
                    <div>
                        <p className="ebook-help-label">Kindle</p>
                        <h2>Send it to your Kindle library.</h2>
                    </div>
                    <p>
                        This works for Kindle devices and the Kindle app. Once
                        uploaded, the book appears in your Kindle library on
                        devices signed in to the same Amazon account.
                    </p>
                </div>
                <div className="ebook-help-section-grid">
                    <ol className="ebook-help-steps">
                        <Step number="01" title="Save the EPUB attachment">
                            In your email, tap or click the EPUB and save it to
                            Files, Downloads, or your desktop.
                        </Step>
                        <Step number="02" title="Open Send to Kindle">
                            Visit amazon.com/sendtokindle and sign in with the
                            Amazon account used by your Kindle.
                        </Step>
                        <Step number="03" title="Choose the EPUB">
                            Tap “Select files,” choose the Walls EPUB, then
                            confirm the upload.
                        </Step>
                        <Step number="04" title="Open your Kindle library">
                            After a few minutes, sync or refresh your library
                            and tap the Walls cover.
                        </Step>
                        <li>
                            <Link
                                href={sendToKindleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ebook-help-primary-action"
                            >
                                Open Send to Kindle
                                <ExternalLink aria-hidden="true" />
                            </Link>
                        </li>
                    </ol>
                    <Screenshot
                        src="/books/ebook-help/send-to-kindle.png"
                        alt="The actual Amazon Send to Kindle website showing the Walls cover on a Kindle device"
                        caption="Sign in on Amazon’s Send to Kindle page, then choose the EPUB you saved from the email."
                    />
                </div>
                <aside className="ebook-help-note">
                    <Smartphone aria-hidden="true" />
                    <div>
                        <strong>Using a phone with the Kindle app?</strong>
                        <p>
                            You can also open the EPUB attachment, tap Share,
                            and choose Kindle. If Kindle is not shown, tap More
                            and select it from the app list.
                        </p>
                    </div>
                </aside>
            </div>
        </section>

        <section
            id="apple-books"
            className="ebook-help-section ebook-help-section-muted scroll-mt-16"
        >
            <div className="site-page-container">
                <div className="ebook-help-section-heading">
                    <div>
                        <p className="ebook-help-label">Apple Books</p>
                        <h2>Open it on iPhone, iPad, or Mac.</h2>
                    </div>
                    <p>
                        Apple devices recognize EPUB files. In most cases,
                        tapping the attachment opens it in Books immediately.
                    </p>
                </div>
                <div className="ebook-help-section-grid">
                    <Screenshot
                        src="/books/ebook-help/apple-books.png"
                        alt="The actual Apple Books Preview website showing the Walls cover in a book library"
                        caption="Once imported, Walls appears in your Apple Books library with this cover."
                    />
                    <ol className="ebook-help-steps">
                        <Step number="01" title="Tap the EPUB attachment">
                            On iPhone or iPad, tap the attached EPUB in your
                            delivery email.
                        </Step>
                        <Step number="02" title="Choose Books if asked">
                            If a menu appears, tap Books. You may need to tap
                            Share or More first.
                        </Step>
                        <Step number="03" title="Start reading">
                            Apple Books opens and adds Walls to your library.
                        </Step>
                        <Step number="Mac" title="On a Mac">
                            Download the EPUB and double-click it. You can also
                            open Books and choose File, then Import.
                        </Step>
                    </ol>
                </div>
                <aside className="ebook-help-note">
                    <Check aria-hidden="true" />
                    <div>
                        <strong>Want it on all your Apple devices?</strong>
                        <p>
                            Make sure Books and iCloud Drive syncing are enabled
                            in your iCloud settings.
                        </p>
                    </div>
                </aside>
            </div>
        </section>

        <section id="other-readers" className="ebook-help-section scroll-mt-16">
            <div className="site-page-container">
                <div className="ebook-help-section-heading">
                    <div>
                        <p className="ebook-help-label">Other readers</p>
                        <h2>Use any app that supports EPUB.</h2>
                    </div>
                    <p>
                        The exact wording may vary, but the pattern is the same:
                        download the EPUB, open it, and choose your reading app.
                    </p>
                </div>
                <div className="ebook-help-section-grid">
                    <ol className="ebook-help-steps">
                        <Step number="01" title="Download the EPUB">
                            Save the attachment to your Downloads or Files app.
                        </Step>
                        <Step number="02" title="Open the file">
                            Tap or double-click “Walls - Gibson Murray.epub.”
                        </Step>
                        <Step number="03" title="Choose a reader">
                            Select Play Books, Kobo, or another EPUB-reading app
                            when your device asks how to open the file.
                        </Step>
                        <Step number="04" title="Look in your library">
                            The imported book should appear in that app’s
                            library or uploads section.
                        </Step>
                        <li>
                            <Link
                                href={playBooksUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ebook-help-secondary-action"
                            >
                                Upload with Google Play Books
                                <ExternalLink aria-hidden="true" />
                            </Link>
                        </li>
                    </ol>
                    <Screenshot
                        src="/books/ebook-help/other-readers.png"
                        alt="The actual Google Play Books website showing the Walls cover on a reading device"
                        caption="Google Play Books keeps uploaded EPUBs in My books so you can read on any device."
                    />
                </div>
                <div className="ebook-help-device-grid">
                    <div>
                        <Smartphone aria-hidden="true" />
                        <h3>Android phone or tablet</h3>
                        <p>
                            Open the file from Downloads, then choose Play Books
                            or your preferred EPUB reader.
                        </p>
                    </div>
                    <div>
                        <Laptop aria-hidden="true" />
                        <h3>Windows or Chromebook</h3>
                        <p>
                            Upload the EPUB to Play Books, use Send to Kindle,
                            or open it with an EPUB app.
                        </p>
                    </div>
                    <div>
                        <Download aria-hidden="true" />
                        <h3>Kobo or another e-reader</h3>
                        <p>
                            Use the manufacturer’s import tool, or connect the
                            reader to a computer and copy the EPUB onto it.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section className="ebook-help-section ebook-help-troubleshooting">
            <div className="site-page-container ebook-help-trouble-grid">
                <div>
                    <p className="ebook-help-label">Still stuck?</p>
                    <h2>We will help you get reading.</h2>
                </div>
                <div className="ebook-help-trouble-list">
                    <div>
                        <Mail aria-hidden="true" />
                        <p>
                            <strong>Cannot find the delivery email?</strong>
                            Check Spam, Promotions, and the email address used
                            at checkout.
                        </p>
                    </div>
                    <div>
                        <HelpCircle aria-hidden="true" />
                        <p>
                            <strong>Something looks different?</strong>
                            Menus vary a little by device. Look for Share, Open
                            With, Import, or Upload.
                        </p>
                    </div>
                    <Link
                        href={`mailto:${publicContactEmail}?subject=Help opening my Walls ebook`}
                        className="ebook-help-primary-action"
                    >
                        Email Gibson for help
                        <ArrowRight aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </section>
    </main>
)

export default EbookHelpPage
