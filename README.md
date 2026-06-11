# Gibson Murray

My personal website: A portfolio of my best web development adventures.

## Book Orders

Stripe-hosted Checkout sells books directly from the site. Physical formats
collect a shipping address in Checkout, then present flat-rate USPS and UPS
shipping choices for manual fulfillment with Pirate Ship.

Useful environment variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_CHECKOUT_SECRET_KEY` overrides checkout session creation when set
- `STRIPE_LIVE_KEY` is used as the checkout fallback before `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` is the signing secret for the Stripe webhook endpoint
- `RESEND_API_KEY`
- `BLOB_READ_WRITE_TOKEN` authenticates server-side reads from the private
  Vercel Blob store containing `ebooks/walls.epub`. The EPUB stays out of the
  repository and cannot be downloaded directly from its Blob URL.
- `NOTIFICATION_EMAIL` receives author/admin alerts and defaults to
  `gibson@gibsonmurray.com`; `ORDER_NOTIFICATION_EMAIL` remains a legacy
  fallback
- `BOOK_SHIPPING_ALLOWED_COUNTRIES` defaults to `US`

The Stripe webhook at `/api/webhooks/stripe` should subscribe to
`checkout.session.completed`, `checkout.session.async_payment_succeeded`, and
`payment_intent.payment_failed`.
New paid orders email `NOTIFICATION_EMAIL` with a stable fulfillment ID:
`stripe:<checkout-session-id>`. Use that same ID in notes or your tracking
sheet so you can tell which Stripe order already has a Pirate Ship label.
Failed payment attempts also email `NOTIFICATION_EMAIL` with Stripe's
error details and a direct Dashboard link.
Paid ebook and bundle orders automatically receive the EPUB by email. Successful
delivery is recorded on the Checkout Session as `ebook_delivered_walls`, so
webhook retries and backfills skip orders that have already been fulfilled.
The delivery process reads the private Blob server-side and sends its bytes as a
personalized email attachment, so the Blob URL and storage credentials are never
shared with buyers.

Preview the editorial delivery email:

```bash
bun run ebooks:deliver -- --preview you@example.com
```

Find all paid ebook and bundle buyers without sending:

```bash
bun run ebooks:deliver
```

Deliver to the undelivered buyer list:

```bash
bun run ebooks:deliver -- --send
```

Export physical-book buyers as a Pirate Ship-friendly CSV:

```bash
bun run orders:buyers -- --book walls > buyers.csv
```

The export emits one row per paid Stripe Checkout Session. Use
`--since YYYY-MM-DD` to limit a shipping batch, or `--all` to include
digital-only purchases. The `Fulfillment ID` column is there so you can check
your own shipping log before buying another label.
