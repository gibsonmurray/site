import { readFile } from "node:fs/promises"
import path from "node:path"

import { ManuscriptReader } from "@/components/manuscript-reader"

export default async function Page() {
    const manuscript = await readFile(
        path.join(process.cwd(), "data", "manuscript.md"),
        "utf8",
    )

    return <ManuscriptReader manuscript={manuscript} />
}
