# Outstanding Issues

Running log of known gaps in the marketing site. Last reviewed: 30 July 2026.

Priority key: **P1** blocks launch · **P2** should fix before wider promotion · **P3** tidy-up.

---

## Content — placeholder text still live

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| 1 | **P1** | Footer company blurb is Lorem ipsum: *"Lorem ipsum dolor ame consectetue adipiscin diam…"* | All 8 pages, footer column 1 |
| 2 | **P1** | Newsletter sign-up blurb is Lorem ipsum: *"Lorem ipsum dolor amet, consectetuer adipiscing…"* | All 8 pages, footer column 4 |
| 3 | **P1** | Second testimonial (José, Nancy & Isaac) is Lorem ipsum but is switched on via `showSecondTestimonial = true`. Either supply the real quote or set the flag to `false`. | `index`, `cafe`, `hall`, `library`, `wellbeing`, `expert-hub` |
| 4 | **P3** | Typo in footer Quick Links: **"Addmition"** should read "Admission" (or "Admissions"). | All 8 pages |
| 5 | **P3** | Footer copyright reads *"© Copyright 2026. All Rights Design by Revive Creative."* — wording looks garbled; probably intended as "All Rights Reserved. Design by Revive Creative." | All 8 pages |

## Missing pages

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| 6 | **P1** | **Cookie Policy does not exist.** The Privacy Policy explicitly points readers to it twice — clause 7.2 ("Further information is available in our Cookie Policy") and clause 16.3. Both currently render as plain text with nowhere to go. | `/privacy` |
| 7 | **P1** | **User Terms of Use does not exist.** Referenced in Privacy Policy clause 1.5 and 8.7(b), and the footer "Terms" link is a dead `#`. | `/privacy`, all footers |
| 8 | **P2** | **Community Guidelines** and **Complaints and Reporting Procedure** don't exist. Both are named in Privacy Policy clause 1.5 as documents the reader should read alongside it. | `/privacy` |
| 9 | **P2** | Footer "Support" link is a dead `#` — no support/contact page exists. | All 8 pages |

## Legal document gaps

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| 10 | **P1** | **Company registration number is an unfilled placeholder** — renders literally as `[●]`, carried over verbatim from the source PDF. Needs the real Companies House number. | `/privacy` §2.1 |
| ~~11~~ | **P2** | ~~No cookie consent banner anywhere on the site, despite the Privacy Policy (§16) and HubSpot tracking both setting cookies. UK PECR requires consent for non-essential cookies before they're set.~~ **Done 29 July 2026.** `src/components/CookieConsent.astro`; the HubSpot script is no longer in the page at all until someone accepts. See content-issues.md C58. | Site-wide |

## Newsletter / HubSpot

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| 12 | **P1** | **HubSpot capture is unverified, and now conditional.** The form meets HubSpot's non-HubSpot form requirements, and a test submission does fire `POST /collected-forms/submit/form` — but nobody has confirmed a Contact is actually created at the HubSpot end. Worse, non-HubSpot form capture is a feature of the *tracking* script, so since the consent banner went in (#11) it only happens for visitors who accept analytics cookies. Everyone else submits, is told they're on the list, and is not. See content-issues.md C64: the fix is a Cloudflare Pages Function posting to HubSpot's Forms API, which also closes #13. | All 13 pages |
| 13 | **P2** | Form uses `method="get"`, so the subscriber's email ends up in the URL (`/newsletter-thanks?email=…`) and therefore in browser history. GET was chosen because Cloudflare Pages returns **405** to a POST against a static asset. Proper fix is a Cloudflare Pages Function to accept the POST and redirect. Note HubSpot's own docs use POST in their example — if capture turns out not to fire, this is the first thing to change. | All 8 pages |
| 14 | **P3** | No client-side success/error state — the user is navigated away to `/newsletter-thanks` rather than getting inline confirmation. Deliberate: HubSpot warns that intercepting submit with JS can prevent capture. | All 8 pages |

## Navigation — dead links

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| 15 | **P1** | **Header nav is almost entirely dead.** "Explore The Vilij", "About Us" and the primary **SIGN UP** call-to-action are all `href="#"`. The SIGN UP button is the site's main conversion path and currently does nothing. | All 8 pages |
| 16 | **P2** | Footer "About" column — all four links dead: About Us, Our Story, News, Become a Vilij Elder. | All 8 pages |
| 17 | **P2** | Footer "Quick Link" column — three of four dead: Free Courses, Addmition, Request a Demo. Only Café resolves. | All 8 pages |
| 18 | **P2** | Homepage section CTAs for **High Street**, **Market Place** and **Vilij Campus** are `href="#"` — those three pages haven't been built. The other five (Café, Hall, Library, Wellbeing, Expert Hub) do resolve. | `index` |
| 19 | **P2** | Final "SIGN UP NOW" CTA at the foot of every content page is `href="#"`. | `index`, `cafe`, `hall`, `library`, `wellbeing`, `expert-hub` |

Roughly 19–20 `href="#"` placeholders per content page.

