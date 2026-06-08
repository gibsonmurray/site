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

Export physical-book buyers as a Pirate Ship-friendly CSV:

```bash
bun run orders:buyers -- --book walls > buyers.csv
```

The export emits one row per paid Stripe Checkout Session. Use
`--since YYYY-MM-DD` to limit a shipping batch, or `--all` to include
digital-only purchases. The `Fulfillment ID` column is there so you can check
your own shipping log before buying another label.
