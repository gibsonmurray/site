interface BiblePassageProps {
    bookName: string
    chapter: number
    passageHtml: string
}

export const BiblePassage = ({ bookName, chapter, passageHtml }: BiblePassageProps) => {
    return (
        <>
            <div className="relative flex w-full max-w-xl items-center gap-2">
                <div className="bg-bible-red h-10 w-3"></div>
                <h2 className="text-foreground font-newsreader text-start text-4xl">
                    {bookName}
                </h2>
            </div>
            <h3 className="text-bible-red font-newsreader w-full max-w-xl text-start text-4xl">
                {chapter}
            </h3>
            <div
                className="prose font-newsreader max-w-xl"
                dangerouslySetInnerHTML={{
                    __html: passageHtml,
                }}
            />
        </>
    )
}

