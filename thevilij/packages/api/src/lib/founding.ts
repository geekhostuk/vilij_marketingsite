import {
  ContainerRegistrationKeys,
  Modules,
  MedusaContainer,
} from "@medusajs/framework/utils"
import {
  createCommissionRatesWorkflow,
  deleteCommissionRatesWorkflow,
} from "@mercurjs/core/workflows"
import { CommissionRateType, CommissionRateTarget, MercurModules } from "@mercurjs/types"
import { SEND_SELLER_PROFILE_MODULE } from "../modules/send-seller-profile"
import { VilijStage } from "../modules/send-seller-profile/models/send-seller-profile"

export const FOUNDING_MONTHS = 12
export const FOUNDING_WARN_DAYS = 30

export type SendProfile = {
  id: string
  is_founding: boolean
  founding_until: Date | string | null
  founding_warned_at: Date | string | null
  founding_commission_rate_id: string | null
  vilij_stage: string
}

/** Fetch the SEND profile linked to a seller (or null). */
export async function getProfileForSeller(
  container: MedusaContainer,
  sellerId: string
): Promise<SendProfile | null> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "seller",
    fields: [
      "id",
      "send_seller_profile.id",
      "send_seller_profile.is_founding",
      "send_seller_profile.founding_until",
      "send_seller_profile.founding_warned_at",
      "send_seller_profile.founding_commission_rate_id",
      "send_seller_profile.vilij_stage",
    ],
    filters: { id: sellerId },
  })
  return (data?.[0] as any)?.send_seller_profile ?? null
}

/** Ensure a SEND profile exists for a seller, creating + linking it if missing. */
export async function getOrCreateProfile(
  container: MedusaContainer,
  sellerId: string
): Promise<SendProfile> {
  const existing = await getProfileForSeller(container, sellerId)
  if (existing) return existing

  const profileService = container.resolve(SEND_SELLER_PROFILE_MODULE) as any
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const profile = await profileService.createSendSellerProfiles({})
  await link.create({
    [MercurModules.SELLER]: { seller_id: sellerId },
    [SEND_SELLER_PROFILE_MODULE]: { send_seller_profile_id: profile.id },
  })
  return profile
}

/**
 * Founders Fifty: mark a seller as a founding seller and give them a per-seller
 * 0% commission rate (priority 100, above the product-type rates) for 12 months.
 */
export async function activateFoundingSeller(
  container: MedusaContainer,
  sellerId: string,
  opts: { months?: number; fromDate?: Date } = {}
): Promise<{ profileId: string; rateId: string; foundingUntil: Date }> {
  const months = opts.months ?? FOUNDING_MONTHS
  const from = opts.fromDate ?? new Date()
  const foundingUntil = new Date(from)
  foundingUntil.setMonth(foundingUntil.getMonth() + months)

  const profile = await getOrCreateProfile(container, sellerId)
  const profileService = container.resolve(SEND_SELLER_PROFILE_MODULE) as any

  let rateId = profile.founding_commission_rate_id
  if (!rateId) {
    const { result } = await createCommissionRatesWorkflow(container).run({
      input: [
        {
          name: `Founders Fifty — ${sellerId}`,
          code: `vilij-founding-${sellerId}`,
          type: CommissionRateType.PERCENTAGE,
          target: CommissionRateTarget.ITEM,
          value: 0,
          is_enabled: true,
          priority: 100,
          rules: [{ reference: "seller", reference_id: sellerId }],
        },
      ],
    })
    rateId = (result as any)[0].id
  }

  await profileService.updateSendSellerProfiles({
    id: profile.id,
    is_founding: true,
    founding_until: foundingUntil,
    founding_warned_at: null,
    founding_commission_rate_id: rateId,
    vilij_stage: VilijStage.ACTIVE,
  })

  return { profileId: profile.id, rateId: rateId!, foundingUntil }
}

/**
 * End a seller's Founders Fifty window: delete the 0% override (so standard
 * product-type rates apply again), clear the founding flag, and emit an event so
 * notifications fire.
 */
export async function revertFoundingCommission(
  container: MedusaContainer,
  profile: SendProfile,
  sellerId?: string
): Promise<void> {
  const profileService = container.resolve(SEND_SELLER_PROFILE_MODULE) as any
  const eventBus = container.resolve(Modules.EVENT_BUS)

  if (profile.founding_commission_rate_id) {
    await deleteCommissionRatesWorkflow(container).run({
      input: { ids: [profile.founding_commission_rate_id] },
    })
  }

  await profileService.updateSendSellerProfiles({
    id: profile.id,
    is_founding: false,
    founding_commission_rate_id: null,
  })

  await eventBus.emit({
    name: "founding.expired",
    data: { profile_id: profile.id, seller_id: sellerId },
  })
}
