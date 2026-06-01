import { model } from "@medusajs/framework/utils"

/**
 * A downloadable/licensable asset behind a digital product variant. Linked to a
 * Medusa product variant (see src/links/variant-digital-product.ts). The platform
 * delivers it securely post-purchase via time-limited tokens (DigitalProductDelivery).
 */
const DigitalProduct = model.define("digital_product", {
  id: model.id({ prefix: "digprod" }).primaryKey(),
  name: model.text(),
  file_url: model.text(),
  mime_type: model.text().nullable(),
  license_key: model.text().nullable(),
})

export default DigitalProduct
