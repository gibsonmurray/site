import Image from "next/image"
import {
    SiGithub,
    SiSpotify,
    SiSubstack,
    SiX,
    SiYoutube,
} from "react-icons/si"
import type { IconType } from "react-icons"
import type { BrandName } from "@/lib/widgets"

const brandLogos: Record<
    Exclude<BrandName, "instagram" | "tiktok">,
    IconType
> = {
    github: SiGithub,
    x: SiX,
    substack: SiSubstack,
    youtube: SiYoutube,
    spotify: SiSpotify,
}

type BrandLogoProps = {
    brand: BrandName
}

export function BrandLogo({ brand }: BrandLogoProps) {
    if (brand === "instagram" || brand === "tiktok") {
        return (
            <span
                className="grid size-full shrink-0 place-items-center overflow-hidden"
                aria-hidden="true"
            >
                <Image
                    src={
                        brand === "instagram"
                            ? "/instagram-logo-2022.svg"
                            : "https://img.magnific.com/premium-vector/tik-tok-logo_578229-290.jpg?semt=ais_hybrid&w=740&q=80"
                    }
                    alt=""
                    width={49}
                    height={49}
                    className="block size-full"
                />
            </span>
        )
    }

    const Logo = brandLogos[brand]
    return (
        <span
            className="grid size-[1.7rem] shrink-0 place-items-center overflow-visible p-[0.1rem]"
            aria-hidden="true"
        >
            <Logo
                className="block size-full overflow-visible"
                aria-hidden="true"
                focusable="false"
            />
        </span>
    )
}
