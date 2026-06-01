import Link from "next/link"
import type { HomepageSlot } from "@/lib/data/homepage"

const withLocale = (locale: string, href?: string | null) => {
  if (!href) return `/${locale}`
  if (href.startsWith("http")) return href
  return `/${locale}${href.startsWith("/") ? "" : "/"}${href}`
}

/** Warm, story-led hero. */
export const VilijHero = ({ locale }: { locale: string }) => (
  <section className="w-full bg-secondary">
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
      <div className="flex flex-col gap-6">
        <span className="label-sm uppercase tracking-[0.2em] text-action">
          From our community to yours
        </span>
        <h1 className="font-display text-4xl lg:text-6xl leading-[1.05] text-primary">
          Gentle, useful and beautiful things — made by the SEND community.
        </h1>
        <p className="text-lg text-secondary max-w-prose">
          Discover small businesses run by SEND parents, grandparents and
          carers. Every maker has a story, and every purchase supports a family.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={withLocale(locale, "/categories")}
            className="rounded-full bg-action px-7 py-3 text-white label-md hover:bg-action-hover transition-colors"
          >
            Start shopping
          </Link>
          <Link
            href="#stories"
            className="rounded-full border border-action px-7 py-3 text-action label-md hover:bg-component-secondary transition-colors"
          >
            Meet the makers
          </Link>
        </div>
      </div>
      <div className="aspect-[4/3] rounded-[var(--vilij-radius)] bg-component-secondary overflow-hidden shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero/Image.jpg"
          alt="A calm, handmade scene from The Vilij community"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </section>
)

/** A warm editorial band used for the storytelling slots (spotlight, behind-the-business). */
export const VilijStoryBand = ({
  slot,
  locale,
  align = "left",
}: {
  slot: HomepageSlot
  locale: string
  align?: "left" | "center"
}) => (
  <section
    id={slot.slot_key === "behind_the_business" ? "stories" : undefined}
    className="w-full"
  >
    <div
      className={`mx-auto max-w-7xl px-4 lg:px-8 py-12 lg:py-16 flex flex-col gap-4 ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      {slot.subtitle && (
        <span className="label-sm uppercase tracking-[0.2em] text-action">
          {slot.subtitle}
        </span>
      )}
      <h2 className="font-display text-3xl lg:text-4xl text-primary max-w-2xl">
        {slot.title}
      </h2>
      {slot.body && (
        <p className="text-lg text-secondary max-w-2xl">{slot.body}</p>
      )}
      {slot.cta_label && (
        <Link
          href={withLocale(locale, slot.cta_href)}
          className="mt-2 inline-flex w-fit rounded-full border border-action px-6 py-2.5 text-action label-md hover:bg-component-secondary transition-colors"
        >
          {slot.cta_label}
        </Link>
      )}
    </div>
  </section>
)

/** The trust/values strip — warmth over transactions. */
export const VilijCommitments = () => {
  const items = [
    { t: "Hand-picked", d: "Every seller is personally vetted and welcomed by our founders." },
    { t: "Founding sellers", d: "Our first makers trade commission-free for their first year." },
    { t: "Real stories", d: "Lived SEND experience behind every shop and every product." },
    { t: "Made with care", d: "Calm, useful, beautiful — chosen for our community." },
  ]
  return (
    <section className="w-full bg-secondary">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((i) => (
          <div key={i.t} className="flex flex-col gap-2">
            <h3 className="font-display text-xl text-primary">{i.t}</h3>
            <p className="text-md text-secondary">{i.d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
