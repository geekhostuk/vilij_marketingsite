import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { DIGITAL_PRODUCT_MODULE } from "../../../modules/digital-product"

/**
 * Public, tokenised digital download (top-level path so email links work without
 * a publishable key). Validates expiry + download cap, then redirects to the
 * asset. GET /digital-downloads/:token
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { token } = req.params
  const dpService = req.scope.resolve(DIGITAL_PRODUCT_MODULE) as any

  const [delivery] = await dpService.listDigitalProductDeliveries({ token })
  if (!delivery) {
    return res.status(404).json({ message: "Invalid download link." })
  }
  if (delivery.expires_at && new Date(delivery.expires_at) < new Date()) {
    return res.status(410).json({ message: "This download link has expired." })
  }
  if (delivery.download_count >= delivery.max_downloads) {
    return res.status(410).json({ message: "Download limit reached." })
  }

  const dp = await dpService.retrieveDigitalProduct(delivery.digital_product_id)
  await dpService.updateDigitalProductDeliveries({
    id: delivery.id,
    download_count: delivery.download_count + 1,
  })

  return res.redirect(dp.file_url)
}
