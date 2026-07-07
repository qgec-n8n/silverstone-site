/**
 * Booking panel for /book. Embeds the repository's real production Calendly
 * destination (the same URL referenced in the approved content registry's
 * book interaction) directly in-page via iframe — no external tab, no
 * fabricated calendar-grid mockup with invented "available" days.
 *
 * Calendly's own booking surface is white and can't be restyled from
 * outside, so instead of fighting it the scheduler is presented as a
 * deliberate "screen": a white pane set into the dark card behind a
 * luminous cyan→violet ring, with a console rail above it and the
 * light-theme embed params matching the pane so widget and pane read as
 * one seamless sheet — no grey frame, no box-in-a-box.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { CalendarCheck, MessageSquare } from "~/components/icons/lucide";
import { OrbitalLoader } from "~/components/ui/orbital-loader";
import { Reveal } from "~/features/services-v2/components/primitives";

/**
 * Calendly only honours its embed params (background_color, hide_gdpr_banner,
 * …) when the URL identifies itself as an inline embed via embed_domain +
 * embed_type, so both are always present. embed_domain is pinned to the
 * production domain rather than read from window.location: Calendly uses it
 * for analytics, not validation, and a runtime-derived value diverges from
 * the prerendered HTML on any non-production host, tripping a hydration
 * mismatch on the iframe src.
 */
const CALENDLY_URL = `https://calendly.com/silverstone-ai/30min?embed_domain=silverstone-ai.com&embed_type=Inline&hide_landing_page_details=1&hide_event_type_details=1&hide_gdpr_banner=1&primary_color=0891b2&text_color=0b1220&background_color=ffffff`;

/**
 * Calendly reports its internal page height via `calendly.page_height`
 * postMessage events — one per step (event view → time picker → details
 * form), each a different height. The pane tracks those reports so the white
 * sheet always fits the current Calendly page exactly: no dead white space,
 * no internal scrollbar. During load Calendly emits bogus 2–26px reports, so
 * anything under the floor is ignored; the ceiling guards against a
 * malformed report stretching the page.
 */
const CALENDLY_ORIGIN = "https://calendly.com";
const MIN_FRAME_HEIGHT = 480;
const MAX_FRAME_HEIGHT = 1600;

function useCalendlyFrameHeight(): number | null {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== CALENDLY_ORIGIN) {
        return;
      }
      const data: unknown = event.data;
      if (
        typeof data !== "object" ||
        data === null ||
        (data as { event?: unknown }).event !== "calendly.page_height"
      ) {
        return;
      }
      const raw = (data as { payload?: { height?: unknown } }).payload?.height;
      const parsed = typeof raw === "string" ? Number.parseInt(raw, 10) : NaN;
      if (Number.isNaN(parsed) || parsed < MIN_FRAME_HEIGHT) {
        return;
      }
      setHeight(Math.min(parsed, MAX_FRAME_HEIGHT));
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return height;
}

export function BookingPanel() {
  const [loaded, setLoaded] = useState(false);
  const frameHeight = useCalendlyFrameHeight();

  return (
    <div className="ss-core-booking ss-srv2-beam-border" id="booking-calendar">
      <Reveal kind="section">
        <div className="ss-core-booking__body">
          <span className="ss-srv2-bench__tag">
            <CalendarCheck aria-hidden="true" />
            30-minute discovery call
            <span className="ss-core-booking__live" aria-hidden="true">
              <span className="ss-core-booking__live-dot" />
              Live
            </span>
          </span>
          <h3>Choose a time that works for you</h3>
          <p>
            The scheduler is embedded directly on this page — no new tab, no separate
            sign-in. Bring one process, journey or digital decision — no technical
            preparation required.
          </p>
        </div>
      </Reveal>
      <Reveal kind="section" delayMs={120}>
        <div className="ss-core-booking__console">
          <div className="ss-core-booking__rail" aria-hidden="true">
            <span className="ss-core-booking__rail-label">
              Secure scheduler · Calendly
            </span>
            <span className="ss-core-booking__rail-track" />
            <span className="ss-core-booking__rail-dots">
              <span />
              <span />
              <span />
            </span>
          </div>
          <div
            className="ss-core-booking__frame"
            data-loaded={loaded}
            aria-busy={!loaded}
            style={
              frameHeight !== null
                ? // +2px covers the 1px luminous ring padding top and bottom.
                  { height: `${String(frameHeight + 2)}px` }
                : undefined
            }
          >
            {!loaded ? (
              <div className="ss-core-booking__loading" role="status">
                <OrbitalLoader
                  message="Loading your scheduler…"
                  className="h-10 w-10"
                />
              </div>
            ) : null}
            <iframe
              title="Book a 30-minute discovery call with Silverstone AI on Calendly"
              src={CALENDLY_URL}
              loading="eager"
              onLoad={() => setLoaded(true)}
            />
          </div>
        </div>
      </Reveal>
      <Reveal kind="section" delayMs={200}>
        <div className="ss-core-booking__footer">
          <p className="ss-core-booking__footer-note">
            Rather talk it through in writing first?
          </p>
          <Link
            className="ss-srv2-btn ss-srv2-btn--ghost ss-srv2-beam-border ss-core-booking__contact-btn"
            to="/contact#contact-form"
          >
            <MessageSquare aria-hidden="true" />
            Contact instead
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
