import {
  ContainerRegistrationKeys,
  MedusaContainer,
} from "@medusajs/framework/utils"
import { SellerStatus } from "@mercurjs/types"
import { activateFoundingSeller, getOrCreateProfile } from "./founding"
import { VilijStage } from "../modules/send-seller-profile/models/send-seller-profile"

/**
 * The Vilij seller funnel rides on a fine-grained `vilij_stage` on the SEND
 * profile, synced down to Mercur's coarse SellerStatus which gates what the
 * seller can actually do. Mapping:
 *   active                     -> OPEN
 *   paused                     -> SUSPENDED
 *   rejected                   -> TERMINATED
 *   applied/in_review/         -> PENDING_APPROVAL
 *   approved_pending_welcome/onboarding
 */
export const STAGE_TO_SELLER_STATUS: Record<string, string> = {
  [VilijStage.APPLIED]: SellerStatus.PENDING_APPROVAL,
  [VilijStage.IN_REVIEW]: SellerStatus.PENDING_APPROVAL,
  [VilijStage.APPROVED_PENDING_WELCOME]: SellerStatus.PENDING_APPROVAL,
  [VilijStage.ONBOARDING]: SellerStatus.PENDING_APPROVAL,
  [VilijStage.ACTIVE]: SellerStatus.OPEN,
  [VilijStage.PAUSED]: SellerStatus.SUSPENDED,
  [VilijStage.REJECTED]: SellerStatus.TERMINATED,
}

/**
 * Move a seller to a new funnel stage: updates the SEND profile, syncs the
 * Mercur SellerStatus, and (when activating) optionally starts Founders Fifty.
 */
export async function transitionSellerStage(
  container: MedusaContainer,
  sellerId: string,
  stage: string,
  opts: { reason?: string; founding?: boolean; reviewerId?: string } = {}
): Promise<{ stage: string; sellerStatus: string }> {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const profileService = container.resolve("send_seller_profile") as any
  const sellerService = container.resolve("seller") as any

  if (!Object.values(VilijStage).includes(stage as any)) {
    throw new Error(`Unknown vilij_stage "${stage}"`)
  }

  const profile = await getOrCreateProfile(container, sellerId)
  await profileService.updateSendSellerProfiles({
    id: profile.id,
    vilij_stage: stage,
  })

  const sellerStatus = STAGE_TO_SELLER_STATUS[stage]
  const update: Record<string, unknown> = { id: sellerId, status: sellerStatus }
  if (stage === VilijStage.ACTIVE) update.approved_at = new Date()
  if (stage === VilijStage.REJECTED) {
    update.rejected_at = new Date()
    if (opts.reason) update.status_reason = opts.reason
  }
  await sellerService.updateSellers(update)

  // Activating + founding -> start the 12-month 0% window (sets stage active too).
  if (stage === VilijStage.ACTIVE && opts.founding) {
    await activateFoundingSeller(container, sellerId)
  }

  logger.info(
    `[curation] seller ${sellerId} -> stage=${stage} (SellerStatus=${sellerStatus})${
      opts.founding ? " +founding" : ""
    }`
  )
  return { stage, sellerStatus }
}
