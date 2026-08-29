# SEO and Site Review

Review date: 31 July 2026 · Reviewer: Claude · Site: `marketing.thevilij.co.uk` (Astro 5, static, Cloudflare Pages)

Scope: the 13 built routes, `public/`, `src/`, and the built output in `dist/`. This is a technical and
on-page SEO review. It deliberately does **not** re-list the content and dead-link gaps already tracked in
`ISSUES.md` and `content-issues.md` except where they carry a specific SEO consequence — those are marked
*(also ISSUES #n)*.

Priority key: **P1** fix before promoting the site · **P2** fix before it matters · **P3** tidy-up.

---

## Summary

The fundamentals are in better shape than most sites at this stage. Titles and meta descriptions are
hand-written, unique, keyword-appropriate and correctly sized on all 13 routes. Canonicals are derived
properly and match both the sitemap and the internal links. `robots.txt` and `sitemap.xml` exist and agree
with each other. Every page has exactly one `<h1>`. `/newsletter-thanks` is correctly `noindex`ed *and*
disallowed. That is a genuinely good baseline and there is nothing to undo.

The gaps are concentrated in three areas:

1. **Performance.** The homepage ships ~2.7 MB of un-optimised PNGs, none of which declare dimensions or
   lazy-load. This is the single biggest SEO problem on the site — Core Web Vitals is a ranking signal and
   this will fail LCP and CLS on mobile.
2. **Social and structured data.** There are no Open Graph tags, no Twitter Card tags and no JSON-LD
   anywhere. Every share of this site to Facebook, LinkedIn, WhatsApp or Slack currently renders as a bare
   grey link — which matters a lot for a site whose growth is likely to be parent-to-parent sharing.
3. **Crawl/index consistency.** Two pages were just held back behind the coming-soon banner but are still
   in the sitemap and still indexable.

Nothing in those three requires re-architecting. They are roughly a day's work and would move the needle
more than everything else on the technical list combined.

Separately, and more important than any of them in the long run: **the site has no organic acquisition
layer and structurally cannot inherit one from the app**, because everything searchable The Vilij produces
sits behind the subscription. That is §10, it is a content programme rather than a code change, and it is
where organic growth will actually come from.

---

## P1 — Performance

### 1. Images are unoptimised and bypass Astro entirely

Everything lives in `public/assets/`, which Astro copies verbatim — no resizing, no format conversion, no
hashing. `sharp` is already an allowed dependency but nothing uses it.

The homepage alone loads **~2.7 MB across 15 images**:

| Size | Asset |
|---|---|
| 849 KB | `hero_village.png` ← the LCP element |
| 391 KB | `village_sm.png` |
| 296 KB | `tiles/campus.png` |
| 213 KB | `tiles/experthub.png` |
| 184 KB | `tiles/highstreet.png` |
| 175 KB | `p_emily_loui.png` |
| … | 9 more |

`hero_village.png` is a 849 KB PNG serving as the largest contentful paint on the most important page on
the site. On a mid-range phone on 4G this alone is a multi-second LCP. Google's "good" threshold is 2.5s.

**Recommendation.** Move the assets from `public/assets/` into `src/assets/` and use Astro's `<Image>` /
`<Picture>` components, which will emit WebP/AVIF at multiple widths with correct `srcset` and hashed
filenames. Astro does this at build time with `sharp`, which is already permitted in `package.json`. If
moving all 47 images at once is too much churn, do `hero_village.png` and the eight tile images first —
that is ~2.3 MB of the 2.7 MB.

The `/cafe` precedent in `ISSUES.md` (PNG → JPEG at 2× dropped that page from 1377 KB to 807 KB *while
doubling resolution*) shows the win is real and already proven on this codebase.

### 2. No image has `width`, `height`, `loading` or `decoding` — **DONE 31 Jul 2026**

> Fixed on branch `seo-optimisation`. All 123 rendered `<img>` across the 13 built pages now carry
> `width`/`height`; 103 are `loading="lazy" decoding="async"`, the 6 page heroes are eager with
> `fetchpriority="high"`, and the nav logo and hero house icon stay eager without a priority hint.
> Dimensions for the three components that take their image as a prop come from the generated
> `src/data/imageSizes.ts` (`node scripts/gen-image-sizes.mjs`); the hand-written page markup carries
> literals. Verified against a baseline build: with the four new attributes normalised away, the built
> `<body>` of all 13 pages is unchanged apart from the TestimonialScript edit described below.

All **47** `<img>` tags across `src/` lack every one of these. A grep for them returns only the viewport
meta tag.

Two separate consequences:

- **CLS.** Without `width`/`height` (or an `aspect-ratio`), the browser cannot reserve space, so every
  image pops the layout as it arrives. Only `.vcard-img` has an `aspect-ratio`, so the tiles are partly
  protected — the hero, the photo tiles and the testimonial photo are not.
- **LCP.** Every image is eager-loaded, so the ~15 below-the-fold images on the homepage compete for
  bandwidth with the hero.

**Recommendation.** Add explicit `width` and `height` to every `<img>`, and `loading="lazy"
decoding="async"` to everything below the fold. The hero should stay eager and additionally get
`fetchpriority="high"`. Using Astro's `<Image>` component (item 1) supplies `width`/`height` automatically
and makes this mostly free.

### 3. Render-blocking Google Fonts

`BaseLayout.astro` loads Lato from `fonts.googleapis.com` via a `<link rel="stylesheet">`, which is
render-blocking on every page. The `preconnect` hints are correctly in place, which helps, and
`&display=swap` avoids invisible text — so this is the mildest of the three.

**Recommendation.** Self-host the three Lato weights as WOFF2 in `public/fonts/` with `@font-face` and
`font-display: swap`. That removes a third-party connection from the critical path entirely and also
removes a GDPR wrinkle (Google Fonts serves from Google's servers and logs visitor IPs — a German court
has ruled this a GDPR violation, and this site is otherwise scrupulous about consent).

---

## P1 — Social sharing and structured data

### 4. No Open Graph or Twitter Card tags anywhere — **DONE 31 Jul 2026**

> Fixed on branch `seo-optimisation`. `BaseLayout` now emits the full `og:*` and `twitter:*` set, driven by
> the `title` and `description` props that were already unique per page. `og:title` strips the
> `| The Vilij` suffix because `og:site_name` carries the brand; `<title>` keeps it. Two new optional
> props, `ogImage` and `ogImageAlt`, let a page override the card. `<html lang>` went to `en-GB` at the
> same time, which closes §16.
>
> The share image is `public/assets/og-default.jpg` — 1200x630, 67KB — generated by
> `node scripts/make-og-image.mjs`, which contain-fits the village illustration onto the hero gradient.
> It is a build-from-existing-asset, not a designed card: worth replacing with a real one from Damien,
> and the script says so. The only contract is the path.

Confirmed absent from the built output. Every link to this site shared on Facebook, LinkedIn, WhatsApp,
Slack or iMessage renders with no image, and with whatever title and description the platform decides to
scrape.

For a community site aimed at SEND parents — where the realistic growth channel is one parent sending the
link to another in a WhatsApp group — this is a significant, cheap miss.

**Recommendation.** Add to `BaseLayout.astro`'s head, driven by the props that already exist:

```astro
<meta property="og:type" content="website" />
<meta property="og:site_name" content="The Vilij" />
<meta property="og:locale" content="en_GB" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={new URL(ogImage, Astro.site).href} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content={ogImageAlt} />
<meta name="twitter:card" content="summary_large_image" />
```

`title` and `description` are already props and already unique per page, so this is nearly free. You will
need a new prop for the image with a sensible default — a 1200×630 crop of the village illustration would
work site-wide, with per-area overrides later if wanted.

Note `og:title` should probably drop the `| The Vilij` suffix, since `og:site_name` already carries it.

### 5. No structured data

No JSON-LD on any route. Two schemas are worth having:

- **`Organization`** on the homepage — name, URL, logo, `sameAs` pointing at the three real social
  profiles already in the footer, and `contactPoint` for `info@thevilij.co.uk`. This is what feeds the
  Google knowledge panel and helps disambiguate "The Vilij" from ordinary uses of "village".
- **`WebSite`** with `potentialAction` if you ever add site search. Skip for now.

`FAQPage` is worth considering later if the Library pages grow question-shaped headings, but it no longer
produces rich results for non-authoritative sites, so it is low value today.

**Recommendation.** Add `Organization` JSON-LD to the homepage. Roughly 20 lines, no dependencies.

---

## P1 — Crawl and index consistency

### 6. Library and Wellbeing are held back but still indexable and still in the sitemap — **DONE 31 Jul 2026**

> Fixed on branch `seo-optimisation`. Both pages now pass `noindex`; both are out of `public/sitemap.xml`,
> which is down to 10 entries; and the `/newsletter-thanks` "While You're Here" cards that pointed at them
> now point at Vilij Hall and the Expert Hub, with copy lifted from `src/data/areas.ts`. Neither page is
> disallowed in `robots.txt`, deliberately — see the note in the sitemap. Reversing all of it when the app
> features ship is three small edits, and each one says so at the site.

Commit `2dab0ad` put `/library` and `/wellbeing` behind the coming-soon banner. Its own commit message
flags the loose ends, and they are still loose:

- Both are still listed in `public/sitemap.xml` at priority 0.8.
- Both are still fully indexable — no `noindex`.
- `/newsletter-thanks` still links directly to both.
- Both pages are still built and reachable by direct URL.

The result is that Google will happily index two pages the business has decided not to offer yet, and can
serve them as landing pages from search — for users who cannot reach them through the site's own
navigation. That is a poor first impression and it dilutes the crawl signal across the pages you *do* want
ranked.

The point that settles this: these are **brochure pages for app features**, not content in their own right
(see §10). A brochure page for a feature that is not yet available is advertising something the reader
cannot get even if they subscribe. Indexed, it can only disappoint.

**Recommendation.** Treat both as not-ready and be consistent about it:

- Add `noindex` — the `BaseLayout` prop already exists, so this is one line each.
- Remove both entries from `public/sitemap.xml`.
- Repoint or remove the `/newsletter-thanks` buttons that still link to them.

Reverse all three when the app features go live. Because `href` still points at the real pages, opening
them up stays the small change the commit message intended.

### 7. No 404 page *(also ISSUES #24)*

Cloudflare serves a generic one. Beyond the brand cost, a branded 404 with links back into the site
recovers traffic from stale inbound links. `src/pages/404.astro` — Astro and Cloudflare Pages both pick it
up automatically.

---

## P2 — On-page and semantics

### 8. No `<main>` landmark on any page

The built output contains one `<nav>` and one `<footer>` and no `<main>`, `<header>`, or `role="banner"`.
Everything sits inside a chain of `<div>`s and `<section>`s.

This affects assistive technology directly (there is no "skip to main content" target, which is also
ISSUES #27), and it removes the strongest hint available to search engines about which part of the page is
the content and which is boilerplate repeated across 13 routes.

**Recommendation.** Wrap the page slot in `<main id="main">` inside `BaseLayout`, wrap `SiteNav` in
`<header>`, and add the skip link. Low risk — none of these have default styling that would move the
design.

### 9. Heading hierarchy is presentational

On `/cafe`, `<h3>` is used for card headings that are visually 30–40px while `<h2>` is used for 50–58px
band headings — that part is fine. But the "Be More / Be Brave / Be Curious" bars and several strapline
lines are `<span>`s carrying 42px type, and some `<h3>`s sit directly under an `<h2>` in a different
section rather than nested beneath it.

This is a minor issue and it is not worth churning 13 pages over. Worth a pass only if you are already in
these files.

### 10. The site has no organic acquisition layer, and structurally cannot inherit one

This is the strategic item on the list. It is not a bug and it cannot be fixed in an afternoon, but it is
the answer to "where will organic traffic actually come from."

**Measured word counts.** Unique body copy per page, taken from the built HTML with the shared nav
(8 words) and footer (91 words) subtracted:

| Words | Page |
|---|---|
| 576 | `/cafe` |
| 531 | `/index` |
| 494 | `/expert-hub` |
| 484 | `/hall` |
| 477 | `/wellbeing` |
| 461 | `/library` |

Every content page sits in a band of roughly 460–580 words — the consistency of one template.

**Word count is not the problem.** Google has said explicitly that there is no minimum and no threshold.
Do not pad these pages; that would make them worse. The count is a symptom, and the diagnosis is a
**search intent mismatch**.

The area pages answer *"What is The Vilij's Café?"* — a question only someone who already knows The Vilij
exists would type. The questions SEND parents actually search are problem-shaped and urgent: "EHCP annual
review timeline", "how to appeal EHCP refusal", "DLA form help autism", "school won't follow EHCP".
Nothing on the site attempts to answer any of them. The ~500-word length falls naturally out of that —
there isn't more to say about what a Café *is*.

**The structural constraint.** All six area pages are brochures for app features. Everything genuinely
searchable that The Vilij produces — the guides, the templates, the expert answers — lives in the app at
`app.thevilij.co.uk`, behind a login and a subscription, and will never be indexed. Confirmed with the
business, 31 July 2026.

So the marketing site's entire organic surface is six brochure pages plus six legal pages, and it cannot
inherit anything from the app however good the app content becomes. This is the standard membership-product
problem: the asset that would rank is the asset you sell.

**Recommendation — three surfaces, not two.**

*Keep the area pages exactly as they are.* They are conversion pages. Their job is to make someone who has
already arrived feel understood and then sign up, for an audience that is exhausted and short on attention.
For that job ~500 focused words is correct, and the copy already understands its reader.

*Build a public content section on this domain* — `/guides`, `/resources` or `/blog` — distinct from both
the area pages and the gated app Library. The footer already anticipated this: `ISSUES.md` #16/#17 record
planned "News" and "Free Courses" links that were never built.

Split by intent so this does not cannibalise the product:

- **Publish publicly** — awareness-stage material. What an EHCP is, statutory timelines, what happens at an
  annual review, tribunal appeal deadlines. IPSEA, gov.uk and SENDIASS already publish all of this; it
  cannot be owned exclusively and hiding it gains nothing. It is also exactly what gets typed into Google
  at 11pm.
- **Keep gated** — action-stage material. The templates, the letter builders, the personalised tools, expert
  responses to a specific situation, and the community itself. That is the product.

You are not giving away the product; you are publishing the encyclopedia entry that leads to it. The same
expertise writes both, so it is not duplicated effort, and each public guide links inward to the relevant
area page — the guides earn the traffic, the area pages convert it.

**This is where the authorship plan becomes a real advantage.** The guides are to be written by
professionals in each field alongside people with lived experience (confirmed 31 July 2026). That is worth
naming explicitly, because SEND content is **YMYL** — "Your Money or Your Life" — which Google holds to a
materially higher quality bar, and it assesses it through **E-E-A-T**: Experience, Expertise,
Authoritativeness, Trust.

Most competitors can evidence expertise *or* experience. Professional plus lived experience on the same
guide is the strongest combination available in this sector, and it is the one thing here that could
genuinely outrank an established charity. But Google can only credit it if the page *shows* it, so build
these in from the start rather than retrofitting:

- Named bylines with real credentials, not "The Vilij Team".
- Author pages with qualifications, registration numbers where they exist, and relevant experience.
- A visible "Written by … · Reviewed by … · Last updated …" line on every guide.
- `Article` and `Person` JSON-LD tying author to page (extends §5).
- Outbound citations to IPSEA, gov.uk and the SEND Code of Practice. Linking out to authoritative sources
  is a trust signal, not a leak.
- A real review cadence — SEND law and thresholds change, and stale statutory content is actively harmful
  to both readers and rankings.

**Caveat on timescale.** This pays off over months, not days, and it needs the writers before it needs any
code. It is ranked P2 for that reason, not because it matters less than the P1 items — it matters more,
but nothing on the technical list is blocked on it and it is not blocked on them.

### 11. `href="#"` placeholders are still live in 8 places *(also ISSUES #15–19)*

Down from ~20 per page, which is good progress. The remaining ones with SEO weight:

- The **"TAKE A SNEAKY PEEK"** CTA on `index`, `cafe`, `hall`, `library`, `wellbeing`, `expert-hub` — six
  instances of a prominent, dead call-to-action.
- `Explore The Vilij` and `About Us` in the header nav.
- Footer `Support`.

Beyond the conversion cost, `href="#"` links are crawled as self-referencing links and add nothing to the
internal link graph. Either point them somewhere or render them as non-links, the way `AreaCard` already
correctly does for coming-soon tiles (`const Tag = comingSoon ? "div" : "a"` — that is the right pattern,
and it should be reused here).

### 12. Placeholder testimonial copy is still in the shipped source — **closed, 29 August 2026**

`showSecondTestimonial = false` hid it, but the Lorem ipsum quote and the invented attribution
("Charlie & Family", "SEND Family, The Vilij") were still in the JavaScript payload of `index.astro`
and five other pages, because the carousel script serialises the full list into the page. Not
rendered, so never indexed as visible text — but in the HTML source, and for a site in a sector
where trust is the entire proposition, fabricated testimonial attributions in the shipped source
were a reputational risk worth closing.

The recommendation was to filter the list before it reaches `BaseLayout` rather than only at render
time. It was overtaken: six real quotes from the closed-beta testers arrived on 29 August 2026, so
the placeholder was deleted outright along with the flag that hid it. There is nothing left to
filter — `src/data/testimonials.ts` holds seven real testimonials and every page serialises those.

---

## P3 — Smaller items

### 13. Sitemap is hand-maintained

`public/sitemap.xml` is a static file with a comment asking future editors to keep it in step with
`src/pages/`. It is currently accurate apart from item 6. `@astrojs/sitemap` would generate it from the
routes at build time and would have caught the Library/Wellbeing drift automatically. `site` is already
set in `astro.config.mjs`, so it is a drop-in.

Note that `lastmod` is 2026-07-29 on every entry including pages edited on the 30th and 31st.

### 14. `changefreq` and `priority` are ignored

Google has publicly stated it ignores both. Harmless, but they are noise.

### 15. Footer has no links to the content areas

The footer links out to the six legal pages, three social profiles and the designer — but not to `/cafe`,
`/hall` or `/expert-hub`. Internal linking to the area pages comes solely from the tile grids.

A footer "Explore" column linking the three live areas would strengthen the internal link graph on every
page at essentially no design cost.

### 16. No `hreflang` or `og:locale`

The site is UK-specific (UK GDPR, EHCPs, DLA). `<html lang="en">` would be more precise as `lang="en-GB"`,
which also nudges spelling and date expectations. Not worth a dedicated deploy; fold into item 4.

### 17. Analytics is consent-gated, so measurement will be partial

The `CookieConsent` gating of HubSpot is correct and I would not change it. Be aware that it means
analytics will undercount by however many visitors decline — typically 20–40%. If you want accurate
traffic numbers to judge SEO progress, Cloudflare Web Analytics is cookieless, needs no consent, and can
run unconditionally alongside HubSpot.

---

## Suggested order of work

| # | Item | Effort | Impact | Status |
|---|---|---|---|---|
| 1 | Open Graph + Twitter Card tags (#4) | 1 hour | High | **Done** 31 Jul |
| 2 | Resolve Library/Wellbeing index state (#6) | 30 min | High | **Done** 31 Jul |
| 3 | Image dimensions + lazy-loading (#2) | 2–3 hours | High | **Done** 31 Jul |
| 4 | Move to Astro `<Image>`, starting with the hero (#1) | half day | Highest | Next |
| 5 | `Organization` JSON-LD (#5) | 30 min | Medium | |
| 6 | `<main>` + skip link (#8) | 1 hour | Medium | |
| 7 | 404 page (#7) | 30 min | Medium | |
| 8 | Self-host Lato (#3) | 1–2 hours | Medium | |
| 9 | Remaining `href="#"` (#11) | blocked on pages existing | Medium | |
| 10 | `@astrojs/sitemap` (#13) | 30 min | Low | |

Items 1–3 are about two hours together and cover the largest share of the available technical gain.

**§10 is deliberately not in this table.** The public guides section is a content programme, not a ticket —
it needs writers before it needs code, and it pays off over months. Start it in parallel; do not queue it
behind the list above. When the first guides are ready, the technical work they need is a `/guides` route,
`Article` + `Person` JSON-LD (§5), and author pages.

---

## What is already right

Worth recording so it does not get undone in a later refactor:

- Unique, hand-written, correctly-sized `<title>` and `meta description` on all 13 routes — genuinely good
  ones, not templated.
- Canonical URLs derived from `Astro.site` + pathname, with the trailing-slash behaviour matched to what
  Cloudflare Pages actually serves. The reasoning in the `BaseLayout` comment is correct and the
  implementation matches the sitemap and the internal links.
- `/newsletter-thanks` is both `noindex` and `Disallow`ed, which is the right belt-and-braces treatment.
- Exactly one `<h1>` per page across all 13.
- `robots.txt` present, permissive, and correctly pointing at the sitemap.
- Full favicon set including 180px Apple touch icon.
- Consent-gated analytics that genuinely does not set cookies before acceptance — rarer than it should be.
- The responsive layer is real and measured, and mobile-friendliness is a ranking factor.
- `AreaCard`'s coming-soon tiles render as `<div>` rather than a dead `<a>`. That is the correct pattern
  and item 11 should follow it.
- A clean domain split: `app.thevilij.co.uk` is entirely gated and non-indexable, so there is no risk of
  the app competing with the marketing site for the same queries. Worth confirming the app also sends
  `noindex` on any login or marketing-shaped page it serves — a login wall in the index helps nobody.
