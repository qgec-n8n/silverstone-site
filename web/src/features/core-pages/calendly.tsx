/**
 * Shared Calendly embed constants + background warm-up.
 *
 * `CALENDLY_URL` / `CALENDLY_ORIGIN` are the single source of truth for the
 * production scheduler embed (see booking-panel.tsx for why embed_domain is
 * pinned rather than derived from window.location).
 *
 * `CalendlyWarmup` renders one invisible, inert copy of the scheduler iframe
 * on non-/book routes once the route's entrance gate has cleared and the main
 * thread is idle. Calendly's widget shell (HTML, JS, CSS, fonts, availability
 * API) is then already in the HTTP cache when the visitor scrolls to the real
 * scheduler or follows a "Book a discovery call" CTA to /book#booking-calendar,
 * so the visible embed paints near-instantly instead of loading from cold.
 * It renders nothing on /book itself — the real panel owns the embed there,
 * and a second live iframe would double-fire Calendly's postMessage height
 * reports at the visible pane.
 */
import { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { useAppExperience } from "~/app/experience/app-experience";

export const CALENDLY_ORIGIN = "https://calendly.com";

/**
 * Calendly only honours its embed params (background_color, hide_gdpr_banner,
 * …) when the URL identifies itself as an inline embed via embed_domain +
 * embed_type, so both are always present. embed_domain is pinned to the
 * production domain rather than read from window.location: Calendly uses it
 * for analytics, not validation, and a runtime-derived value diverges from
 * the prerendered HTML on any non-production host, tripping a hydration
 * mismatch on the iframe src.
 */
/*
 * Calendly's custom `primary_color` currently produces tone-on-tone available
 * day circles for non-default colours (the day number and solid circle are
 * neighbouring shades of the same custom colour). Leave its accessible
 * high-contrast light calendar theme intact here; the booking panel stylesheet applies a
 * colour-only hue grade to the iframe so the proven contrast is preserved
 * while the blue accent becomes Silverstone cyan. White and silver remain
 * unchanged by that grade.
 */
export const CALENDLY_URL = `${CALENDLY_ORIGIN}/silverstone-ai/30min?embed_domain=silverstone-ai.com&embed_type=Inline&hide_landing_page_details=1&hide_event_type_details=1&hide_gdpr_banner=1`;

export function CalendlyWarmup() {
  const location = useLocation();
  const { headerHidden } = useAppExperience();
  const [warmed, setWarmed] = useState(false);

  useEffect(() => {
    if (warmed || headerHidden) {
      return undefined;
    }
    // Wait for genuine idle time so the warm-up never competes with the
    // route's own entrance work; Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(() => setWarmed(true), {
        timeout: 6000,
      });
      return () => window.cancelIdleCallback(handle);
    }
    const timer = window.setTimeout(() => setWarmed(true), 2500);
    return () => window.clearTimeout(timer);
  }, [headerHidden, warmed]);

  if (!warmed || location.pathname === "/book") {
    return null;
  }

  return (
    <iframe
      title="Calendly scheduler preload"
      src={CALENDLY_URL}
      aria-hidden="true"
      tabIndex={-1}
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        border: 0,
        clipPath: "inset(50%)",
        overflow: "hidden",
        pointerEvents: "none",
        opacity: 0,
      }}
    />
  );
}
