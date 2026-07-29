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
| `/privacy` | `src/pages/privacy.astro` | Privacy Policy — the full policy, rendered from a `sections` data structure in the page frontmatter, with a table of contents. Linked from the footer and the newsletter opt-in. |
| `/newsletter-thanks` | `src/pages/newsletter-thanks.astro` | Newsletter confirmation — the `action` target of the footer newsletter form. Must stay a plain GET destination: Cloudflare Pages serves static assets and returns 405 to POST. `noindex`, and excluded from `sitemap.xml`. |

### Shared markup
There are no layouts or components — the header, footer, testimonial carousel
and "What else you can see inside the Vilij" grid are **duplicated in every
page file**. A change to any of them has to be made in all eight (or six, for
the sections the Privacy and newsletter pages do not carry).

### Interactive behaviour
The six content pages reproduce the original design component logic with a
small inline script:
- **Testimonial carousel** — prev/next buttons cycle through the `testimonials`
  array; each entry carries its own optional `stars` rating.
- **Back to the top** — smooth-scrolls to the top of the page.
- The monthly **price** (£10) is rendered server-side.

`/privacy` and `/newsletter-thanks` carry the "Back to the top" script only.

### Navigation links
- The nav **Home** link and the logo point to `/` on every page.
- The six content pages cross-link to each other through the "What else you can
  see inside the Vilij" grid; the footer **Café** quick-link points to `/cafe`.
- The footer **Privacy** link and the newsletter opt-in point to `/privacy`.
- High Street, Market Place, Vilij Campus, sign-up, About and several footer
  links are still `href="#"` — see [content-issues.md](content-issues.md).

## SEO files

`public/robots.txt` and `public/sitemap.xml` are copied verbatim to the site
root at build time. The sitemap lists the 7 indexable routes and must be
updated by hand when a route is added or removed.

## Project structure

```
.
├── astro.config.mjs
├── package.json
├── README.md
├── ISSUES.md                        # Technical, responsive and accessibility backlog
├── content-issues.md                # Copy-and-content audit of the public pages
├── src/
│   └── pages/
│       ├── index.astro              # Homepage
│       ├── cafe.astro               # Café page
│       ├── hall.astro               # Vilij Hall page
│       ├── library.astro            # Library page
│       ├── wellbeing.astro          # Wellbeing Centre page
│       ├── expert-hub.astro         # Vilij Expert Hub page
│       ├── privacy.astro            # Privacy Policy
│       └── newsletter-thanks.astro  # Newsletter sign-up confirmation (noindex)
├── public/                          # Copied verbatim to the site root
│   ├── assets/                      # Images (illustrations, photos, logos)
│   ├── favicon.ico, favicon-*.png   # Favicons and Apple touch icon
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
