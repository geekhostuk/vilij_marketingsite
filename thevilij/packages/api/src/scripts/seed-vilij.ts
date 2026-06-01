import {
  ExecArgs,
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"
import { activateFoundingSeller } from "../lib/founding"
import { transitionSellerStage } from "../lib/curation"
import { VilijStage } from "../modules/send-seller-profile/models/send-seller-profile"
import { HOMEPAGE_SLOTS_MODULE } from "../modules/homepage-slots"

/**
 * Seed a realistic Vilij demo: a Vilij own-brand seller plus founding sellers
 * across the four internal categories, with story-led products (physical,
 * digital, service), Founders Fifty activated, and homepage slots targeted.
 * Idempotent by seller email + product handle.
 *
 *   corepack yarn medusa exec ./src/scripts/seed-vilij.ts
 */
type SeedProduct = {
  title: string
  handle: string
  type: "Physical" | "Digital" | "Service"
  lens: string
  price?: number
  why_created: string
  maker_story: string
}

type SeedSeller = {
  name: string
  handle: string
  email: string
  founding: boolean
  verified?: boolean
  send_connection: string
  story: string
  why_belongs: string
  products: SeedProduct[]
}

const SELLERS: SeedSeller[] = [
  {
    name: "The Vilij",
    handle: "the-vilij",
    email: "ownbrand@thevilij.uk",
    founding: false,
    verified: true,
    send_connection: "Our own-brand range, designed with and for the community.",
    story: "Calm, useful pieces from The Vilij — journals, planners and sensory bits made to a standard we'd give our own families.",
    why_belongs: "The house brand that sets the tone for the whole marketplace.",
    products: [
      { title: "The Vilij Calm Planner", handle: "vilij-calm-planner", type: "Physical", lens: "Wellbeing", price: 18, why_created: "Most planners shout. We wanted one that breathes.", maker_story: "Designed with SEND parents who needed structure without overwhelm — soft prompts, plenty of white space." },
      { title: "Sensory Regulation Printables", handle: "vilij-sensory-printables", type: "Digital", lens: "Sensory", price: 6, why_created: "Tools that work on the hard days, ready to print at home.", maker_story: "A pack of visual schedules and calm-down cards refined over years at our own kitchen tables." },
    ],
  },
  {
    name: "Sarah's Sensory Studio",
    handle: "sarahs-sensory-studio",
    email: "sarah@example.com",
    founding: true,
    send_connection: "Autism mum of two; I make the things my children actually reach for.",
    story: "Meet Sarah — autism mum and maker of tactile, beautiful sensory toys, handmade in small batches in her spare room.",
    why_belongs: "Lived experience in every stitch; exactly the warmth The Vilij is built on.",
    products: [
      { title: "Weighted Sensory Lap Pad", handle: "weighted-lap-pad", type: "Physical", lens: "Sensory", price: 32, why_created: "My son settles the moment it's on his lap. I wanted others to have that.", maker_story: "Hand-sewn, washable, filled to a weight worked out over many bedtimes." },
    ],
  },
  {
    name: "Bright Sparks Learning",
    handle: "bright-sparks-learning",
    email: "leah@example.com",
    founding: true,
    send_connection: "SEND teacher and ADHD parent — I build resources I wished I'd had.",
    story: "Leah makes joyful, no-prep learning resources for neurodivergent children, born from the classroom and the kitchen table.",
    why_belongs: "Genuinely useful SEND tools made by someone who lives it daily.",
    products: [
      { title: "ADHD Focus Card Deck", handle: "adhd-focus-deck", type: "Physical", lens: "ADHD", price: 14, why_created: "Transitions were our daily battle. These cards turned them into a game.", maker_story: "Tested with real families until every card earned its place." },
      { title: "Visual Timetable Pack (digital)", handle: "visual-timetable-pack", type: "Digital", lens: "Education", price: 5, why_created: "Predictability is kindness. This makes the day make sense.", maker_story: "Editable, printable, and gentle on the eyes." },
    ],
  },
  {
    name: "Maker & Mend",
    handle: "maker-and-mend",
    email: "priya@example.com",
    founding: true,
    send_connection: "Grandmother and carer; craft is how our family regulates together.",
    story: "Priya hand-makes heirloom-quality fidget jewellery and comfort objects, each one a small act of care.",
    why_belongs: "Beautiful, handmade, and rooted in real caregiving.",
    products: [
      { title: "Fidget Bangle (brass)", handle: "fidget-bangle-brass", type: "Physical", lens: "Wellbeing", price: 28, why_created: "Discreet stimming for grown-ups who still need it.", maker_story: "Forged by hand; quiet enough for a meeting, satisfying enough to matter." },
    ],
  },
  {
    name: "Clear Day Studio",
    handle: "clear-day-studio",
    email: "tom@example.com",
    founding: true,
    send_connection: "Dad to an autistic daughter; I run a small design studio around school runs.",
    story: "Tom offers warm, patient brand and web design for fellow SEND-community businesses.",
    why_belongs: "Creative services from someone who gets the realities of SEND family life.",
    products: [
      { title: "Brand & Logo Design", handle: "brand-logo-design", type: "Service", lens: "Services", why_created: "Small SEND businesses deserve design that feels like them.", maker_story: "A calm, flexible process that works around appointments and hard days." },
    ],
  },
]

export default async function seedVilij({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const sellerService = container.resolve("seller") as any
  const profileService = container.resolve("send_seller_profile") as any
  const slotsService = container.resolve(HOMEPAGE_SLOTS_MODULE) as any

  // Prerequisites
  const { data: channels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const salesChannelId = channels[0]?.id
  const { data: profiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfileId = profiles[0]?.id
  const { data: types } = await query.graph({
    entity: "product_type",
    fields: ["id", "value"],
  })
  const typeId = (v: string) => types.find((t: any) => t.value === v)?.id
  const { data: cats } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const catId = (n: string) => cats.find((c: any) => c.name === n)?.id

  let createdSellers = 0
  let createdProducts = 0
  let spotlightSellerId: string | null = null
  let vilijSellerId: string | null = null

  for (const s of SELLERS) {
    // Seller (idempotent by email)
    const existing = await sellerService.listSellers({ email: s.email })
    const seller =
      existing[0] ??
      (await sellerService.createSellers({
        name: s.name,
        handle: s.handle,
        email: s.email,
        currency_code: "gbp",
      }))
    if (!existing[0]) createdSellers++

    if (s.handle === "the-vilij") vilijSellerId = seller.id
    if (s.founding && !spotlightSellerId) spotlightSellerId = seller.id

    // Profile: story content, stage active, founding/badge
    await transitionSellerStage(container, seller.id, VilijStage.ACTIVE, {
      founding: s.founding,
    })
    // attach story content + badge via the seller's profile
    const { data: sellerWithProfile } = await query.graph({
      entity: "seller",
      fields: ["id", "send_seller_profile.id"],
      filters: { id: seller.id },
    })
    const profileId = (sellerWithProfile?.[0] as any)?.send_seller_profile?.id
    if (profileId) {
      await profileService.updateSendSellerProfiles({
        id: profileId,
        send_connection: s.send_connection,
        story: s.story,
        why_belongs: s.why_belongs,
        is_vilij_verified: !!s.verified,
      })
    }

    // Products (idempotent by handle), linked to the seller via additional_data
    const { data: existingProducts } = await query.graph({
      entity: "product",
      fields: ["id", "handle"],
    })
    const existingHandles = new Set(existingProducts.map((p: any) => p.handle))

    const toCreate = s.products.filter((p) => !existingHandles.has(p.handle))
    for (const p of toCreate) {
      const isPhysical = p.type === "Physical"
      await createProductsWorkflow(container).run({
        input: {
          products: [
            {
              title: p.title,
              handle: p.handle,
              status: "published",
              type_id: typeId(p.type),
              ...(catId(p.lens) ? { categories: [{ id: catId(p.lens)! }] } : {}),
              ...(salesChannelId
                ? { sales_channels: [{ id: salesChannelId }] }
                : {}),
              ...(isPhysical && shippingProfileId
                ? { shipping_profile_id: shippingProfileId }
                : {}),
              options: [{ title: "Option", values: ["Default"] }],
              variants: [
                {
                  title: "Default",
                  options: { Option: "Default" },
                  manage_inventory: false,
                  ...(p.price != null
                    ? { prices: [{ currency_code: "gbp", amount: p.price }] }
                    : {}),
                },
              ],
              metadata: {
                why_created: p.why_created,
                maker_story: p.maker_story,
              },
            },
          ],
          additional_data: { seller_id: seller.id },
        },
      })
      createdProducts++
    }
    logger.info(`[seed-vilij] seller "${s.name}" ready (${toCreate.length} new products)`)
  }

  // Point homepage slots at real targets.
  const { data: collections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title"],
  })
  const favCollection = collections.find(
    (c: any) => c.title === "Sensory-friendly gifts"
  )?.id

  const setSlotTarget = async (slot_key: string, target_type: string, target_id?: string | null) => {
    if (!target_id) return
    const [slot] = await slotsService.listHomepageSlots({ slot_key })
    if (slot) {
      await slotsService.updateHomepageSlots({ id: slot.id, target_type, target_id })
    }
  }
  await setSlotTarget("seller_spotlight", "seller", spotlightSellerId)
  await setSlotTarget("vilij_own_brand", "seller", vilijSellerId)
  await setSlotTarget("community_favourites", "collection", favCollection)

  logger.info(
    `[seed-vilij] done — ${createdSellers} new sellers, ${createdProducts} new products; homepage targets set.`
  )
}
