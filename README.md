# The Vilij — Marketing Site

Static marketing site for **The Vilij**, an online village community for SEND
(Special Educational Needs and Disabilities) families. Built with
[Astro](https://astro.build/).

The pages were imported from a Claude Design project ("Vilij Homepage.dc.html"
and "Vilij Café.dc.html") and implemented as hand-authored Astro pages with the
design's interactive behaviour reproduced in vanilla JS.

## Pages

| Route   | Source file              | Description |
|---------|--------------------------|-------------|
| `/`     | `src/pages/index.astro`  | Homepage — hero, "Everything you need" feature grid (Café, Hall, Library, Wellbeing, Expert Hub, High Street, Market Place, Campus), benefits panel, "Built by families", testimonials, CTAs, footer. |
| `/cafe` | `src/pages/cafe.astro`   | Café page — hero, "Why The Café Exists", the six Café spaces (Sip & Natter, Tea and Empathy, The Brew Source, The Elder Brew, Show Us Your Mug, Brewtiful Bites), "What else inside the Vilij" grid, testimonials, CTAs, footer. |
| `/hall` | `src/pages/hall.astro`   | Vilij Hall page — hero, "Why The Vilij Hall Exists", six feature cards (Collective wins, Our Stories, Come and meet, What's on?, Vilij News, Daily Chat), "What else inside the Vilij" grid, testimonials, CTAs, footer. |

### Interactive behaviour
Both pages reproduce the original design component logic with a small inline
script:
- **Testimonial carousel** — prev/next buttons cycle through testimonials.
- **Back to the top** — smooth-scrolls to the top of the page.
- The monthly **price** (£10) is rendered server-side.

### Navigation links
- Homepage → Café / Hall: the "What's on at the Café?" and "What's on in the
  Vilij Hall?" card buttons (and the footer **Café** quick-link) point to
  `/cafe` and `/hall`.
- Café / Hall → Homepage: the nav **Home** link and the logo point to `/`; the
  Café and Hall pages also cross-link to each other via their "What else inside
  the Vilij" grids.

## Project structure

```
.
├── astro.config.mjs
├── package.json
├── src/
│   └── pages/
│       ├── index.astro      # Homepage
│       ├── cafe.astro       # Café page
│       └── hall.astro       # Vilij Hall page
├── public/
│   └── assets/              # Images (illustrations, photos, logos)
└── Designs/                 # Original design PDFs (reference only, not served)
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
