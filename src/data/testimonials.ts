// The Vilij — testimonial carousel settings shared by the six pages that carry it.
//
// Only one real testimonial exists (Emily & Loui). The second slot on every page
// pairs a Lorem ipsum quote with an invented, named family — see C3, C5, C6 and
// C7 in content-issues.md. The audit recommends hiding that slot until a second
// real, consented quote exists.
//
// Set false on 29 July 2026: the placeholder slot is hidden on all six pages
// until a second real, consented quote exists. The data itself is untouched —
// each page still defines its second testimonial, invented attribution and all,
// so restoring it is a one-word change here.
//
// With one testimonial there is nothing to page to, so TestimonialCarousel also
// drops the prev/next controls when the list has a single entry. A next button
// that does nothing is worse than the placeholder it replaced.
export const showSecondTestimonial = false;

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  // C8 — a testimonial without a rating has stars: null and the star row is
  // hidden rather than rendered empty.
  stars: number | null;
  photo: string;
}
