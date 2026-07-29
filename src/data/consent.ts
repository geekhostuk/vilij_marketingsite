// The Vilij — cookie consent settings, shared by the banner and the Cookie
// Policy page so the two cannot drift apart.
//
// The site sets no non-essential cookies until someone has agreed to them. The
// only thing that loads without consent is HubSpot's *forms* behaviour — and on
// this site there is no separate forms script, so see the note at the bottom.

/**
 * The name of the cookie that records the visitor's choice.
 *
 * The record itself is strictly necessary — it is what stops us asking again on
 * every page, and it is the evidence that consent was given — so it is set
 * without consent. It carries no identifier and nothing about the visitor
 * beyond the choice they made.
 */
export const CONSENT_COOKIE = "vilij_cookie_consent";

/**
 * The version of the Cookie Policy that the banner asked about.
 *
 * Stored alongside the choice. If this string changes, every stored record
 * becomes stale and the banner asks again — which is the point: consent is to a
 * particular description of what the site does, and if that description changes
 * materially the old answer no longer covers it.
 *
 * 1.0 — 29 July 2026. The policy as first written: honest that there was no
 *       consent mechanism, and offering only browser controls.
 * 2.0 — 1 August 2026. The consent banner exists; sections 4.1, 5.1, 5.2, 7 and
 *       7.5 rewritten to match. Bumped rather than pointed because the change is
 *       material: what the site does before you choose is now different.
 */
export const COOKIE_POLICY_VERSION = "2.0";

/** Shown on the Cookie Policy page, and the date version 2.0 takes effect. */
export const COOKIE_POLICY_EFFECTIVE = { iso: "2026-08-01", label: "1 August 2026" };

/** How long a recorded choice lasts before we ask again. */
export const CONSENT_MAX_AGE_DAYS = 182;

/** The HubSpot tracking script. Injected only once analytics consent is given. */
export const HUBSPOT_TRACKING_SRC = "//js-eu1.hs-scripts.com/148725470.js";

/**
 * The cookies HubSpot's tracking script sets. Cleared when consent is
 * withdrawn — a rejection that leaves the cookies in place is not a rejection.
 */
export const HUBSPOT_COOKIES = ["__hstc", "hubspotutk", "__hssc", "__hssrc"];
