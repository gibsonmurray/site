export const ACCENT_KINDS = [
    "ai-searching",
    "bible",
    "champion",
    "code",
    "friend",
    "globe",
    "hero",
    "idea",
    "laugh",
    "logo",
    "love",
    "movie",
    "nerd",
    "plant",
    "pointing",
    "school",
    "signature",
    "teacher",
    "tennis",
    "zoom",
] as const

export type AccentKind = (typeof ACCENT_KINDS)[number]

export type ManuscriptToken = {
    accent?: AccentKind
    text: string
}

const ACCENT_BY_MARKER: Record<string, AccentKind> = {
    best: "ai-searching",
    Book: "bible",
    programmer: "code",
    friend: "friend",
    world: "globe",
    "underdog's rise": "hero",
    imagination: "idea",
    laugh: "laugh",
    Gibson: "logo",
    love: "love",
    theaters: "movie",
    "least favorite student": "nerd",
    your: "pointing",
    school: "school",
    author: "signature",
    blackboard: "teacher",
    "fling the ball": "tennis",
    "zoom out": "zoom",
}

export function parseManuscript(source: string): ManuscriptToken[] {
    let liveMarkerCount = 0
    const pieces = source.match(/~[^~]+~[.,!?;:]?|\s+|[^\s]+/g) ?? []

    return pieces.map((piece) => {
        const marker = piece.match(/~([^~]+)~/)?.[1]
        let accent = marker ? ACCENT_BY_MARKER[marker] : undefined

        if (marker === "live") {
            accent = liveMarkerCount === 0 ? "plant" : "champion"
            liveMarkerCount += 1
        }

        return {
            accent,
            text: piece.replaceAll("~", ""),
        }
    })
}

export function isWhitespaceToken(token: ManuscriptToken): boolean {
    return /^\s+$/.test(token.text)
}
