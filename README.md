# PulsoFit

PulsoFit is a fitness SaaS MVP with a polished training dashboard, habit
tracking, recovery signals, and a real Stripe subscription checkout for
**PulsoFit Pro** at **14,99 EUR / month**.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Stripe

Create the Stripe product and recurring price, then configure:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_1TQWpcCk2t7YRcTVDHlhW6LD
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

The checkout action uses Stripe Checkout Sessions in `subscription` mode and
the Stripe API version `2026-02-25.clover`.

Created Stripe resources:

- Product: `prod_UPLWFE70vJs1QO`
- Monthly price: `price_1TQWpcCk2t7YRcTVDHlhW6LD` (`1499` cents, `eur`)

## Scripts

- `npm run dev`: start local development
- `npm run lint`: run ESLint
- `npm run build`: build production app

## Concept

Accepted layout concept:
`C:\Users\Adri\.codex\generated_images\019dcad3-a6b9-72b3-8e8e-79623bd0687a\ig_08f82c40e91ddf750169ee4bb3c8ec819191a25b957b1d0b3b.png`

Supporting project asset:
`public/upper-body-focus.png`
