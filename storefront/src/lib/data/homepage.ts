"use server"

import { sdk } from "../config"
import { getCacheOptions } from "./cookies"

export type HomepageSlot = {
  id: string
  slot_key:
    | "start_shopping"
    | "seller_spotlight"
    | "new_this_week"
    | "community_favourites"
    | "vilij_own_brand"
    | "behind_the_business"
  title: string
  subtitle: string | null
  body: string | null
  cta_label: string | null
  cta_href: string | null
  media_url: string | null
  target_type: string | null
  target_id: string | null
  position: number
}

export type LiteProduct = {
  id: string
  title: string
  description: string | null
  type?: { value?: string } | null
  metadata?: Record<string, string> | null
}

/**
 * Fetch a product by handle without region/price filtering (so enquiry-led,
 * price-free Service listings still resolve). Used to branch the product page.
 */
export const getProductByHandle = async (
  handle: string
): Promise<LiteProduct | undefined> => {
  const next = { ...(await getCacheOptions("products")) }
  return sdk.client
    .fetch<{ products: LiteProduct[] }>(`/store/products`, {
      query: {
        handle,
        limit: 1,
        fields: "id,title,description,type.value,metadata",
      },
      next,
      cache: "force-cache",
    })
    .then(({ products }) => products?.[0])
    .catch(() => undefined)
}

/** The Vilij's admin-curated homepage feature slots, published + ordered. */
export const listHomepageSlots = async (): Promise<HomepageSlot[]> => {
  const next = {
    ...(await getCacheOptions("homepage-slots")),
  }
  return sdk.client
    .fetch<{ slots: HomepageSlot[] }>(`/store/homepage-slots`, {
      next,
      cache: "force-cache",
    })
    .then(({ slots }) => slots ?? [])
    .catch(() => [])
}
