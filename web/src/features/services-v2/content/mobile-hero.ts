/**
 * Phone-only copy for the shared secondary hero.
 *
 * On a phone the hero is budgeted to one screen and has to read at a glance,
 * so every route can carry a second, much shorter set of hero copy that only
 * the `max-width: 40rem` tier renders: an optional one-line tagline in place
 * of the deck and lead, and three ultra-short signal points in place of the
 * full capability sentences. The H1, eyebrow and CTAs are shared with desktop
 * — the H1 in particular is the route's single heading and carries its target
 * term, so it is never rewritten per viewport.
 *
 * Both variants ship in the prerendered HTML (the site's established pattern
 * for viewport copy, see `.ss-hv2-hero__lead-full` / `-short`); CSS decides
 * which one a given screen shows. Budgets are enforced by a unit test so a
 * copy edit can never silently push the phone hero past the fold.
 */
export type MobileHeroCopy = {
  /** One short line under the H1 on phones. Replaces the deck and the lead. */
  tagline?: string;
  /** Exactly three signal points, each a few words — chip-sized, not sentences. */
  points: string[];
};

/**
 * Character ceilings.
 *
 * The tagline's is the ONE-LINE budget at 390px — the reference phone — not a
 * fits-on-screen budget: at that width the line holds 50-52 characters, so 48
 * is that measurement with a margin for a bad word boundary. It was 64 (a
 * 320px-stage figure that only asked whether the line fitted at all), which
 * passed five taglines that wrapped to two lines on the reference phone. The
 * ceiling is word-boundary dependent, so it can only ever be an approximation
 * of the real constraint; the rendered line count is asserted for real, in a
 * browser, by tests/e2e/mobile-hero-fold.spec.ts.
 */
export const MOBILE_HERO_TAGLINE_MAX_CHARS = 48;
/** Measured against the 320px stage, where the panel has ~240px of inner width. */
export const MOBILE_HERO_POINT_MAX_CHARS = 26;
export const MOBILE_HERO_POINT_COUNT = 3;
