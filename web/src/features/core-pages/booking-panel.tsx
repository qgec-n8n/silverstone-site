/**
 * Booking panel for /book. Uses the repository's real production Calendly
 * destination (the same URL referenced in the approved content registry's
 * book interaction) as a direct external link — not an embedded widget, and
 * not a fabricated calendar-grid mockup with invented "available" days.
 */
import { useState } from "react";

import { ArrowUpRight, CalendarCheck, CheckCircle2Icon } from "~/components/icons/lucide";
import { Reveal } from "~/features/services-v2/components/primitives";

const CALENDLY_URL =
  "https://calendly.com/silverstone-ai/30min?hide_landing_page_details=1&hide_event_type_details=1&primary_color=00FF9D";

export function BookingPanel() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="ss-core-booking ss-srv2-beam-border" id="booking-calendar">
      <Reveal kind="section">
        <div className="ss-core-booking__body">
          <span className="ss-srv2-bench__tag">
            <CalendarCheck aria-hidden="true" />
            30-minute discovery call
          </span>
          <h3>Choose a time that works for you</h3>
          <p>
            Calendly opens in a new tab so you can check it against your own calendar. Bring
            one process, journey or digital decision — no technical preparation required.
          </p>
          <div className="ss-core-form__actions">
            <a
              className="ss-srv2-btn ss-srv2-btn--primary"
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpened(true)}
            >
              Open Calendly <ArrowUpRight aria-hidden="true" />
            </a>
            <a className="ss-srv2-btn ss-srv2-btn--ghost" href="/contact">
              Contact instead
            </a>
          </div>
          <p className="ss-core-booking__target">calendly.com/silverstone-ai</p>
          <p className="ss-core-booking__confirm" role="status" aria-live="polite">
            {opened ? (
              <>
                <CheckCircle2Icon aria-hidden="true" />
                Opened in a new tab. Once you book, Calendly sends the confirmation straight to
                your inbox.
              </>
            ) : null}
          </p>
        </div>
      </Reveal>
    </div>
  );
}
