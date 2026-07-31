// The Vilij — generates public/assets/og-default.jpg, the site-wide Open Graph
// share image (SEO-REVIEW.md §4).
//
// Run with: node scripts/make-og-image.mjs
//
// This is a build-from-existing-asset, not a designed card: the village
// illustration contain-fitted onto the site's hero gradient at the 1200x630
// Facebook/LinkedIn/WhatsApp reference size. It exists so that shares stop
// rendering as a bare grey link today. If Damien supplies a designed share card,
// drop it in at the same path and same dimensions and delete this script — the
// only contract is the path, which BaseLayout reads.
//
// Why generated rather than committed by hand: hero_village.png is 1240x776 and
// 849KB. Neither the aspect ratio nor the weight is usable as an OG image, and
// the crop is not obvious enough to do by eye — the illustration must not be cut.
//
// The gradient matches the CSS on the homepage hero:
//   linear-gradient(108deg, #fde7d0 0%, #f6e6d6 42%, #dcecea 74%, #d3edee 100%)
// CSS angles run clockwise from "to top", so 108deg points right and slightly
// down: dx = sin(108) = 0.951, dy = -cos(108) = 0.309.
import sharp from "sharp";

const W = 1200;
const H = 630;

// Contain-fit the illustration inside a generous margin so nothing touches the
// edge — several platforms round the corners or overlay a play affordance.
const ART_W = 1080;
const ART_H = 520;

const gradient = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
     <defs>
       <linearGradient id="g" x1="0" y1="0" x2="0.951" y2="0.309">
         <stop offset="0%"   stop-color="#fde7d0"/>
         <stop offset="42%"  stop-color="#f6e6d6"/>
         <stop offset="74%"  stop-color="#dcecea"/>
         <stop offset="100%" stop-color="#d3edee"/>
       </linearGradient>
     </defs>
     <rect width="${W}" height="${H}" fill="url(#g)"/>
   </svg>`
);

const art = await sharp("public/assets/hero_village.png")
  .resize(ART_W, ART_H, { fit: "inside", withoutEnlargement: true })
  .toBuffer();

const { width: aw, height: ah } = await sharp(art).metadata();

await sharp(gradient)
  .composite([
    {
      input: art,
      left: Math.round((W - aw) / 2),
      top: Math.round((H - ah) / 2),
    },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("public/assets/og-default.jpg");

const out = await sharp("public/assets/og-default.jpg").metadata();
console.log(
  `og-default.jpg written: ${out.width}x${out.height}, ` +
    `${(out.size / 1024).toFixed(0)}KB`
);
