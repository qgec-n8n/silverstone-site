/**
 * Seven-Day Booking Conversion Sprint — the offer banner and its expanded
 * section.
 *
 * Visual concept: **Intake Board**. Not another glass island — this is the one
 * element on the page allowed to read as instrumentation: a void-black band
 * ruled off with an animated accent rim, corner ticks borrowed from the
 * signature chrome, a live capacity light, and a segmented mono clock in its
 * own bezel. It sits after the route's trust strip and operating-principle
 * pills, directly before the live client build, and it is deliberately the
 * loudest promotional surface near the top of the page.
 *
 * HONESTY CONTRACT — the clock counts to the end of *this week's intake*, a
 * recurring capacity window, not to an expiring price. It resets every week
 * and the offer does not change when it does. `windowNote` states that in
 * plain, always-visible text directly beneath the digits, so the countdown can
 * never be read as a fake deadline. Nothing here claims the price rises, the
 * offer withdraws, or that a fixed number of slots remain.
 *
 * CRAWLABILITY — every commercial fact (name, price, payment split, six
 * deliverables, guarantee sentence, both CTAs) is plain prerendered HTML. Only
 * the four digit groups are client-only, and they are `aria-hidden` decoration
 * layered on top of the text that already says the same thing. The server and
 * the first client render emit identical placeholder glyphs, so the ticking
 * clock can never produce a hydration mismatch.
 */
import { useEffect, useState } from "react";

import {
  CalendarClock,
  Check,
  Clock,
  Gauge,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
  type LucideIcon,
} from "~/components/icons/lucide";

import {
  BorderBeam,
  PanelReveal,
  Reveal,
  RichText,
  SectionHead,
  ServiceButton,
} from "~/features/services-v2/components/primitives";
import type { SprintOffer } from "../content/types";
import { Money } from "~/components/ui/money";

/** The site's single booking destination, shared with every other page CTA. */
const BOOKING_HREF = "/book#booking-calendar";

const DELIVERABLE_ICONS: LucideIcon[] = [
  Sparkles,
  Smartphone,
  Zap,
  Send,
  Gauge,
  CalendarClock,
];

/* ---- Weekly intake clock ------------------------------------------------ */

/*
 * Wall-clock arithmetic in Europe/London rather than UTC offsets, so British
 * Summer Time needs no special case: we ask Intl what the London clock says,
 * then measure how far that is from Friday 23:59:59 on the same clock. Because
 * every tick re-reads the real time instead of decrementing a counter, a
 * throttled background tab, a sleeping laptop or a DST change can never leave
 * the display drifting — it is simply correct again on the next tick.
 */
const LONDON_CLOCK = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const WEEKDAY_INDEX: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

const WEEK_SECONDS = 7 * 24 * 60 * 60;
/** Friday 23:59:59, as seconds elapsed into a Monday-start week. */
const DEADLINE_SECONDS = 4 * 86_400 + 23 * 3_600 + 59 * 60 + 59;

function secondsUntilIntakeCloses(now: Date): number {
  const parts = LONDON_CLOCK.formatToParts(now);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const day = WEEKDAY_INDEX[read("weekday")] ?? 0;
  const elapsed =
    day * 86_400 +
    Number(read("hour")) * 3_600 +
    Number(read("minute")) * 60 +
    Number(read("second"));

  const remaining = DEADLINE_SECONDS - elapsed;
  // Past this week's cut-off, the clock already belongs to next week's intake,
  // so it rolls forward rather than ever resting on a dead 00:00:00.
  return remaining > 0 ? remaining : remaining + WEEK_SECONDS;
}

type ClockCell = { key: string; label: string; value: string };

const PLACEHOLDER_CELLS: ClockCell[] = [
  { key: "days", label: "Days", value: "--" },
  { key: "hours", label: "Hrs", value: "--" },
  { key: "minutes", label: "Min", value: "--" },
  { key: "seconds", label: "Sec", value: "--" },
];

const pad = (value: number) => String(value).padStart(2, "0");

function cellsFor(remaining: number): ClockCell[] {
  return [
    { key: "days", label: "Days", value: pad(Math.floor(remaining / 86_400)) },
    {
      key: "hours",
      label: "Hrs",
      value: pad(Math.floor((remaining % 86_400) / 3_600)),
    },
    {
      key: "minutes",
      label: "Min",
      value: pad(Math.floor((remaining % 3_600) / 60)),
    },
    { key: "seconds", label: "Sec", value: pad(remaining % 60) },
  ];
}

