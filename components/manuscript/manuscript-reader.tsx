"use client"

import { useMemo, useState } from "react"
import { useScroll } from "motion/react"

import { ManuscriptWord } from "@/components/manuscript/manuscript-word"
import { ReaderFooter } from "@/components/manuscript/reader-footer"
import { isWhitespaceToken, parseManuscript } from "@/lib/manuscript"

export function ManuscriptReader({ manuscript }: { manuscript: string }) {
    const tokens = useMemo(() => parseManuscript(manuscript), [manuscript])
    const wordTokens = useMemo(() => tokens.filter((token) => !isWhitespaceToken(token)), [tokens])
    const { scrollY } = useScroll()
    const [manuscriptComplete, setManuscriptComplete] = useState(false)
    const lastWordIndex = wordTokens.length - 1

    return (
        <main className="manuscript" aria-labelledby="page-title">
            <h1 className="seo-heading" id="page-title">
                Gibson Murray — Author, Programmer, and Storyteller
            </h1>
            <article className="manuscript-text" aria-label="A story about stories">
                {tokens.map((token, tokenIndex) => {
                    if (isWhitespaceToken(token)) {
                        return token.text.split("").map((character, characterIndex) =>
                            character === "\n" ? (
                                <br key={`${tokenIndex}-${characterIndex}`} />
                            ) : (
                                character
                            ),
                        )
                    }

                    const wordIndex = wordTokens.indexOf(token)

                    return (
                        <ManuscriptWord
                            accent={token.accent}
                            index={wordIndex}
                            key={tokenIndex}
                            onCompletionChange={
                                wordIndex === lastWordIndex ? setManuscriptComplete : undefined
                            }
                            scrollY={scrollY}
                            text={token.text}
                        />
                    )
                })}
            </article>
            <ReaderFooter visible={manuscriptComplete} />
        </main>
    )
}
