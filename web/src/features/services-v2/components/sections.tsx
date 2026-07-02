/**
 * Shared services-v2 section components. Every component is fed structured,
 * approved copy — no raw markdown, no authoring labels. The benchmark console
 * always renders the canonical disclaimer and labels figures as external
 * evidence, never as a Silverstone result.
 */
import type { ReactNode } from "react";

import { ArrowUpRight, ShieldCheck, type LucideIcon } from "~/components/icons/lucide";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import type { ApprovedCopyCard } from "~/content/services/approved-services";

import type { FaqItem } from "../content/service-content";
import type { RouteArt } from "../content/route-art";
import {
  AnimatedMetricValue,
  Prose,
  Reveal,
  RichText,
  ServiceButton,
  splitMetric,
} from "./primitives";

/* ---- Responsive figure -------------------------------------------------- */

export function ServiceFigure({ image }: { image: RouteArt["image"] }) {
  return (
    <figure className="ss-srv2-figure">
      <picture>
        <source media="(max-width: 767px)" srcSet={image.mobile} />
        <img
          src={image.desktop}
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
    <div className="ss-srv2-bench ss-srv2-beam-border">
      <Reveal kind="pill">
        <span className="ss-srv2-bench__tag">
          <ShieldCheck aria-hidden="true" />
          {attribution}
        </span>
      </Reveal>
      <div className="ss-srv2-bench__grid" data-count={metrics.length}>
        {metrics.map((metric, index) => {
          const { value, label } = splitMetric(metric);
          return (
            <Reveal key={metric} kind="metric" delayMs={150 + index * 110}>
              <div className="ss-srv2-metric">
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
    </div>
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

/* ---- FAQ (Radix Accordion — accessible, animated, answers in prerendered HTML) */

export function FaqPanel({ items }: { items: FaqItem[] }) {
  return (
    <Accordion type="single" collapsible className="ss-srv2-faq">
      {items.map((item, index) => (
        <Reveal key={item.question} kind="section" delayMs={index * 90}>
          <AccordionItem value={item.question} className="ss-srv2-faq__item">
            <AccordionTrigger className="ss-srv2-faq__trigger">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="ss-srv2-faq__panel-inner">
              {item.answer.map((paragraph, answerIndex) => (
                <p key={answerIndex}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Reveal>
      ))}
    </Accordion>
  );
}

/* ---- Final CTA ---------------------------------------------------------- */

export function FinalCta({
  heading,
  body,
  reassurance,
  buttonLabel,
  bookHref = "/book",
}: {
  heading: string;
  body: ReactNode;
  reassurance?: string;
  buttonLabel: string;
  bookHref?: string;
}) {
  return (
    <div className="ss-srv2-cta">
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
    </div>
  );
}

/* ---- Related rail ------------------------------------------------------- */

export type RelatedLink = { href: string; label: string; title: string };

export function RelatedRail({ links }: { links: RelatedLink[] }) {
  return (
    <div className="ss-srv2-related">
      {links.map((link, index) => (
        <Reveal key={link.href} kind="card" delayMs={index * 120}>
          <a className="ss-srv2-related__card" href={link.href}>
            <span className="ss-srv2-related__label">{link.label}</span>
            <span className="ss-srv2-related__title">
              {link.title}
              <ArrowUpRight aria-hidden="true" />
            </span>
          </a>
        </Reveal>
      ))}
    </div>
  );
}

/** Small helper for measured prose blocks within a composition. */
export function ProseBlock({ paragraphs }: { paragraphs: string[] }) {
  return <Prose paragraphs={paragraphs} />;
}
