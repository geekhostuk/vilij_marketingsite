import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { ReviewSubject } from "../../../../../modules/send-review/models/review-checklist"

/**
 * Record the SEND quality checklist for a product and optionally publish it —
 * this is the gate that takes a seller's product from `proposed`/`draft` to live.
 * Body: { trust?, authenticity?, curation_fit?, quality?, notes?, decision?, publish? }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const body = (req.body ?? {}) as any
  const reviewService = req.scope.resolve("send_review") as any
  const productModule = req.scope.resolve(Modules.PRODUCT)
  const reviewerId = (req as any).auth_context?.actor_id ?? null

  const review = await reviewService.createReviewChecklists({
    subject_type: ReviewSubject.PRODUCT,
    subject_id: id,
    trust: body.trust ?? null,
    authenticity: body.authenticity ?? null,
    curation_fit: body.curation_fit ?? null,
    quality: body.quality ?? null,
    notes: body.notes ?? null,
    decision: body.decision ?? null,
    reviewer_id: reviewerId,
  })

  let published = false
  if (body.publish === true) {
    await productModule.updateProducts(id, { status: "published" })
    published = true
  } else if (body.publish === false) {
    await productModule.updateProducts(id, { status: "rejected" })
  }

  res.json({ ok: true, review, published })
}

/** GET the SEND quality review history for a product. */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const reviewService = req.scope.resolve("send_review") as any
  const reviews = await reviewService.listReviewChecklists(
    { subject_type: ReviewSubject.PRODUCT, subject_id: id },
    { order: { created_at: "DESC" } }
  )
  res.json({ reviews })
}
