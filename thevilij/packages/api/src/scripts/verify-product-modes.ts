import {
  ExecArgs,
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import { DIGITAL_PRODUCT_MODULE } from "../modules/digital-product"

/**
 * Sets up fixtures + checks for Step 6 product modes. Creates a digital asset
 * linked to a variant, a delivery token, and a Service-type product, then prints
 * the token + product id so the HTTP download/enquiry routes can be exercised.
 *
 *   corepack yarn medusa exec ./src/scripts/verify-product-modes.ts
 */
export default async function verifyProductModes({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const productModule = container.resolve(Modules.PRODUCT)
  const dpService = container.resolve(DIGITAL_PRODUCT_MODULE) as any

  const results: string[] = []
  const check = (label: string, ok: boolean, detail = "") =>
    results.push(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`)

  const { data: types } = await query.graph({
    entity: "product_type",
    fields: ["id", "value"],
  })
  const digitalType = types.find((t: any) => t.value === "Digital")?.id
  const serviceType = types.find((t: any) => t.value === "Service")?.id

  // --- Digital: asset + variant + link + delivery token ---
  const dp = await dpService.createDigitalProducts({
    name: "Vilij Calm Printable Pack",
    file_url: "https://example.com/vilij/calm-pack.pdf",
    mime_type: "application/pdf",
  })

  const [product] = await productModule.createProducts([
    {
      title: "Calm Printable Pack (digital)",
      status: "published",
      type_id: digitalType,
      options: [{ title: "Format", values: ["PDF"] }],
      variants: [{ title: "PDF", options: { Format: "PDF" } }],
    },
  ])
  const variantId = product.variants[0].id

  await link.create({
    [Modules.PRODUCT]: { product_variant_id: variantId },
    [DIGITAL_PRODUCT_MODULE]: { digital_product_id: dp.id },
  })

  const { data: linked } = await query.graph({
    entity: "product_variant",
    fields: ["id", "digital_product.id", "digital_product.name"],
    filters: { id: variantId },
  })
  check(
    "digital asset linked to variant",
    (linked?.[0] as any)?.digital_product?.id === dp.id,
    (linked?.[0] as any)?.digital_product?.name
  )

  const future = new Date()
  future.setDate(future.getDate() + 30)
  const token = "veriftoken" + Date.now().toString(36)
  await dpService.createDigitalProductDeliveries({
    token,
    digital_product_id: dp.id,
    email: "buyer@example.com",
    expires_at: future,
    max_downloads: 2,
  })
  const [delivery] = await dpService.listDigitalProductDeliveries({ token })
  check("delivery token created", !!delivery && delivery.download_count === 0)

  // --- Service: a Service-type product to enquire about ---
  const [service] = await productModule.createProducts([
    {
      title: "Vilij Brand Design (service)",
      status: "published",
      type_id: serviceType,
    },
  ])
  check("service product created", !!service?.id)

  logger.info("\n[verify-product-modes]\n" + results.join("\n"))
  logger.info(
    `[verify-product-modes] FIXTURES — download token: ${token} | service product id: ${service.id}`
  )
  if (results.some((r) => r.startsWith("FAIL"))) {
    throw new Error("product-modes verification FAILED")
  }
  logger.info("[verify-product-modes] ALL PASS")
}
