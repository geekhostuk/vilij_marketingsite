import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { HOMEPAGE_SLOTS_MODULE } from "../../../modules/homepage-slots"

/**
 * Public: the curated homepage feature slots, published + ordered. The storefront
 * renders one component per slot and resolves any target (collection/seller/etc.)
 * via the existing store endpoints. GET /store/homepage-slots
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const slotsService = req.scope.resolve(HOMEPAGE_SLOTS_MODULE) as any
  const slots = await slotsService.listHomepageSlots(
    { is_published: true },
    { order: { position: "ASC" } }
  )
  res.json({ slots })
}
