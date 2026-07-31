# Damien's feedback — resolution plan

Source: email, 30 July 2026. Branch: `fixes-01`.

Ordering is deliberate: the typography pass touches every file, so it lands
first and everything else rebases on top of it. Items marked **BLOCKED** need
something from Damien or from whoever owns DNS before they can be finished.

---

## STATUS — 31 July 2026 (round two)

Damien replied on 31 July and sent the outstanding assets. Everything on his
list is now done except the DNS item, which is not a code fix.

| # | Item | Status |
|---|---|---|
| 1.1 | Body copy Mulish → Lato (222 declarations) | **done** |
| 1.1 | Headings Quicksand → Lato (157 declarations) | **done** — Figtree question closed |
| 1.1 | Weights 500/600/800 → explicit 400/700/900 | **done** |
| 1.2 | H1 3 sizes → 1; H2 9 → 2; H3 6 → 3 | **done** |
| 1.3 | Card straplines up 2pt (29) | **done** |
| 1.4 | Em dashes out of visible copy (22) | **done** |
| 1.5 | Ramp re-audited, no gaps | **done** |
| 2.1 | Coming-soon banner + lighter pics | **done** — bigger and lower per round two |
| 2.2 | Whole tile clickable | **done** |
| 2.3 | Buildings centred | **done** — approved as-is |
| 2.4 | "Join us now" Error 1000 | **BLOCKED** — DNS, not code |
| 3.1 | Café blocks lining up (#29) | **done** |
| 3.2 | Café photos filling their boxes | **done** — five replacements installed |
| 3.3 | Photo tiles as full grid blocks | **done** |
| 4.1 | Hall hero out of its box | **done** |
| 4.2 | Vilij News / Daily Chat / What's on spacing | **done** |
| 5.1 | Library / Wellbeing / Expert Hub heroes | **done** — branch illustrations installed |
| 5.2 | Library + Wellbeing branch images | **done** — 12 supplied and placed |
| 6 | Orange bar text white | **done** — all 18 eyebrows, "always white" |

### The type ramp after the Lato swap

Three weights: **900** for display type ≥50px, **700** for structural type below
it, **400** for the 34/36px strapline voice. Lato ships 100/300/400/700/900 and
nothing else — do not reintroduce 500, 600 or 800, they round silently and
flatten the ladder. The straplines went *down* to 400 deliberately: they sit
under a 900 h2, and rounding them up to 700 reads as a second heading.

No font size moved, so `src/styles/responsive.css` needed no ramp edits. The set
of distinct `font-size` values is byte-identical before and after — that check
is the cheapest proof the mobile step-down still matches everything.

### Assets received 31 July

24 files. Everything is cropped and re-encoded to the box it renders in;
photographs moved PNG → JPEG q82, which is why `/cafe` dropped from 1377KB to
807KB of images while more than doubling in resolution. The three branch
illustrations stay PNG for their transparency, palette-quantised to about a
third of their raw size.

Library and Wellbeing branch cards now mirror Expert Hub's four layout variants
position for position — the three pages share the same orange/teal colour
rhythm, so the layouts land on the colours already signed off.

**On 2.3, the buildings.** This went further than the "interim CSS nudge"
option. The originals measured 5–20% off-centre (Library worst at 19.5%, Campus
correctly 0% as a full scene), and they ran from 1.03:1 to 1.70:1, so
contain-fitting them into one 4:3 box also rendered each at a different size.
Since Damien authorised cropping the shadows, the tiles are re-canvassed into
`public/assets/tiles/` — building centred, nothing cropped vertically, shadow
running off the right edge, every canvas exactly 4:3. All eight now centre to
within 0.1%, and none has a clipped building (verified: symmetric margins, >=16px
on both sides). **The originals in `public/assets/` are untouched** — if Damien
prefers his own re-exports, drop them into `tiles/` under the same filenames.

Not attempted, and worth raising with him: the buildings still occupy very
different shares of their frames (Café 63% of canvas width, Library 44%, Market
Place 94%). Normalising that would make the grid properly uniform, but a single
shop and a whole campus scene are not the same kind of drawing, so it is a
design call rather than a mechanical one.

**The other orange bands** ("So what do I do next?" and "So, you've come this
far?") were held on the `#ffe6cf` tint awaiting his nod. He gave it — "always
white please" — so all 18 eyebrows across the six content pages and six legal
pages are now `#ffffff`.

---

## Phase 1 — Typography (site-wide, all 13 pages)

### 1.1 Lato throughout

`brand-kit/brand.md` already flagged this as an open decision: the Illustrator
sources are **Figtree Medium + Lato**, the web build substituted Quicksand +
Mulish. Damien has now decided — Lato.

- `src/layouts/BaseLayout.astro` — swap the Google Fonts URL to
  `family=Lato:wght@300;400;700;900`. Keep the `extraFonts` splice (Caveat, for
  the Hall sticky note) untouched.
- Replace 158 × `font-family:Quicksand` and 223 × `font-family:Mulish` with
  `Lato`. Includes the two page-wrapper `font-family:Mulish,sans-serif`
  declarations and `brand-kit/brand.md` itself.

**Weight audit — this is the part that will bite.** Google Fonts Lato ships
100 / 300 / 400 / 700 / 900 only. There is no 500, 600 or 800. The site uses
all three, and the browser will silently substitute:

| Current | In use for | Becomes |
|---|---|---|
| `font-weight:500` | "Be More" bars, "Still not sure?", hero band copy | 400 — lighter |
| `font-weight:600` | nav links, band text | 700 — heavier |
| `font-weight:800` | lead paragraphs, card sub-headings | 700 — lighter |

Left alone, the emphasis hierarchy flattens: lead paragraphs (800) and card
headings (700) end up identical. So each 500/600/800 gets an explicit decision
rather than an implicit round. Proposal: 500 → 400, 600 → 700, 800 → 700, and
push the few places that genuinely need to out-weigh their neighbour to 900.

Lato also runs narrower with a smaller x-height than Quicksand, so headings
read ~5% smaller at the same px. Folded into 1.2 rather than corrected
separately.

### 1.2 Harmonise the H1/H2 ramp

Current spread — 3 distinct H1 sizes, **9** distinct H2 sizes, 6 distinct H3:

- H1: 64 / 74 / 80
- H2: 38 / 44 / 48 / 50 / 52 / 54 / 56 / 58 / 62
- H3: 25 / 30 / 34 / 36 / 40 / 42

Proposed scale:

| Role | Now | Proposed |
|---|---|---|
| Hero H1 | 64 / 74 / 80 | **72** |
| Section H2 (on white) | 44–56 | **48** |
| Band H2 (on orange/teal) | 58 / 62 | **56** |
| Feature-card H3 | 40 / 42 | **40** |
| Panel / area-tile H3 | 25 / 30 / 34 / 36 | **30** (tile stays 25 → **28**) |

### 1.3 Sub-heading bump (Damien: "up a couple of points")

The "Guidance you can trust" line is `font-weight:800; font-size:20–21px`.
Goes to **22–23px** everywhere it appears — all five content pages.

### 1.4 Retire the em dash

26 em dashes in visible copy (excluding code comments), plus 18 `&mdash;`
entities. Replace per context rather than blanket-swapping: mid-sentence
asides → comma or a spaced en dash; the `Title — Subtitle` pattern in `<title>`
tags and legal headings → leave, it is conventional and not on-page. Also
appears in `src/data/consent.ts` (6) and `cookie-policy.astro` (11).

### 1.5 Mirror everything into responsive.css — NOT OPTIONAL

`src/styles/responsive.css` steps type down at three breakpoints using
`[style*="font-size:74px"]` selectors that match the literal inline string.
Change `74px` to `72px` in a page and that heading **silently reverts to full
desktop size on mobile** — no error, no visual cue until someone opens it on a
phone. Every size touched above gets its ramp row updated in the same commit,
then all 13 pages re-checked at 1180 / 900 / 400px.

---

## Phase 2 — Homepage

### 2.1 Coming-soon tiles more pronounced
`src/components/AreaCard.astro`. Today: a paler gradient, `opacity:.78` on the
image, and a grey "Coming soon" chip where the orange pill sits.
- Banner **across the card** (top of the image) instead of the bottom chip.
- Drop the image to ~50% opacity, add slight desaturation.
- Keep the current a11y behaviour: no anchor, nothing focusable, no hover lift.

### 2.2 Whole tile clickable
Live tiles only. Card becomes an `<a>` and the orange pill becomes a `<span>`
inside it, so the whole box is the hit target and there is still exactly one
link in the accessibility tree (nesting an `<a>` in an `<a>` is invalid and
double-announces). Hover lift moves to the card.

### 2.3 Centre the buildings in the tiles
Root cause: the nine tile PNGs have wildly different aspect ratios — Library
**1.03**, Café 1.34, Market Place **1.70** — and `.vcard-img` contain-fits them
all into a fixed 4:3 box. So each building lands at a different size with
different slack around it, and the baked-in shadows push them off-centre.

CSS alone can't fix this properly. Two options:
- **Recommended** — re-export all nine on a shared canvas (900×600, 2x), building
  centred, shadow cropped to the right edge as Damien suggested. Fixes centring
  *and* the softness in one go, since several are only ~460–720px wide.
- Interim — per-tile `object-position` nudges. Cheap, but guesswork per image.

### 2.4 "Join us now" → Error 1000 — **BLOCKED (not a site fix)**
The markup is already `href="https://app.thevilij.co.uk"` on all six pages.
Cloudflare **Error 1000 = "DNS points to prohibited IP"** — the `app` record
resolves to a Cloudflare IP, so the edge refuses to proxy it. Fixed in the DNS
zone, not in this repo. Need: (a) confirmation that `app.thevilij.co.uk` is the
final destination, (b) whoever owns the Cloudflare zone to correct the record.

Related and still open (`ISSUES.md` #15–#19): the header **SIGN UP** button and
every "TAKE A SNEAKY PEEK" are `href="#"`. Same missing URL. Worth doing at once.

---

## Phase 3 — Café page

### 3.1 Blocks don't line up — `ISSUES.md` #29, now unblocked
Real and measurable, not a rendering quirk. A flex item's automatic minimum
width is its content's min-content width, and for an `<img>` that is the file's
intrinsic pixel width. `flex:0 0 42%` on the 800px-wide `p_brew.png` therefore
means "at least 800px", dragging the `1fr 1fr` track out to ~986px regardless
of viewport — and the wrapper's `overflow-x:hidden` quietly cuts the surplus.
At 1440px roughly **270px of the right-hand column is off-screen**.

Expert Hub carries `min-width:0` on its card items and is unaffected; Café and
Hall never got them. Fix: `min-width:0` on the flex items, explicit heights,
`object-fit:cover`. This was left alone because it moves the signed-off desktop
layout — which is precisely what Damien is asking for, so it is now in scope.

### 3.2 Images not filling the box / low res — **BLOCKED on assets**
They did all come across in the package — at thumbnail resolution:

| Asset | Actual | Displayed at | Need (2x) |
|---|---|---|---|
| `p_sip.png` | **256×256** | ~250×300 | ~600×720 |
| `p_mug.png` | 256×262 | ~250×300 | ~600×720 |
| `p_tea.png` | 278×232 | ~230×190 | ~560×460 |
| `p_bites.png` | 310×250 | ~230×190 | ~560×460 |
| `p_elder.png` | 325×252 | ~230×190 | ~560×460 |

`object-fit:cover` and the layout fix will make them *fill* their boxes, but
upscaling 256px to 600px will look worse, not better. Need the originals at
1000px+ on the long edge.

### 3.3 Photo tiles as full grid blocks
`src/components/PhotoTile.astro` uses `align-self:start` + `height:auto`, so
"Louie on the beach" and "Steph and grandson" size to their own aspect ratio and
leave a gap under them. Change to `align-self:stretch` + `height:100%` +
`object-fit:cover`, so they match the card blocks and complete the grid.

Caveat: cropping to card height loses a lot of a landscape photo. `p_beach`
(840×500) and `p_grand` (760×480) survive it; **`p_jose.png` (494×335) will not**
— too small and too wide. Taller crops preferred where they exist.

---

## Phase 4 — Vilij Hall

### 4.1 Hero "in a box"
`hall.astro:79` wraps `hall_trim.png` in a gradient panel with padding and a
shadow. The PNG is transparent (1200×962, good resolution), so removing the
wrapper drops it straight onto the hero gradient exactly like the homepage and
Café. **No new image needed.**

### 4.2 "Vilij News" and "Daily Chat" — wasted space
- Remove the hard `<br />` splits: `Vilij<br />News` → `Vilij News`, and the same
  on "What's on?" and "Come<br />and meet".
- Drop `min-height:300px`, let padding set the height.
- Images sit inside the block with even padding from the edge, replacing the
  current negative margins (`margin-left:-22px`, `margin-right:-22px`).

### 4.3 Branch-section images
Same `PhotoTile` fix as 3.3 — the beach photo and the parents-and-child photo
become full-size blocks. Same `p_jose` caveat.

---

## Phase 5 — Library / Wellbeing / Expert Hub

### 5.1 Hero "in a box" — **PART-BLOCKED on assets**
Same wrapper as Hall, on all three. Removing it is trivial; the question is
whether the source images hold up once they aren't sitting in a padded panel:

| Page | Asset | Size | Verdict |
|---|---|---|---|
| Library | `library_hero.png` | **458×443** | **Too small — needs re-supply.** It is byte-identical to `library.png`, the small card thumbnail. |
| Wellbeing | `wellbeing_hero.png` | 859×535 | Borderline; fine at 1x, soft on retina |
| Expert Hub | `experthub_hero.png` | 798×617 | Borderline; same |

Spec for re-supply: **~1400px wide, transparent-background PNG**, matching
`hall_trim.png` (1200×962) and `hero_village.png` (1240×776).

### 5.2 No images on Library / Wellbeing branch blocks — **BLOCKED on assets**
Confirmed: both pages' six feature cards are text-only. Expert Hub has all six
(`p_eh_*.png`, 420×420 each). The Library and Wellbeing equivalents are not in
the repo — they were never supplied, rather than lost in packaging. Need 12
images, or a decision that those two pages stay text-only.

### 5.3 General block tightening
Once 5.1/5.2 land, a pass across all five content pages to even up card
heights, gaps and image insets against the visuals in `Designs/`.

---

## Phase 6 — Orange bar text

`color:#ffe9d6` → `#ffffff` on the band under the hero, all five content pages.
Damien named this bar specifically. Two other orange bands use the same tint
(`#ffe6cf` on "So what do I do next?" and "So, you've come this far?") — worth
doing for consistency, flagged rather than assumed.

Bonus: `#ffe9d6` on `#f28121` is about 2.1:1 contrast, below the WCAG AA
minimum of 4.5:1. White takes it to ~2.9:1 — better, though large-text-only
compliant. Related to `ISSUES.md` #25.

---

## What's needed from Damien — round three

Items 2–6 from the previous round are all closed. What's left:

1. **App URL + DNS** — confirm `app.thevilij.co.uk`; someone with Cloudflare zone
   access to fix the Error 1000 record. Unblocks every CTA on the site. He says
   Jonathan is moving it to the app; once that lands, the header SIGN UP button
   and every "Take a sneaky peek" get pointed at the same destination.
2. **`cafe_hero.png` is the same defect the Library hero had** — it is
   byte-identical to `cafe.png`, the 566×423 card thumbnail, so the Café hero is
   an upscaled thumbnail. No Café branch illustration came in the drop. Not
   previously recorded anywhere; worth adding while he is exporting.
3. **"Financial Peace of Mind"** — nothing in the Wellbeing set is about money,
   so that card currently carries the hilltop image on mood alone ("peace of
   mind") rather than subject. Every other card in both sets is a direct hit.
   One more file if he wants a literal one.
4. **No Library or Wellbeing PDF exists** in `Designs/` — it holds only Homepage,
   Café and Hall. He said to refer to the PDF for placement, so the layout
   choice for those twelve cards was ours. Happy to rework against a PDF.
5. **Adobe Stock licences** — the six `AdobeStock_*` files are full-res and
   unwatermarked, so presumably licensed. Worth one line confirming before live.
6. **A spare Hall photo** — `pexels-mizunokozuki` (two people talking over
   coffee) came in the Hall folder with no obvious slot. Proposed for the Daily
   Chat block if he wants it used.

Also worth telling him: the nav's Home-vs-other-links weight distinction is gone.
Home was 700 and the other two 600, and Lato has no 600.

## Sequencing

Phase 1 lands first and alone — it touches all 13 pages and the responsive ramp,
so nothing else should be in that diff. Phases 2, 4 and 6 need no assets and can
follow immediately. Phases 3 and 5 go as far as the layout fixes allow, then
wait on the asset list above.
