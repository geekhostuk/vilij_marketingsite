// The Vilij — the testimonial carousel content, shared by the six pages that
// carry it.
//
// Until 29 August 2026 there was one real testimonial (Emily & Loui) and every
// page paired it with a Lorem ipsum quote attributed to an invented family —
// see C3, C5, C6 and C7 in content-issues.md. That slot was hidden behind a
// `showSecondTestimonial` flag while it waited for real, consented copy.
//
// Six quotes from the closed-beta testers arrived on 29 August 2026, so the
// placeholder is gone: the flag, the invented names and the per-page copies of
// the list all went with it. Every page now rotates through the same seven real
// testimonials from this one list, and the carousel has something to page to.
//
// Quotes are as supplied, with the brand spelt "The Vilij" throughout (two
// testers wrote "Villij") and two obvious typos corrected. Wording is otherwise
// untouched. The testers' home towns followed later the same day and are the
// line under each name; "Stoke-On-Trent" is spelt "Stoke-on-Trent" here, the
// city's own styling and the one already used for Newcastle-under-Lyme.
export interface Testimonial {
  quote: string;
  name: string;
  // The line under the name — a location or relationship. The six beta testers
  // sent theirs on 29 August 2026, so every slide now carries one; the type
  // stays nullable and the row is still hidden when it is null, because a
  // testimonial arriving without a location must not get an invented one. See
  // C7 in content-issues.md.
  role: string | null;
  // C8 — a testimonial without a rating has stars: null and the star row is
  // hidden rather than rendered empty. Only Emily & Loui gave one; the beta
  // testers were asked for words, not a score.
  stars: number | null;
  photo: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "As a parent of a 22-year-old son with autism, I finally feel understood. The Vilij offers practical support, genuine connection and reminds us we’re never alone.",
    name: "Emily & Loui",
    role: "SEND family, Newcastle-under-Lyme",
    stars: 5,
    photo: "/assets/p_emily_loui.jpg",
  },
  {
    quote:
      "The Vilij is the missing piece in our SEN journey, bringing expert advice, lived experience and guidance together in one simple, trusted place. Every journey starts with a footstep. The Vilij is a path to lay your footstep on.",
    name: "Phil",
    role: "Watford",
    stars: null,
    photo: "/assets/p_phil.jpg",
  },
  {
    quote:
      "Looking after a SEND child can often feel isolating and overwhelming. The Vilij really is a lifeline. It offers comfort, clarity and connection with others who can relate to what I’m going through. It’s lovely to know I’m not alone in this.",
    name: "Laura & Max",
    role: "Stoke-on-Trent",
    stars: null,
    photo: "/assets/p_laura.jpg",
  },
  {
    quote:
      "Wow! The Vilij is a breath of fresh air. Everyone on similar paths, who understand and support one another, and simply “get it”. Having everything under one roof is so refreshing. The Vilij feels like a one stop shop with heart, and a hint of nostalgia that we all enjoy.",
    name: "Sally",
    role: "Northwich",
    stars: null,
    photo: "/assets/p_sally.jpg",
  },
  {
    quote:
      "I’ve been using The Vilij for a while now talking to people who just get it. People understand me and know how lonely it can be bringing up a special needs child. I know The Vilij will be a life-line for people who just need someone to listen. I’m really looking forward to the village community growing.",
    name: "Karla",
    role: "Stalybridge",
    stars: null,
    photo: "/assets/p_karla.jpg",
  },
  {
    quote:
      "Both you and Charlie together on video make my watching feel included and less alone, and for me it reinforces what The Vilij is about: real people on this journey, all at different stops on the road.",
    name: "Littlemissa",
    role: "Bedford",
    stars: null,
    photo: "/assets/p_littlemissa.jpg",
  },
  {
    quote:
      "I feel genuinely honoured to have been one of The Vilij testers and I’ve seen how much thought, passion and care has gone into making it something that can genuinely make a difference to SEND families.",
    name: "Lorna",
    role: "Audlem",
    stars: null,
    photo: "/assets/p_lorna.jpg",
  },
];
