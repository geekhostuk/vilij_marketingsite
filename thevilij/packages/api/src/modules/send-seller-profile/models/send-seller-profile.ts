import { model } from "@medusajs/framework/utils"

/**
 * The Vilij's extension of a Mercur seller: the SEND curation/funnel state, the
 * Founders Fifty commission window, trust badges, and the storytelling content
 * that leads the seller's public profile. Linked 1:1 to a Mercur Seller (see
 * src/links/seller-send-profile.ts) so the Mercur Seller block stays untouched.
 */
export const VilijStage = {
  APPLIED: "applied",
  IN_REVIEW: "in_review",
  APPROVED_PENDING_WELCOME: "approved_pending_welcome",
  ONBOARDING: "onboarding",
  ACTIVE: "active",
  PAUSED: "paused",
  REJECTED: "rejected",
} as const

const SendSellerProfile = model.define("send_seller_profile", {
  id: model.id({ prefix: "sendprof" }).primaryKey(),

  // --- Curation funnel (fine-grained; synced to Mercur's coarse SellerStatus) ---
  vilij_stage: model
    .enum(Object.values(VilijStage))
    .default(VilijStage.APPLIED),

  // --- Founders Fifty: 0% commission for 12 months from activation ---
  is_founding: model.boolean().default(false),
  founding_until: model.dateTime().nullable(),
  // timestamp of the 30-day-before-expiry warning email, for idempotency
  founding_warned_at: model.dateTime().nullable(),
  // id of the per-seller 0% commission rate created for this founding seller
  founding_commission_rate_id: model.text().nullable(),

  // --- Trust badges ---
  is_vilij_verified: model.boolean().default(false),

  // --- SEND application / storytelling content (surfaced in Step 4 + storefront) ---
  // The lived-experience SEND connection — the heart of the profile.
  send_connection: model.text().nullable(),
  // Must already be trading; free-text business stage.
  business_stage: model.text().nullable(),
  // "Why this belongs in The Vilij" — applicant's pitch.
  why_belongs: model.text().nullable(),
  // Public-facing story shown on the profile page.
  story: model.text().nullable(),
  // External links (website, socials) captured at application.
  links: model.json().nullable(),
  // Profile photos / gallery (array of urls).
  photos: model.json().nullable(),
})

export default SendSellerProfile
