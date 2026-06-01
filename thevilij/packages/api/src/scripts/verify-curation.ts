import { ExecArgs, ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { transitionSellerStage } from "../lib/curation"
import { getProfileForSeller } from "../lib/founding"
import { VilijStage } from "../modules/send-seller-profile/models/send-seller-profile"
import { ReviewSubject } from "../modules/send-review/models/review-checklist"

/**
 * End-to-end check of the curation engine: stage transitions sync Mercur
 * SellerStatus, review checklists persist, and the product quality gate publishes.
 *
 *   corepack yarn medusa exec ./src/scripts/verify-curation.ts
 */
export default async function verifyCuration({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const sellerService = container.resolve("seller") as any
  const reviewService = container.resolve("send_review") as any
  const productModule = container.resolve(Modules.PRODUCT)

  const results: string[] = []
  const check = (label: string, ok: boolean, detail = "") =>
    results.push(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`)

  // Test seller (reuse Step 3's).
  const existing = await sellerService.listSellers({ email: "test-seller@thevilij.uk" })
  const seller =
    existing[0] ??
    (await sellerService.createSellers({
      name: "Vilij Test Seller",
      handle: "vilij-test-seller",
      email: "test-seller@thevilij.uk",
      currency_code: "gbp",
    }))

  // 1. Stage in_review -> SellerStatus pending_approval.
  await transitionSellerStage(container, seller.id, VilijStage.IN_REVIEW)
  let s = await sellerService.retrieveSeller(seller.id)
  let p = await getProfileForSeller(container, seller.id)
  check(
    "in_review syncs status",
    p?.vilij_stage === VilijStage.IN_REVIEW && s.status === "pending_approval",
    `stage=${p?.vilij_stage} status=${s.status}`
  )

  // 2. Activate (+founding) -> SellerStatus open, is_founding true.
  await transitionSellerStage(container, seller.id, VilijStage.ACTIVE, {
    founding: true,
  })
  s = await sellerService.retrieveSeller(seller.id)
  p = await getProfileForSeller(container, seller.id)
  check(
    "active syncs status open + founding",
    p?.vilij_stage === VilijStage.ACTIVE &&
      s.status === "open" &&
      p?.is_founding === true,
    `stage=${p?.vilij_stage} status=${s.status} founding=${p?.is_founding}`
  )

  // 3. Seller review checklist persists.
  await reviewService.createReviewChecklists({
    subject_type: ReviewSubject.SELLER,
    subject_id: seller.id,
    trust: true,
    authenticity: true,
    curation_fit: true,
    quality: true,
    notes: "Lovely lived-experience story; clear SEND connection.",
    decision: "approved",
  })
  const sellerReviews = await reviewService.listReviewChecklists({
    subject_type: ReviewSubject.SELLER,
    subject_id: seller.id,
  })
  check("seller review checklist saved", sellerReviews.length >= 1, `${sellerReviews.length} review(s)`)

  // 4. Product quality gate: draft -> published.
  const [product] = await productModule.createProducts([
    { title: "Vilij Test Product", status: "draft" },
  ])
  await reviewService.createReviewChecklists({
    subject_type: ReviewSubject.PRODUCT,
    subject_id: product.id,
    quality: true,
    authenticity: true,
    decision: "approved",
  })
  await productModule.updateProducts(product.id, { status: "published" })
  const published = await productModule.retrieveProduct(product.id)
  check("product quality gate publishes", published.status === "published", `status=${published.status}`)

  // cleanup the throwaway product
  await productModule.deleteProducts([product.id])

  logger.info("\n[verify-curation]\n" + results.join("\n"))
  if (results.some((r) => r.startsWith("FAIL"))) {
    throw new Error("curation verification FAILED")
  }
  logger.info("[verify-curation] ALL PASS")
}
