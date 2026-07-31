// The Vilij — regenerates src/data/imageSizes.ts from the files in public/.
//
// Run with: node scripts/gen-image-sizes.mjs
//
// Why this exists (SEO-REVIEW.md §2): an <img> with no width/height gives the
// browser nothing to reserve space with, so every image shifts the layout as it
// lands — the CLS half of Core Web Vitals. Three components take their `src` as
// a prop (AreaCard, PhotoTile, TestimonialCarousel), so their dimensions cannot
// be written inline the way the hand-written page markup can. They look the
// size up here instead.
//
// The hand-written <img> tags in src/pages/ carry literal width/height
// attributes and do NOT use this map. That is deliberate: they are one-off
// markup, and a literal is easier to read at the call site than a lookup.
//
// Re-run this after adding, replacing or re-cropping anything in public/assets/.
// If a file changes size and this is not re-run, the map goes stale and the
// reserved box is the wrong shape — which is a smaller problem than no box at
// all, but still a layout shift.
import sharp from "sharp";
import fs from "fs";
import path from "path";

const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]
  );

const files = walk("public")
  .filter((f) => /\.(png|jpe?g)$/i.test(f))
  // The favicons are declared by <link rel="icon">, which takes no dimensions.
  .filter((f) => !/favicon/i.test(f));

const entries = [];
for (const f of files) {
  const m = await sharp(f).metadata();
  const url = "/" + f.replace(/\\/g, "/").replace(/^public\//, "");
  entries.push([url, m.width, m.height]);
}
entries.sort((a, b) => a[0].localeCompare(b[0]));

const body = entries
  .map(([url, w, h]) => `  "${url}": { w: ${w}, h: ${h} },`)
  .join("\n");

const out = `// The Vilij — intrinsic pixel dimensions of every image in public/.
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
${body}
};

/**
 * The intrinsic size of \`src\`, or undefined if it is not a known local asset.
 *
 * Undefined is not an error worth throwing over: a missing entry costs a layout
 * shift, and a build that fails because someone added a photo without running
 * the generator is a worse trade. Callers omit width/height in that case, which
 * is exactly the behaviour the whole site had before this existed.
 */
export function imageSize(src: string): ImageSize | undefined {
  return imageSizes[src];
}
`;

fs.writeFileSync("src/data/imageSizes.ts", out);
console.log(`src/data/imageSizes.ts written: ${entries.length} images`);