/**
 * Isolated so the once-a-second state change re-renders four digit spans and
 * nothing else — the banner's copy, buttons and reveals are all outside it.
 */
function IntakeClock() {
  const [cells, setCells] = useState<ClockCell[]>(PLACEHOLDER_CELLS);

  useEffect(() => {
    const tick = () => {
      setCells(cellsFor(secondsUntilIntakeCloses(new Date())));
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    // A background tab's interval is throttled to seconds or minutes, so catch
    // the display up the instant the tab is looked at again.
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);

  return (
    <div className="ss-ind2-sprint__clock" aria-hidden="true">
      {cells.map((cell) => (
        <div className="ss-ind2-sprint__clock-cell" key={cell.key}>
          <span className="ss-ind2-sprint__clock-value">{cell.value}</span>
          <span className="ss-ind2-sprint__clock-label">{cell.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---- Banner ------------------------------------------------------------- */

export function SprintBanner({
  sprint,
  route,
}: {
  sprint: SprintOffer;
  /** The page's own path — the detail CTA is a full `path#id` deep link. */
  route: string;
}) {
  const titleId = `${sprint.id}-banner-title`;

  return (
    <section className="ss-ind2-sprint-banner" aria-labelledby={titleId}>
      <div className="ss-srv2__container">
        <PanelReveal className="ss-ind2-sprint__board">
          <div className="ss-ind2-sprint__grid">
            <div className="ss-ind2-sprint__offer">
              <Reveal kind="pill">
                <p className="ss-ind2-sprint__capacity">
                  <span className="ss-ind2-sprint__pulse" aria-hidden="true" />
                  {sprint.capacity}
                </p>
              </Reveal>

              <Reveal kind="section" delayMs={110}>
                <h2 className="ss-ind2-sprint__title" id={titleId}>
                  {sprint.name}
                </h2>
              </Reveal>

              <Reveal kind="metric" delayMs={200}>
                <p className="ss-ind2-sprint__price">
                  <span className="ss-ind2-sprint__price-figure">
                    <Money text={sprint.price} />
                  </span>
                  <span className="ss-ind2-sprint__price-note">
                    <Money text={sprint.priceNote} />
                  </span>
                </p>
              </Reveal>

              <Reveal kind="section" delayMs={280}>
                <p className="ss-ind2-sprint__body">
                  <RichText text={sprint.bannerBody} />
                </p>
              </Reveal>

              <Reveal kind="cta" delayMs={380}>
                <div className="ss-ind2-sprint__actions">
                  <ServiceButton href={BOOKING_HREF} variant="primary">
                    {sprint.bannerCtaLabel}
                  </ServiceButton>
                  {/* Jump to the full offer, so a visitor who wants the detail
                      before the diary never has to leave. Routed as a full
                      `path#id` Link rather than a bare `#id` anchor: only a
                      router navigation reaches DeepLinkScrollHandler, which
                      owns the shared header-offset landing behavior. */}
                  <ServiceButton href={`${route}#${sprint.id}`} variant="ghost">
                    {sprint.bannerDetailLabel}
                  </ServiceButton>
                </div>
              </Reveal>
            </div>

            <Reveal kind="card" className="ss-ind2-sprint__clock-col" delayMs={220}>
              <div className="ss-ind2-sprint__clock-frame">
                <p className="ss-ind2-sprint__clock-head">
                  <Clock aria-hidden="true" />
                  This week&rsquo;s intake closes
                </p>
                <IntakeClock />
                {/* The countdown is decoration layered over this sentence, not
                    a substitute for it: the honest terms are always in text. */}
                <p className="ss-ind2-sprint__clock-note">{sprint.windowNote}</p>
              </div>
            </Reveal>
          </div>
          <BorderBeam />
        </PanelReveal>
      </div>
    </section>
  );
}

/* ---- Full offer section ------------------------------------------------- */

export function SprintPanel({ sprint }: { sprint: SprintOffer }) {
  return (
    <section className="ss-srv2-section" aria-labelledby={`${sprint.id}-heading`}>
      <div className="ss-srv2__container" id={sprint.id}>
        <SectionHead
          eyebrow={sprint.section.eyebrow}
          icon={CalendarClock}
          heading={sprint.section.heading}
          headingId={`${sprint.id}-heading`}
          lead={sprint.section.lead}
        />

        {/* Delivery window first: it is the promise the six deliverables are
            measured against, so it frames them rather than following them. */}
        {/* The Reveal is nested inside each <li> rather than around it: it
            renders a <div>, which an <ol> may not contain directly. */}
        <ol
          className="ss-ind2-sprint-track"
          aria-label="Seven business-day delivery track"
        >
          {sprint.dayTrack.map((stage, index) => (
            <li
              className="ss-ind2-sprint-track__cell"
              key={stage.day}
              data-last={index === sprint.dayTrack.length - 1 ? "true" : "false"}
            >
              <Reveal
                kind="card"
                delayMs={index * 70}
                className="ss-ind2-sprint-track__stage"
              >
                <span className="ss-ind2-sprint-track__node" aria-hidden="true" />
                <span className="ss-ind2-sprint-track__day">{stage.day}</span>
                <span className="ss-ind2-sprint-track__label">{stage.label}</span>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="ss-ind2-sprint-body">
          <div className="ss-ind2-sprint-deliverables">
            {sprint.deliverables.map((item, index) => {
              const Icon = DELIVERABLE_ICONS[index] ?? Check;
              return (
                <Reveal key={item.title} kind="card" delayMs={index * 80}>
                  <article className="ss-ind2-sprint-deliverable">
                    <span
                      className="ss-ind2-sprint-deliverable__mark"
                      aria-hidden="true"
                    >
                      {pad(index + 1)}
                    </span>
                    <Icon
                      aria-hidden="true"
                      className="ss-ind2-sprint-deliverable__icon"
                    />
                    <h3 className="ss-ind2-sprint-deliverable__title">{item.title}</h3>
                    <p className="ss-ind2-sprint-deliverable__body">
                      <RichText text={item.body} />
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>

          <aside className="ss-ind2-sprint-terms-wrap" aria-label="Price and terms">
            <PanelReveal className="ss-ind2-sprint-terms">
              <Reveal kind="card">
                <div className="ss-ind2-sprint-terms__price">
                  <span className="ss-ind2-sprint-terms__figure">
                    <Money text={sprint.price} />
                  </span>
                  <span className="ss-ind2-sprint-terms__figure-label">
                    Fixed, for the six deliverables
                  </span>
                </div>
              </Reveal>

              <ol className="ss-ind2-sprint-terms__ladder">
                {sprint.payments.map((payment, index) => (
                  <li className="ss-ind2-sprint-terms__cell" key={payment.when}>
                    <Reveal
                      kind="section"
                      delayMs={120 + index * 90}
                      className="ss-ind2-sprint-terms__rung"
                    >
                      <span className="ss-ind2-sprint-terms__amount">
                        <Money text={payment.amount} />
                      </span>
                      <span className="ss-ind2-sprint-terms__when">{payment.when}</span>
                      <span className="ss-ind2-sprint-terms__note">{payment.note}</span>
                    </Reveal>
                  </li>
                ))}
              </ol>

              {/* Rendered verbatim: this is the exact sentence quoted on calls. */}
              <Reveal kind="card" delayMs={420}>
                <div className="ss-ind2-sprint-terms__guarantee">
                  <p className="ss-ind2-sprint-terms__guarantee-tag">
                    <ShieldCheck aria-hidden="true" />
                    The guarantee
                  </p>
                  <blockquote className="ss-ind2-sprint-terms__guarantee-quote">
                    {sprint.guarantee}
                  </blockquote>
                  <p className="ss-ind2-sprint-terms__guarantee-note">
                    {sprint.guaranteeNote}
                  </p>
                </div>
              </Reveal>
            </PanelReveal>
          </aside>
        </div>

        <Reveal kind="cta" delayMs={200}>
          <div className="ss-ind2-sprint-close">
            <ServiceButton href={BOOKING_HREF} variant="primary">
              {sprint.ctaLabel}
            </ServiceButton>
            <p className="ss-ind2-sprint-close__reassurance">
              <RichText text={sprint.reassurance} />
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
