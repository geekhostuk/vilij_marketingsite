# Content Issues

Copy-and-content audit of the public pages — what a visitor can actually read or click.
Last reviewed: 29 July 2026.

Companion to [ISSUES.md](ISSUES.md), which covers technical, responsive and accessibility work.
Items appearing in both are marked *(ISSUES #n)*; everything else is new.

Scope — the 13 public routes: `/` · `/cafe` · `/hall` · `/library` · `/wellbeing` · `/expert-hub` ·
`/privacy` · `/terms` · `/community-guidelines` · `/cookie-policy` · `/complaints` ·
`/safeguarding-policy` · `/newsletter-thanks`

Priority key: **P1** blocks launch · **P2** should fix before wider promotion · **P3** tidy-up.

Status key: ☐ outstanding · ✅ fixed.

---

## What is still outstanding

The self-contained items — everything fixable without new copy or a decision from someone
else — have been fixed: **C4, C8, C9–C19, C35, C36, C37, C38, C41, C43, C45, C46, C47, C48, C50,
C51, C52, C55.**

A second batch closed on 29 July 2026, this time on instructions rather than by tidying:
**C1, C2, C20, C23, C24, C25, C54, C56, C58.** Three of those were decisions, not code — remove the
placeholder copy without replacing it, point sign-up at the app, and give the Terms a date.
**C3 is closed by hiding rather than filling**; C5, C6 and C7 go dormant with it, because the
invented attributions are still in the page files, just not rendered.

Publishing the Safeguarding Policy (C56) raised two new items of its own, **C62** and **C63**.
C63 is a P1: the policy's contact clause is fully filled in and includes two named individuals'
personal mobile numbers.

Closing the consent gap (**C58**) raised one, **C64**, and it is a P1 too. HubSpot captures the
newsletter through the same script that sets the analytics cookies, so blocking the tracker until
consent means signups from anyone who refuses analytics are no longer recorded — while the site
still tells them they are on the list. Nothing was worked around; the choice belongs to someone
else.

C36 and C37 came off the blocked list on 29 July 2026 when the source documents turned up. C35
followed the same day: no source existed, so the Cookie Policy was written from scratch. C55 and
C38 followed when the general complaints address was confirmed as `complaints@thevilij.co.uk`,
which let `/complaints` go live. **All four cited documents are now published.**

C30–C32 are closed by removal rather than by building the pages: the footer Quick Links column
was replaced with the four legal documents on 29 July 2026, so the "Free Courses", "Admissions"
and "Request a Demo" dead links no longer exist anywhere on the site.

Everything below is still open, and every one of them is blocked on something external:

| Blocked on | Items |
|------------|-------|
| **Copy that has to be written** | C1 and C2 are closed, but the footer blurb and newsletter blurb still have to be written — the site simply does without them in the meantime |
| **A real second testimonial** | C5, C6, C7 — dormant, not gone. The invented names, roles and photos are still in the six page files |
| **Pages that do not exist yet** | C21, C22, C26–C29, C33, C34 (nav, preview, footer links, Charlie's Story) · C40 |
| **A commercial decision** | C39 — £10/month is quoted with no pricing page and no inclusions list |
| **An asset that has to be produced** | C44 — Open Graph / Twitter Card tags need a 1200×630 image before they are worth adding |
| **A lawyer's eye** | C53 and C62 — numbering faults in the source legal documents · C60 — the registered office now reads two ways |
| **A decision about publishing personal contact details** | C63 — the Safeguarding Policy names two people and their mobile numbers |
| **A decision about the newsletter** | C64 — blocking the tracker means HubSpot no longer captures newsletter signups from anyone who refuses analytics |
| **The site being made responsive** | ISSUES #20 — the footer and every content section overflow below about 460px |

C39, C63 and C64 are the remaining launch blockers on this list.

> **All five legal documents are now published.** The source PDFs turned up in the client's
> "Vilij Files" folder on 29 July 2026. **C36** (`/terms`), **C37** (`/community-guidelines`) and
> **C38** (`/complaints`) are live and linked from the footer. The **Cookie Policy (C35)** had no
> source at all and has been written from what the site actually loads. The fifth document in
> that folder, the **Safeguarding Policy (C56)**, is now transcribed and live at
> `/safeguarding-policy` — the longest of the set at 19 sections and 129 clauses.

> **The duplicated markup is gone (C48), and it paid for itself.** The header, footer,
> testimonial carousel and areas grid live in `src/layouts/` and `src/components/`. Every item
> closed on 29 July 2026 was a single edit that reached every page: C1 and C2 in
> `SiteFooter.astro`, the company details (C61) and the two new Safeguarding Policy links in the
> same file, the header SIGN UP in `SiteNav.astro`, `showSecondTestimonial` in
> `src/data/testimonials.ts`, and the `comingSoon` flag in `src/data/areas.ts`. Only the twelve
> body sign-up CTAs needed touching page by page, because they are page copy rather than shared
> markup.

---

## Placeholder text still live

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| ✅ C1 | **P1** | ~~Footer company blurb is Lorem ipsum, sitting directly under the logo~~ *(ISSUES #1)* — **removed, not replaced.** Nothing stands in its place; the logo's bottom margin absorbed the gap. The real copy drops back under the logo when it is written. | All 12 pages, footer col 1 |
| ✅ C2 | **P1** | ~~Newsletter blurb is Lorem ipsum — the copy meant to earn the email~~ *(ISSUES #2)* — **removed, not replaced.** The heading, field, Subscribe button and consent checkbox are untouched; the newsletter heading now takes the same 22px bottom margin as its three siblings so the four column headings sit on one line. | All 12 pages, footer col 4 |
| ☐ C3 | **P1** | Second testimonial quote is Lorem ipsum, reachable via the ▸ button *(ISSUES #3)* | 6 content pages |
| ✅ C4 | **P1** | ~~Company registration number renders literally as `[●]`~~ *(ISSUES #10)* — now reads **16718802**, taken from the executed Expert Community Membership Agreement for THE VILIJ LIMITED. | `privacy` §2.1 |

> **Registered office (§2.1): confirmed and corrected on 29 July 2026.** The confirmed
> registered office is **The Meakin Suite, Ravenscliffe, First Avenue, Newcastle-under-Lyme,
> ST5 8QX**. The Privacy Policy carried a variant of it — "Newcastle Under Lyme" unhyphenated,
> plus a trailing ", Staffordshire, United Kingdom" — and now matches the confirmed version
> exactly. The same address appears verbatim in the Complaints procedure (§11), in the old
> unhyphenated form; that page is a solicitor document transcribed verbatim and has been left
> alone. **The two now disagree** — see C60.

**No Lorem ipsum remains anywhere on the site.** All 22 blocks are gone as of 29 July 2026:

- **C1** and **C2** — deleted from `src/components/SiteFooter.astro`. One edit each, all twelve
  pages. Nothing was written to replace them.
- **C3** — the six placeholder quotes are still in the page files, one per page, each with its
  own invented attribution. They are no longer rendered: `showSecondTestimonial` is now `false`
  in `src/data/testimonials.ts`, which drops the second slot on all six pages at once. The data
  stays so a real quote can take its place — see C3 and C5 below.

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
| ☐ C5 | **P1** | Five invented families credited with one placeholder quote. Fill the Latin in without checking the names and the site ships five testimonials from people who don't exist. **Now dormant rather than live** — the slot is hidden, but the data is still in the six page files and comes back the moment the flag is flipped. | 6 content pages, testimonial data |
| ☐ C6 | **P2** | Homepage credits the placeholder to "Charlie & Family" using `charlie.png` — the photo the same page uses for founder Charlie. She appears to review her own product. **Dormant** — no longer rendered. | `index` testimonial 2, Charlie's Story panel |
| ☐ C7 | **P2** | `p_grand.png` is alt-texted "Grandparent and child" on `/cafe`, but carries four different identities across the site. **Dormant in the carousel**, but the image is still used in the areas grid on `/cafe` and `/wellbeing` with two different descriptions. | 4 pages |
| ✅ C8 | **P3** | ~~The 5-star rating is hard-coded into the carousel frame, so it also displays against the placeholder.~~ Each testimonial now carries its own `stars` value. Emily & Loui keep 5; the placeholder slot is `stars: null` and the frame hides the star row rather than rendering an empty one. | 6 content pages |

**Done, 29 July 2026:** `showSecondTestimonial` is now `false`. The recommendation above was
taken — hide the slot until a second real, consented quote exists, rather than write copy into
an invented persona. Unsubstantiated endorsements breach CAP Code 3.45, and this is a brand
asking families in difficulty for money.

One flag in `src/data/testimonials.ts` covers all six pages. Two things went with it:

- **The carousel controls are no longer rendered at all** when the list has a single entry.
  Not disabled, not hidden with CSS — absent, so there is nothing to tab to and nothing for a
  screen reader to announce. A next button that pages to nothing is worse than the placeholder
  it replaced. (This carousel has no dot indicators; the prev/next pair was the whole of its
  navigation.) The role line drops its bottom margin at the same time, so the column does not
  end in the dead space the buttons used to occupy.
- **The data is untouched.** All six second testimonials, invented attributions and photos
  included, are still in the page files. C5, C6 and C7 are dormant, not fixed.

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

**C20–C29, C33 and C34 are outstanding; C30–C32 are closed.** Every link below still marked ☐ is
`href="#"`. Clicking does nothing: no navigation, no 404, no message. There is also no 404 page,
so mistyped URLs fall through to Cloudflare's generic one *(ISSUES #24)*. Nothing here can be
fixed by editing the existing pages — each one needs a destination to exist first.

| # | Priority | Missing page | Linked from | Where |
|---|----------|--------------|-------------|-------|
| ✅ C20 | **P1** | Sign-up / join — the site's only conversion path | Header SIGN UP, JOIN US NOW, SIGN UP NOW *(ISSUES #15, #19)* | **Resolved 29 July 2026** — all 13 point at `https://app.thevilij.co.uk`, same tab |
| C21 | **P1** | Explore The Vilij | Header nav *(ISSUES #15)* | All 12 pages |
| C22 | **P1** | About Us | Header nav + footer About *(ISSUES #15, #16)* | All 12 pages |
| ✅ C23 | **P2** | High Street | Area card CTA *(ISSUES #18)* | **Closed by conversion, not by building** — now a "coming soon" tile |
| ✅ C24 | **P2** | Market Place | Area card CTA *(ISSUES #18)* | **Closed by conversion, not by building** — now a "coming soon" tile |
| ✅ C25 | **P2** | Vilij Campus | Area card CTA *(ISSUES #18)* | **Closed by conversion, not by building** — now a "coming soon" tile |
| C26 | **P2** | Preview / demo — "TAKE A SNEAKY PEEK" promises a look inside | Teal band | 6 content pages |
| C27 | **P2** | Our Story | Footer About *(ISSUES #16)* | All 11 pages |
| C28 | **P2** | News | Footer About *(ISSUES #16)* | All 11 pages |
| C29 | **P2** | Become a Vilij Elder | Footer About *(ISSUES #16)* | All 11 pages |
| ✅ C30 | **P2** | Free Courses | Footer Quick Links *(ISSUES #17)* | **Link removed** — see note below |
| ✅ C31 | **P2** | Admissions | Footer Quick Links *(ISSUES #17)* | **Link removed** — see note below |
| ✅ C32 | **P2** | Request a Demo | Footer Quick Links *(ISSUES #17)* | **Link removed** — see note below |
| C33 | **P2** | Support / Contact | Footer legal row *(ISSUES #9)* | All 11 pages |
| C34 | **P2** | Charlie's Story — panel has **no link at all**, not even a dead one | Homepage panel | `index:254–260` |

Notes:

- **C20** — the destination is `https://app.thevilij.co.uk`, confirmed 29 July 2026. Thirteen
  calls to action now reach it: the header SIGN UP on all twelve pages, plus JOIN US NOW and
  SIGN UP NOW in the body of the six content pages. Deliberately no `target="_blank"` — the app
  is the same brand, not an outbound link. **"TAKE A SNEAKY PEEK" was left dead** (C26): it
  promises a look inside without signing up, so pointing it at the sign-up page would be a lie.
- **C23–C25** — closed the way C30–C32 were, by removal rather than by building. The three
  cards are now non-interactive "coming soon" tiles: no anchor, no button, no `tabindex`, so
  nothing to focus and nothing announced as activatable. They keep their descriptive copy and
  are muted — a paler wash of the same gradient, a quieter shadow, and a plain "Coming soon"
  label where the orange pill sits on a live card. They also drop the `vcard` class, which is
  what carries the hover lift; a tile that rises under the cursor invites a click it cannot
  honour. Driven by a `comingSoon` flag in `src/data/areas.ts`, not by name-matching in the
  template. `href` and `cta` are left in the data: deleting the flag makes each a live card
  again with the wording it always had.
- **C25** — the card's own copy already read "now under construction", so this is the tile that
  most obviously wanted the treatment.
- **C28** — `/hall` already markets a "Vilij News" feature card, so the appetite exists.
- **C30–C32** — closed on 29 July 2026 without the pages being built. The footer Quick Links
  column was repurposed to carry the four legal documents (Community Guidelines, User Terms of
  Use, Complaints and Reporting Procedures, Privacy Policy), so the three dead links were
  deleted rather than given destinations. The `/cafe` link that shared the column is unaffected —
  it is still in the header nav on every page. If Free Courses, Admissions or Request a Demo are
  wanted later they need somewhere new in the footer, not this column.
- **C33** — the Support link in the legal row is still dead, but the site is no longer without a
  contact route: `/complaints` now publishes `complaints@thevilij.co.uk` and
  `safeguarding@thevilij.co.uk`, and the Privacy Policy publishes `privacy@`. A general contact
  page is still missing.

## Missing pages — cited by the Privacy Policy

The policy names four companion documents the reader "should read". Three existed as PDFs all
along and are now transcribed onto the site; the fourth, the Cookie Policy, had never been
written and now has been. **All four are live and all four are linked from the footer.**

| # | Priority | Document | Status |
|---|----------|----------|--------|
| ✅ C35 | **P1** | Cookie Policy *(ISSUES #6)* | **Written and published at `/cookie-policy`.** No source document existed, so unlike the other three this one was written from what the site demonstrably loads. Linked from Privacy §7.2 and §16.3 — the two places that promised it — and from the footer. **Rewritten to version 2.0 on 1 August 2026** once the consent banner existed (C58): §4.1, §4.2, §5.1, §5.2, §7 and §7.5 all described a site with no way to refuse anything. See C59 for what it still does not claim. |
| ✅ C36 | **P1** | User Terms of Use *(ISSUES #7)* | Published at **`/terms`**. The footer "Terms" link, dead on all eight pages, now points at it. |
| ✅ C37 | **P2** | Community Guidelines *(ISSUES #8)* | Published at **`/community-guidelines`**, linked from Privacy §1.5. |
| ✅ C38 | **P2** | Complaints and Reporting Procedure *(ISSUES #8)* | Published at **`/complaints`**, linked from the footer. Held back until C55 was resolved; released once the general complaints address was confirmed. |

Source documents: `THE VILIJ  COMMUNITY GUIDELINES.pdf`, `The Vilij - User Terms of Use.pdf`,
`The Vilij Complaints and Reporting Procedure.pdf` and `THE VILIJ Safeguarding Policy
(Final).pdf` — the last of which is now published too (C56).

Transcription was verified mechanically: every clause number in each PDF appears on its page in
the same order, and every sentence in each PDF appears in the rendered text. For the Safeguarding
Policy that is 129 clause numbers, all present and in order, and 756 sentences, of which 741
matched exactly; the other 15 are clauses 19.3 and 19.4, which are key-and-value lines rather
than prose and were checked by eye against the source.

**Where the source PDFs live.** All five are in a folder that was moved to the Windows Recycle
Bin on 28 July 2026 and had not been restored as of 29 July. Nothing was written back to it —
the Safeguarding Policy was copied out to a scratch directory and transcribed from there — but
the folder should be restored somewhere permanent before anyone needs to re-check a
transcription.

## Dead links by page

Recounted from the build on 29 July 2026, after the sign-up destination was set (C20) and the
three unbuilt area cards became "coming soon" tiles (C23–C25).

| Page | Dead `href="#"` | Working internal links |
|------|-----------------|------------------------|
| `/` | 8 | Café, Hall, Library, Wellbeing, Expert Hub, app ×3 + the 5 footer legal links |
| `/cafe` | 8 | Home, Hall, Library, Wellbeing, Expert Hub, app ×3 + the 5 footer legal links |
| `/hall` | 8 | Home, Café, Library, Wellbeing, Expert Hub, app ×3 + the 5 footer legal links |
| `/library` | 8 | Home, Café, Hall, Wellbeing, Expert Hub, app ×3 + the 5 footer legal links |
| `/wellbeing` | 8 | Home, Café, Hall, Library, Expert Hub, app ×3 + the 5 footer legal links |
| `/expert-hub` | 8 | Home, Café, Hall, Library, Wellbeing, app ×3 + the 5 footer legal links |
| `/privacy` | 7 | Home, app, Community Guidelines ×2, Cookie Policy ×3, Terms ×3, Complaints, ICO, 2 × mailto |
| `/terms` | 7 | Home, app + the 5 footer legal links, mailto |
| `/community-guidelines` | 7 | Home, app + the 5 footer legal links, mailto |
| `/cookie-policy` | 7 | Home, app, Privacy ×5, Terms ×3, Cookies, Complaints, Community Guidelines, ICO, browser help ×4, HubSpot, mailto |
| `/complaints` | 7 | Home, app + the 5 footer legal links, 2 × mailto |
| `/safeguarding-policy` | 7 | Home, app + the 6 footer legal links, mailto |
| `/newsletter-thanks` | 7 | Home, app, Café, Library, Wellbeing + the 6 footer legal links |
| **Total** | **97** | |

"The 6 footer legal links" are the five in the Quick Links column — Community Guidelines, User
Terms of Use, Complaints and Reporting Procedures, Privacy Policy, Safeguarding Policy — plus
Cookies in the legal row, which also repeats Terms, Privacy and Safeguarding. "app" is
`https://app.thevilij.co.uk`, the only external destination in the count. The counts above are
per page and unchanged by the Safeguarding Policy, which added a working link rather than a dead
one; the total rose only because a thirteenth page joined the table.

Counts exclude the footer "Back to the top" anchor, which is `href="#"` by design and handled in JS.

The total fell from 132 to 90. On every page the header SIGN UP came off the count (−12 in
all). On the six content pages, JOIN US NOW and SIGN UP NOW went the same way (−12), and the
three "coming soon" tiles stopped rendering an anchor at all (−18). Six dead links per content
page, one per legal page.

The eight left on a content page are: Explore The Vilij, About Us, TAKE A SNEAKY PEEK, and the
five in the footer (About Us, Our Story, News, Become a Vilij Elder, Support). The legal pages
carry the same list without TAKE A SNEAKY PEEK.

One regression to note: the legal pages and `/newsletter-thanks` used to reach `/cafe` through
the footer Quick Links column, and no longer do. `/newsletter-thanks` has its own body links into
the site, but from `/privacy`, `/terms`, `/community-guidelines`, `/cookie-policy` and
`/complaints` the only route back into the marketing pages is the logo. Worth folding into C33.

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
| ☐ C44 | **P2** | No Open Graph or Twitter Card tags anywhere. Shares in WhatsApp and Facebook SEND-parent groups — realistically the main distribution channel — render as a bare URL. **Blocked:** needs one 1200×630 image before the tags are worth adding. | All 11 pages |
| ✅ C45 | **P3** | ~~Titles carry no search terms beyond the homepage.~~ Rewritten to lead with the subject rather than "Welcome to the …". | All 8 pages |
| ✅ C46 | **P3** | ~~No `sitemap.xml` or `robots.txt`~~ *(ISSUES #23)*. Both added in `public/`, which Astro copies verbatim to the site root. Sitemap now lists the 10 indexable routes; `/newsletter-thanks` and `/complaints` are excluded and `Disallow`ed. | `public/` |

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
| `/terms` | User Terms of Use \| The Vilij |
| `/community-guidelines` | Community Guidelines \| The Vilij |
| `/cookie-policy` | Cookie Policy \| The Vilij |
| `/safeguarding-policy` | Safeguarding Policy \| The Vilij |
| `/newsletter-thanks` | You're on the List \| The Vilij |
| `/complaints` | Complaints and Reporting Procedure \| The Vilij |

---

## Documentation drift (not public-facing)

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| ✅ C47 | **P3** | ~~README documents 3 pages.~~ Page table covers all ten routes plus the unpublished `/complaints`; the project-structure block matches the repo; the "shared markup" section now documents the layout and components rather than warning about duplication. | `README.md` |

---

## Found while fixing the above — not in the original audit

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| ✅ C48 | **P2** | ~~**Duplicated markup.** There are no layouts or components.~~ Extracted into a shared layout plus components — see below. The build output was byte-for-byte identical before and after. | All 8 pages |
| ☐ C49 | **P3** | **Card copy has already drifted.** The Market Place tile reads "Discover wonderful products **& services** created by SEND parents in business." on `/`, `/cafe`, `/hall` and `/wellbeing`, but drops "& services" on `/library` and `/expert-hub`. Same tile, two versions. **Deliberately not normalised** — both survive as `areas.marketPlace` and `areas.marketPlaceShort` in `src/data/areas.ts`. Once a decision is made, delete the loser and repoint two pages. | `library`, `expert-hub` |
| ✅ C50 | **P3** | ~~No `<link rel="canonical">` on any page.~~ Added to the shared layout, derived from `Astro.site` and the page path. No trailing slash except on `/`, matching what Cloudflare Pages actually serves and what `sitemap.xml` lists. Verified against the built HTML for every route, and the three new pages picked it up for free. Done without waiting on C44 — canonicals don't need the share image. | All 11 pages |
| ✅ C51 | **P3** | ~~The star row renders as five bare `★` characters with no accessible name.~~ The row is now `role="img"` with an `aria-label` generated from the testimonial's own `stars` value ("Rated 5 out of 5"); the glyphs are in an `aria-hidden` span. The placeholder slot (`stars: null`) carries neither role nor label and stays hidden. Visual output unchanged. | 6 content pages |
| ✅ C52 | **P3** | ~~Homepage hero uses a hyphen where the rest of the site uses an em dash.~~ Both now use the site's spaced `&mdash;` convention. | `index` hero |
| ✅ C61 | **P2** | ~~**The statutory company details appeared nowhere but the Privacy Policy.**~~ A UK company must disclose its registered name, registered office, registration number and place of registration on its website — not bury them in one policy a visitor has to open. The footer legal row now carries them on all twelve pages, in 13px `#767676` beneath the copyright line: quiet, but present. | `SiteFooter` legal row |

---

## Found while transcribing the legal documents

The three source PDFs were transcribed verbatim. Clause numbering is reproduced exactly as
printed, because these documents cross-reference each other by clause number and renumbering
them here would change what the published policy says. That means the following faults are now
live on the site, and only their author can fix them.

| # | Priority | Issue | Where |
|---|----------|-------|-------|
| ☐ C53 | **P2** | **Clause numbering faults in the Community Guidelines.** §2.1 introduces a list, but only its first item is lettered `(a)` — the next two are numbered `2.2` and `2.3` as if they were clauses, and the list then restarts at `(a)`. §9.1 has the same fault: "You must not:" is followed by `9.2`–`9.6` where `(a)`–`(e)` was clearly meant. §3.2 letters its closing sentence as item `(f)`. §10.2's list ends without an "or". | `community-guidelines` |
| ✅ C54 | **P1** | ~~**The User Terms of Use have no effective date.** The source PDF reads `Effective Date: [●]`~~ — set to **1 August 2026**, supplied by The Vilij on 29 July 2026 and not taken from the PDF. It is the only part of `/terms` that is not a transcription. Rendered as the same "Effective from …" pill the Cookie Policy uses, in the same place: beneath the page intro, above the orange band. | `terms` |
| ✅ C55 | **P1** | **The Complaints procedure had no real contact address.** The source PDF gives `email@email.co.uk` in five places, including the address for reporting **safeguarding and child protection concerns**. The safeguarding address was resolved from clause 7.2 of the Terms (`safeguarding@thevilij.co.uk`); the general complaints address was confirmed on 29 July 2026 as `complaints@thevilij.co.uk`. Both are now set in `src/pages/complaints.astro`, and the page has been published: `noindex` removed, added to `sitemap.xml`, `Disallow` lifted from `robots.txt`, linked from the footer on all 12 pages. **Confirm the `complaints@` mailbox is live and monitored** — the page now tells people it is. | `complaints` |
| ✅ C56 | **P2** | ~~**The Safeguarding Policy is not published anywhere.**~~ Transcribed verbatim from `THE VILIJ Safeguarding Policy (Final).pdf` (version 1.1, effective 24 July 2026) and published at **`/safeguarding-policy`** — 19 sections, 129 clauses, the longest document on the site. The mislabelled footer link is fixed: "Privacy Policy & Safeguarding Policy" is split into two entries in the Quick Links column, and "Safeguarding" is added to the legal row alongside Terms, Privacy and Cookies. Added to `sitemap.xml`. **Nothing was added to the Privacy Policy, Terms or Community Guidelines** — those are published legal texts and a new cross-reference would change what they say. Faults reproduced from the source are recorded in C62; the contact details question is C63. | `safeguarding-policy` |
| ☐ C57 | **P3** | **The Privacy Policy PDF is behind the live site.** The source still reads `company number []`; the live page carries **16718802**, taken from the executed Membership Agreement. Anyone re-transcribing from the PDF would regress C4. | source PDF |
| ✅ C58 | **P1** | ~~**Non-essential cookies are set with no consent.**~~ Fixed on 29 July 2026 by a consent banner, and fixed properly: the HubSpot script tag is **gone from `BaseLayout.astro` entirely**, and is injected by `CookieConsent.astro` only after someone accepts. Loading HubSpot and asking it not to track would not have worked — the cookies get set either way. Verified in a real browser on a clean profile: no `__hstc`, `hubspotutk`, `__hssc` or `__hssrc` before a choice; still none after rejecting, after a navigation and after a reload; all four present after accepting. Accept and Reject are the same size, shape and colour, and both are fully on screen down to 320×568. Escape dismisses without accepting and without overwriting an earlier answer. GPC is honoured as a refusal. Withdrawing consent deletes the four cookies and reloads the page without the script. | All 13 pages |
| ☐ C64 | **P1** | **The newsletter is only captured from people who accept analytics.** The footer form is a plain HTML form; HubSpot records it through *non-HubSpot form capture*, which is a feature of the tracking script rather than a separate forms script. Blocking tracking therefore does not break the form — it still submits and still lands on `/newsletter-thanks` — but nothing reaches HubSpot. Confirmed by watching the network in both states: with analytics rejected there are no HubSpot requests at all; with analytics accepted, `collectedforms.js` loads and a `POST /collected-forms/submit/form` fires on submit. **So a visitor who refuses analytics, subscribes, and is told “You’re on the list” is not on the list.** That is worse than a form that visibly fails, and it is a decision rather than something to work around. Three ways out: accept the loss; replace the plain form with a HubSpot embedded form, whose script is independent of tracking; or POST to a Cloudflare Pages Function that calls HubSpot’s Forms API server-side, which needs no client cookies in any consent state and would also close ISSUES #13. The third is the right one. | `SiteFooter` newsletter form |
| ☐ C63 | **P1** | **The Safeguarding Policy publishes two people's personal mobile numbers.** Clause 19.4 is fully filled in — no placeholders — and names the DSL and Deputy DSL with their roles, work email addresses and mobile numbers (`07968 212108`, `07598 179440`). Transcribed verbatim because that is what the document says and it is the client's document. But publishing a personal mobile number on an indexed marketing page is a publication decision, not a transcription detail: it will be scraped. Three options, all of which need a person to choose: publish as-is, replace the numbers with `safeguarding@thevilij.co.uk` (which clause 19.4 already gives as the reporting route), or leave the page `noindex` until the policy is reissued. **Decide before this page goes live.** | `safeguarding-policy` §19.4 |
| ☐ C62 | **P2** | **Numbering and naming faults in the source Safeguarding Policy.** Three, all reproduced as printed. **§16.8** prints an item `(g)` with no text at all — just the letter and a semicolon; the item is omitted rather than published as an empty bracket, and `(h)` and `(i)` keep the letters the document prints (this is what `itemLabels` in `src/data/legal.ts                     shared shape for the five legal documents` is for). **§19.5** is a heading, "Emergency and external contacts", with no clause text; the content it introduces is numbered 19.6. **§19.1** names the policy owner "Charlene Andruskeviciu" where §19.4 names the same person "Charlene Andruskevicius". Only the author can fix any of these. | `safeguarding-policy` |
| ☐ C60 | **P2** | **The registered office now reads two ways.** The confirmed address is *The Meakin Suite, Ravenscliffe, First Avenue, Newcastle-under-Lyme, ST5 8QX*, and that is what the footer and the Privacy Policy §2.1 now carry. The Complaints procedure §11 still reads *Newcastle Under Lyme, Staffordshire, United Kingdom* because it is a solicitor document transcribed verbatim and correcting it would change what the published procedure says. Either the source PDF is reissued or someone decides the transcription rule bends for a factual address. | `complaints` §11 |
| ☐ C59 | **P2** | **The cookie inventory has only been half scanned.** A real scan on 29 July 2026 confirmed the four HubSpot names, that they appear only after acceptance, and that `vilij_cookie_consent` behaves exactly as §5.2 now describes. Two gaps remain. The **lifespans** in the table are still HubSpot’s and Cloudflare’s published figures rather than measured ones, and those providers can change them. And `__cf_bm` could not be checked properly: the scan ran against a local server, where it appears only as a third-party cookie on HubSpot’s own domains. On the deployed site it is set at the Cloudflare edge for `marketing.thevilij.co.uk` before any of our JavaScript runs — nothing in the consent code touches it, but confirm that in production. | `cookie-policy` §5 |

Two typographic corrections were made silently, both in the User Terms of Use: a stray space
before a full stop in §7.2 ("by The Vilij ."), and the mangled currency symbol in §14.3, which
is £100.

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
src/components/SiteFooter.astro       footer — C1, C2 and the company details (C61)
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

1. ~~**Write the three missing pieces of real copy**~~ — overtaken. The placeholders were
   removed rather than filled (C1, C2) and the second testimonial hidden rather than written
   (C3). The footer blurb and newsletter blurb are still wanted; the site now reads correctly
   without them, so they are no longer blocking.
2. ~~**Fix the four typos visible above the fold**~~ — done (C9, C10, C11, C12), along with the
   rest of C13–C19.
3. ~~**Give SIGN UP somewhere to go** (C20)~~ — done. All thirteen sign-up calls to action now
   reach `https://app.thevilij.co.uk`.
4. ~~**Fill in the company number** (C4)~~ — done. ~~**Publish the Terms of Use, Community
   Guidelines, Cookie Policy and Complaints procedure**~~ (C36, C37, C35, C38, C55) — done, and
   all four are now linked from the footer. Still outstanding: **fix the cookie consent gap**
   (C58) — done, see the consent banner — ~~**give the Terms an effective date**~~ (C54) and
   ~~**decide whether the Safeguarding Policy goes public**~~ (C56), both done. What the consent
   work left behind is C64: the newsletter is no longer captured from people who refuse
   analytics.
5. ~~**Build or hide** High Street, Market Place and Campus (C23–C25)~~ — hidden, as
   "coming soon" tiles. Still outstanding: a Support/Contact route (C33).
6. **Decide on pricing** (C39) — £10/month currently leads nowhere.
7. **Produce the 1200×630 share image** so Open Graph tags can go in (C44). Canonical tags
   (C50) are already done and did not need it.
8. ~~Extracting a shared layout (C48)~~ — done, ahead of C1 and C2 as intended. Decide the
   Market Place wording (C49) whenever convenient: it is now a one-word edit in one file.
