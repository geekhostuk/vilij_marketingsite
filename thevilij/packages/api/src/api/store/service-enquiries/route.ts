import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { SERVICE_ENQUIRY_MODULE } from "../../../modules/service-enquiry"

/**
 * Submit an enquiry against a Service-type listing (Phase 1: no checkout).
 * POST /store/service-enquiries  { product_id, name, email, message }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { product_id, name, email, message } = (req.body ?? {}) as Record<string, string>

  if (!product_id || !name || !email || !message) {
    return res
      .status(400)
      .json({ message: "product_id, name, email and message are required." })
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const enquiryService = req.scope.resolve(SERVICE_ENQUIRY_MODULE) as any
  const eventBus = req.scope.resolve(Modules.EVENT_BUS)

  // Resolve the seller behind the product (Mercur links product -> seller).
  let sellerId: string | null = null
  let sellerEmail: string | null = null
  try {
    const { data } = await query.graph({
      entity: "product",
      fields: ["id", "seller.id", "seller.email"],
      filters: { id: product_id },
    })
    sellerId = (data?.[0] as any)?.seller?.id ?? null
    sellerEmail = (data?.[0] as any)?.seller?.email ?? null
  } catch {
    /* seller resolution is best-effort */
  }

  const enquiry = await enquiryService.createServiceEnquiries({
    product_id,
    seller_id: sellerId,
    customer_name: name,
    customer_email: email,
    message,
  })

  await eventBus.emit({
    name: "service_enquiry.created",
    data: {
      enquiry_id: enquiry.id,
      seller_id: sellerId,
      seller_email: sellerEmail,
      product_id,
      customer_name: name,
      customer_email: email,
    },
  })

  res.status(201).json({ enquiry: { id: enquiry.id, status: enquiry.status } })
}
