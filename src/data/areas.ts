// The Vilij — the nine "areas of The Vilij" tiles.
//
// These tiles appear on the homepage ("Everything you need, in one place.") and
// again in the "What else you can see inside the Vilij" grid on every content
// page. Before this file existed the markup was copy-pasted into six page files
// and had already drifted (see marketPlace below). Each tile is defined once
// here; the pages choose which ones to show and in what order.
//
// `title`, `body` and `cta` are rendered with set:html so that the HTML entities
// the original design used (&Eacute;, &rsquo;, &amp;) survive verbatim.
//
// `label` is the HTML comment that precedes the tile in the markup, kept so the
// built output is unchanged from the hand-written version.
//
// `img` points at /assets/tiles/, not /assets/. Damien asked for the buildings
// to be centred, "even if it means cropping the shadows and aligning the
// cropped shadow to the right edge of the blocks". The originals are isometric
// cutouts with a flat grey cast shadow trailing right, so every building sat
// left of centre — measured, between 5% (Market Place) and 19.5% (Library).
// They also ran from 1.03:1 to 1.70:1, so contain-fitting them into one 4:3 box
// rendered each at a different size, which is the other half of why the grid
// looked ragged.
//
// The tiles in /assets/tiles/ are re-canvassed from the originals: building
// centred, artwork uncropped vertically, shadow allowed to run off the right
// edge, every canvas exactly 4:3. The originals are untouched in /assets/ —
// point these back at them to revert. If Damien supplies his own re-exports,
// drop them into /assets/tiles/ with the same filenames and nothing else needs
// to change.
//
// Still open: the buildings occupy very different shares of their frames (the
// Café is 63% of canvas width, the Library 44%, Market Place 94%), because a
// single shop and a whole campus scene are not the same kind of drawing.
// Normalising that is a design call, not a mechanical one.

export interface AreaCard {
  label: string;
  img: string;
  alt: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  /**
   * The area is not open to visitors yet. The tile still renders, with its copy
   * intact, but as a plain "Coming soon" panel: no anchor, nothing focusable,
   * nothing for assistive technology to announce as activatable.
   *
   * Two different reasons end up here. High Street, Market Place and Vilij
   * Campus have no page at all (C23–C25). Library and Wellbeing are built and
   * finished but held back, so only the Café, Vilij Hall and Expert Hub are
   * open for now. The tile behaves identically either way.
   *
   * `href` and `cta` are deliberately left in place on these cards. They are
   * what the tile goes back to when the area opens — deleting this one flag
   * makes it a live card again, with the wording it always had.
   */
  comingSoon?: boolean;
}

// A photo slotted into the grid between the cards. Which photo, what it is
// described as, and where it sits all vary from page to page.
export interface AreaPhoto {
  label: string;
  img: string;
  alt: string;
  framed?: boolean;
}

export type GridItem = AreaCard | AreaPhoto;

export const cafe: AreaCard = {
  label: "Café",
  img: "/assets/tiles/cafe.png",
  alt: "Café",
  title: "CAF&Eacute;",
  body: "Pull up a chair, pour a brew and find your people.",
  href: "/cafe",
  cta: "WHAT&rsquo;S ON AT THE CAF&Eacute;?",
};

export const hall: AreaCard = {
  label: "Vilij Hall",
  img: "/assets/tiles/hall.png",
  alt: "Vilij Hall",
  title: "VILIJ HALL",
  body: "Where stories are shared, voices are heard, and support comes to life.",
  href: "/hall",
  cta: "WHAT&rsquo;S ON IN THE VILIJ HALL?",
};

// Library and Wellbeing are held back (31 Jul 2026): only the Café, Vilij Hall
// and Expert Hub are open for now. Both pages are built and complete — they are
// simply not being offered yet, so the tiles carry the same banner as the three
// areas that have no page at all. `href` stays pointed at the real page, which
// is what the tile goes back to the moment the flag comes off.
export const library: AreaCard = {
  label: "Library",
  img: "/assets/tiles/library.png",
  alt: "Library",
  title: "LIBRARY",
  body: "Practical resources at your fingertips, ready whenever you are.",
  href: "/library",
  cta: "WHAT&rsquo;S IN THE LIBRARY?",
  comingSoon: true,
};

export const wellbeing: AreaCard = {
  label: "Wellbeing",
  img: "/assets/tiles/wellbeing.png",
  alt: "Wellbeing Centre",
  title: "WELLBEING CENTRE",
  body: "Because caring for them starts with caring for you.",
  href: "/wellbeing",
  cta: "WHAT&rsquo;S ON AT THE WELLBEING CENTRE?",
  comingSoon: true,
};

export const expertHub: AreaCard = {
  label: "Expert Hub",
  img: "/assets/tiles/experthub.png",
  alt: "Vilij Expert Hub",
  title: "VILIJ EXPERT HUB",
  body: "Trusted experts, tailored advice, and tools that make a difference.",
  href: "/expert-hub",
  cta: "WHAT&rsquo;S IN THE EXPERT HUB?",
};

export const highStreet: AreaCard = {
  label: "High Street",
  img: "/assets/tiles/highstreet.png",
  alt: "High Street",
  title: "HIGH STREET",
  body: "Handpicked products for SEND families, all in one easy place.",
  href: "#",
  cta: "WHAT&rsquo;S ON THE HIGH STREET?",
  comingSoon: true,
};

// C49 — the Market Place tile has drifted into two versions and which one is
// correct has not been decided yet. `marketPlace` is the version live on /,
// /cafe, /hall and /wellbeing; `marketPlaceShort` drops "& services" and is the
// version live on /library and /expert-hub. Both are kept deliberately so the
// extraction changes nothing. Once the wording is agreed, delete the loser and
// point the two pages at the survivor — a one-line change in one file.
export const marketPlace: AreaCard = {
  label: "Market Place",
  img: "/assets/tiles/market.png",
  alt: "Market Place",
  title: "MARKET PLACE",
  body: "Discover wonderful products &amp; services created by SEND parents in business.",
  href: "#",
  cta: "WHAT&rsquo;S ON AT THE MARKET PLACE?",
  comingSoon: true,
};

export const marketPlaceShort: AreaCard = {
  ...marketPlace,
  body: "Discover wonderful products created by SEND parents in business.",
};

export const campus: AreaCard = {
  label: "Vilij Campus",
  img: "/assets/tiles/campus.png",
  alt: "Vilij Campus",
  title: "VILIJ CAMPUS",
  body: "New exciting development now under construction.",
  href: "#",
  cta: "WHAT&rsquo;S COMING TO THE VILIJ CAMPUS?",
  comingSoon: true,
};
