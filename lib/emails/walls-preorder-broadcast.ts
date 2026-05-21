import { publicContactEmail } from "@/lib/contact"

const siteUrl = "https://gibsonmurray.com"
const bookUrl = `${siteUrl}/books/walls`
const heroImageUrl = `${siteUrl}/books/walls-mock-1.png`

export const wallsPreorderBroadcast = {
    name: "Walls preorder announcement",
    from: "Gibson Murray <orders@gibsonmurray.com>",
    replyTo: publicContactEmail,
    subject: "Walls is now available for preorder",
    previewText:
        "The paperback, ebook, and complete preorder bundle are open now. Releases June 12th.",
    text: [
        "Hi {{{contact.first_name|there}}},",
        "",
        "Walls is now available for preorder.",
        "",
        "The paperback, ebook, and complete preorder bundle are open now, ahead of the June 12th release.",
        "",
        "Preorder here:",
        bookUrl,
        "",
        "Thanks for being on the early list. It means a lot.",
        "",
        "Cheers,",
        "Gibson Murray",
        "",
        "Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}",
    ].join("\n"),
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>Walls is now available for preorder</title>
  </head>
  <body style="margin:0; padding:0; background:#f5efe6; color:#24170f; font-family:Arial, Helvetica, sans-serif;">
    <div style="display:none; overflow:hidden; line-height:1px; opacity:0; max-height:0; max-width:0;">
      The paperback, ebook, and complete preorder bundle are open now. Releases June 12th.
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5efe6;">
      <tr>
        <td align="center" style="padding:28px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%; max-width:640px; background:#fffaf2; border:1px solid #e3d5c4;">
            <tr>
              <td style="padding:0;">
                <a href="${bookUrl}" style="display:block; text-decoration:none;">
                  <img src="${heroImageUrl}" width="640" alt="Walls book cover and preorder artwork" style="display:block; width:100%; max-width:640px; height:auto; border:0;">
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:36px 34px 18px;">
                <p style="margin:0 0 12px; color:#8c3f20; font-size:13px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;">
                  Preorders open now
                </p>
                <h1 style="margin:0; color:#24170f; font-family:Georgia, 'Times New Roman', serif; font-size:42px; line-height:1.08; font-weight:700;">
                  Walls releases June 12th.
                </h1>
                <p style="margin:18px 0 0; color:#4b3728; font-size:18px; line-height:1.65;">
                  Hi {{{contact.first_name|there}}}, you asked to hear when <em>Walls</em> was ready. It is now available for preorder in paperback, ebook, and the complete preorder bundle.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 34px 6px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e7d9c8; border-bottom:1px solid #e7d9c8;">
                  <tr>
                    <td style="padding:18px 0; width:33.333%; vertical-align:top;">
                      <p style="margin:0; color:#8c3f20; font-size:12px; font-weight:700; letter-spacing:.06em; text-transform:uppercase;">Format</p>
                      <p style="margin:6px 0 0; color:#24170f; font-size:16px; line-height:1.35;">Paperback, ebook, bundle</p>
                    </td>
                    <td style="padding:18px 10px; width:33.333%; vertical-align:top;">
                      <p style="margin:0; color:#8c3f20; font-size:12px; font-weight:700; letter-spacing:.06em; text-transform:uppercase;">Release</p>
                      <p style="margin:6px 0 0; color:#24170f; font-size:16px; line-height:1.35;">June 12th</p>
                    </td>
                    <td style="padding:18px 0; width:33.333%; vertical-align:top;">
                      <p style="margin:0; color:#8c3f20; font-size:12px; font-weight:700; letter-spacing:.06em; text-transform:uppercase;">Genre</p>
                      <p style="margin:6px 0 0; color:#24170f; font-size:16px; line-height:1.35;">Biblical fiction</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 34px 32px;">
                <p style="margin:0 0 22px; color:#4b3728; font-size:16px; line-height:1.7;">
                  <em>Walls</em> follows two Israelite spies into Jericho, where a dangerous mission becomes a story of unlikely mercy, tested faith, and courage inside a city on the edge of collapse.
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td bgcolor="#8c3f20" style="border-radius:4px;">
                      <a href="${bookUrl}" style="display:inline-block; padding:14px 22px; color:#ffffff; font-size:15px; font-weight:700; text-decoration:none;">
                        Preorder Walls
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 34px 34px;">
                <p style="margin:0; color:#6c594a; font-size:14px; line-height:1.65;">
                  Thanks for being on the early list. It means a lot.<br>
                  Gibson Murray
                </p>
              </td>
            </tr>
          </table>

          <p style="max-width:640px; margin:16px auto 0; color:#856f5d; font-size:12px; line-height:1.6; text-align:center;">
            You are receiving this because you subscribed to preorder updates for Walls.
            <br>
            <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#8c3f20; text-decoration:underline;">Unsubscribe</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`,
}
