import { ExecArgs, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  createCollectionsWorkflow,
  updateProductCategoriesWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * The Vilij taxonomy (idempotent, data-driven so founders can adjust):
 *  - Public filter "lenses" — shopper-facing product categories.
 *  - Internal supplier-mix categories — admin-only (is_internal), for recruitment
 *    balance, hidden from the storefront.
 *  - Gift-guide collections — curated edits.
 *
 *   corepack yarn medusa exec ./src/scripts/setup-taxonomy.ts
 */
const PUBLIC_LENSES = [
  "Autism",
  "ADHD",
  "Education",
  "Wellbeing",
  "Sensory",
  "Parent Support",
  "Digital Downloads",
  "Gifts",
  "Services",
]

const INTERNAL_CATEGORIES = [
  "Wellbeing & Self-Care",
  "SEND Resources & Tools",
  "Creative & Handmade Businesses",
  "Digital & Creative Services",
]

const GIFT_GUIDES = [
  "Sensory-friendly gifts",
  "Burnout-recovery gifts",
  "ADHD organisation",
  "Teacher thank-you gifts",
]

const handleOf = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

export default async function setupTaxonomy({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // --- Product categories (public lenses + internal supplier-mix) ---
  const { data: existingCats } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const existingCatNames = new Set(existingCats.map((c: any) => c.name))

  const catsToCreate = [
    ...PUBLIC_LENSES.filter((n) => !existingCatNames.has(n)).map((name) => ({
      name,
      handle: handleOf(name),
      is_active: true,
      is_internal: false,
    })),
    ...INTERNAL_CATEGORIES.filter((n) => !existingCatNames.has(n)).map((name) => ({
      name,
      handle: handleOf(name),
      is_active: true,
      is_internal: true,
    })),
  ]
  if (catsToCreate.length) {
    await createProductCategoriesWorkflow(container).run({
      input: { product_categories: catsToCreate },
    })
    logger.info(
      `[taxonomy] created ${catsToCreate.length} categories (${PUBLIC_LENSES.length} public lenses + ${INTERNAL_CATEGORIES.length} internal)`
    )
  } else {
    logger.info("[taxonomy] categories already present, skipping")
  }

  // --- Hide leftover demo categories from the base seed (keep public nav clean) ---
  const DEMO_CATEGORIES = ["Shirts", "Sweatshirts", "Pants", "Merch"]
  const demoIds = existingCats
    .filter((c: any) => DEMO_CATEGORIES.includes(c.name))
    .map((c: any) => c.id)
  if (demoIds.length) {
    await updateProductCategoriesWorkflow(container).run({
      input: {
        selector: { id: demoIds },
        update: { is_internal: true, is_active: false },
      },
    })
    logger.info(`[taxonomy] hid ${demoIds.length} demo categories from storefront`)
  }

  // --- Gift-guide collections ---
  const { data: existingCols } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title"],
  })
  const existingColTitles = new Set(existingCols.map((c: any) => c.title))
  const colsToCreate = GIFT_GUIDES.filter((t) => !existingColTitles.has(t)).map(
    (title) => ({ title, handle: handleOf(title) })
  )
  if (colsToCreate.length) {
    await createCollectionsWorkflow(container).run({
      input: { collections: colsToCreate },
    })
    logger.info(`[taxonomy] created ${colsToCreate.length} gift-guide collections`)
  } else {
    logger.info("[taxonomy] gift guides already present, skipping")
  }

  logger.info("[taxonomy] setup complete")
}
