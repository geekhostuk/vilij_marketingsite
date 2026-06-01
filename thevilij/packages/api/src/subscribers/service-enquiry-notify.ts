import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Notify the seller (and an admin alert) when a service enquiry is submitted.
 * Logs the enquiry details when no email provider is configured (Resend deferred).
 */
export default async function serviceEnquiryNotify({
  event,
  container,
}: SubscriberArgs<{
  enquiry_id: string
  seller_email?: string | null
  customer_name?: string
  customer_email?: string
  product_id?: string
}>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const { seller_email, customer_name, customer_email, product_id } = event.data
  const adminEmail = process.env.VILIJ_ADMIN_EMAIL || "hello@thevilij.uk"
  const to = [seller_email, adminEmail].filter(Boolean) as string[]

  try {
    const notification = container.resolve(Modules.NOTIFICATION)
    for (const recipient of to) {
      await notification.createNotifications({
        to: recipient,
        channel: "email",
        template: "service-enquiry",
        content: { subject: "New enquiry on your Vilij service listing" },
        data: { customer_name, customer_email, product_id },
      })
    }
    logger.info(`[enquiry-notify] emailed seller ${seller_email} about enquiry ${event.data.enquiry_id}`)
  } catch (e: any) {
    logger.warn(
      `[enquiry-notify] could not email (${e.message}). Enquiry ${event.data.enquiry_id} from ${customer_name} <${customer_email}> on product ${product_id} for seller ${seller_email}`
    )
  }
}

export const config: SubscriberConfig = {
  event: "service_enquiry.created",
}
