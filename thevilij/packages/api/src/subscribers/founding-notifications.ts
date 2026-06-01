import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Founders Fifty notifications. Reacts to the events emitted by the daily expiry
 * job and the revert flow, and sends the seller (and an admin alert) an email via
 * the notification module. If no email provider (Resend) is configured yet, it
 * logs the intent rather than failing — so the economics change is never silent.
 */
export default async function foundingNotifications({
  event,
  container,
}: SubscriberArgs<{
  seller_id?: string
  seller_email?: string
  seller_name?: string
  founding_until?: string
}>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  let { seller_email, seller_name, founding_until } = event.data
  const adminEmail = process.env.VILIJ_ADMIN_EMAIL || "hello@thevilij.uk"

  // The revert/expired event only carries seller_id; resolve email + name.
  if (!seller_email && (event.data as any).seller_id) {
    try {
      const sellerService = container.resolve("seller") as any
      const seller = await sellerService.retrieveSeller(
        (event.data as any).seller_id
      )
      seller_email = seller?.email
      seller_name = seller_name ?? seller?.name
    } catch {
      /* seller lookup is best-effort */
    }
  }

  const expiring = event.name === "founding.expiring_soon"
  const subject = expiring
    ? "Your Founders Fifty 0% commission ends soon"
    : "Your Founders Fifty period has ended"
  const body = expiring
    ? `Hi ${seller_name ?? "there"}, your founding-seller 0% commission ends on ${founding_until}. After that, standard rates apply (5% physical, 20% digital).`
    : `Hi ${seller_name ?? "there"}, your founding-seller 0% commission has ended. Standard rates now apply (5% physical, 20% digital).`

  const notify = async () => {
    const notification = container.resolve(Modules.NOTIFICATION)
    // Seller email + admin alert.
    const recipients = [seller_email, adminEmail].filter(Boolean) as string[]
    for (const to of recipients) {
      await notification.createNotifications({
        to,
        channel: "email",
        template: expiring
          ? "founding-expiring-soon"
          : "founding-expired",
        content: { subject },
        data: { seller_name, founding_until, body },
      })
    }
  }

  try {
    await notify()
    logger.info(`[founding-notify] sent "${event.name}" email to ${seller_email}`)
  } catch (e: any) {
    // No email provider configured yet (Resend deferred) — log so nothing is silent.
    logger.warn(
      `[founding-notify] could not send "${event.name}" email (${e.message}). Intended: to=${seller_email} subject="${subject}"`
    )
  }
}

export const config: SubscriberConfig = {
  event: ["founding.expiring_soon", "founding.expired"],
}
