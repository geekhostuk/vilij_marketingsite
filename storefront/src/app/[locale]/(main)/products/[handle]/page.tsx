import { ProductDetailsPage } from "@/components/sections"
import { listProducts } from "@/lib/data/products"
import { getProductByHandle } from "@/lib/data/homepage"
import { generateProductMetadata } from "@/lib/helpers/seo"
import { WhyICreatedThis } from "@/components/vilij/WhyICreatedThis"
import { ServiceEnquiryForm } from "@/components/vilij/ServiceEnquiryForm"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string; locale: string }>
}): Promise<Metadata> {
  const { handle, locale } = await params

  const prod = await listProducts({
    countryCode: locale,
    queryParams: { handle: [handle], limit: 1 },
    forceCache: true,
  }).then(({ response }) => response.products[0])

  return generateProductMetadata(prod)
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string; locale: string }>
}) {
  const { handle, locale } = await params

  const product = await getProductByHandle(handle)
  const meta = (product?.metadata ?? {}) as Record<string, string>
  const isService = product?.type?.value === "Service"

  // Services are enquiry-led in Phase 1 — render a bespoke, price-free listing
  // (the standard product template assumes a purchasable, priced product).
  if (isService && product) {
    return (
      <main className="container">
        <section className="mx-auto max-w-3xl px-4 lg:px-0 py-12 flex flex-col gap-4">
          <span className="label-sm uppercase tracking-[0.2em] text-action">
            Service
          </span>
          <h1 className="font-display text-4xl text-primary">{product.title}</h1>
          {product.description && (
            <p className="text-lg text-secondary">{product.description}</p>
          )}
        </section>
        <WhyICreatedThis why={meta.why_created} makerStory={meta.maker_story} />
        <div className="mx-auto max-w-3xl px-4 lg:px-0 pb-16">
          <ServiceEnquiryForm productId={product.id} productTitle={product.title} />
        </div>
      </main>
    )
  }

  return (
    <main className="container">
      <ProductDetailsPage handle={handle} locale={locale} />
      <WhyICreatedThis why={meta.why_created} makerStory={meta.maker_story} />
    </main>
  )
}
