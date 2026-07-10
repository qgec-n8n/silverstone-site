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
 *
 * The console rail carries a live three-step trace (Time → Details →
 * Confirmed) driven by Calendly's own postMessage interaction events
 * (`calendly.date_and_time_selected`, `calendly.event_scheduled`), so the
 * dark chrome visibly responds to what happens inside the white sheet.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { CalendarCheck, MessageSquare } from "~/components/icons/lucide";
import { OrbitalLoader } from "~/components/ui/orbital-loader";
import { CALENDLY_ORIGIN, CALENDLY_URL } from "~/features/core-pages/calendly";
import { BorderBeam } from "~/features/services-v2/components/primitives";

/**
 * Calendly reports its internal page height via `calendly.page_height`
 * postMessage events — one per step (event view → time picker → details
 * form), each a different height. The pane tracks those reports so the white
 * sheet always fits the current Calendly page exactly: no dead white space,
 * no internal scrollbar. During load Calendly emits bogus 2–26px reports, so
 * anything under the floor is ignored; the ceiling guards against a
 * malformed report stretching the page.
 */
const MIN_FRAME_HEIGHT = 480;
const MAX_FRAME_HEIGHT = 1600;

type BookingStage = "time" | "details" | "confirmed";

const BOOKING_STEPS: { id: BookingStage; label: string }[] = [
  { id: "time", label: "Time" },
  { id: "details", label: "Details" },
  { id: "confirmed", label: "Confirmed" },
];

const STAGE_ORDER: Record<BookingStage, number> = {
  time: 0,
  details: 1,
  confirmed: 2,
};

function parseCalendlyEvent(event: MessageEvent): string | null {
  if (event.origin !== CALENDLY_ORIGIN) {
    return null;
  }
  const data: unknown = event.data;
  if (typeof data !== "object" || data === null) {
    return null;
  }
  const name = (data as { event?: unknown }).event;
  return typeof name === "string" ? name : null;
}

function useCalendlyFrameHeight(): number | null {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (parseCalendlyEvent(event) !== "calendly.page_height") {
        return;
      }
      const raw = (event.data as { payload?: { height?: unknown } }).payload?.height;
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

/**
 * Live booking stage, advanced by Calendly's interaction events. Only ever
 * moves forward — Calendly re-emits view events when the visitor pages back,
 * but a locked-in time shouldn't visually regress the trace, and a completed
 * booking is terminal.
 */
function useBookingStage(): BookingStage {
  const [stage, setStage] = useState<BookingStage>("time");

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const name = parseCalendlyEvent(event);
      if (name === "calendly.date_and_time_selected") {
        setStage((current) => (current === "confirmed" ? current : "details"));
      } else if (name === "calendly.event_scheduled") {
        setStage("confirmed");
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return stage;
}

export function BookingPanel() {
  const [loaded, setLoaded] = useState(false);
  const frameHeight = useCalendlyFrameHeight();
  const stage = useBookingStage();

  return (
    <div
      className="ss-core-booking ss-srv2-beam-border"
      id="booking-calendar"
      data-stage={stage}
    >
      {/* The booking surface never plays an entrance: visitors are sent here
          by explicit "book a call" CTAs, so the calendar must simply be
          present the instant the page is — no reveal choreography, ever. */}
      <div>
        <div className="ss-core-booking__body">
          <span className="ss-srv2-bench__tag">
            <CalendarCheck aria-hidden="true" />
            30-minute discovery call
            <span className="ss-core-booking__live" aria-hidden="true">
              <span className="ss-core-booking__live-dot" />
              {stage === "confirmed" ? "Booked" : "Live"}
            </span>
          </span>
          <h3>
            Choose a time that <em>works for you</em>
          </h3>
          <p>
            The scheduler is embedded directly on this page — no new tab, no separate
            sign-in. Bring one process, journey or digital decision — no technical
            preparation required.
          </p>
        </div>
      </div>
      <div>
        <div className="ss-core-booking__console">
          <div className="ss-core-booking__rail" aria-hidden="true">
            <span className="ss-core-booking__rail-label">
              {stage === "confirmed"
                ? "Booking confirmed · Calendly"
                : "Secure scheduler · Calendly"}
            </span>
            <span className="ss-core-booking__rail-track" />
            <ol className="ss-core-booking__steps">
              {BOOKING_STEPS.map((step, index) => {
                const state =
                  STAGE_ORDER[stage] > index
                    ? "done"
                    : STAGE_ORDER[stage] === index
                      ? "current"
                      : "ahead";
                return (
                  <li key={step.id} data-state={state}>
                    <span className="ss-core-booking__step-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {step.label}
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="sr-only" aria-live="polite">
            {stage === "confirmed"
              ? "Booking confirmed. A calendar invite is on its way to your inbox."
              : stage === "details"
                ? "Time selected. Enter your details to confirm the call."
                : "Choose an available time in the scheduler."}
          </p>
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
      </div>
      <div>
        <div className="ss-core-booking__footer">
          <p className="ss-core-booking__footer-note">
            {stage === "confirmed"
              ? "Calendar invite sent — check your inbox for the confirmation."
              : "Rather talk it through in writing first?"}
          </p>
          <Link
            className="ss-srv2-btn ss-srv2-btn--ghost ss-srv2-beam-border ss-core-booking__contact-btn"
            to="/contact#contact-form"
          >
            <MessageSquare aria-hidden="true" />
            Contact instead
            <BorderBeam />
          </Link>
        </div>
      </div>
      <BorderBeam />
    </div>
  );
}
