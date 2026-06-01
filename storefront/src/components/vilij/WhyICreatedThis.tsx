/**
 * The "Why I created this" maker-story block — storytelling as a first-class
 * product feature. Reads from product metadata (why_created / maker_story).
 */
export const WhyICreatedThis = ({
  why,
  makerStory,
}: {
  why?: string | null
  makerStory?: string | null
}) => {
  if (!why && !makerStory) return null
  return (
    <section className="mx-auto max-w-3xl px-4 lg:px-0 py-10 flex flex-col gap-4">
      <span className="label-sm uppercase tracking-[0.2em] text-action">
        Why I created this
      </span>
      {why && <p className="font-display text-2xl lg:text-3xl text-primary leading-snug">{why}</p>}
      {makerStory && <p className="text-lg text-secondary">{makerStory}</p>}
    </section>
  )
}
