/**
 * Shared services-v2 section components. Every component is fed structured,
 * approved copy — no raw markdown, no authoring labels. The benchmark console
 * labels figures as verified Silverstone AI performance and preserves every
 * supplied value exactly.
 */
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link } from "react-router";

import {
  ArrowUpRight,
  ChevronDown,
  ShieldCheck,
  type LucideIcon,
} from "~/components/icons/lucide";
import type { ApprovedCopyCard } from "~/content/services/approved-services";
import { hasWebpSibling, webpSource } from "~/lib/image-sources";

import type { FaqItem } from "../content/service-content";
import type { RouteArt } from "../content/route-art";
import {
  AnimatedMetricValue,
  BorderBeam,
  PanelReveal,
  Prose,
  Reveal,
  RichText,
  ServiceButton,
  splitMetric,
} from "./primitives";

/* ---- Responsive figure -------------------------------------------------- */

export function ServiceFigure({ image }: { image: RouteArt["image"] }) {
  const optimizedDesktop = hasWebpSibling(image.desktop)
    ? webpSource(image.desktop)
    : image.desktop;

  return (
    <figure className="ss-srv2-figure">
      <picture>
        {hasWebpSibling(image.mobile) ? (
          <source
            media="(max-width: 767px)"
            srcSet={webpSource(image.mobile)}
            type="image/webp"
          />
        ) : null}
        <source media="(max-width: 767px)" srcSet={image.mobile} />
        {hasWebpSibling(image.desktop) ? (
          <>
            <source srcSet={optimizedDesktop} type="image/webp" />
            <source srcSet={image.desktop} />
          </>
        ) : null}
        <img
          src={optimizedDesktop}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
        />
      </picture>
    </figure>
  );
}

/* ---- Capability / outcome cards ---------------------------------------- */

