import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  revertFoundingCommission,
  FOUNDING_WARN_DAYS,
} from "../lib/founding"

/**
 * Daily Founders Fifty maintenance:
 *  - founding sellers whose `founding_until` has passed → revert to standard
 *    commission and emit `founding.expired`.
 *  - founding sellers expiring within 30 days and not yet warned → emit
 *    `founding.expiring_soon` and stamp `founding_warned_at` (idempotent).
 * Subscribers turn those events into Resend emails (seller + admin alert).
 */
export default async function foundingExpiryJob(container: MedusaContainer) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const eventBus = container.resolve(Modules.EVENT_BUS)
  const profileService = container.resolve("send_seller_profile") as any

  const now = new Date()
  const warnCutoff = new Date(now)
  warnCutoff.setDate(warnCutoff.getDate() + FOUNDING_WARN_DAYS)

  // Founding profiles with their linked seller (for notifications).
  const { data: sellers } = await query.graph({
    entity: "seller",
    fields: [
      "id",
      "email",
      "name",
      "send_seller_profile.id",
      "send_seller_profile.is_founding",
      "send_seller_profile.founding_until",
      "send_seller_profile.founding_warned_at",
      "send_seller_profile.founding_commission_rate_id",
      "send_seller_profile.vilij_stage",
    ],
    filters: {},
  })

  let expired = 0
  let warned = 0

  for (const seller of sellers as any[]) {
    const profile = seller.send_seller_profile
    if (!profile?.is_founding || !profile.founding_until) continue

    const foundingUntil = new Date(profile.founding_until)

    if (foundingUntil <= now) {
      await revertFoundingCommission(container, profile, seller.id)
      expired++
      logger.info(
        `[founding-expiry] reverted founding seller ${seller.id} (${seller.email})`
      )
      continue
    }

    if (foundingUntil <= warnCutoff && !profile.founding_warned_at) {
      await eventBus.emit({
        name: "founding.expiring_soon",
        data: {
          profile_id: profile.id,
          seller_id: seller.id,
          seller_email: seller.email,
          seller_name: seller.name,
          founding_until: foundingUntil.toISOString(),
        },
      })
      await profileService.updateSendSellerProfiles({
        id: profile.id,
        founding_warned_at: now,
      })
      warned++
      logger.info(
        `[founding-expiry] warned founding seller ${seller.id} (expires ${foundingUntil.toISOString()})`
      )
    }
  }

  logger.info(
    `[founding-expiry] done — ${expired} reverted, ${warned} warned of ${(sellers as any[]).length} sellers`
  )
}

export const config = {
  name: "founding-fifty-expiry",
  // Daily at 06:00.
  schedule: "0 6 * * *",
}
