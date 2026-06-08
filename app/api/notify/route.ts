import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { books } from "@/lib/books"
import { notificationEmail, publicContactEmail } from "@/lib/contact"

const resend = new Resend(process.env.RESEND_API_KEY!)

const AUDIENCE_ID = "652a20bd-5f37-4ad1-9579-3c9ec60748f1"
const PREORDER_SEGMENT_ID = process.env.RESEND_PREORDER_SEGMENT_ID

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { email, bookSlug } = body

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

    const book = books.find((b) => b.slug === bookSlug)
    if (!book) {
        return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    const releaseDate =
        book.status.type === "pre-order" ? book.status.releaseDate : null

    await Promise.all([
        PREORDER_SEGMENT_ID
            ? resend.contacts.create({
                  email,
                  unsubscribed: false,
                  segments: [{ id: PREORDER_SEGMENT_ID }],
                  properties: {
                      book_slug: book.slug,
                      book_title: book.title,
                  },
              })
            : resend.contacts.create({
                  audienceId: AUDIENCE_ID,
                  email,
                  unsubscribed: false,
              }),
        // Confirmation to subscriber
        resend.emails.send({
            from: "orders@gibsonmurray.com",
            replyTo: publicContactEmail,
            to: email,
            subject: `You're on the list 🥳 — ${book.title}`,
            text: [
                `Hi there,`,
                ``,
                `You're on the list! We'll send you an email as soon as pre-orders open for "${book.title}"${releaseDate ? `, releasing ${releaseDate}` : ""}.`,
                ``,
                `Thanks for your interest!`,
                ``,
                `Cheers,`,
                `Gibson Murray`,
                `https://gibsonmurray.com`,
            ].join("\n"),
        }),
        // Notification to author
        resend.emails.send({
            from: "orders@gibsonmurray.com",
            to: notificationEmail,
            subject: `New pre-order notification signup — ${book.title}`,
            text: [
                `New signup for pre-order notifications:`,
                ``,
                `  Book:  ${book.title}`,
                `  Email: ${email}`,
            ].join("\n"),
        }),
    ])

    return NextResponse.json({ success: true })
}
