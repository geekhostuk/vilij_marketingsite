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
