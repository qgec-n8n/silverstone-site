/**
 * Booking panel for /book. Embeds the repository's real production Calendly
 * destination (the same URL referenced in the approved content registry's
 * book interaction) directly in-page via iframe — no external tab, no
 * fabricated calendar-grid mockup with invented "available" days. Colour
 * params mirror the site's own dark/cyan theme so the embed reads as part of
 * the page rather than a bolted-on third-party widget.
 */
import { useState } from "react";

import { ArrowUpRight, CalendarCheck } from "~/components/icons/lucide";
import { OrbitalLoader } from "~/components/ui/orbital-loader";
import { Reveal } from "~/features/services-v2/components/primitives";

const CALENDLY_URL =
  "https://calendly.com/silverstone-ai/30min?hide_landing_page_details=1&hide_event_type_details=1&primary_color=22d3ee&text_color=e9eaef&background_color=05070a";

export function BookingPanel() {
  const [loaded, setLoaded] = useState(false);

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
        <div
          className="ss-core-booking__frame"
          data-loaded={loaded}
          aria-busy={!loaded}
        >
          {!loaded ? (
            <div className="ss-core-booking__loading" role="status">
              <OrbitalLoader message="Loading your scheduler…" className="h-10 w-10" />
            </div>
          ) : null}
          <iframe
            title="Book a 30-minute discovery call with Silverstone AI on Calendly"
            src={CALENDLY_URL}
            loading="lazy"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </Reveal>
      <Reveal kind="section" delayMs={200}>
        <div className="ss-core-form__actions">
          <a
            className="ss-srv2-btn ss-srv2-btn--ghost"
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in a new tab <ArrowUpRight aria-hidden="true" />
          </a>
          <a className="ss-srv2-btn ss-srv2-btn--ghost" href="/contact">
            Contact instead
          </a>
        </div>
        <p className="ss-core-booking__target">calendly.com/silverstone-ai</p>
      </Reveal>
    </div>
  );
}
