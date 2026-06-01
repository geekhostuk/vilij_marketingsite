"use client"

import { useState } from "react"
import { submitServiceEnquiry } from "@/lib/data/enquiries"

/**
 * Enquiry form for Service-type listings (Phase 1: no checkout). Posts to the
 * backend, which notifies the seller.
 */
export const ServiceEnquiryForm = ({
  productId,
  productTitle,
}: {
  productId: string
  productTitle: string
}) => {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setState("sending")
    setError(null)
    const res = await submitServiceEnquiry({
      product_id: productId,
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      message: String(form.get("message") || ""),
    })
    if (res.ok) setState("sent")
    else {
      setState("error")
      setError(res.error || "Something went wrong.")
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-[var(--vilij-radius)] bg-secondary p-6">
        <h3 className="font-display text-2xl text-primary mb-2">Thank you</h3>
        <p className="text-md text-secondary">
          Your enquiry about <strong>{productTitle}</strong> is on its way to the
          maker. They&apos;ll be in touch by email soon.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[var(--vilij-radius)] bg-secondary p-6 flex flex-col gap-4"
    >
      <div>
        <h3 className="font-display text-2xl text-primary">Enquire about this service</h3>
        <p className="text-md text-secondary">
          Tell the maker what you need — they&apos;ll reply personally.
        </p>
      </div>
      <input
        name="name"
        required
        placeholder="Your name"
        className="rounded-lg border border-action/30 bg-primary px-4 py-3 text-md text-primary outline-none focus:border-action"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Your email"
        className="rounded-lg border border-action/30 bg-primary px-4 py-3 text-md text-primary outline-none focus:border-action"
      />
      <textarea
        name="message"
        required
        rows={4}
        placeholder="How can this maker help?"
        className="rounded-lg border border-action/30 bg-primary px-4 py-3 text-md text-primary outline-none focus:border-action"
      />
      {error && <p className="text-sm text-negative">{error}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-full bg-action px-7 py-3 text-white label-md hover:bg-action-hover transition-colors disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  )
}
