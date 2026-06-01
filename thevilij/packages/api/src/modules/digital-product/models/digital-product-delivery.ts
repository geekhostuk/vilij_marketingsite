import { model } from "@medusajs/framework/utils"

/**
 * A secure, time-limited grant to download a digital product, created at purchase
 * and consumed via GET /store/digital-downloads/:token.
 */
const DigitalProductDelivery = model.define("digital_product_delivery", {
  id: model.id({ prefix: "digdel" }).primaryKey(),
  token: model.text(),
  digital_product_id: model.text(),
  order_id: model.text().nullable(),
  email: model.text().nullable(),
  expires_at: model.dateTime().nullable(),
  download_count: model.number().default(0),
  max_downloads: model.number().default(5),
})

export default DigitalProductDelivery
