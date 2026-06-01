# Stripe Connect setup (The Vilij)

The Vilij splits each customer payment across the sellers in the order and pays
each seller out automatically, minus commission, via **Stripe Connect (Express
accounts)**. This is wired in `thevilij/packages/api/medusa-config.ts` and
**self-activates** as soon as a real Stripe secret key is present in the backend
`.env` — until then the stack runs on the system payout provider with manual
payment, so local dev works without Stripe.

## 1. Get test credentials

1. Create / log into a Stripe account, stay in **Test mode**.
2. Enable **Connect** (Settings → Connect). Choose the **platform** profile.
3. Confirm Connect is available for your country and that **Express** accounts
   are enabled. The Vilij operates **UK / GBP**.
4. Copy your **Secret key** (`sk_test_…`) from Developers → API keys.

## 2. Configure webhooks

Create two webhook endpoints (Developers → Webhooks). For local testing use the
Stripe CLI (`stripe listen`) or a tunnel; in production use the backend URL.

| Purpose | Endpoint path | Signing secret → env var |
|---------|---------------|--------------------------|
| Payments | `/hooks/payment/stripe_stripe` | `STRIPE_WEBHOOK_SECRET` |
| Connect payouts | `/hooks/payout` | `STRIPE_PAYOUT_WEBHOOK_SECRET` |

Local example:

```bash
stripe listen --forward-to localhost:9000/hooks/payment/stripe_stripe
stripe listen --forward-to localhost:9000/hooks/payout
```

## 3. Set backend env (`thevilij/packages/api/.env`)

```
STRIPE_API_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PAYOUT_WEBHOOK_SECRET=whsec_xxx
```

Set the storefront key too (`storefront/.env`): `NEXT_PUBLIC_STRIPE_KEY=pk_test_xxx`.

Restart the backend. On boot you should now see `pp_stripe_stripe` among the
payment providers (verify with `corepack yarn medusa exec ./src/scripts/check-config.ts`).

## 4. Attach Stripe to the UK region

The UK/GBP region (`src/scripts/setup-uk-region.ts`) is created with the system
payment provider when Stripe is off. After enabling Stripe, add the Stripe
provider to the region: **Admin → Settings → Regions → United Kingdom → Payment
providers → add "Stripe"**.

## 5. Verify (the deferred payout test)

1. Onboard a seller; complete the Stripe Connect (Express) onboarding flow from
   the vendor panel (`/seller`).
2. Place a test order containing that seller's product (test card `4242 4242 4242 4242`).
3. Confirm in the admin / DB:
   - the order has a **commission line** (Mercur writes one per order),
   - a **payout** to the seller's connected account is created for
     `order total − commission`.

## How commission feeds the payout

Mercur's commission engine writes a commission line per order based on the
configured rules (Step 3: Digital 20% / Physical 5%, Founders Fifty 0%). The
Stripe Connect payout provider transfers `order total − commission` to each
seller's Express account. Account validation requires details submitted, charges
enabled and payouts enabled before a seller is payable (see `accountValidation`
in `medusa-config.ts`).
