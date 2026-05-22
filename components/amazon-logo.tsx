import Image from "next/image"

export const AmazonLogo = ({ className }: { className?: string }) => (
    <Image
        src="/amazon-logo.svg"
        alt=""
        width={66}
        height={20}
        aria-hidden="true"
        className={className}
    />
)
