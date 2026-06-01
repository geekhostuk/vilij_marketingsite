import {
  ExecArgs,
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils"
import { CommissionRateType, CommissionRateTarget } from "@mercurjs/types"
import { createProductTypesWorkflow } from "@medusajs/medusa/core-flows"
import { createCommissionRatesWorkflow } from "@mercurjs/core/workflows"

/**
 * The Vilij commission model (idempotent). Creates the three product types and
 * the base commission rates:
 *   - Digital products  -> 20%
 *   - Physical products -> 5%
 *   - Services          -> no rule (enquiry-led, no checkout in Phase 1)
 *   - Default fallback  -> 5% (any product without a matching type rule)
 *
 * Founders Fifty (per-seller 0%) is created per seller at activation by
 * activateFoundingSellerWorkflow, at a higher priority than these rates.
 *
 *   corepack yarn medusa exec ./src/scripts/setup-commission.ts
 */
const PRODUCT_TYPES = ["Physical", "Digital", "Service"] as const

export default async function setupCommission({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // 1. Product types (idempotent).
  const { data: existingTypes } = await query.graph({
    entity: "product_type",
    fields: ["id", "value"],
  })
  const typeByValue = new Map<string, string>(
    existingTypes.map((t: any) => [t.value, t.id])
  )
  const missing = PRODUCT_TYPES.filter((v) => !typeByValue.has(v))
  if (missing.length) {
    const { result } = await createProductTypesWorkflow(container).run({
      input: { product_types: missing.map((value) => ({ value })) },
    })
    result.forEach((t: any) => typeByValue.set(t.value, t.id))
    logger.info(`[commission] created product types: ${missing.join(", ")}`)
  }

  // 2. Base commission rates (idempotent by code).
  const { data: existingRates } = await query.graph({
    entity: "commission_rate",
    fields: ["id", "code"],
  })
  const existingCodes = new Set(existingRates.map((r: any) => r.code))

  const desiredRates = [
    {
      name: "Digital products",
      code: "vilij-digital-20",
      value: 20,
      priority: 50,
      rules: [
        { reference: "product_type", reference_id: typeByValue.get("Digital")! },
      ],
    },
    {
      name: "Physical products",
      code: "vilij-physical-5",
      value: 5,
      priority: 50,
      rules: [
        { reference: "product_type", reference_id: typeByValue.get("Physical")! },
      ],
    },
    {
      name: "Default commission",
      code: "vilij-default-5",
      value: 5,
      priority: 10,
      rules: [] as { reference: string; reference_id: string }[],
    },
  ]

  for (const rate of desiredRates) {
    if (existingCodes.has(rate.code)) {
      logger.info(`[commission] rate ${rate.code} already exists, skipping`)
      continue
    }
    await createCommissionRatesWorkflow(container).run({
      input: [
        {
          name: rate.name,
          code: rate.code,
          type: CommissionRateType.PERCENTAGE,
          target: CommissionRateTarget.ITEM,
          value: rate.value,
          is_enabled: true,
          priority: rate.priority,
          rules: rate.rules,
        },
      ],
    })
    logger.info(
      `[commission] created rate ${rate.code} (${rate.value}%, priority ${rate.priority})`
    )
  }

  logger.info("[commission] setup complete")
}
