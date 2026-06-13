import Image from "next/image"
import { Mail } from "lucide-react"

const RetailerAsset = ({ src, alt }: { src: string; alt: string }) => (
    <span className="retailer-logo">
        <Image src={src} alt={alt} width={64} height={64} unoptimized />
    </span>
)

export const AmazonRetailerLogo = () => (
    <span className="retailer-logo retailer-logo-amazon">
        <Image
            src="/retailers/amazon.png"
            alt="Amazon"
            width={64}
            height={64}
            unoptimized
        />
    </span>
)

export const KindleLogo = () => (
    <span className="retailer-logo retailer-logo-kindle">
        <Image
            src="/retailers/kindle.png"
            alt="Kindle"
            width={64}
            height={64}
            unoptimized
        />
    </span>
)

export const AppleBooksLogo = () => (
    <RetailerAsset src="/retailers/apple-books.png" alt="Apple Books" />
)

export const IngramSparkLogo = () => (
    <RetailerAsset src="/retailers/ingram.png" alt="IngramSpark" />
)

export const VenmoLogo = () => (
    <RetailerAsset src="/retailers/venmo.png" alt="Venmo" />
)

export const DirectEbookLogo = () => (
    <span className="retailer-logo retailer-logo-direct">
        <Mail aria-hidden="true" />
    </span>
)