export function ServiceCards({
  cards,
  icons,
  columns,
}: {
  cards: ApprovedCopyCard[];
  icons: LucideIcon[];
  columns: 3 | 4;
}) {
  return (
    <div className="ss-srv2-cards" data-columns={columns}>
      {cards.map((card, index) => {
        const Icon = icons[index % icons.length];
        return (
          <Reveal
            key={card.label}
            kind="card"
            delayMs={index * 120}
            className="ss-srv2-card"
          >
            <span className="ss-srv2-card__icon">
              {Icon ? <Icon aria-hidden="true" /> : null}
            </span>
            <h3 className="ss-srv2-card__title">{card.label}</h3>
            <p className="ss-srv2-card__body">
              <RichText text={card.body} />
            </p>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ---- Benchmark console -------------------------------------------------- */

export function BenchmarkConsole({
  metrics,
  caption,
  attribution = "Verified Silverstone AI performance",
  clarification = "Results vary by scope, data quality, implementation and operating environment.",
}: {
  metrics: string[];
  caption: string;
  attribution?: string;
  clarification?: string;
}) {
  return (
    <PanelReveal className="ss-srv2-bench ss-srv2-beam-border">
      <Reveal kind="pill">
        <span className="ss-srv2-bench__tag">
          <ShieldCheck aria-hidden="true" />
          {attribution}
        </span>
      </Reveal>
      <div className="ss-srv2-bench__grid" data-count={metrics.length}>
        {metrics.map((metric, index) => {
          const { value, label } = splitMetric(metric);
          const valueLength = Array.from(value).length;
          const valueSize =
            valueLength >= 11 ? "long" : valueLength >= 8 ? "medium" : "short";
          return (
            <Reveal key={metric} kind="metric" delayMs={150 + index * 110}>
              <div className="ss-srv2-metric" data-value-size={valueSize}>
                <span className="ss-srv2-metric__value">
                  <AnimatedMetricValue value={value} />
                </span>
                {label ? <span className="ss-srv2-metric__label">{label}</span> : null}
              </div>
            </Reveal>
          );
        })}
      </div>
      <Reveal kind="section" delayMs={150 + metrics.length * 110 + 100}>
        <p className="ss-srv2-bench__caption">{caption}</p>
      </Reveal>
      <Reveal kind="section" delayMs={150 + metrics.length * 110 + 200}>
        <p className="ss-srv2-bench__disclaimer">{clarification}</p>
      </Reveal>
      <BorderBeam />
    </PanelReveal>
  );
}

/* ---- Process track ------------------------------------------------------ */

export function ProcessTrack({ steps }: { steps: ApprovedCopyCard[] }) {
  return (
    <div className="ss-srv2-process" data-count={steps.length}>
      {steps.map((step, index) => (
        <Reveal
          key={step.label}
          kind="card"
          delayMs={index * 130}
          className="ss-srv2-step"
        >
          <span className="ss-srv2-step__index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="ss-srv2-step__title">{step.label}</h3>
          <p className="ss-srv2-step__body">
            <RichText text={step.body} />
          </p>
        </Reveal>
      ))}
    </div>
  );
}

/* ---- FAQ ---------------------------------------------------------------- */

/**
 * Hand-built rather than the shared Radix `Accordion`, for the same reason
 * `/pricing` is (see `features/core-pages/pricing/pricing-faq.tsx`): Radix
 * unmounts a closed panel, so the answers never reached the prerendered HTML.
 * Every service and industry page renders this panel, which left 76 answers
 * invisible to search and AI crawlers and made the FAQ ineligible for FAQPage
 * structured data — Google requires the marked-up answer to be present and to
 * match visible copy.
 *
 * Answers are therefore always in the document and merely collapsed by CSS
 * (`grid-template-rows: 0fr → 1fr`), with `inert` keeping closed panels out of
 * the accessibility tree and off the tab order.
 *
 * Interaction parity with the Radix implementation it replaces: real buttons
 * with `aria-expanded`/`aria-controls`, one open item at a time, collapsible,
 * and Arrow/Home/End roving between triggers.
 */
export function FaqPanel({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTrigger = (index: number) => {
    const target = (index + items.length) % items.length;
    triggers.current[target]?.focus();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusTrigger(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusTrigger(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTrigger(0);
        break;
      case "End":
        event.preventDefault();
        focusTrigger(items.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="ss-srv2-faq">
      {items.map((item, index) => {
        const open = openIndex === index;
        const triggerId = `srv2-faq-trigger-${String(index)}`;
        const panelId = `srv2-faq-panel-${String(index)}`;

        return (
          <Reveal key={item.question} kind="section" delayMs={index * 90}>
            <div className="ss-srv2-faq__item" data-state={open ? "open" : "closed"}>
              <h3 className="ss-srv2-faq__heading">
                <button
                  aria-controls={panelId}
                  aria-expanded={open}
                  className="ss-srv2-faq__trigger"
                  id={triggerId}
                  onClick={() => {
                    setOpenIndex(open ? null : index);
                  }}
                  onKeyDown={(event) => {
                    onTriggerKeyDown(event, index);
                  }}
                  ref={(node) => {
                    triggers.current[index] = node;
                  }}
                  type="button"
                >
                  <span>{item.question}</span>
                  <ChevronDown aria-hidden="true" className="ss-srv2-faq__chevron" />
                </button>
              </h3>

              <div
                aria-labelledby={triggerId}
                className="ss-srv2-faq__panel"
                id={panelId}
                inert={!open}
                role="region"
              >
                <div className="ss-srv2-faq__panel-inner">
                  {item.answer.map((paragraph, answerIndex) => (
                    <p key={answerIndex}>
                      <RichText text={paragraph} />
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ---- Final CTA ---------------------------------------------------------- */

export function FinalCta({
  heading,
  body,
  reassurance,
  buttonLabel,
  bookHref = "/book#booking-calendar",
}: {
  heading: string;
  body: ReactNode;
  reassurance?: string;
  buttonLabel: string;
  bookHref?: string;
}) {
  return (
    <PanelReveal className="ss-srv2-cta">
      <Reveal kind="section">
        <h2 className="ss-srv2-cta__title">
          <RichText text={heading} />
        </h2>
      </Reveal>
      <Reveal kind="section" delayMs={130}>
        <div className="ss-srv2-cta__body">{body}</div>
      </Reveal>
      <Reveal kind="cta" delayMs={280}>
        <ServiceButton href={bookHref} variant="primary">
          {buttonLabel}
        </ServiceButton>
      </Reveal>
      {reassurance ? (
        <Reveal kind="section" delayMs={380}>
          <p className="ss-srv2-cta__reassurance">{reassurance}</p>
        </Reveal>
      ) : null}
    </PanelReveal>
  );
}

/* ---- Related rail ------------------------------------------------------- */

export type RelatedLink = { href: string; label: string; title: string };

export function RelatedRail({ links }: { links: RelatedLink[] }) {
  return (
    <div className="ss-srv2-related">
      {links.map((link, index) => (
        <Reveal key={link.href} kind="card" delayMs={index * 120}>
          <Link className="ss-srv2-related__card" to={link.href}>
            <span className="ss-srv2-related__label">{link.label}</span>
            <span className="ss-srv2-related__title">
              {link.title}
              <ArrowUpRight aria-hidden="true" />
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

/** Small helper for measured prose blocks within a composition. */
export function ProseBlock({ paragraphs }: { paragraphs: string[] }) {
  return <Prose paragraphs={paragraphs} />;
}
