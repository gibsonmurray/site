import {
    SiGithub,
    SiInstagram,
    SiSpotify,
    SiSubstack,
    SiX,
    SiYoutube,
} from "react-icons/si"
import type { IconType } from "react-icons"
import type { WidgetBrand } from "@/lib/widgets"

const brandLogos: Record<WidgetBrand, IconType> = {
    github: SiGithub,
    instagram: SiInstagram,
    x: SiX,
    substack: SiSubstack,
    youtube: SiYoutube,
    spotify: SiSpotify,
}

type BrandLogoProps = {
    brand: WidgetBrand
}

export function BrandLogo({ brand }: BrandLogoProps) {
    const Logo = brandLogos[brand]
    return <Logo aria-hidden="true" focusable="false" />
}
