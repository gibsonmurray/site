# Gibson Murray

My personal website: A portfolio of my best web development adventures.

## Book Orders

Stripe Checkout sells books directly from the site. Physical formats collect a
shipping address and charge a flat shipping amount for manual fulfillment with
Pirate Ship.

Useful environment variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `BOOK_SHIPPING_BASE_CENTS` defaults to `599`
- `BOOK_SHIPPING_ADDITIONAL_CENTS` defaults to `100`
- `BOOK_SHIPPING_ALLOWED_COUNTRIES` defaults to `US`
- `BOOK_SHIPPING_DISPLAY_NAME` defaults to `USPS shipping via Pirate Ship`

New paid orders email `PUBLIC_CONTACT_EMAIL` with a stable fulfillment ID:
`stripe:<checkout-session-id>`. Use that same ID in notes or your tracking
sheet so you can tell which Stripe order already has a Pirate Ship label.

Export physical-book buyers as a Pirate Ship-friendly CSV:

```bash
bun run orders:buyers -- --book walls > buyers.csv
```

The export emits one row per paid Stripe Checkout Session. Use
`--since YYYY-MM-DD` to limit a shipping batch, or `--all` to include
digital-only purchases. The `Fulfillment ID` column is there so you can check
your own shipping log before buying another label.
