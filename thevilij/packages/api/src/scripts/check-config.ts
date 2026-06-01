import { ExecArgs, Modules } from "@medusajs/framework/utils"

/**
 * Diagnostic: loads the full Medusa + Mercur config and resolves the payment and
 * payout modules, listing their registered providers. Used to validate the
 * Stripe Connect wiring (Step 2) without starting the HTTP server.
 *
 *   corepack yarn medusa exec ./src/scripts/check-config.ts
 */
export default async function checkConfig({ container }: ExecArgs) {
  const logger = container.resolve("logger")

  try {
    const payment = container.resolve(Modules.PAYMENT) as any
    const providers = await payment.listPaymentProviders?.({})
    logger.info(
      `[check-config] payment providers: ${JSON.stringify(
        (providers || []).map((p: any) => p.id)
      )}`
    )
  } catch (e: any) {
    logger.warn(`[check-config] payment module: ${e.message}`)
  }

  try {
    const payout = container.resolve("payout") as any
    logger.info(`[check-config] payout module resolved: ${!!payout}`)
  } catch (e: any) {
    logger.warn(`[check-config] payout module: ${e.message}`)
  }

  logger.info("[check-config] config loaded successfully")
}
