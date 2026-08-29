# The Vilij — Marketing Site

Static marketing site for **The Vilij**, an online village community for SEND
(Special Educational Needs and Disabilities) families. Built with
[Astro](https://astro.build/).

The Homepage, Café and Hall pages were imported from a Claude Design project
("Vilij Homepage.dc.html" and "Vilij Café.dc.html"); the Library, Wellbeing
Centre and Expert Hub pages were built from the design PDFs in `Designs/`. All
are hand-authored Astro pages with the design's interactive behaviour
reproduced in vanilla JS.

## Pages

Eight public routes.

| Route | Source file | Description |
|-------|-------------|-------------|
| `/` | `src/pages/index.astro` | Homepage — hero, "Everything you need" feature grid (Café, Hall, Library, Wellbeing, Expert Hub, High Street, Market Place, Campus), benefits panel, "Built by families", Charlie's Story panel, testimonials, CTAs, footer. |
| `/cafe` | `src/pages/cafe.astro` | Café page — hero, "Why The Café Exists", the six Café spaces (Sip & Natter, Tea and Empathy, The Brew Source, The Elder Brew, Show Us Your Mug, Brewtiful Bites), "What else inside the Vilij" grid, testimonials, CTAs, footer. |
| `/hall` | `src/pages/hall.astro` | Vilij Hall page — hero, "Why The Vilij Hall Exists", six feature cards (Collective wins, Our Stories, Come and meet, What's on?, Vilij News, Daily Chat), "What else inside the Vilij" grid, testimonials, CTAs, footer. |
| `/library` | `src/pages/library.astro` | Library page — hero, "SEND Roadmap & Acronym Guide", the resource areas (navigating the system, understanding your child, calmer days, making sense of the system), "What else inside the Vilij" grid, testimonials, CTAs, footer. |
| `/wellbeing` | `src/pages/wellbeing.astro` | Wellbeing Centre page — hero, "Why The Wellbeing Centre Exists", the support areas (calming, steadying, understanding your feelings, energy, relationships, background stress, stepping away), "What else inside the Vilij" grid, testimonials, CTAs, footer. |
| `/expert-hub` | `src/pages/expert-hub.astro` | Expert Hub page — hero, "Why The Expert Hub Exists", the expert categories (health, education, legal, emotional, family life, meet the experts), "What else inside the Vilij" grid, testimonials, CTAs, footer. |
| `/privacy` | `src/pages/privacy.astro` | Privacy Policy — transcribed from the source PDF into a `sections` data structure and rendered by the shared legal components. Linked from the footer and the newsletter opt-in. |
| `/terms` | `src/pages/terms.astro` | User Terms of Use — transcribed from the source PDF. The footer **Terms** link points here. |
| `/community-guidelines` | `src/pages/community-guidelines.astro` | Community Guidelines — transcribed from the source PDF. Linked from Privacy Policy §1.5. |
| `/cookie-policy` | `src/pages/cookie-policy.astro` | Cookie Policy — **written, not transcribed**: no source document existed. Describes only what this site demonstrably loads. Linked from Privacy Policy §7.2 and §16.3 and from the footer. |
| `/newsletter-thanks` | `src/pages/newsletter-thanks.astro` | Newsletter confirmation — the `action` target of the footer newsletter form. Must stay a plain GET destination: Cloudflare Pages serves static assets and returns 405 to POST. `noindex`, and excluded from `sitemap.xml`. |
| `/complaints` | `src/pages/complaints.astro` | Complaints and Reporting Procedure — transcribed, but **not published**: `noindex`, absent from `sitemap.xml`, linked from nowhere. The source document's contact addresses are still placeholders. See C55 in [content-issues.md](content-issues.md). |

### Shared layout and components
The page shell and every repeated block live in one place:

| File | What it holds |
|------|---------------|
| `src/layouts/BaseLayout.astro` | Document head (title, description, canonical, fonts), the body shell and the closing scripts. |
| `src/components/SiteNav.astro` | Header navigation. |
| `src/components/SiteFooter.astro` | Footer, including the two blurbs still awaiting real copy. |
| `src/components/AreasGrid.astro`, `AreaTiles.astro`, `AreaCard.astro`, `PhotoTile.astro` | The "What else you can see inside the Vilij" grid and its tiles. |
| `src/components/TestimonialCarousel.astro`, `TestimonialScript.astro`, `ToTopScript.astro` | The carousel and the two end-of-body scripts. |
| `src/components/LegalContents.astro`, `LegalSections.astro` | The contents jump list and clause renderer shared by the five legal pages. |
| `src/data/areas.ts`, `testimonials.ts`, `legal.ts` | Area tile copy, the seven testimonials shared by all six carousels, and the legal document shape. |

Anything that legitimately varies between pages is a prop. Where two copies of
the same block had drifted before the extraction, both versions were kept and
parameterised rather than normalised — those are listed in
[content-issues.md](content-issues.md).

Each page keeps its own `<style is:global>` block: the three CSS variants
interleave, so they cannot be composed from a shared base without reordering
the stylesheet.

### Interactive behaviour
The six content pages reproduce the original design component logic with a
small inline script:
- **Testimonial carousel** — cycles through the shared `testimonials` list in
  `src/data/testimonials.ts`, on its own every 10 seconds and on the prev/next
  buttons. The timer stops on hover, on keyboard focus inside the carousel, while
  the tab is in the background, and completely under `prefers-reduced-motion:
  reduce`; pressing prev or next restarts it, so a slide the reader chose gets a
  full 10 seconds. Each entry carries its own optional `stars` rating and optional
  `role` line, and both rows are hidden rather than rendered empty when absent.
  All seven photos are cropped to 900×900 so the square photo box holds still as
  the carousel pages.
- **Back to the top** — smooth-scrolls to the top of the page.
- The monthly **price** (£10) is rendered server-side.

The five legal pages carry the "Back to the top" script only.

### Navigation links
- The nav **Home** link and the logo point to `/` on every page.
- The six content pages cross-link to each other through the "What else you can
  see inside the Vilij" grid; the footer **Café** quick-link points to `/cafe`.
- The footer legal row links to `/terms`, `/privacy` and `/cookie-policy`;
  the newsletter opt-in points to `/privacy`.
- Privacy Policy §1.5 links to `/terms` and `/community-guidelines`;
  §7.2 and §16.3 link to `/cookie-policy`.
- High Street, Market Place, Vilij Campus, sign-up, About and several footer
  links are still `href="#"` — see [content-issues.md](content-issues.md).

## SEO files

`public/robots.txt` and `public/sitemap.xml` are copied verbatim to the site
root at build time. The sitemap lists the 10 indexable routes and must be
updated by hand when a route is added or removed. It is also the only file that
repeats the domain — everything else derives its absolute URLs from `site` in
`astro.config.mjs`, which has read `https://thevilij.co.uk` since 29 August 2026.

## Redirects

`public/_redirects` is the Cloudflare Pages redirect file, also copied to the
site root. It exists because the two sites swapped domains: this one moved from
`marketing.thevilij.co.uk` to the apex `thevilij.co.uk` on 29 August 2026, and
the Bubble app moved from the apex to `app.thevilij.co.uk`, so the app's old
URLs now land here. Each of its 21 pages gets an exact rule and a splat rule, all 301.

Two things to know before editing it. Pages matches these rules **before** it
looks for a file to serve, so a rule shadows a route of the same name. And a
destination must not carry a query string of its own — Pages forwards the
incoming one only when the destination has none, which is what keeps the
one-time tokens on `/reset_pw` and `/email-confirmed` intact. The file's own
header comment covers the rest.

Verify changes with `npx wrangler pages dev dist` — it prints the number of
rules it parsed and serves the redirects locally.

## Project structure

```
.
├── astro.config.mjs
├── package.json
├── README.md
├── ISSUES.md                        # Technical, responsive and accessibility backlog
├── content-issues.md                # Copy-and-content audit of the public pages
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro         # Head, body shell, closing scripts
│   ├── components/                  # Header, footer, areas grid, carousel, legal renderer
│   ├── data/
│   │   ├── areas.ts                 # The nine area tiles' copy
│   │   ├── testimonials.ts          # The seven testimonials, Testimonial type
│   │   └── legal.ts                 # Legal document shape
│   └── pages/
│       ├── index.astro              # Homepage
│       ├── cafe.astro               # Café page
│       ├── hall.astro               # Vilij Hall page
│       ├── library.astro            # Library page
│       ├── wellbeing.astro          # Wellbeing Centre page
│       ├── expert-hub.astro         # Vilij Expert Hub page
│       ├── privacy.astro            # Privacy Policy
│       ├── terms.astro              # User Terms of Use
│       ├── community-guidelines.astro
│       ├── cookie-policy.astro      # Cookie Policy (written, not transcribed)
│       ├── complaints.astro         # Transcribed, not published (noindex)
│       └── newsletter-thanks.astro  # Newsletter sign-up confirmation (noindex)
├── public/                          # Copied verbatim to the site root
│   ├── assets/                      # Images (illustrations, photos, logos)
│   ├── favicon.ico, favicon-*.png   # Favicons and Apple touch icon
│   ├── _redirects                   # App URLs -> app.thevilij.co.uk
│   ├── robots.txt
│   └── sitemap.xml
├── brand-kit/                       # Brand hand-off (git-ignored, not served)
└── Designs/                         # Original design PDFs (reference only, not served)
```

## Getting started

```bash
npm install      # install dependencies
npm run dev      # dev server at http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve the production build locally
```

Requires Node.js (developed against Node 24, npm 11).

## Assets

All images live in `public/assets/` and are referenced as `/assets/<name>.png`.
Most were exported directly from the Claude Design project.

> **Placeholder note:** Four images exceeded the design tool's 256 KiB
> per-file download cap and could not be retrieved at full resolution
> programmatically. As a temporary measure they were extracted (cropped) from
> the reference PDFs in `Designs/`:
>
> - `hero_village.png`, `village_sm.png` (homepage)
> - `cafe_hero.png`, `p_jose.png` (Café page)
>
> These are lower-fidelity stand-ins. To replace them with the real
> full-resolution originals, just overwrite the files in `public/assets/` (keep
> the same filenames) and rebuild — no code changes required.

## Credits

Design by Revive Creative. Implemented in Astro.
