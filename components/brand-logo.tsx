import {
    SiGithub,
    SiInstagram,
    SiSpotify,
    SiSubstack,
    SiX,
    SiYoutube,
} from "react-icons/si"
import type { IconType } from "react-icons"
import type { BrandName } from "@/lib/widgets"

const brandLogos: Record<BrandName, IconType> = {
    github: SiGithub,
    instagram: SiInstagram,
    x: SiX,
    substack: SiSubstack,
    youtube: SiYoutube,
    spotify: SiSpotify,
}

type BrandLogoProps = {
    brand: BrandName
}

export function BrandLogo({ brand }: BrandLogoProps) {
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
