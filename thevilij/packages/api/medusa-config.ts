import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'
import { DashboardModuleOptions } from '@mercurjs/types'
import path from 'path'
loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// The Vilij: when REDIS_URL is set, run the event bus, workflow engine, locking
// and cache on Redis so local dev matches production behaviour (durable events
// and scheduled jobs — e.g. the Founders Fifty expiry job). Falls back to the
// in-memory defaults when REDIS_URL is absent.
const redisUrl = process.env.REDIS_URL
const redisModules = redisUrl
  ? [
      { key: Modules.CACHE, resolve: '@medusajs/cache-redis', options: { redisUrl } },
      { key: Modules.EVENT_BUS, resolve: '@medusajs/event-bus-redis', options: { redisUrl } },
      {
        key: Modules.WORKFLOW_ENGINE,
        resolve: '@medusajs/workflow-engine-redis',
        options: { redis: { redisUrl } },
      },
      {
        key: Modules.LOCKING,
        resolve: '@medusajs/locking',
        options: {
          providers: [
            {
              resolve: '@medusajs/locking-redis',
              id: 'locking-redis',
              is_default: true,
              options: { redisUrl },
            },
          ],
        },
      },
    ]
  : []

// The Vilij — Stripe Connect (Step 2). Activated only when a real Stripe secret
// key is present, so the stack still boots on placeholder/empty keys (falling
// back to the default system payout provider + manual payment). When a key is
// set, register the Stripe payment provider (buyer checkout) and the Mercur
// Stripe Connect payout provider (Express accounts, split payouts to sellers).
// Webhooks: payment -> /hooks/payment/stripe_stripe, payout -> /hooks/payout.
const stripeApiKey = process.env.STRIPE_API_KEY
const stripeEnabled = !!stripeApiKey && stripeApiKey.startsWith('sk_')
const stripeModules = stripeEnabled
  ? [
      {
        resolve: '@medusajs/medusa/payment',
        options: {
          providers: [
            {
              resolve: '@medusajs/payment-stripe',
              id: 'stripe',
              options: {
                apiKey: stripeApiKey,
                webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                capture: false,
                automatic_payment_methods: true,
              },
            },
          ],
        },
      },
      {
        resolve: '@mercurjs/core/modules/payout',
        options: {
          providers: [
            {
              resolve: '@mercurjs/payout-stripe-connect',
              id: 'stripe-connect',
              options: {
                apiKey: stripeApiKey,
                webhookSecret: process.env.STRIPE_PAYOUT_WEBHOOK_SECRET,
                accountValidation: {
                  detailsSubmitted: true,
                  chargesEnabled: true,
                  payoutsEnabled: true,
                  noOutstandingRequirements: true,
                  requiredCapabilities: [],
                },
              },
            },
          ],
        },
      },
    ]
  : []

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      // @ts-expect-error: vendorCors is not defined in medusa config module
      vendorCors: process.env.VENDOR_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  featureFlags: {
    rbac: true,
    seller_registration: true
  },
  modules: [
    ...redisModules,
    ...stripeModules,
    {
      resolve: "@medusajs/medusa/rbac",
    },
    // The Vilij: SEND seller profile (funnel stage, Founders Fifty, badges, story).
    {
      resolve: "./src/modules/send-seller-profile",
    },
    // The Vilij: curation review checklists (seller vetting + product quality).
    {
      resolve: "./src/modules/send-review",
    },
    {
      resolve: '@mercurjs/core/modules/admin-ui',
      options: {
        appDir: path.join(__dirname, '../../apps/admin'),
        path: '/dashboard',
      } as DashboardModuleOptions
    },
    {
      resolve: '@mercurjs/core/modules/vendor-ui',
      options: {
        appDir: path.join(__dirname, '../../apps/vendor'),
        path: '/seller',
      } as DashboardModuleOptions
    },
  ],
  plugins: [{
    resolve: "@mercurjs/core",
    options: {}
  }]
})
