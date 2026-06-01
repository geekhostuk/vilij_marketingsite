# The Vilij — Marketplace Build Plan (Phase 1)

**Audience:** Claude Code
**Author handoff:** Joe Talbot / Geekhost (technical design)
**Status:** Phase 1 — validation build (target 25–50 founding sellers)

---

## 0. Read this first

This is a build brief, not a finished spec. Before scaffolding anything, **verify the current state of the dependencies** — Medusa and Mercur both move fast and the API surface shifts between releases:

- Check the latest stable Medusa v2 version (was v2.13.x at time of writing).
- Check the latest stable **Mercur** release. v1.0 is the production-ready, self-hostable open-source B2C release; a v2.0 ("AI-native architecture") has since appeared — confirm which is the current recommended self-host target before committing, and read the Mercur deployment docs for that version.
- Clone and read the Mercur monorepo README and docs (`github.com/mercurjs/mercur`, `docs.mercurjs.com`) so you build on actual module names and workflows, not assumptions.

**Do not invent Mercur/Medusa APIs.** Where this plan describes a capability, locate the real module/workflow/route in the cloned source and extend *that*. Mercur is designed to be extended via Medusa conventions (modules, workflows, events, plugins) without patching core.

---

## 1. What we're building

**The Vilij** is a curated, values-led multi-vendor marketplace for the SEND (Special Educational Needs & Disabilities) community. Sellers are SEND parents/grandparents running small independent businesses. The product is *trusted emotional curation* — warmth, storytelling and quality — not ecommerce technology.

Phase 1 is a **validation build**: prove supplier demand and emotional alignment with a small cohort of hand-picked founding sellers. So: lean, beautiful, manually curated. Do **not** over-engineer or build the growth-phase features listed in §9.

### Defining mechanics (the non-negotiables)

1. **Multi-vendor**: sellers create/manage their own listings and fulfil their own orders. The Vilij hosts, vets and takes commission.
2. **Split payouts via Stripe Connect**: customer pays The Vilij; order is split per seller; payout to each seller is automated, minus commission.
3. **Commission varies by product type and per seller** (see §4).
4. **Heavy manual curation pipeline**: nothing goes live without human approval (see §3).
5. **Storytelling is a first-class feature**, not decoration (see §5).
6. **Three product modes**: physical (seller-fulfilled), digital (download/license, platform-delivered), services (enquiry-led in Phase 1).

---

## 2. Architecture decision

**Stack: MercurJS (on Medusa v2), self-hosted, with a bespoke storefront.**

Rationale: Mercur is MIT-licensed, open-source, self-hostable on our own VPS/Docker, with zero transaction fees and full code ownership. It already implements the expensive marketplace plumbing — sellers, onboarding, product-approval requests, a commission engine, reviews, order splitting, and **Stripe Connect payouts** — so we don't rebuild financial plumbing or commerce primitives. We then build the *warmth* on top.

### Monorepo layout (Mercur)

| App | What it is | Our work |
|-----|-----------|----------|
| `apps/backend` | Medusa + Mercur marketplace engine (Postgres) | Extend: SEND application fields, commission rules, founding-seller logic, digital/service product types |
| Admin panel | Marketplace ops: vendor verification, product approval queue, commission rules, payouts | Light: add SEND review checklist fields, badge management; mostly reuse |
| Vendor panel (Next.js) | Seller dashboard: products, orders, earnings, payouts | Light: rebrand; expose "Why I created this" + story fields on product/profile |
| **Storefront (Next.js)** | Public shopping site | **Heavy: this is the bespoke build.** Replace/restyle for the warm, Etsy-like, storytelling-led experience |

### Stated direction vs reality

The founders' brief says "Shopify → marketplace → Stripe". That was lay shorthand for "we sell things and use Stripe". Mercur honours the *intent* — a real commerce engine, a marketplace layer, Stripe Connect payouts — without the multi-vendor constraints and per-seller SaaS fees a Shopify-app route would impose. No Shopify dependency in Phase 1.

### Infrastructure (target: our IONOS VPS)

