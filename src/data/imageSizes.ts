// The Vilij — intrinsic pixel dimensions of every image in public/.
//
// GENERATED FILE — do not edit by hand.
// Regenerate with: node scripts/gen-image-sizes.mjs
//
// Consumed by the three components that take their image as a prop and so
// cannot carry literal width/height attributes: AreaCard, PhotoTile and
// TestimonialCarousel. See scripts/gen-image-sizes.mjs for why.

export interface ImageSize {
  w: number;
  h: number;
}

export const imageSizes: Record<string, ImageSize> = {
  "/assets/cafe_hero.png": { w: 566, h: 423 },
  "/assets/cafe.png": { w: 566, h: 423 },
  "/assets/campus.png": { w: 720, h: 507 },
  "/assets/charlie.png": { w: 496, h: 411 },
  "/assets/experthub_hero.png": { w: 1400, h: 1084 },
  "/assets/experthub.png": { w: 720, h: 557 },
  "/assets/footerlogo.png": { w: 441, h: 192 },
  "/assets/hall_trim.png": { w: 1200, h: 962 },
  "/assets/hall.png": { w: 584, h: 445 },
  "/assets/hero_village.png": { w: 1240, h: 776 },
  "/assets/highstreet.png": { w: 720, h: 475 },
  "/assets/houseicon.png": { w: 269, h: 250 },
  "/assets/library_hero.png": { w: 1400, h: 1354 },
  "/assets/library.png": { w: 458, h: 443 },
  "/assets/logo.png": { w: 570, h: 248 },
  "/assets/market.png": { w: 638, h: 375 },
  "/assets/og-default.jpg": { w: 1200, h: 630 },
  "/assets/p_beach.jpg": { w: 800, h: 1000 },
  "/assets/p_bites.jpg": { w: 480, h: 400 },
  "/assets/p_brew.png": { w: 800, h: 444 },
  "/assets/p_dailychat.png": { w: 560, h: 640 },
  "/assets/p_eh_education.png": { w: 420, h: 420 },
  "/assets/p_eh_emotional.png": { w: 420, h: 420 },
  "/assets/p_eh_expert.png": { w: 420, h: 420 },
  "/assets/p_eh_health.png": { w: 420, h: 420 },
  "/assets/p_eh_legal.png": { w: 420, h: 420 },
  "/assets/p_eh_life.png": { w: 420, h: 420 },
  "/assets/p_elder.jpg": { w: 480, h: 400 },
  "/assets/p_emily_loui.png": { w: 780, h: 510 },
  "/assets/p_events.png": { w: 800, h: 440 },
  "/assets/p_experts.png": { w: 560, h: 640 },
  "/assets/p_founders.png": { w: 389, h: 536 },
  "/assets/p_grand.jpg": { w: 1000, h: 750 },
  "/assets/p_jose.jpg": { w: 1000, h: 750 },
  "/assets/p_lib_child.jpg": { w: 460, h: 400 },
  "/assets/p_lib_ehcp.jpg": { w: 460, h: 400 },
  "/assets/p_lib_everyday.jpg": { w: 460, h: 400 },
  "/assets/p_lib_parent.jpg": { w: 480, h: 660 },
  "/assets/p_lib_roadmap.jpg": { w: 460, h: 400 },
  "/assets/p_lib_tools.jpg": { w: 470, h: 570 },
  "/assets/p_mug.jpg": { w: 500, h: 640 },
  "/assets/p_sip.jpg": { w: 500, h: 640 },
  "/assets/p_tea.jpg": { w: 480, h: 400 },
  "/assets/p_wb_burnout.jpg": { w: 470, h: 570 },
  "/assets/p_wb_calm.jpg": { w: 480, h: 660 },
  "/assets/p_wb_emotional.jpg": { w: 460, h: 400 },
  "/assets/p_wb_finance.jpg": { w: 460, h: 400 },
  "/assets/p_wb_social.jpg": { w: 460, h: 400 },
  "/assets/p_wb_team.jpg": { w: 460, h: 400 },
  "/assets/testimonial.png": { w: 780, h: 510 },
  "/assets/tiles/cafe.png": { w: 597, h: 448 },
  "/assets/tiles/campus.png": { w: 716, h: 537 },
  "/assets/tiles/experthub.png": { w: 787, h: 590 },
  "/assets/tiles/hall.png": { w: 629, h: 472 },
  "/assets/tiles/highstreet.png": { w: 672, h: 504 },
  "/assets/tiles/library.png": { w: 627, h: 470 },
  "/assets/tiles/market.png": { w: 531, h: 398 },
  "/assets/tiles/wellbeing.png": { w: 633, h: 475 },
  "/assets/village_sm.png": { w: 760, h: 475 },
  "/assets/wellbeing_hero.png": { w: 1400, h: 874 },
  "/assets/wellbeing.png": { w: 720, h: 448 },
};

/**
 * The intrinsic size of `src`, or undefined if it is not a known local asset.
 *
 * Undefined is not an error worth throwing over: a missing entry costs a layout
 * shift, and a build that fails because someone added a photo without running
 * the generator is a worse trade. Callers omit width/height in that case, which
 * is exactly the behaviour the whole site had before this existed.
 */
export function imageSize(src: string): ImageSize | undefined {
  return imageSizes[src];
}
