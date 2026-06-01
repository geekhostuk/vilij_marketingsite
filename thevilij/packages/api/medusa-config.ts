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
    {
      resolve: "@medusajs/medusa/rbac",
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