- **Runtime:** Node.js 20+, PostgreSQL, Redis (Medusa uses Redis for events/workflow engine in production — don't run prod on the in-memory defaults).
- **Containers:** Docker Compose (backend, postgres, redis, storefront, vendor-panel, admin). Reverse proxy / TLS via the existing nginx/Caddy setup.
- **Email:** Resend (Mercur ships transactional email via Resend + MJML templates). Need a domain + DKIM.
- **Search:** Algolia is the Mercur default. For 25–50 sellers, evaluate whether Postgres/Medusa search is sufficient for Phase 1 and defer Algolia to avoid a paid dependency — decide during build.
- **Skip in Phase 1 unless trivially free:** TalkJS (vendor messaging), Stripe Tax, EasyPost shipping labels. Add later if validated.

---

## 3. Curation pipeline (manual, high-touch)

The brief is explicit: keep approval manual for the first 1–2 years. Mercur already provides a **request centre / vendor verification / product-approval queue** — build on it, don't replace it.

Flow:

```
Seller applies (extended SEND application form)
  → Admin reviews against fit criteria (review checklist)
  → Admin approves on fit  [status change]
  → Offline: personal welcome video call with Steph & Charlie  [status change only — no tech]
  → Seller onboards (Stripe Connect account setup, builds profile + listings)
  → Every product reviewed before going live  [Mercur product-approval queue]
```

Build tasks:

- **Extend the seller application** with SEND-specific fields: the SEND connection / lived-experience story, business stage (must already be trading), category, links, "why this belongs in The Vilij". Store on the seller entity (extend the Mercur Seller model via Medusa).
- **Review checklist** surfaced in admin: trust, authenticity, curation fit, quality. Free-text reviewer notes + a fit decision.
- **Seller statuses** that reflect the funnel: `applied → in_review → approved_pending_welcome → onboarding → active` (+ `paused`, `rejected`). Map onto Mercur's existing seller/store status where possible; add states only if needed.
- **Product approval**: keep the requirement that products are `in_review` and an admin approves before `live`. This already exists in Mercur — wire the SEND quality checklist into it.
- **Badges:** `Founding Seller` and `Vilij Verified`. Model as seller attributes/flags; display prominently on profiles and listings.

The welcome video call is a real-world step — represent it only as a status transition + an admin note. No scheduling tech in Phase 1.

---

## 4. Commission & payouts

Configure Mercur's commission engine with these rules:

| Product type | Commission |
|---|---|
| Digital products | 20% |
| Physical products | 5% |
| Services | TBC — treat as enquiry-led in Phase 1 (likely no transaction, so no commission yet) |

**Founders Fifty override:** founding sellers pay **0% for 12 months** from their activation date.

Implementation:

- Use Mercur commission **rules** keyed by product type for the base 5% / 20%.
- Model the founding-seller 0% as a **per-seller commission override with an expiry date** (store `founding_until` on the seller).
- Add a **scheduled job/workflow** (Medusa scheduled job) that, daily, finds founding sellers whose `founding_until` has passed, removes the 0% override (reverting them to standard rates), and triggers a notification email (Resend) + admin alert. Don't silently change someone's economics — notify ahead of expiry too (e.g. 30 days before).
- Verify every order writes a **commission line** (Mercur does this) so payouts are auditable.

**Payouts:** use Mercur's Stripe Connect payout module as-is — seller payout-account onboarding, automated transfers, reversals, webhook status. Confirm Stripe Connect account type (Express is the usual fit for this: sellers onboard via Stripe-hosted flow, platform controls payouts). Configure for **UK / GBP** and Stripe Connect availability in the UK.

---

## 5. The storefront (bespoke — the real design work)

This is where the brand lives. Restyle/replace the Mercur storefront for a warm, calm, trusted, Etsy-like *discovery* feel. Apply the frontend-design skill; avoid generic ecommerce-template aesthetics.

### Homepage — 6 preview blocks (from the brief)

1. **Start Shopping** (category entry)
2. **Seller Spotlight** — "Meet Sarah — autism mum and creator of…"
3. **New This Week**
4. **SEND Parent / Community Favourites**
5. **Vilij own-brand products**
6. **Behind the Business** — storytelling features

These are **curated slots** — admin chooses what appears. Model them as editable homepage feature slots (a small content model in the backend the admin can populate), not hardcoded queries.

### Category browse + filtering

Customer-facing filter taxonomy (note: this differs from the internal supplier-mix categories in §6 — these are the *shopper's* lenses):

`Autism · ADHD · Education · Wellbeing · Sensory · Parent Support · Digital Downloads · Gifts · Services`

Plus gift guides as curated collections: sensory-friendly gifts, burnout-recovery gifts, ADHD organisation, teacher thank-you gifts.

### Seller profiles (the emotional/trust layer — drives conversion)

Every seller profile must carry: **story**, **SEND connection**, **photos**, **reviews**, **products/services**, and a **"Why I created this"** narrative per product. Extend the Mercur seller/store profile and product models with these content fields, and design the profile page to lead with story, not a product grid.

### Tone

Warm, community-led, "supporting each other" — not transactional. Microcopy matters: "Discover", "Support", "From our community to yours". Calm, restorative visual language (especially the Wellbeing category).

---

## 6. Categories & launch mix (internal)

Internal supplier-mix target for the first ~50 sellers (for recruitment balance — not necessarily the public nav):

| Internal category | Target suppliers |
|---|---|
| Wellbeing & Self-Care | 15 |
| SEND Resources & Tools | 15 |
| Creative & Handmade Businesses | 15 |
| Digital & Creative Services | 5 |

Set up the product category tree to support both the internal grouping and the public filter lenses (§5). Keep it data-driven so the founders can adjust without a code change.

---

## 7. Product modes

- **Physical** — standard Medusa product; seller fulfils. Shipping config kept simple in Phase 1 (flat/manual). Defer EasyPost labels.
- **Digital** — use Mercur/Medusa digital-product support (digital inventory, license keys, downloadable assets). Platform delivers securely post-purchase. This is the 20%-commission tier.
- **Services** (VA, bookkeeping, branding, web/design) — these don't fit add-to-cart cleanly. **Phase 1: enquiry-led listings** (a service profile + an enquiry/contact action that routes to the seller), not transactional checkout. Revisit transactional/booking flow post-validation.

**Vilij own-brand:** model The Vilij itself as a seller account so own-brand products (journals, planners, sensory products) flow through the same system.

---

## 8. Build sequence (suggested order for Claude Code)

1. **Scaffold & run Mercur locally.** Clone the monorepo, install, configure `.env` (DATABASE_URL, Stripe keys), get backend + admin + vendor panel + storefront running against local Postgres/Redis in Docker. Confirm the stock multi-vendor flow works end-to-end (seller signup → product → order → split → payout in Stripe test mode) **before customising anything**.
2. **Stripe Connect (test mode), UK/GBP.** Verify the payout flow and commission lines on a test order.
3. **Commission rules + Founders Fifty.** Configure 5%/20%, add the per-seller 0% override + expiry + scheduled expiry job + notifications.
4. **Curation extensions.** Extend the seller application (SEND fields), review checklist, seller statuses, badges; wire the SEND checklist into the existing product-approval queue.
5. **Categories & taxonomy.** Build the category tree + public filter lenses + gift-guide collections.
6. **Product modes.** Enable digital products + delivery; build services-as-enquiry.
7. **Storefront rebuild.** The bespoke warm storefront: 6 homepage blocks (admin-curated slots), category browse/filter, story-led seller profiles, "Why I created this", gift guides. (Largest chunk — apply frontend-design skill.)
8. **Branding pass** across storefront, vendor panel, admin, and Resend email templates.
9. **Seed + walkthrough.** Seed a handful of realistic sellers/products across the four internal categories; do a full buyer + seller + admin walkthrough.
10. **Deploy to VPS.** Docker Compose on IONOS, Postgres + Redis, Resend domain/DKIM, Stripe live keys, TLS, backups. Document the runbook.

Work in vertical slices and keep each step runnable. Commit at each step. Don't fork/patch Mercur core — extend via Medusa modules/workflows/plugins so we can pull upstream updates.

---

## 9. Explicitly NOT in Phase 1

Design data models so these *can* exist later, but **do not build**:

- Subscription boxes / SEND wellbeing boxes
- Vilij own-brand range beyond a token few products
- Affiliate / corporate partnerships
- Featured listings / sponsored placements
- Paid subscription memberships
- Automated/self-service seller approval (stays manual by design)
- AI tooling, advanced analytics, messaging (TalkJS), Stripe Tax, shipping-label automation

---

## 10. Open questions for the founders (flag, don't block)

- **Services**: enquiry-only in Phase 1, or do they want transactional/bookable from the start? (Assumed enquiry-only.)
- **Shipping**: who sets rates — sellers per-listing, or marketplace-wide flat? (Assumed seller-set/simple.)
- **Returns/refunds**: Mercur has return escalation; confirm The Vilij's policy and who funds refunds vs commission clawback.
- **Search**: Algolia (paid) vs Postgres search for Phase 1 scale. (Lean: defer Algolia.)
- **Legal/compliance**: marketplace operator T&Cs, seller agreement, data protection (UK GDPR), and Stripe Connect platform obligations — needs sign-off before live.

---

## Appendix — key references for Claude Code to read

- Mercur monorepo: `github.com/mercurjs/mercur` (README + `apps/backend/.env.template`)
- Mercur docs: `docs.mercurjs.com` (introduction, seller/commission/payout modules, deployment)
- Medusa v2 docs: marketplace recipe, digital products recipe, scheduled jobs, modules & workflows
- Stripe Connect: UK availability, Express accounts, application fees / transfers
