# The Vilij — Phase 1 walkthrough

An end-to-end demo of the build. Assumes the stack is running (see `README.md`)
and the provisioning + seed scripts have been run.

## Provision a fresh environment

```powershell
docker compose -f docker-compose.dev.yml up -d
cd thevilij ; corepack yarn install
cd packages/api
corepack yarn medusa db:migrate
corepack yarn seed
corepack yarn medusa user -e admin@thevilij.uk -p Vilij-dev-2026
corepack yarn medusa exec ./src/scripts/setup-uk-region.ts
corepack yarn medusa exec ./src/scripts/setup-commission.ts
corepack yarn medusa exec ./src/scripts/setup-taxonomy.ts
corepack yarn medusa exec ./src/scripts/setup-homepage.ts
corepack yarn medusa exec ./src/scripts/seed-vilij.ts
```

Then run the backend (`corepack yarn dev` in `packages/api`) and the storefront
(`corepack yarn dev` in `storefront`).

## What the seed creates

- **5 sellers**: The Vilij (own-brand, Vilij Verified) + 4 founding sellers —
  Sarah's Sensory Studio, Bright Sparks Learning, Maker & Mend, Clear Day Studio
  — one per internal supplier-mix category, all `active` (Mercur `open`).
- **7 products** with "Why I created this" + maker story, across the public
  lenses (Sensory, Wellbeing, ADHD, Education, Services) and all three product
  modes (physical, digital, service).
- **Founders Fifty** activated for the 4 founding sellers (per-seller 0% rate).
- **Homepage slots** targeted: seller spotlight → a founding seller, own-brand →
  The Vilij, community favourites → the Sensory-friendly gifts collection.

## Buyer journey (storefront, http://localhost:3000/gb)

1. **Homepage** — warm hero, six curated slots (Start shopping → lens browse,
   Community favourites products, Seller spotlight, commitments, From The Vilij,
   Behind the business). All admin-editable via the `homepage_slots` model.
2. **Physical product** `/gb/products/weighted-lap-pad` — product detail plus a
   prominent **"Why I created this"** maker-story block.
3. **Service listing** `/gb/products/brand-logo-design` — a bespoke, price-free
   enquiry page with an **enquiry form** that posts to the seller (no checkout).
4. **Digital product** `/gb/products/vilij-sensory-printables` — a 20%-commission
   digital item; post-purchase it issues a tokenised download link
   (`/digital-downloads/:token`).

## Seller + admin journey

- **Seller onboarding** is the stock Mercur flow at `/seller/register` (Stripe
  Connect onboarding activates once real Stripe keys are added — see
  `STRIPE_SETUP.md`).
- **Admin curation** at `/dashboard` → **SEND curation**: review a seller against
  trust / authenticity / fit / quality, add notes + a decision, set the funnel
  stage (which syncs Mercur's SellerStatus), and toggle Founding / Vilij Verified.
- **Product approval**: products are published via the quality gate
  (`POST /admin/products/:id/vilij-quality` with `publish: true`).

## Commission & Founders Fifty

- Digital 20%, Physical 5%, Services none (enquiry-led). Verified by
  `verify-commission.ts`.
- Founding sellers pay **0%** for 12 months; the daily `founding-fifty-expiry`
  job reverts them to standard rates and emails a 30-day warning + expiry notice
  (logged until Resend is configured).

## Verification scripts (run from `packages/api`)

```powershell
corepack yarn medusa exec ./src/scripts/verify-commission.ts      # rates + Founders Fifty
corepack yarn medusa exec ./src/scripts/verify-curation.ts        # stage sync, checklist, publish gate
corepack yarn medusa exec ./src/scripts/verify-product-modes.ts   # digital link + delivery; service product
corepack yarn medusa exec ./src/scripts/check-config.ts           # payment/payout providers
```

## Not in Phase 1 (by design)

Live Stripe payout verification (placeholder keys), Algolia search, Resend
sending, subscription boxes, affiliate/sponsored placements, automated seller
approval, and VPS deploy (brief Step 10).
