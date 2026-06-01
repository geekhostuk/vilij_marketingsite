import { model } from "@medusajs/framework/utils"

/**
 * A customer enquiry against a Service-type listing. In Phase 1 services are
 * enquiry-led (no add-to-cart / checkout): the storefront posts here and the
 * seller is notified to follow up directly.
 */
export const EnquiryStatus = {
  NEW: "new",
  CONTACTED: "contacted",
  CLOSED: "closed",
} as const

const ServiceEnquiry = model.define("service_enquiry", {
  id: model.id({ prefix: "enq" }).primaryKey(),
  product_id: model.text(),
  seller_id: model.text().nullable(),
  customer_name: model.text(),
  customer_email: model.text(),
  message: model.text(),
  status: model.enum(Object.values(EnquiryStatus)).default(EnquiryStatus.NEW),
})

export default ServiceEnquiry
