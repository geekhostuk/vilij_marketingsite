# Content Issues

Copy-and-content audit of the public pages — what a visitor can actually read or click.
Last reviewed: 29 July 2026.

Companion to [ISSUES.md](ISSUES.md), which covers technical, responsive and accessibility work.
Items appearing in both are marked *(ISSUES #n)*; everything else is new.

Scope — the 8 public routes: `/` · `/cafe` · `/hall` · `/library` · `/wellbeing` · `/expert-hub` ·
`/privacy` · `/newsletter-thanks`

Priority key: **P1** blocks launch · **P2** should fix before wider promotion · **P3** tidy-up.

Status key: ☐ outstanding · ✅ fixed.

---

## What is still outstanding

The self-contained items — everything fixable without new copy or a decision from someone
else — have been fixed: **C4, C8, C9–C19, C41, C43, C45, C46, C47, C48, C50, C51, C52.**

Everything below is still open, and every one of them is blocked on something external:

| Blocked on | Items |
|------------|-------|
| **Copy that has to be written** | C1 footer blurb · C2 newsletter blurb |
| **A decision about the second testimonial** | C3, C5, C6, C7 — all six placeholder slots, plus the invented names, roles and photos attached to them |
| **Pages that do not exist yet** | C20–C34 (nav, CTAs, area cards, footer links, Charlie's Story) · C35–C38 (the four documents the Privacy Policy tells the reader to go and read) · C40 |
| **A commercial decision** | C39 — £10/month is quoted with no pricing page, no inclusions list and no Terms behind it |
| **An asset that has to be produced** | C44 — Open Graph / Twitter Card tags need a 1200×630 image before they are worth adding |

None of these can be closed by editing the existing pages. C1, C2, C5, C20 and C39 are the
launch blockers.

> **The duplicated markup is gone (C48).** The header, footer, testimonial carousel and areas
> grid now live in `src/layouts/` and `src/components/`. C1 and C2 are one edit each in
> `src/components/SiteFooter.astro` rather than eight, and `showSecondTestimonial` is a single
> flag in `src/data/testimonials.ts`. It is still `true` — that decision has not been made.

---

## Placeholder text still live

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| ☐ C1 | **P1** | Footer company blurb is Lorem ipsum, sitting directly under the logo *(ISSUES #1)* | All 8 pages, footer col 1 |
| ☐ C2 | **P1** | Newsletter blurb is Lorem ipsum — the copy meant to earn the email *(ISSUES #2)* | All 8 pages, footer col 4 |
| ☐ C3 | **P1** | Second testimonial quote is Lorem ipsum, reachable via the ▸ button *(ISSUES #3)* | 6 content pages |
| ✅ C4 | **P1** | ~~Company registration number renders literally as `[●]`~~ *(ISSUES #10)* — now reads **16718802**, taken from the executed Expert Community Membership Agreement for THE VILIJ LIMITED. | `privacy` §2.1 |

> **Registered office (§2.1):** not a placeholder — the block already carries a full address
> (The Meakin Suite, Ravenscliffe, First Avenue, Newcastle Under Lyme, ST5 8QX). Left as found.
> Still worth confirming that this is the address the policy should carry.

22 blocks of Latin are still live across the site, but after the C48 extraction they come from
far fewer places (re-checked 29 July 2026 — line numbers drift with every edit, so search for
the text rather than trusting the number):

- **C1** — `src/components/SiteFooter.astro:17`. **One edit, all eight pages.**
- **C2** — `src/components/SiteFooter.astro:43`. **One edit, all eight pages.**
- **C3** — still six copies, one per page, because each carries a different invented
  attribution: `index:26`, `cafe:25`, `hall:25`, `library:25`, `wellbeing:25`, `expert-hub:25`.
  Setting `showSecondTestimonial = false` in `src/data/testimonials.ts` removes all six at once.

---

## Fabricated testimonials

Only **one real testimonial exists** — Emily & Loui, Newcastle-under-Lyme. The second carousel slot
on every content page pairs the placeholder quote with a fully invented, named and located person:

| Page | Attribution attached to the Lorem ipsum | Photo |
|------|------------------------------------------|-------|
| `/` | Charlie & Family — SEND Family, The Vilij | `charlie.png` |
| `/cafe` | Margaret & Charlie — SEND Family, Leeds | `p_grand.png` |
| `/hall` | Margaret & Charlie — SEND Family, Leeds | `p_grand.png` |
| `/library` | José, Nancy & Isaac — SEND Family, Manchester | `p_jose.png` |
| `/wellbeing` | Robert & Ethan — SEND Grandparent, Bristol | `p_grand.png` |
| `/expert-hub` | Margaret & Charlie — SEND Family, Leeds | `p_grand.png` |

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| ☐ C5 | **P1** | Five invented families credited with one placeholder quote. Fill the Latin in without checking the names and the site ships five testimonials from people who don't exist. | 6 content pages, testimonial data |
| ☐ C6 | **P2** | Homepage credits the placeholder to "Charlie & Family" using `charlie.png` — the photo the same page uses for founder Charlie. She appears to review her own product. | `index` testimonial 2, Charlie's Story panel |
| ☐ C7 | **P2** | `p_grand.png` is alt-texted "Grandparent and child" on `/cafe`, but carries four different identities across the site. | 4 pages |
| ✅ C8 | **P3** | ~~The 5-star rating is hard-coded into the carousel frame, so it also displays against the placeholder.~~ Each testimonial now carries its own `stars` value. Emily & Loui keep 5; the placeholder slot is `stars: null` and the frame hides the star row rather than rendering an empty one. | 6 content pages |

**Recommendation:** set `showSecondTestimonial = false` until a second real, consented quote
exists — rather than writing copy into an invented persona. Unsubstantiated endorsements breach
CAP Code 3.45, and this is a brand asking families in difficulty for money.

Since C48 that is one flag in `src/data/testimonials.ts` covering all six pages. It is
deliberately left `true`: the decision is not the developer's to make.

---

## Copy errors

**All of C9–C19 are fixed.** Kept here as a record of what changed.

| # | Priority | Error | Now reads | Where |
|---|----------|-------|-----------|-------|
| ✅ C9 | **P1** | "**AThe** Café is a warm, heartfelt haven…get it**..**" | "The Café is a warm…get it." | `cafe` |
| ✅ C10 | **P2** | "tailored **advise**" — including the Expert Hub hero strapline | "tailored advice" | 6 pages |
| ✅ C11 | **P2** | "WHAT'S COMING TO THE **VIJIL** CAMPUS?" | "…THE VILIJ CAMPUS?" | 6 pages |
| ✅ C12 | **P2** | "WHAT'S ON AT THE **WELL BEING** CENTRE?" | "…THE WELLBEING CENTRE?" | 5 pages |
| ✅ C13 | **P3** | Footer Quick Links: "**Addmition**" *(ISSUES #4)* | "Admissions" | All 8 pages |
| ✅ C14 | **P3** | "© Copyright 2026. All Rights Design by…" *(ISSUES #5)* | "…All rights reserved. Design by…" | All 8 pages |
| ✅ C15 | **P3** | Footer column heading "Quick **Link**", singular | "Quick Links" | All 8 pages |
| ✅ C16 | **P3** | "…overwhelming, lonely, and **frightened**" | "…overwhelming, lonely and frightening" | `index` |
| ✅ C17 | **P3** | "quirky food **combos SEND-friendly** places" | "…combos, SEND-friendly places," | `cafe` |
| ✅ C18 | **P3** | Events card had no full stop, unlike every sibling | full stop added | `hall` |
| ✅ C19 | **P3** | Acronym styled three ways: SEND, S.E.N.D. (8×), S.E.N.D (6×) | all 14 dotted forms normalised to **SEND** | Site-wide |

C13–C15 note: the footer was duplicated in all eight page files, so each of those was an
eight-way edit. That is what prompted C48, now done — the footer lives in one component.

---

## Missing pages — navigation and CTAs

**All of C20–C34 are outstanding.** Every link below is `href="#"`. Clicking does nothing: no
navigation, no 404, no message. There is also no 404 page, so mistyped URLs fall through to
Cloudflare's generic one *(ISSUES #24)*. Nothing here can be fixed by editing the existing
pages — each one needs a destination to exist first.

| # | Priority | Missing page | Linked from | Where |
|---|----------|--------------|-------------|-------|
| C20 | **P1** | Sign-up / join — the site's only conversion path | Header SIGN UP, JOIN US NOW, SIGN UP NOW *(ISSUES #15, #19)* | All 8 pages |
| C21 | **P1** | Explore The Vilij | Header nav *(ISSUES #15)* | All 8 pages |
| C22 | **P1** | About Us | Header nav + footer About *(ISSUES #15, #16)* | All 8 pages |
| C23 | **P2** | High Street | Area card CTA *(ISSUES #18)* | 6 content pages |
| C24 | **P2** | Market Place | Area card CTA *(ISSUES #18)* | 6 content pages |
| C25 | **P2** | Vilij Campus | Area card CTA *(ISSUES #18)* | 6 content pages |
| C26 | **P2** | Preview / demo — "TAKE A SNEAKY PEEK" promises a look inside | Teal band | 6 content pages |
| C27 | **P2** | Our Story | Footer About *(ISSUES #16)* | All 8 pages |
| C28 | **P2** | News | Footer About *(ISSUES #16)* | All 8 pages |
| C29 | **P2** | Become a Vilij Elder | Footer About *(ISSUES #16)* | All 8 pages |
| C30 | **P2** | Free Courses | Footer Quick Links *(ISSUES #17)* | All 8 pages |
| C31 | **P2** | Admissions | Footer Quick Links *(ISSUES #17)* | All 8 pages |
| C32 | **P2** | Request a Demo | Footer Quick Links *(ISSUES #17)* | All 8 pages |
| C33 | **P2** | Support / Contact | Footer legal row *(ISSUES #9)* | All 8 pages |
| C34 | **P2** | Charlie's Story — panel has **no link at all**, not even a dead one | Homepage panel | `index:254–260` |

Notes:

- **C25** — the card's own copy reads "now under construction", so a non-clickable "coming soon"
  tile reads better than a button that does nothing.
- **C28** — `/hall` already markets a "Vilij News" feature card, so the appetite exists.
- **C33** — there is **no way to contact The Vilij anywhere on the public site** except the
  `privacy@` and `safeguarding@` addresses inside the Privacy Policy.

## Missing pages — cited by the Privacy Policy

**All of C35–C38 are outstanding.** The policy names four companion documents the reader "should
read". All four render as plain text with nowhere to go, and all four need writing before they
can be linked.

| # | Priority | Missing document | Where |
|---|----------|------------------|-------|
| C35 | **P1** | Cookie Policy *(ISSUES #6)* | `privacy:298` (§7.2), `privacy:703` (§16.3) |
| C36 | **P1** | User Terms of Use — also the dead footer "Terms" link *(ISSUES #7)* | `privacy:28` (§1.5), `privacy:397` (§8.7) |
| C37 | **P2** | Community Guidelines *(ISSUES #8)* | `privacy:28`, `privacy:397` |
| C38 | **P2** | Complaints and Reporting Procedure *(ISSUES #8)* | `privacy:28` (§1.5) |

## Dead links by page

| Page | Dead `href="#"` | Working internal links |
|------|-----------------|------------------------|
| `/` | 19 | Café, Hall, Library, Wellbeing, Expert Hub, Privacy |
| `/cafe` | 18 | Home, Hall, Library, Wellbeing, Expert Hub, Privacy |
| `/hall` | 18 | Home, Café, Library, Wellbeing, Expert Hub, Privacy |
| `/library` | 18 | Home, Café, Hall, Wellbeing, Expert Hub, Privacy |
| `/wellbeing` | 18 | Home, Café, Hall, Library, Expert Hub, Privacy |
| `/expert-hub` | 18 | Home, Café, Hall, Library, Wellbeing, Privacy |
| `/privacy` | 12 | Home, Café, Privacy, ICO, 2 × mailto |
| `/newsletter-thanks` | 12 | Home, Café, Library, Wellbeing, Privacy |
| **Total** | **133** | |

Counts exclude the footer "Back to the top" anchor, which is `href="#"` by design and handled in JS.

---

## Promised but not delivered

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| ☐ C39 | **P1** | "£10 per month" is quoted with no pricing page, no list of what's included and no Terms to sit behind the transaction. A visitor sold on the price has no next step. | 6 content pages |
| ☐ C40 | **P2** | Eight areas of The Vilij are described; only five have pages. The "What else you can see inside the Vilij" grid repeats on every page, so a visitor meets the same three broken tiles up to six times. | 6 content pages |
| ✅ C41 | **P2** | ~~Homepage nav "Home" is `href="#"`; homepage logo is the only one not wrapped in a link home.~~ Both now match every other page. | `index` |
| ☐ C42 | **P3** | `/newsletter-thanks` is reachable only from the form and is `noindex`. Fine as-is — noted for completeness. Now also `Disallow`ed in `robots.txt` and excluded from the sitemap. | `newsletter-thanks` |

---

## Metadata — what shows outside the site

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| ✅ C43 | **P2** | ~~No `<meta name="description">` on 7 of 8 pages.~~ All eight now carry a factual 150–160 character description written from the page's own content. No pricing mentioned. | All 8 pages |
| ☐ C44 | **P2** | No Open Graph or Twitter Card tags anywhere. Shares in WhatsApp and Facebook SEND-parent groups — realistically the main distribution channel — render as a bare URL. **Blocked:** needs one 1200×630 image before the tags are worth adding. | All 8 pages |
| ✅ C45 | **P3** | ~~Titles carry no search terms beyond the homepage.~~ Rewritten to lead with the subject rather than "Welcome to the …". | All 8 pages |
| ✅ C46 | **P3** | ~~No `sitemap.xml` or `robots.txt`~~ *(ISSUES #23)*. Both added in `public/`, which Astro copies verbatim to the site root. Sitemap lists the 7 indexable routes. | `public/` |

Titles now live:

| Route | Title |
|-------|-------|
| `/` | The Vilij — Online Support Community for SEND Families |
| `/cafe` | The Café — SEND Peer Support and Friendship \| The Vilij |
| `/hall` | Vilij Hall — SEND Community Stories and Events \| The Vilij |
| `/library` | Library — SEND Guides, Templates and Resources \| The Vilij |
| `/wellbeing` | Wellbeing Centre — Support for SEND Parent Carers \| The Vilij |
| `/expert-hub` | Expert Hub — SEND Advice on Education and Health \| The Vilij |
| `/privacy` | Privacy Policy \| The Vilij |
| `/newsletter-thanks` | You're on the List \| The Vilij |

---

## Documentation drift (not public-facing)

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| ✅ C47 | **P3** | ~~README documents 3 pages.~~ Page table now covers all eight routes; project-structure block matches the repo; a note records that the repeated markup is duplicated, not shared. | `README.md` |

---

## Found while fixing the above — not in the original audit

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| ✅ C48 | **P2** | ~~**Duplicated markup.** There are no layouts or components.~~ Extracted into a shared layout plus components — see below. The build output was byte-for-byte identical before and after. | All 8 pages |
| ☐ C49 | **P3** | **Card copy has already drifted.** The Market Place tile reads "Discover wonderful products **& services** created by SEND parents in business." on `/`, `/cafe`, `/hall` and `/wellbeing`, but drops "& services" on `/library` and `/expert-hub`. Same tile, two versions. **Deliberately not normalised** — both survive as `areas.marketPlace` and `areas.marketPlaceShort` in `src/data/areas.ts`. Once a decision is made, delete the loser and repoint two pages. | `library`, `expert-hub` |
| ✅ C50 | **P3** | ~~No `<link rel="canonical">` on any page.~~ Added to the shared layout, derived from `Astro.site` and the page path. No trailing slash except on `/`, matching what Cloudflare Pages actually serves and what `sitemap.xml` lists. Verified against the built HTML for all eight routes. Done without waiting on C44 — canonicals don't need the share image. | All 8 pages |
| ✅ C51 | **P3** | ~~The star row renders as five bare `★` characters with no accessible name.~~ The row is now `role="img"` with an `aria-label` generated from the testimonial's own `stars` value ("Rated 5 out of 5"); the glyphs are in an `aria-hidden` span. The placeholder slot (`stars: null`) carries neither role nor label and stays hidden. Visual output unchanged. | 6 content pages |
| ✅ C52 | **P3** | ~~Homepage hero uses a hyphen where the rest of the site uses an em dash.~~ Both now use the site's spaced `&mdash;` convention. | `index` hero |

---

## What the extraction found (C48)

Where two copies of the "same" block disagreed, both versions were kept and parameterised
rather than normalised. Each is now a one-line change once someone decides which is right.

| What differs | Versions | Now controlled by |
|---|---|---|
| Market Place tile copy (**C49**) | "products **& services** created by…" on `/`, `/cafe`, `/hall`, `/wellbeing`; "products created by…" on `/library`, `/expert-hub` | `areas.marketPlace` / `areas.marketPlaceShort` |
| Quote-mark bubble over the testimonial photo | Present on `/`, `/hall`, `/library`, `/wellbeing`, `/expert-hub`; **absent on `/cafe`** | `TestimonialCarousel showQuoteMark` |
| Footer top padding | `74px` on seven pages; `34px` on `/newsletter-thanks` | `SiteFooter padding` |
| Google Fonts families | `/hall` alone loads `Caveat` | `BaseLayout extraFonts` |
| Second photo tile in the areas grid | `/cafe` `p_grand.png` alt "Grandparent and child"; `/wellbeing` **the same image** alt "A SEND grandparent and child"; `/hall`, `/library`, `/expert-hub` `p_jose.png` alt "A SEND family" | per-page `gridItems` |
| Order of the areas grid | No two pages agree. `/library` and `/expert-hub` also swap High Street and Expert Hub relative to the others | per-page `gridItems` |

The two `p_grand.png` alt texts are the same problem as **C7**: one image, several identities.
Left as found.

### File structure

```
src/layouts/BaseLayout.astro          head, body shell, closing scripts
src/components/SiteNav.astro          header navigation
src/components/SiteFooter.astro       footer — C1 and C2 live here
src/components/AreasGrid.astro        "What else you can see inside the Vilij"
src/components/AreaTiles.astro        the tiles inside a grid
src/components/AreaCard.astro         one area tile
src/components/PhotoTile.astro        one photo tile
src/components/TestimonialCarousel.astro
src/components/TestimonialScript.astro
src/components/ToTopScript.astro
src/data/areas.ts                     the nine area tiles' copy
src/data/testimonials.ts              showSecondTestimonial, Testimonial type
```

Two things stayed in the page files on purpose: the `<style is:global>` block, because the
three CSS variants interleave and cannot be composed from a shared base without reordering the
stylesheet; and the header `<section>` wrapper, whose background gradient is page specific.

---

## Suggested order of work

Steps 2 and 4 (in part) are done. What remains, in order:

1. **Write the three missing pieces of real copy** — footer blurb, newsletter blurb, and a decision
   on the second testimonial (C1, C2, C5). That alone clears 22 blocks of Latin. Until that
   decision is made, the recommendation above stands: set `showSecondTestimonial = false` on all
   six pages rather than writing copy into an invented persona.
2. ~~**Fix the four typos visible above the fold**~~ — done (C9, C10, C11, C12), along with the
   rest of C13–C19.
3. **Give SIGN UP somewhere to go** (C20). Until then the site cannot convert. If the app isn't
   ready, point it at a waiting-list form rather than `#`.
4. ~~**Fill in the company number** (C4)~~ — done. Still outstanding: **publish the Cookie Policy
   and Terms of Use** (C35, C36) — the Privacy Policy makes promises the site doesn't keep.
5. **Build or hide** High Street, Market Place and Campus (C23–C25), and add a Support/Contact
   route (C33).
6. **Decide on pricing** (C39) — £10/month currently leads nowhere.
7. **Produce the 1200×630 share image** so Open Graph tags can go in (C44). Canonical tags
   (C50) are already done and did not need it.
8. ~~Extracting a shared layout (C48)~~ — done, ahead of C1 and C2 as intended. Decide the
   Market Place wording (C49) whenever convenient: it is now a one-word edit in one file.
