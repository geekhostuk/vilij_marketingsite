import { ProductDetailsPage } from "@/components/sections"
import { listProducts } from "@/lib/data/products"
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

  const product = await listProducts({
    countryCode: locale,
    queryParams: {
      handle: [handle],
      limit: 1,
      fields: "id,title,type.value,metadata",
    } as any,
    forceCache: true,
  })
    .then(({ response }) => response.products[0])
    .catch(() => undefined)

  const meta = (product?.metadata ?? {}) as Record<string, string>
  const isService = (product as any)?.type?.value === "Service"

  return (
    <main className="container">
      <ProductDetailsPage handle={handle} locale={locale} />

      <WhyICreatedThis why={meta.why_created} makerStory={meta.maker_story} />

      {isService && product && (
        <div className="mx-auto max-w-3xl px-4 lg:px-0 pb-16">
          <ServiceEnquiryForm productId={product.id} productTitle={product.title} />
        </div>
      )}
    </main>
  )
}
