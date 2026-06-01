import { ExecArgs, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  activateFoundingSeller,
  revertFoundingCommission,
  getProfileForSeller,
} from "../lib/founding"

/**
 * End-to-end check of the commission model + Founders Fifty (no real orders):
 * resolves commission lines for synthetic items and asserts the expected rates.
 *
 *   corepack yarn medusa exec ./src/scripts/verify-commission.ts
 */
export default async function verifyCommission({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const commission = container.resolve("commission") as any
  const sellerService = container.resolve("seller") as any

  const { data: types } = await query.graph({
    entity: "product_type",
    fields: ["id", "value"],
  })
  const typeId = (v: string) => types.find((t: any) => t.value === v)?.id
  const digitalType = typeId("Digital")
  const physicalType = typeId("Physical")

  // Reuse or create a dedicated test seller.
  const existing = await sellerService.listSellers({ email: "test-seller@thevilij.uk" })
  const seller =
    existing[0] ??
    (await sellerService.createSellers({
      name: "Vilij Test Seller",
      handle: "vilij-test-seller",
      email: "test-seller@thevilij.uk",
      currency_code: "gbp",
    }))

  const lineFor = async (item: any) => {
    const lines = await commission.getCommissionLines({
      items: [item],
      shipping_methods: [],
      currency_code: "gbp",
    })
    return lines[0]
  }

  const results: string[] = []
  const check = (label: string, actual: number, expected: number) => {
    const ok = Math.abs(actual - expected) < 0.001
    results.push(`${ok ? "PASS" : "FAIL"}  ${label}: rate=${actual}% (expected ${expected}%)`)
    return ok
  }

  // Digital -> 20%
  const digital = await lineFor({
    id: "test_d",
    subtotal: 10000,
    product: { id: "test_pd", type_id: digitalType },
  })
  check("digital product", digital?.rate ?? -1, 20)

  // Physical -> 5%
  const physical = await lineFor({
    id: "test_p",
    subtotal: 10000,
    product: { id: "test_pp", type_id: physicalType },
  })
  check("physical product", physical?.rate ?? -1, 5)

  // Activate Founders Fifty -> seller pays 0% even on a physical item.
  await activateFoundingSeller(container, seller.id)
  const founding = await lineFor({
    id: "test_f",
    subtotal: 10000,
    product: {
      id: "test_pf",
      type_id: physicalType,
      seller: { id: seller.id },
    },
  })
  check("founding seller (physical)", founding?.rate ?? -1, 0)

  // Simulate expiry -> reverts to standard 5% for the same physical item.
  const profile = await getProfileForSeller(container, seller.id)
  await revertFoundingCommission(container, profile!, seller.id)
  const reverted = await lineFor({
    id: "test_r",
    subtotal: 10000,
    product: {
      id: "test_pr",
      type_id: physicalType,
      seller: { id: seller.id },
    },
  })
  check("reverted seller (physical)", reverted?.rate ?? -1, 5)

  logger.info("\n[verify-commission]\n" + results.join("\n"))
  if (results.some((r) => r.startsWith("FAIL"))) {
    throw new Error("commission verification FAILED")
  }
  logger.info("[verify-commission] ALL PASS")
}
