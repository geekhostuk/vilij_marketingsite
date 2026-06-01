import { ExecArgs, Modules } from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  updateRegionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * The Vilij is a UK marketplace. The base seed ships a single EUR "Europe"
 * region that includes GB. This script (idempotent) makes GBP a supported store
 * currency and gives the UK its own GBP region, moving the `gb` country out of
 * the Europe region so checkout in the UK is priced and paid in GBP.
 *
 *   corepack yarn medusa exec ./src/scripts/setup-uk-region.ts
 */
export default async function setupUkRegion({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  const regionModule = container.resolve(Modules.REGION)
  const storeModule = container.resolve(Modules.STORE)

  const stripeEnabled =
    !!process.env.STRIPE_API_KEY && process.env.STRIPE_API_KEY.startsWith("sk_")
  const paymentProviders = ["pp_system_default"]
  if (stripeEnabled) paymentProviders.push("pp_stripe_stripe")

  // 1. Ensure GBP is a supported store currency. Rebuild the list explicitly so
  //    exactly one currency stays flagged default (EUR, to preserve seeded prices).
  const [store] = await storeModule.listStores(
    {},
    { relations: ["supported_currencies"] }
  )
  const currencies = store.supported_currencies ?? []
  if (!currencies.some((c) => c.currency_code === "gbp")) {
    const codes = Array.from(
      new Set([...currencies.map((c) => c.currency_code), "gbp"])
    )
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: codes.map((code) => ({
            currency_code: code,
            is_default: code === "eur",
          })),
        },
      },
    })
    logger.info("[uk-region] added GBP to supported store currencies")
  }

  // 2. If a UK/GBP region already exists, stop (idempotent).
  const regions = await regionModule.listRegions(
    {},
    { relations: ["countries"] }
  )
  const existingUk = regions.find(
    (r) => r.currency_code === "gbp" || r.name === "United Kingdom"
  )
  if (existingUk) {
    logger.info(`[uk-region] UK region already exists: ${existingUk.id}`)
    return
  }

  // 3. Remove GB from the Europe region so the country is free to reuse.
  const europe = regions.find((r) =>
    (r.countries ?? []).some((c) => c.iso_2 === "gb")
  )
  if (europe) {
    const remaining = (europe.countries ?? [])
      .map((c) => c.iso_2)
      .filter((iso) => iso !== "gb")
    await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: europe.id },
        update: { countries: remaining },
      },
    })
    logger.info(`[uk-region] removed GB from region "${europe.name}"`)
  }

  // 4. Create the United Kingdom / GBP region.
  const { result } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "United Kingdom",
          currency_code: "gbp",
          countries: ["gb"],
          payment_providers: paymentProviders,
        },
      ],
    },
  })
  logger.info(
    `[uk-region] created United Kingdom (GBP) region ${result[0].id} with providers ${JSON.stringify(
      paymentProviders
    )}`
  )
}