## Technical

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| 22 | **P3** | Styling is entirely inline `style` attributes, so there's no design-token layer — colours (`#1f9ca0`, `#f28121`) and fonts are repeated hundreds of times. Makes any rebrand or accessibility contrast fix a find-and-replace exercise. **Partly mitigated, not resolved:** `src/styles/responsive.css` now exists, but it is a responsive layer, not a token layer, and it made the inline styles slightly more load-bearing — its type ramp keys on the literal `font-size:NNpx` substring in each `style` attribute, so changing an inline size means updating the ramp too. Read that file's header before touching a `font-size` anywhere. | `src/pages/*` |
| 23 | **P3** | No `sitemap.xml` or `robots.txt`. `astro.config.mjs` has `site` set, so `@astrojs/sitemap` would be a drop-in addition. | Project root |
| 24 | **P3** | No 404 page — Cloudflare Pages will serve its own generic one. | `src/pages/404.astro` |

## Accessibility

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| 25 | **P2** | Footer link colour `#999` on white is roughly 2.8:1 contrast, below the WCAG AA minimum of 4.5:1. Same concern for the `#777` consent text. | All 8 pages |
| 26 | **P2** | Testimonial carousel prev/next buttons have `aria-label`s but the quote region isn't a live region, so screen reader users get no announcement when the content swaps. | Pages with testimonials |
| 27 | **P3** | No skip-to-content link. | All 8 pages |

---

## Recently resolved

- ~~**#29 — `/cafe` clips its right-hand card column on desktop**~~ — fixed 30 July 2026, as part of
  Damien's feedback pass ("the blocks are a bit of a mess and don't line up"). A flex item's automatic
  minimum size is its min-content width, and for an `<img>` that is the file's intrinsic pixel size — so
  `flex:0 0 42%` on the 800px-wide `p_brew.png` meant "at least 800px", dragging the `1fr 1fr` track out to
  986px at every viewport; the wrapper's `overflow-x:hidden` then cut the surplus, hiding roughly 270px of
  the second column at 1440px. `responsive.css` had unlocked this at <=1180px only, deliberately, because
  fixing it above that moves the signed-off desktop layout. Damien owns the design and has asked for it, so
  the `min-width:0` chain now sits in the `<style is:global>` blocks of `/cafe` and `/hall` — the two pages
  that never got it; `/expert-hub` already carried it inline. The six `/cafe` card photos also gained
  explicit heights and `object-fit:cover`, which is what makes them fill their boxes rather than sit at
  their own aspect ratio. The residual softness — those photos were 256–325px originals, so they filled
  their boxes correctly but stayed blurry — was closed on 31 July when Damien supplied replacements. All
  five are now cropped to their card box at 2x and shipped as JPEG rather than PNG, which is why `/cafe`
  got *lighter* (1377KB → 807KB of images) while more than doubling in resolution.
- ~~**#20 — the site is not responsive**~~ — fixed 30 July 2026. `src/styles/responsive.css` is the
  whole of it: one stylesheet, imported once by `BaseLayout`, in which every rule sits inside a
  `max-width` media query and carries `!important` (inline `style` attributes outrank any plain
  selector, so `!important` is arithmetic here, not emphasis). Four breakpoints — 1180 / 900 / 600 /
  400px. Below 900px the nav's three text links fold into a dropdown behind a burger while the logo
  and SIGN UP stay in the bar; the footer goes 4 → 2 → 1 column; every fixed grid collapses; the
  feature-card photos stop bleeding past the card edge and stack above the copy at 600px.
  Type is scaled by a ramp keyed on the inline `font-size` value — see #22, which this made worse.
  Measured across all 13 routes at 1440 / 1024 / 768 / 390 / 320px: horizontal overflow went from
  70px (390) and 140px (320) to zero, and elements sitting past the viewport edge went from as many
  as 88 per page to zero everywhere except `/cafe` above 1180px, which is #29 and pre-existing.
  Desktop is untouched by construction and by measurement: with the added hook classes and the new
  nav elements normalised away, the built `<body>` of all 13 pages is byte-identical to the
  pre-change build.
- ~~**#21 — no shared layout component**~~ — `src/layouts/BaseLayout.astro` plus `SiteNav`,
  `SiteFooter`, `AreasGrid`, `AreaCard`, `PhotoTile`, `TestimonialCarousel`, `LegalContents` and
  `LegalSections` now carry everything that was copy-pasted.
- ~~`white-space:nowrap` on the `/cafe` "The Café gives us:" bullet rows~~ — each span is a whole
  sentence, so `nowrap` forbade the only break that mattered and the wrapper's `overflow-x:hidden`
  cut the ends off on any narrow screen. Removed; it never fired on desktop, where they fit anyway.
- ~~Privacy Policy page missing~~ — `/privacy` built 29 July 2026 from the supplied PDF (16 sections, 94 clauses).
- ~~Privacy Policy had no effective date, despite clause 3.2 referring to "the date stated at the top of the policy"~~ — set to 29 July 2026.
- ~~Footer newsletter form was not a real `<form>` and could not be captured by HubSpot~~ — now a standard HTML form with `name="email"`, a required opt-in checkbox and explicit consent wording.
- ~~Footer "Privacy" link was a dead `#`~~ — now points at `/privacy`.
