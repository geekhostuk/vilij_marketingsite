# Outstanding Issues

Running log of known gaps in the marketing site. Last reviewed: 29 July 2026.

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
| 11 | **P2** | No cookie consent banner anywhere on the site, despite the Privacy Policy (§16) and HubSpot tracking both setting cookies. UK PECR requires consent for non-essential cookies before they're set. Worth a legal steer. | Site-wide |

## Newsletter / HubSpot

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| 12 | **P1** | **HubSpot capture is unverified.** The form meets HubSpot's non-HubSpot form requirements, but nobody has submitted a real test entry yet. Confirm the form appears under HubSpot → Forms and that a Contact is created. | All 8 pages |
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
| 20 | **P1** | **The site is not responsive.** No `@media` queries exist on any page except `/privacy`. Footers use a fixed `grid-template-columns: 1.3fr 1fr 1fr 1.4fr`, hero headings are a hard-coded `74px`, and content grids are fixed two-column. On a phone this will overflow horizontally or crush to unreadable widths. Given the audience is parents and carers — a heavily mobile demographic — this is the highest-impact item on the list. | All pages except `/privacy` |
| 21 | **P2** | **No shared layout component.** The header, footer and newsletter form are copy-pasted into all 8 pages. Every footer change means editing 8 files in lockstep. Extracting `src/layouts/Base.astro` plus a `Footer.astro` would remove a whole class of drift. | `src/pages/*` |
| 22 | **P3** | Styling is entirely inline `style` attributes, so there's no design-token layer — colours (`#1f9ca0`, `#f28121`) and fonts are repeated hundreds of times. Makes any rebrand or accessibility contrast fix a find-and-replace exercise. | `src/pages/*` |
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

- ~~Privacy Policy page missing~~ — `/privacy` built 29 July 2026 from the supplied PDF (16 sections, 94 clauses).
- ~~Privacy Policy had no effective date, despite clause 3.2 referring to "the date stated at the top of the policy"~~ — set to 29 July 2026.
- ~~Footer newsletter form was not a real `<form>` and could not be captured by HubSpot~~ — now a standard HTML form with `name="email"`, a required opt-in checkbox and explicit consent wording.
- ~~Footer "Privacy" link was a dead `#`~~ — now points at `/privacy`.
