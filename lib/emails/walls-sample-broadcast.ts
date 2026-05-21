const siteUrl = "https://gibsonmurray.com"
const bookUrl = `${siteUrl}/books/walls`
const sampleUrl = `${siteUrl}/books/walls/read`
const heroImageUrl = `${siteUrl}/books/walls-mock-1.png`

export const wallsSampleBroadcast = {
    name: "Walls sample announcement",
    from: "Gibson Murray <orders@gibsonmurray.com>",
    replyTo: "gibmurrays@gmail.com",
    subject: "You can read the first three chapters of Walls",
    previewText:
        "The first three chapters of Walls are now available to read on the site.",
    text: [
        "Hi {{{contact.first_name|there}}},",
        "",
        "You can now read the first three chapters of Walls right on the site.",
        "",
        "Read the sample here:",
        sampleUrl,
        "",
        "If you already preordered, thank you. I wanted you to have an early look at the opening chapters. If you signed up for preorder updates and are still deciding, this should give you a much better feel for the story.",
        "",
        "You can also find the full book page here:",
        bookUrl,
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
    <title>You can read the first three chapters of Walls</title>
  </head>
  <body style="margin:0; padding:0; background:#f6f1ea; color:#24170f; font-family:Arial, Helvetica, sans-serif;">
    <div style="display:none; overflow:hidden; line-height:1px; opacity:0; max-height:0; max-width:0;">
      The first three chapters of Walls are now available to read on the site.
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f1ea;">
      <tr>
        <td align="center" style="padding:28px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%; max-width:640px; background:#fffaf2; border:1px solid #e2d6c8;">
            <tr>
              <td style="padding:0;">
                <a href="${sampleUrl}" style="display:block; text-decoration:none;">
                  <img src="${heroImageUrl}" width="640" alt="Walls book cover and artwork" style="display:block; width:100%; max-width:640px; height:auto; border:0;">
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:36px 34px 18px;">
                <p style="margin:0 0 12px; color:#8c3f20; font-size:13px; font-weight:700; letter-spacing:.08em; text-transform:uppercase;">
                  First chapters available
                </p>
                <h1 style="margin:0; color:#24170f; font-family:Georgia, 'Times New Roman', serif; font-size:40px; line-height:1.1; font-weight:700;">
                  Read the opening of <em>Walls</em>.
                </h1>
                <p style="margin:18px 0 0; color:#4b3728; font-size:18px; line-height:1.65;">
                  Hi {{{contact.first_name|there}}}, the first three chapters of <em>Walls</em> are now available to read right on the site.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:8px 34px 6px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e7d9c8; border-bottom:1px solid #e7d9c8;">
                  <tr>
                    <td style="padding:18px 0; width:33.333%; vertical-align:top;">
                      <p style="margin:0; color:#8c3f20; font-size:12px; font-weight:700; letter-spacing:.06em; text-transform:uppercase;">Sample</p>
                      <p style="margin:6px 0 0; color:#24170f; font-size:16px; line-height:1.35;">First three chapters</p>
                    </td>
                    <td style="padding:18px 10px; width:33.333%; vertical-align:top;">
                      <p style="margin:0; color:#8c3f20; font-size:12px; font-weight:700; letter-spacing:.06em; text-transform:uppercase;">Read time</p>
                      <p style="margin:6px 0 0; color:#24170f; font-size:16px; line-height:1.35;">About 37 minutes</p>
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
                  If you already preordered, thank you. I wanted you to have an early look at the opening chapters. If you signed up for preorder updates and are still deciding, this should give you a much better feel for the story.
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td bgcolor="#8c3f20" style="border-radius:4px;">
                      <a href="${sampleUrl}" style="display:inline-block; padding:14px 22px; color:#ffffff; font-size:15px; font-weight:700; text-decoration:none;">
                        Read the first three chapters
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:22px 0 0; color:#6c594a; font-size:14px; line-height:1.65;">
                  You can also visit the full <a href="${bookUrl}" style="color:#8c3f20; text-decoration:underline;">Walls book page</a>.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:0 34px 34px;">
                <p style="margin:0; color:#6c594a; font-size:14px; line-height:1.65;">
                  Cheers,<br>
                  Gibson Murray
                </p>
              </td>
            </tr>
          </table>

          <p style="max-width:640px; margin:16px auto 0; color:#856f5d; font-size:12px; line-height:1.6; text-align:center;">
            You are receiving this because you preordered <em>Walls</em> or subscribed to preorder updates.
            <br>
            <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#8c3f20; text-decoration:underline;">Unsubscribe</a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`,
}
