/**
 * Landing bypass for scroll-triggered reveals.
 *
 * Deep links that land a visitor directly on an action surface (the Book
 * pill and booking CTAs → /book#booking-calendar, "Contact instead" CTAs →
 * /contact#contact-form, the floating demo launcher → a service page's
 * reserved demo frame) should show that surface immediately — the cinematic
 * entrance choreography is for browsing, not for someone who has just been
 * told "the calendar is right here".
 *
 * The deep-link scroll handler arms a short window when it scrolls to a
 * target; any reveal whose trigger fires inside the window skips its
 * entrance animation entirely (see `useRevealStart`). Reveals triggered
 * after the window — the visitor scrolling on from the landing point — play
 * their normal scheduled entrances.
 */

let bypassUntil = 0;

export function armRevealBypass(windowMs: number): void {
  if (typeof performance === "undefined") {
    return;
  }
  bypassUntil = Math.max(bypassUntil, performance.now() + windowMs);
}

export function isRevealBypassActive(): boolean {
  return typeof performance !== "undefined" && performance.now() < bypassUntil;
}
