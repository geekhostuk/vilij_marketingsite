import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import DigitalProductModule from "../modules/digital-product"

/**
 * Attach a digital asset to a product variant. A purchased variant with a linked
 * digital_product triggers secure post-purchase delivery.
 */
export default defineLink(
  ProductModule.linkable.productVariant,
  DigitalProductModule.linkable.digitalProduct
)
