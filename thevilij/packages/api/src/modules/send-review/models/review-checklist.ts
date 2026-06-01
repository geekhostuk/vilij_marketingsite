import { model } from "@medusajs/framework/utils"

/**
 * A human curation review for The Vilij — used both for seller vetting (trust,
 * authenticity, curation fit, quality) and for the per-product quality check
 * before a listing goes live. Polymorphic over subject_type so one model serves
 * both; reviewer notes + a decision are always captured (curation is never silent).
 */
export const ReviewSubject = {
  SELLER: "seller",
  PRODUCT: "product",
} as const

export const ReviewDecision = {
  APPROVED: "approved",
  REJECTED: "rejected",
  HOLD: "hold",
} as const

const ReviewChecklist = model.define("review_checklist", {
  id: model.id({ prefix: "sendrev" }).primaryKey(),
  subject_type: model.enum(Object.values(ReviewSubject)),
  subject_id: model.text(),

  // Curation criteria (seller vetting uses all four; product check leans on
  // quality + authenticity).
  trust: model.boolean().nullable(),
  authenticity: model.boolean().nullable(),
  curation_fit: model.boolean().nullable(),
  quality: model.boolean().nullable(),

  notes: model.text().nullable(),
  decision: model.enum(Object.values(ReviewDecision)).nullable(),
  reviewer_id: model.text().nullable(),
})

export default ReviewChecklist
