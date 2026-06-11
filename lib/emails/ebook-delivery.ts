import { books } from "@/lib/books"
import { publicContactEmail } from "@/lib/contact"

const siteUrl = "https://gibsonmurray.com"
const sendToKindleUrl = "https://www.amazon.com/sendtokindle"
const ebookHelpUrl = `${siteUrl}/books/ebook-help`

type EbookDeliveryEmailOptions = {
    bookId: string
    customerName?: string | null
}

const escapeHtml = (value: string) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;")

const getFirstName = (name?: string | null) =>
    name?.trim().split(/\s+/).filter(Boolean)[0]

export const getEbookDeliveryEmail = ({
    bookId,
    customerName,
}: EbookDeliveryEmailOptions) => {
    const book = books.find((candidate) => candidate.slug === bookId)
    if (!book) {
        throw new Error(`Unknown book: ${bookId}`)
    }

    const firstName = getFirstName(customerName)
    const greeting = firstName ? `Hi ${firstName},` : "Hi there,"
    const bookUrl = `${siteUrl}/books/${book.slug}`
    const coverUrl = `${siteUrl}${book.coverImageSrc}`

    return {
        from: "Gibson Murray <orders@gibsonmurray.com>",
        replyTo: publicContactEmail,
        subject: `Your ebook copy of ${book.title}`,
        text: [
            greeting,
            "",
            `Your ebook copy of ${book.title} is here. The EPUB file is attached to this email.`,
            "",
            "Read it in Apple Books",
            "Open the EPUB attachment on your Apple device, then choose Books.",
            "",
            "Read it on Kindle",
            `Save the EPUB attachment, then upload it with Send to Kindle: ${sendToKindleUrl}`,
            "",
            `Step-by-step instructions with pictures: ${ebookHelpUrl}`,
            "",
            "Keep this email so you can download the attached file again later.",
            "",
            "Thank you for supporting the book.",
            "Gibson Murray",
            "",
            `Book details: ${bookUrl}`,
            `Questions? Reply to this email or write to ${publicContactEmail}.`,
        ].join("\n"),
        html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>Your ebook copy of ${escapeHtml(book.title)}</title>
    <style>
      @media only screen and (max-width: 520px) {
        .delivery-title { font-size: 44px !important; }
        .delivery-cover { width: 86px !important; }
        .reader-column { display: block !important; width: auto !important; padding: 20px 0 24px !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background:#ffffff; color:#171717; font-family:Arial, Helvetica, sans-serif;">
    <div style="display:none; overflow:hidden; line-height:1px; opacity:0; max-height:0; max-width:0;">
      Your EPUB copy of ${escapeHtml(book.title)} is attached and ready to read.
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;">
      <tr>
        <td align="center" style="padding:24px 16px 40px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%; max-width:640px;">
            <tr>
              <td style="border-top:1px solid #d8d8d8; padding:16px 0 28px; color:#005c3f; font-size:11px; font-weight:700; letter-spacing:.18em; text-transform:uppercase;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="color:#005c3f; font-size:11px; font-weight:700; letter-spacing:.18em; text-transform:uppercase;">Digital delivery</td>
                    <td align="right" style="color:#005c3f; font-family:Georgia, 'Times New Roman', serif; font-size:20px; font-weight:400; letter-spacing:-.04em;">Gibson Murray</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 0 30px;">
                <h1 class="delivery-title" style="max-width:570px; margin:0; color:#171717; font-family:Georgia, 'Times New Roman', serif; font-size:58px; line-height:.96; font-weight:400; letter-spacing:-.055em;">
                  Your copy of <em>${escapeHtml(book.title)}</em> is here.
                </h1>
                <p style="max-width:520px; margin:24px 0 0; color:#666666; font-size:17px; line-height:1.75;">
                  ${escapeHtml(greeting)} Thank you for ordering directly from me. Your EPUB file is attached to this email and ready to open in your favorite reading app.
                </p>
              </td>
            </tr>

            <tr>
              <td style="border-block:1px solid #d8d8d8; padding:24px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="118" valign="top" style="padding-right:24px;">
                      <a href="${bookUrl}" style="display:block; text-decoration:none;">
                        <img class="delivery-cover" src="${coverUrl}" width="118" alt="${escapeHtml(book.coverImageAlt)}" style="display:block; width:118px; height:auto; border:0;">
                      </a>
                    </td>
                    <td valign="top">
                      <p style="margin:0; color:#005c3f; font-size:10px; font-weight:700; letter-spacing:.17em; text-transform:uppercase;">Attached file</p>
                      <h2 style="margin:10px 0 0; color:#171717; font-family:Georgia, 'Times New Roman', serif; font-size:32px; line-height:1; font-weight:400; letter-spacing:-.045em;">${escapeHtml(book.title)}.epub</h2>
                      <p style="margin:15px 0 0; color:#666666; font-size:14px; line-height:1.65;">Keep this email so you can download the attached EPUB again later.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:34px 0 8px;">
                <p style="margin:0; color:#005c3f; font-size:10px; font-weight:700; letter-spacing:.17em; text-transform:uppercase;">Choose your reader</p>
              </td>
            </tr>

            <tr>
              <td>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="reader-column" valign="top" width="50%" style="border-top:1px solid #d8d8d8; padding:20px 24px 24px 0;">
                      <h2 style="margin:0; color:#171717; font-family:Georgia, 'Times New Roman', serif; font-size:27px; line-height:1; font-weight:400; letter-spacing:-.045em;">Apple Books</h2>
                      <p style="margin:14px 0 0; color:#666666; font-size:14px; line-height:1.65;">Open the EPUB attachment on your Apple device, then choose Books.</p>
                    </td>
                    <td class="reader-column" valign="top" width="50%" style="border-top:1px solid #d8d8d8; padding:20px 0 24px 24px;">
                      <h2 style="margin:0; color:#171717; font-family:Georgia, 'Times New Roman', serif; font-size:27px; line-height:1; font-weight:400; letter-spacing:-.045em;">Kindle</h2>
                      <p style="margin:14px 0 18px; color:#666666; font-size:14px; line-height:1.65;">Save the EPUB attachment, then send it to your Kindle library.</p>
                      <a href="${sendToKindleUrl}" style="display:inline-block; background:#171717; padding:12px 16px; color:#ffffff; font-size:12px; font-weight:700; letter-spacing:.04em; text-decoration:none;">Open Send to Kindle</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="border-top:1px solid #d8d8d8; padding:26px 0 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 28px;">
                  <tr>
                    <td bgcolor="#005c3f">
                      <a href="${ebookHelpUrl}" style="display:inline-block; padding:14px 18px; color:#ffffff; font-size:13px; font-weight:700; text-decoration:none;">See step-by-step instructions</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0; color:#171717; font-family:Georgia, 'Times New Roman', serif; font-size:22px; line-height:1.35; font-weight:400; letter-spacing:-.035em;">Thank you for supporting the book.</p>
                <p style="margin:14px 0 0; color:#666666; font-size:13px; line-height:1.7;">
                  Gibson Murray<br>
                  <a href="${bookUrl}" style="color:#005c3f; text-decoration:underline;">Book details</a>
                  &nbsp;&middot;&nbsp;
                  <a href="mailto:${publicContactEmail}" style="color:#005c3f; text-decoration:underline;">Questions</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    }
}
