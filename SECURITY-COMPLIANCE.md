# PulsoFit Security And Compliance Baseline

Last updated: 2026-04-26

This file records the launch baseline for a Spain/EU fitness SaaS MVP. It is
not legal advice and must be reviewed with the final business details before
public sale.

## Implemented In Code

- Free plan is usable but restricted: 3 weekly workouts, 3 active habits, basic
  intensity tracking, and preview-only recovery.
- Stripe Checkout uses subscription mode and Stripe-hosted payment collection.
- Monthly price: 14.99 EUR/month.
- Yearly price: 152.90 EUR/year, which applies a 15% discount versus 12 monthly
  payments.
- Legal pages exist at `/legal/privacy`, `/legal/terms`, `/legal/refunds`,
  `/legal/cookies`, and `/legal/security`.
- InsForge Auth protects the app workspace and requires email verification for
  newly-created accounts.
- InsForge Postgres stores user-owned profiles, workouts, habits, progress, and
  subscription records with row-level security policies.
- Refund policy is consumer-friendly: EU statutory rights plus a no-questions
  30-day first-subscription refund.
- Security headers are configured in `next.config.ts`.
- Middleware blocks common hostile probe paths and known scanner user agents.

## Vercel Controls

Vercel includes automatic DDoS mitigation at the platform edge. For a real
commercial launch, also enable or review these project controls in Vercel
Firewall according to the active Vercel plan:

- Vercel Firewall enabled for the PulsoFit project.
- Managed rules enabled where available: Vercel ruleset, OWASP protection, bot
  protection, and AI bot controls if relevant.
- Rate limiting for sensitive endpoints, especially checkout/session creation.
- Alerts and log review for repeated 4xx/5xx spikes.
- Attack Challenge Mode during active incidents.

The Vercel CLI used in this workspace does not expose Firewall configuration
commands. The REST Firewall API requires a bearer token, so dashboard/API
changes should be done with an owner token and reviewed before production use.

## Before Public Launch

- Replace placeholder legal identity with the real company/autonomo details,
  NIF/CIF, registered address, and support/privacy email.
- Sign and retain Data Processing Agreements with Stripe, Vercel, and any other
  processor, including InsForge.
- If analytics, ads, heatmaps, or tracking cookies are added, implement a cookie
  consent banner before loading them.
- Publish a self-service Stripe Customer Portal link for cancellations,
  invoices, and refunds where possible.
- Add Stripe webhook handling for subscription lifecycle events before gating
  paid Pro access from real subscription status.
