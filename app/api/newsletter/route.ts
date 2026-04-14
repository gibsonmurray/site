import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

const AUDIENCE_ID = "652a20bd-5f37-4ad1-9579-3c9ec60748f1"

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { email } = body

    if (
        !email ||
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        return NextResponse.json(
            { error: "Invalid email address" },
            { status: 400 },
        )
    }

    await Promise.all([
        resend.contacts.create({
            audienceId: AUDIENCE_ID,
            email,
            unsubscribed: false,
        }),
        resend.emails.send({
            from: "hello@gibsonmurray.com",
            to: email,
            subject: "You're subscribed!",
            text: [
                `Hi there,`,
                ``,
                `Thanks for subscribing! You'll hear from me when I publish new blog posts, book updates, and other news.`,
                ``,
                `Cheers,`,
                `Gibson Murray`,
                `https://gibsonmurray.com`,
            ].join("\n"),
        }),
    ])

    return NextResponse.json({ success: true })
}
