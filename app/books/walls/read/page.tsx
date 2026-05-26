import { permanentRedirect } from "next/navigation"
import sample from "@/data/walls-sample.json"

const WallsSampleIndexPage = () => {
    permanentRedirect(`/books/walls/read/${sample.chapters[0].id}#chapter`)
}

export default WallsSampleIndexPage
