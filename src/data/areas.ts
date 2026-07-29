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

export interface AreaCard {
  label: string;
  img: string;
  alt: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  /**
   * The area is described on the site but has no page yet (C23–C25). The tile
   * still renders, with its copy intact, but as a plain "Coming soon" panel:
   * no anchor, nothing focusable, nothing for assistive technology to announce
   * as activatable.
   *
   * `href` and `cta` are deliberately left in place on these cards. They are
   * what the tile goes back to when the page exists — deleting this one flag
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
  img: "/assets/cafe.png",
  alt: "Café",
  title: "CAF&Eacute;",
  body: "Pull up a chair, pour a brew and find your people.",
  href: "/cafe",
  cta: "WHAT&rsquo;S ON AT THE CAF&Eacute;?",
};

export const hall: AreaCard = {
  label: "Vilij Hall",
  img: "/assets/hall.png",
  alt: "Vilij Hall",
  title: "VILIJ HALL",
  body: "Where stories are shared, voices are heard, and support comes to life.",
  href: "/hall",
  cta: "WHAT&rsquo;S ON IN THE VILIJ HALL?",
};

export const library: AreaCard = {
  label: "Library",
  img: "/assets/library.png",
  alt: "Library",
  title: "LIBRARY",
  body: "Practical resources at your fingertips, ready whenever you are.",
  href: "/library",
  cta: "WHAT&rsquo;S IN THE LIBRARY?",
};

export const wellbeing: AreaCard = {
  label: "Wellbeing",
  img: "/assets/wellbeing.png",
  alt: "Wellbeing Centre",
  title: "WELLBEING CENTRE",
  body: "Because caring for them starts with caring for you.",
  href: "/wellbeing",
  cta: "WHAT&rsquo;S ON AT THE WELLBEING CENTRE?",
};

export const expertHub: AreaCard = {
  label: "Expert Hub",
  img: "/assets/experthub.png",
  alt: "Vilij Expert Hub",
  title: "VILIJ EXPERT HUB",
  body: "Trusted experts, tailored advice, and tools that make a difference.",
  href: "/expert-hub",
  cta: "WHAT&rsquo;S IN THE EXPERT HUB?",
};

export const highStreet: AreaCard = {
  label: "High Street",
  img: "/assets/highstreet.png",
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
  img: "/assets/market.png",
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
  img: "/assets/campus.png",
  alt: "Vilij Campus",
  title: "VILIJ CAMPUS",
  body: "New exciting development now under construction.",
  href: "#",
  cta: "WHAT&rsquo;S COMING TO THE VILIJ CAMPUS?",
  comingSoon: true,
};
