import { ExecArgs } from "@medusajs/framework/utils"
import { HOMEPAGE_SLOTS_MODULE } from "../modules/homepage-slots"
import { SlotKey, SlotTarget } from "../modules/homepage-slots/models/homepage-slot"

/**
 * Seed The Vilij's six homepage slots (idempotent by slot_key). Admins edit
 * these afterwards; target_ids are filled in during seeding (Step 9).
 *
 *   corepack yarn medusa exec ./src/scripts/setup-homepage.ts
 */
const DEFAULT_SLOTS = [
  {
    slot_key: SlotKey.START_SHOPPING,
    title: "Start shopping",
    subtitle: "Browse by what matters to you",
    body: "Gentle, useful and beautiful things — made by the SEND community, for the SEND community.",
    cta_label: "Explore the shop",
    cta_href: "/categories",
    position: 0,
  },
  {
    slot_key: SlotKey.SELLER_SPOTLIGHT,
    title: "Seller spotlight",
    subtitle: "Meet the maker",
    body: "Every week we share the story behind one of our founding sellers.",
    cta_label: "Read their story",
    target_type: SlotTarget.SELLER,
    position: 1,
  },
  {
    slot_key: SlotKey.NEW_THIS_WEEK,
    title: "New this week",
    subtitle: "Fresh from our community",
    cta_label: "See what's new",
    cta_href: "/categories",
    position: 2,
  },
  {
    slot_key: SlotKey.COMMUNITY_FAVOURITES,
    title: "Community favourites",
    subtitle: "Loved by SEND parents",
    cta_label: "Shop favourites",
    position: 3,
  },
  {
    slot_key: SlotKey.VILIJ_OWN_BRAND,
    title: "From The Vilij",
    subtitle: "Our own-brand journals, planners & sensory pieces",
    cta_label: "Shop The Vilij",
    target_type: SlotTarget.SELLER,
    position: 4,
  },
  {
    slot_key: SlotKey.BEHIND_THE_BUSINESS,
    title: "Behind the business",
    subtitle: "Stories of resilience, care and craft",
    body: "The people of The Vilij are parents, grandparents and carers building something of their own.",
    cta_label: "Read our stories",
    cta_href: "/stories",
    position: 5,
  },
]

export default async function setupHomepage({ container }: ExecArgs) {
  const logger = container.resolve("logger")
  const service = container.resolve(HOMEPAGE_SLOTS_MODULE) as any

  const existing = await service.listHomepageSlots({})
  const existingKeys = new Set(existing.map((s: any) => s.slot_key))

  const toCreate = DEFAULT_SLOTS.filter((s) => !existingKeys.has(s.slot_key))
  if (toCreate.length) {
    await service.createHomepageSlots(toCreate)
    logger.info(`[homepage] created ${toCreate.length} slots`)
  } else {
    logger.info("[homepage] slots already present, skipping")
  }
  logger.info("[homepage] setup complete")
}
