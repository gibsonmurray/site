import { NextResponse } from "next/server"

const CONTACT_EMAIL = "hi@gibsonmurray.com"
const SEND_WINDOW_MS = 10 * 60 * 1000
const SEND_LIMIT = 5
const recentSends = new Map<string, number[]>()

function isRateLimited(clientId: string) {
    const now = Date.now()
    const activeSends = (recentSends.get(clientId) ?? []).filter(
        (sentAt) => now - sentAt < SEND_WINDOW_MS,
    )

    if (activeSends.length >= SEND_LIMIT) {
        recentSends.set(clientId, activeSends)
        return true
    }

    activeSends.push(now)
    recentSends.set(clientId, activeSends)
    return false
}

export async function POST(request: Request) {
    const origin = request.headers.get("origin")
    const requestHost =
        request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ??
        request.headers.get("host")
    if (origin && requestHost) {
        let originHost = ""
        try {
            originHost = new URL(origin).host
        } catch {
            return NextResponse.json(
                { error: "Invalid origin" },
                { status: 403 },
            )
        }

        if (originHost !== requestHost) {
            return NextResponse.json(
                { error: "Invalid origin" },
                { status: 403 },
            )
        }
    }

    const clientId =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "unknown"
    if (isRateLimited(clientId)) {
        return NextResponse.json(
            { error: "Too many messages" },
            { status: 429 },
        )
    }

    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const message =
        typeof body === "object" &&
        body !== null &&
        "message" in body &&
        typeof body.message === "string"
            ? body.message.trim()
            : ""

    if (!message || message.length > 2000) {
        return NextResponse.json({ error: "Invalid message" }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
        return NextResponse.json(
            { error: "Email is not configured" },
            { status: 503 },
        )
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
            from: "Gibson Murray Portfolio <messages@gibsonmurray.com>",
            to: [CONTACT_EMAIL],
            subject: "New message from gibsonmurray.com",
            text: message,
        }),
    })

    if (!resendResponse.ok) {
        return NextResponse.json(
            { error: "Message delivery failed" },
            { status: 502 },
        )
    }

    return NextResponse.json({ delivered: true })
}
