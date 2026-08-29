// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // The public origin. Every absolute URL the site emits is built from this —
  // the canonical link, og:url and og:image in BaseLayout — so this is the one
  // place the domain is stated for the rendered pages. public/sitemap.xml is
  // the exception: it is hand-written and repeats the host in each <loc>.
  //
  // Moved from marketing.thevilij.co.uk to the apex on 29 August 2026, when the
  // Bubble app vacated it for app.thevilij.co.uk. See public/_redirects, which
  // catches the app's old URLs arriving here.
  site: 'https://thevilij.co.uk',
});
