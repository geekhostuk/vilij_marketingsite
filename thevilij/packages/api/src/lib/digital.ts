import { randomUUID } from "crypto"
import {
  ContainerRegistrationKeys,
  MedusaContainer,
} from "@medusajs/framework/utils"
import { DIGITAL_PRODUCT_MODULE } from "../modules/digital-product"

const DOWNLOAD_TTL_DAYS = 30

export function downloadUrl(token: string): string {
  const base = process.env.BACKEND_URL || "http://localhost:9000"
  return `${base}/digital-downloads/${token}`
}

/**
 * For a placed order, create a secure, time-limited delivery token for each line
 * item whose variant has a linked digital_product. Returns the created
 * deliveries (with the buyer email) so the caller can send download links.
 */
export async function createDeliveriesForOrder(
  container: MedusaContainer,
  orderId: string
): Promise<{ token: string; email: string | null; name: string }[]> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const dpService = container.resolve(DIGITAL_PRODUCT_MODULE) as any

  const { data } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "email",
      "items.title",
      "items.variant_id",
      "items.variant.digital_product.id",
      "items.variant.digital_product.name",
    ],
    filters: { id: orderId },
  })
  const order = data?.[0] as any
  if (!order) return []

  const expires = new Date()
  expires.setDate(expires.getDate() + DOWNLOAD_TTL_DAYS)

  const created: { token: string; email: string | null; name: string }[] = []
  for (const item of order.items ?? []) {
    const dp = item.variant?.digital_product
    if (!dp?.id) continue
    const token = randomUUID().replace(/-/g, "")
    await dpService.createDigitalProductDeliveries({
      token,
      digital_product_id: dp.id,
      order_id: order.id,
      email: order.email ?? null,
      expires_at: expires,
    })
    created.push({ token, email: order.email ?? null, name: dp.name })
  }
  return created
}
