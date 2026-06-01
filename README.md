# The Vilij — Marketplace (Phase 1)

A curated, values-led multi-vendor marketplace for the SEND community, built on
**MercurJS v2.1.5** (on **Medusa v2.13.4**) with a bespoke Next.js storefront.

See `the-vilij-claude-code-build-plan.md` for the full build brief.

## Repository layout

| Path | What it is |
|------|------------|
| `thevilij/` | Mercur monorepo (Turborepo, Yarn 4). Contains the backend + dashboards. |
| `thevilij/packages/api` | Medusa + Mercur **backend** (API, modules, workflows, jobs). Our custom code lives in `src/`. |
| `thevilij/apps/admin` | Marketplace **admin** dashboard (Vite/React), served at `/dashboard`. |
| `thevilij/apps/vendor` | **Vendor/seller** panel (Vite/React), served at `/seller`. |
| `storefront/` | Bespoke public **storefront** (Next.js 15, separate repo, vendored here). |
| `docker-compose.dev.yml` | Local Postgres 16 + Redis 7. |

## Prerequisites

- Node.js 20–24 LTS, Docker Desktop, Bun (CLI runner), Yarn 4 via Corepack.
- `corepack enable` once, so `yarn` resolves to the pinned `yarn@4.5.0`.

## Run it locally

```powershell
# 1. Infrastructure (Postgres + Redis)
docker compose -f docker-compose.dev.yml up -d

# 2. Backend (API :9000, admin /dashboard, vendor /seller)
cd thevilij/packages/api
corepack yarn dev            # first run: yarn install at repo root, then db:migrate + seed

# 3. Storefront (:3000)
cd ../../../storefront
corepack yarn dev
```

First-time backend setup (run from `thevilij/`):

```powershell
corepack yarn install
cd packages/api
corepack yarn medusa db:migrate
corepack yarn seed
corepack yarn medusa user -e admin@thevilij.uk -p <password>   # create an admin
corepack yarn medusa exec ./src/scripts/setup-uk-region.ts     # UK / GBP region
corepack yarn medusa exec ./src/scripts/setup-commission.ts    # product types + commission rates
```

### Provisioning / ops scripts (`packages/api/src/scripts`)

| Script | Purpose |
|--------|---------|
| `setup-uk-region.ts` | Add GBP currency + create the UK/GBP region (idempotent). |
| `setup-commission.ts` | Create Physical/Digital/Service product types + base commission rates (Digital 20%, Physical 5%, default 5%). |
| `check-config.ts` | List configured payment/payout providers (Stripe wiring check). |
| `verify-commission.ts` | Assert commission resolution incl. Founders Fifty 0% + expiry revert. |

## URLs

| Surface | URL |
|---------|-----|
| Storefront | http://localhost:3000 (redirects to `/gb`) |
| Backend API | http://localhost:9000 |
| Admin dashboard | http://localhost:9000/dashboard |
| Vendor panel | http://localhost:9000/seller |
| Health | http://localhost:9000/health |

Admin login (dev): `admin@thevilij.uk` / `Vilij-dev-2026`.

## Environment

- `thevilij/packages/api/.env` — `DATABASE_URL`, `REDIS_URL`, CORS, Stripe/Resend
  placeholders. Redis modules (event bus, workflow engine, cache, locking) are
  wired in `medusa-config.ts` and active whenever `REDIS_URL` is set.
- `storefront/.env` — `MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`,
  `NEXT_PUBLIC_DEFAULT_REGION=gb`, site name/description.

> The publishable key is seeded into the DB; fetch it from the admin (Settings →
> Publishable API keys) or from the `api_key` table.

## Build status (per brief §8)

- [x] **Step 1** — Scaffold & run the stock stack (backend + admin + vendor + storefront), Redis wired.
- [x] **Step 2** — Stripe Connect (test, UK/GBP) wired (self-activates on real key; see `STRIPE_SETUP.md`); UK/GBP region created.
- [x] **Step 3** — Commission rules (Digital 20% / Physical 5% / default 5%) + Founders Fifty per-seller 0% override, daily expiry job + 30-day-warning subscriber. Verified via `verify-commission.ts`.
- [ ] Step 4 — Curation extensions (SEND fields, review checklist, statuses, badges).
- [ ] Step 5 — Categories & taxonomy.
- [ ] Step 6 — Product modes (digital + services-as-enquiry).
- [ ] Step 7 — Bespoke storefront rebuild.
- [ ] Step 8 — Branding pass.
- [ ] Step 9 — Seed + walkthrough.
- [ ] Step 10 — VPS deploy (deferred for Phase 1 build).
