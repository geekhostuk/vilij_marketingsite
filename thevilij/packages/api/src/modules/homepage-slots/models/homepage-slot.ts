import { model } from "@medusajs/framework/utils"

/**
 * An admin-curated homepage feature slot. The Vilij homepage is six editable
 * storytelling blocks (not hardcoded queries) — admins choose what each shows.
 */
export const SlotKey = {
  START_SHOPPING: "start_shopping",
  SELLER_SPOTLIGHT: "seller_spotlight",
  NEW_THIS_WEEK: "new_this_week",
  COMMUNITY_FAVOURITES: "community_favourites",
  VILIJ_OWN_BRAND: "vilij_own_brand",
  BEHIND_THE_BUSINESS: "behind_the_business",
} as const

export const SlotTarget = {
  COLLECTION: "collection",
  CATEGORY: "category",
  SELLER: "seller",
  PRODUCT: "product",
  URL: "url",
} as const

const HomepageSlot = model.define("homepage_slot", {
  id: model.id({ prefix: "slot" }).primaryKey(),
  slot_key: model.enum(Object.values(SlotKey)),
  title: model.text(),
  subtitle: model.text().nullable(),
  body: model.text().nullable(),
  cta_label: model.text().nullable(),
  cta_href: model.text().nullable(),
  media_url: model.text().nullable(),
  target_type: model.enum(Object.values(SlotTarget)).nullable(),
  target_id: model.text().nullable(),
  position: model.number().default(0),
  is_published: model.boolean().default(true),
})

export default HomepageSlot
