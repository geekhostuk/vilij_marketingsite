"use server"

import { sdk } from "../config"

/** Submit a service enquiry to the backend (Phase 1 services are enquiry-led). */
export const submitServiceEnquiry = async (input: {
  product_id: string
  name: string
  email: string
  message: string
}): Promise<{ ok: boolean; error?: string }> => {
  try {
    await sdk.client.fetch(`/store/service-enquiries`, {
      method: "POST",
      body: input,
    })
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e?.message || "Could not send your enquiry." }
  }
}
