// The Vilij — testimonial carousel settings shared by the six pages that carry it.
//
// Only one real testimonial exists (Emily & Loui). The second slot on every page
// pairs a Lorem ipsum quote with an invented, named family — see C3, C5, C6 and
// C7 in content-issues.md. The audit recommends hiding that slot until a second
// real, consented quote exists.
//
// Setting this to false hides the placeholder slot on all six pages at once.
// It is left true here because that is the behaviour today and the decision is
// not ours to make.
export const showSecondTestimonial = true;

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  // C8 — a testimonial without a rating has stars: null and the star row is
  // hidden rather than rendered empty.
  stars: number | null;
  photo: string;
}
