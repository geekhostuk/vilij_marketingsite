import { HomeCategories, HomeProductSection } from "@/components/sections"
import { VilijHero, VilijStoryBand, VilijCommitments } from "@/components/vilij"
import { listHomepageSlots, type HomepageSlot } from "@/lib/data/homepage"

import type { Metadata } from "next"
import { headers } from "next/headers"
import Script from "next/script"
import { listRegions } from "@/lib/data/regions"
import { toHreflang } from "@/lib/helpers/hreflang"

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "The Vilij"
const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  "A curated marketplace from the SEND community — warmth, story and quality."

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  const headersList = await headers()
  const host = headersList.get("host")
  const protocol = headersList.get("x-forwarded-proto") || "https"
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

  let languages: Record<string, string> = {}
  try {
    const regions = await listRegions()
    const locales = Array.from(
      new Set(
        (regions || [])
          .map((r) => r.countries?.map((c) => c.iso_2) || [])
          .flat()
          .filter(Boolean)
      )
    ) as string[]
    languages = locales.reduce<Record<string, string>>((acc, code) => {
      acc[toHreflang(code)] = `${baseUrl}/${code}`
      return acc
    }, {})
  } catch {
    languages = { [toHreflang(locale)]: `${baseUrl}/${locale}` }
  }

  const canonical = `${baseUrl}/${locale}`
  return {
    title: "Home",
    description: SITE_DESCRIPTION,
    alternates: { canonical, languages: { ...languages, "x-default": baseUrl } },
    openGraph: {
      title: `Home | ${SITE_NAME}`,
      description: SITE_DESCRIPTION,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const slots = await listHomepageSlots()
  const bySlot = (key: HomepageSlot["slot_key"]) =>
    slots.find((s) => s.slot_key === key)

  const startShopping = bySlot("start_shopping")
  const spotlight = bySlot("seller_spotlight")
  const newThisWeek = bySlot("new_this_week")
  const favourites = bySlot("community_favourites")
  const ownBrand = bySlot("vilij_own_brand")
  const behind = bySlot("behind_the_business")

  return (
    <main className="flex flex-col w-full text-primary">
      <Script
        id="ld-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/${locale}`,
          }),
        }}
      />

      <VilijHero locale={locale} />

      {startShopping && <VilijStoryBand slot={startShopping} locale={locale} />}
      <div className="px-4 lg:px-8 w-full mx-auto max-w-7xl">
        <HomeCategories heading="Browse by what matters to you" />
      </div>

      {newThisWeek && <VilijStoryBand slot={newThisWeek} locale={locale} />}
      <div className="px-4 lg:px-8 w-full mx-auto max-w-7xl">
        <HomeProductSection
          heading={favourites?.title || "Community favourites"}
          locale={locale}
          home
        />
      </div>

      {spotlight && (
        <VilijStoryBand slot={spotlight} locale={locale} align="center" />
      )}

      <VilijCommitments />

      {ownBrand && <VilijStoryBand slot={ownBrand} locale={locale} />}
      {behind && <VilijStoryBand slot={behind} locale={locale} align="center" />}
    </main>
  )
}
