import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Phone-only gate for the three floating controls pinned to the viewport's
 * bottom corners: the demos launcher (`.ss-demo-launcher`), every
 * return-to-intro button (`.ss-hv2-return`) and the Silktide consent widget
 * (its persistent icon, its first-visit prompt and that prompt's backdrop).
 *
 * On a phone the secondary hero is budgeted to exactly one screen, and that
 * screen is the whole first impression. Three floating controls sitting on top
 * of it cost the composition its two bottom corners *and* used to cost the copy
 * a 7.4rem reserved band (`--srv2-mobile-chrome-reserve`) that existed only so
 * the CTA row could never sink behind them. Holding the controls back until the
 * visitor has actually started reading buys that band back for the type — see
 * the `max-width: 40rem` block in styles/services-v2/services-v2.css, where the
 * reserve is now just the scroll cue's own breathing room.
 *
 * This component owns one fact and nothing else: it stamps
 * `<html data-mobile-chrome="ready">` once the visitor has scrolled far enough,
 * and CSS does the hiding (see the phone block near `.ss-hv2-return` in
 * styles/visual/home-v2.css and the OVERRIDES_CSS in
 * components/layout/shell/cookie-consent-manager.tsx). Nothing here reads or
 * writes component state, so it never re-renders the tree.
 *
 * "Far enough" is measured against the trust strip, which sits immediately
 * below every hero: the controls appear once the strip's BOTTOM edge has risen
 * into the upper half of the viewport, i.e. the reader is past the hero and
 * into the page. Routes with no trust strip (blog articles, privacy, 404) fall
 * back to "scrolled at least half a viewport", expressed as the same ratio so
 * one threshold pair governs both.
 *
 * Because the attribute is absent until this effect first runs, the CSS default
 * on phones is "hidden" — there is no frame in which the controls flash over a
 * cold-loaded hero.
 */

/** Phones only. Matches the hero's own `max-width: 40rem` composition tier. */
const PHONE_QUERY = "(max-width: 40rem)";
const ATTRIBUTE = "data-mobile-chrome";
const READY_VALUE = "ready";

/**
 * Both thresholds are fractions of the viewport height, measured as "how far
 * down the screen the reveal marker still sits" (1 = at the fold, 0 = at the
 * top). Showing at 0.5 and hiding again at 0.6 is deliberate hysteresis: a
 * single threshold makes the controls strobe when a fingertip rests on the
 * boundary or when iOS's toolbar collapse shifts the viewport by a few pixels.
 */
const SHOW_AT_OR_BELOW = 0.5;
const HIDE_ABOVE = 0.6;

/** The reassurance band that follows every hero. `.ss-hv2-trust` is the row
 *  itself; the shell around it is `.ss-hv2-trust-shell` (see home-v2.css). */
const TRUST_SELECTOR = ".ss-hv2-trust";

/** Root attributes whose flips mean "a route body just opened" — the moment a
 *  gated route's hero (and its trust strip) first has a real layout box. */
const EXPERIENCE_ATTRIBUTES = [
  "data-route-experience-state",
  "data-homepage-state",
  "data-gate-free",
];

export function MobileChromeGate() {
  const location = useLocation();

  useEffect(() => {
    // jsdom (unit tests) and any non-browser render have no matchMedia; the
    // gate simply never engages there, which is the same as "not a phone".
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const root = document.documentElement;
    const phone = window.matchMedia(PHONE_QUERY);
    let ready = false;
    let frame = 0;

    const evaluate = () => {
      if (!phone.matches) {
        // Wider screens never carry the attribute, so the CSS (which is itself
        // inside `max-width: 40rem`) can never hide anything there. Clearing it
        // also means a rotation back to phone width starts hidden again.
        ready = false;
        root.removeAttribute(ATTRIBUTE);
        return;
      }

      const viewport = window.innerHeight;
      if (viewport <= 0) {
        return;
      }

      const trust = document.querySelector(TRUST_SELECTOR);
      const box = trust?.getBoundingClientRect();
      /*
       * A gated route prerenders with its body clipped to zero height, so the
       * trust strip exists but has no usable box until the intro clears. Treat
       * that as "no trust strip" and use the scroll fallback, rather than
       * reading a collapsed rect as "already scrolled past".
       */
      const marker =
        box && box.height > 0 ? box.bottom / viewport : 1 - window.scrollY / viewport;

      const next = ready ? marker <= HIDE_ABOVE : marker <= SHOW_AT_OR_BELOW;
      if (next === ready) {
        return;
      }
      ready = next;
      if (ready) {
        root.setAttribute(ATTRIBUTE, READY_VALUE);
      } else {
        root.removeAttribute(ATTRIBUTE);
      }
    };

    // Scroll fires far faster than the compositor paints; one evaluation per
    // frame is both sufficient and the only rate that cannot cause layout
    // thrash from the getBoundingClientRect above.
    const schedule = () => {
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        evaluate();
      });
    };

    // The route body opens by flipping an attribute on <html>, at which point
    // the hero and its trust strip get their real boxes for the first time.
    const observer = new MutationObserver(schedule);
    observer.observe(root, {
      attributes: true,
      attributeFilter: EXPERIENCE_ATTRIBUTES,
    });

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    phone.addEventListener("change", schedule);

    evaluate();

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      phone.removeEventListener("change", schedule);
      root.removeAttribute(ATTRIBUTE);
    };
    // A route change replaces the hero (and may add or remove the trust strip),
    // so the gate re-measures from scratch on every navigation.
  }, [location.pathname]);

  return null;
}

export default MobileChromeGate;
