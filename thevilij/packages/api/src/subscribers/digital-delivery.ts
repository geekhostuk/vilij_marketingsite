import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createDeliveriesForOrder, downloadUrl } from "../lib/digital"

/**
 * On order placement, mint download tokens for any digital items and email the
 * buyer their links. Falls back to logging when no email provider is configured.
 */
export default async function digitalDelivery({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const orderId = event.data.id

  const deliveries = await createDeliveriesForOrder(container, orderId)
  if (!deliveries.length) return

  for (const d of deliveries) {
    const url = downloadUrl(d.token)
    try {
      const notification = container.resolve(Modules.NOTIFICATION)
      await notification.createNotifications({
        to: d.email ?? "",
        channel: "email",
        template: "digital-download",
        content: { subject: `Your download: ${d.name}` },
        data: { name: d.name, url },
      })
      logger.info(`[digital-delivery] emailed download for "${d.name}" to ${d.email}`)
    } catch (e: any) {
      logger.warn(
        `[digital-delivery] could not email download (${e.message}). Link for ${d.email}: ${url}`
      )
    }
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
