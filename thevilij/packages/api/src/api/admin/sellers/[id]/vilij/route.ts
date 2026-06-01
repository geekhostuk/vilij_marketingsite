import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { transitionSellerStage } from "../../../../../lib/curation"
import { getOrCreateProfile } from "../../../../../lib/founding"
import { ReviewSubject } from "../../../../../modules/send-review/models/review-checklist"

/** GET the SEND profile + curation review history for a seller. */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const reviewService = req.scope.resolve("send_review") as any

  const { data } = await query.graph({
    entity: "seller",
    fields: [
      "id",
      "name",
      "email",
      "status",
      "send_seller_profile.*",
    ],
    filters: { id },
  })

  const reviews = await reviewService.listReviewChecklists(
    { subject_type: ReviewSubject.SELLER, subject_id: id },
    { order: { created_at: "DESC" } }
  )

  res.json({ seller: data?.[0] ?? null, reviews })
}

/**
 * Update a seller's SEND curation in one call: profile content, the Vilij
 * Verified badge, a review checklist record, and/or a funnel-stage transition.
 * Body: { profile?, is_vilij_verified?, checklist?, stage?, founding?, reason? }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const body = (req.body ?? {}) as any
  const profileService = req.scope.resolve("send_seller_profile") as any
  const reviewService = req.scope.resolve("send_review") as any
  const reviewerId = (req as any).auth_context?.actor_id ?? null

  const profile = await getOrCreateProfile(req.scope, id)

  // 1. Profile content + badge.
  const profileUpdate: Record<string, unknown> = { id: profile.id }
  if (body.profile && typeof body.profile === "object") {
    Object.assign(profileUpdate, body.profile)
  }
  if (typeof body.is_vilij_verified === "boolean") {
    profileUpdate.is_vilij_verified = body.is_vilij_verified
  }
  if (Object.keys(profileUpdate).length > 1) {
    await profileService.updateSendSellerProfiles(profileUpdate)
  }

  // 2. Review checklist record.
  let review = null
  if (body.checklist && typeof body.checklist === "object") {
    const c = body.checklist
    review = await reviewService.createReviewChecklists({
      subject_type: ReviewSubject.SELLER,
      subject_id: id,
      trust: c.trust ?? null,
      authenticity: c.authenticity ?? null,
      curation_fit: c.curation_fit ?? null,
      quality: c.quality ?? null,
      notes: c.notes ?? null,
      decision: c.decision ?? null,
      reviewer_id: reviewerId,
    })
  }

  // 3. Stage transition (+ optional Founders Fifty on activation).
  let transition = null
  if (body.stage) {
    transition = await transitionSellerStage(req.scope, id, body.stage, {
      reason: body.reason,
      founding: !!body.founding,
      reviewerId,
    })
  }

  res.json({ ok: true, review, transition })
}
