/**
 * Shared industries-v2 section components, layered on the services-v2
 * primitives so both families share one premium design language. Everything
 * here renders structured approved copy — no raw markdown blocks, no
 * authoring labels.
 */
import { useInView, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useRef, type ReactNode } from "react";

import {
  Check,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from "~/components/icons/lucide";
import { useRevealStart } from "~/motion/use-reveal-start";

import { Reveal, RichText } from "~/features/services-v2/components/primitives";
import type { IndustryCard, IndustryStage } from "../content/types";
import type { IndustryImage } from "../content/route-art";

const entranceEase = [0.22, 1, 0.36, 1] as const;

/**
 * Inline rich text with crawlable internal links: supports `[label](/path)`
 * markdown links plus the `**bold**`/`*italic*` subset handled by RichText.
 */
export function LinkedText({ text }: { text: string }): ReactNode {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(<RichText key={key++} text={text.slice(lastIndex, match.index)} />);
    }
    nodes.push(
      <a key={key++} className="ss-srv2-textlink" href={match[2]}>
        {match[1]}
      </a>,
    );
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(<RichText key={key++} text={text.slice(lastIndex)} />);
  }
  return nodes;
}

/**
 * Paragraphs with inline links, for the service-architecture sections. Each
 * paragraph reads as one connected node on a small system rail — the same
 * connector language as `JourneyRail` — rather than a plain stacked block of
 * prose, so "what plugs into what" reads at a glance.
 */
export function LinkedProse({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="ss-ind2-linkrail">
      {paragraphs.map((paragraph, index) => (
        <Reveal
          key={index}
          kind="section"
          delayMs={index * 140}
          className="ss-ind2-linkrail__row"
        >
          <span className="ss-ind2-linkrail__node" aria-hidden="true" />
          <p className="ss-ind2-linkrail__text">
            <LinkedText text={paragraph} />
          </p>
        </Reveal>
      ))}
    </div>
  );
}

/**
 * The industry journey rail: numbered stages on a drawn connector spine.
 * Each stage lands as its own beat — the connector segment draws in first,
 * then the node ignites and the copy settles beside it.
 */
export function JourneyRail({ stages }: { stages: IndustryStage[] }) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <ol className="ss-ind2-rail">
      {stages.map((stage, index) => {
        const content = (
          <>
            <span aria-hidden="true" className="ss-ind2-rail__line" />
            <span className="ss-ind2-rail__node" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="ss-ind2-rail__body">
              <h3 className="ss-ind2-rail__title">{stage.title}</h3>
              <p className="ss-ind2-rail__text">
                <RichText text={stage.body} />
              </p>
            </div>
          </>
        );
        if (reducedMotion) {
          return (
            <li className="ss-ind2-rail__stage" key={stage.title}>
              {content}
            </li>
          );
        }
        return (
          <JourneyRailStage key={stage.title} index={index}>
            {content}
          </JourneyRailStage>
        );
      })}
    </ol>
  );
}

function JourneyRailStage({ children, index }: { children: ReactNode; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, {
    amount: 0.5,
    margin: "0px 0px -12% 0px",
    once: true,
  });
  const start = useRevealStart(ref, inView, index * 160);
  const hidden = { opacity: 0, x: index % 2 === 0 ? -26 : 26 };

  return (
    <m.li
      ref={ref}
      className="ss-ind2-rail__stage"
      initial={hidden}
      animate={start !== null ? { opacity: 1, x: 0 } : hidden}
      transition={{
        delay: (start?.delayMs ?? 0) / 1000,
        duration: start?.instant ? 0 : 0.9 * (start?.durationScale ?? 1),
        ease: entranceEase,
      }}
    >
      {children}
    </m.li>
  );
}

/**
 * The human-judgement boundary: a two-tone console splitting what the system
 * prepares from what stays with people, with per-line staggered reveals.
 */
export function BoundaryPanel({
  body,
  keeps,
  keepsLabel = "Decided by your people, always",
}: {
  body: string;
  keeps: string[];
  keepsLabel?: string;
}) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div className="ss-ind2-boundary ss-srv2-beam-border">
      <Reveal kind="section" className="ss-ind2-boundary__col">
        <p className="ss-ind2-boundary__body">
          <RichText text={body} />
        </p>
      </Reveal>
      <div className="ss-ind2-boundary__col ss-ind2-boundary__col--keeps">
        <Reveal kind="pill">
          <span className="ss-ind2-boundary__tag">
            <UserCheck aria-hidden="true" />
            {keepsLabel}
          </span>
        </Reveal>
        <div className="ss-ind2-boundary__list" role="list" aria-label={keepsLabel}>
          {keeps.map((item, index) =>
            reducedMotion ? (
              <div className="ss-ind2-boundary__item" role="listitem" key={item}>
                <ShieldCheck aria-hidden="true" />
                <span>{item}</span>
              </div>
            ) : (
              <BoundaryKeepItem key={item} item={item} index={index} />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function BoundaryKeepItem({ item, index }: { item: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    amount: 0.6,
    margin: "0px 0px -10% 0px",
    once: true,
  });
  const start = useRevealStart(ref, inView, 120 + index * 130);

  return (
    <m.div
      ref={ref}
      className="ss-ind2-boundary__item"
      role="listitem"
      initial={{ opacity: 0, y: 18 }}
      animate={start !== null ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{
        delay: (start?.delayMs ?? 0) / 1000,
        duration: start?.instant ? 0 : 0.7 * (start?.durationScale ?? 1),
        ease: entranceEase,
      }}
    >
      <ShieldCheck aria-hidden="true" />
      <span>{item}</span>
    </m.div>
  );
}

/** Right-fit panel: strong-fit signals plus an honest caution line. */
export function FitPanel({ right, caution }: { right: string[]; caution: string }) {
  return (
    <div className="ss-ind2-fit">
      <ul className="ss-ind2-fit__list">
        {right.map((item, index) => (
          <Reveal
            key={item}
            kind="card"
            delayMs={index * 110}
            className="ss-ind2-fit__item"
          >
            <Check aria-hidden="true" />
            <span>{item}</span>
          </Reveal>
        ))}
      </ul>
      <Reveal kind="section" delayMs={right.length * 110 + 120}>
        <p className="ss-ind2-fit__caution">
          <RichText text={caution} />
        </p>
      </Reveal>
    </div>
  );
}

/** Per-page trust tokens rendered directly beneath the secondary hero. */
export function TrustTokens({ tokens }: { tokens: string[] }) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div className="ss-ind2-tokens" aria-label="Operating principles">
      {tokens.map((token, index) =>
        reducedMotion ? (
          <span className="ss-ind2-tokens__item" key={token}>
            {token}
          </span>
        ) : (
          <TrustTokenItem key={token} token={token} index={index} />
        ),
      )}
    </div>
  );
}

function TrustTokenItem({ token, index }: { token: string; index: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.8, once: true });
  const start = useRevealStart(ref, inView, index * 110);

  return (
    <m.span
      ref={ref}
      className="ss-ind2-tokens__item"
      initial={{ opacity: 0, y: 12 }}
      animate={start !== null ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{
        delay: (start?.delayMs ?? 0) / 1000,
        duration: start?.instant ? 0 : 0.7 * (start?.durationScale ?? 1),
        ease: entranceEase,
      }}
    >
      {token}
    </m.span>
  );
}

/** Responsive approved-image figure (desktop/mobile pair). */
export function IndustryFigure({
  image,
  loading = "lazy",
}: {
  image: IndustryImage;
  loading?: "lazy" | "eager";
}) {
  return (
    <figure className="ss-srv2-figure">
      <picture>
        {image.mobile !== image.desktop ? (
          <source media="(max-width: 767px)" srcSet={image.mobile} />
        ) : null}
        <img
          src={image.desktop}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={loading}
          decoding="async"
        />
      </picture>
    </figure>
  );
}

/** A pair of gallery figures with alternating clip reveals. */
export function ImageDuo({ images }: { images: IndustryImage[] }) {
  return (
    <div className="ss-ind2-duo" data-count={images.length}>
      {images.map((img, index) => (
        <Reveal key={img.desktop} kind="image" delayMs={index * 200}>
          <IndustryFigure image={img} />
        </Reveal>
      ))}
    </div>
  );
}

/** Workflow cards with per-card icon and hover lift, 2-column rhythm. */
export function WorkflowCards({
  items,
  icons,
}: {
  items: IndustryCard[];
  icons: LucideIcon[];
}) {
  return (
    <div className="ss-ind2-workflows">
      {items.map((item, index) => {
        const Icon = icons[index % icons.length];
        return (
          <Reveal
            key={item.title}
            kind="card"
            delayMs={index * 130}
            className="ss-ind2-workflow"
          >
            <span className="ss-srv2-card__icon">
              {Icon ? <Icon aria-hidden="true" /> : null}
            </span>
            <h3 className="ss-srv2-card__title">{item.title}</h3>
            <p className="ss-srv2-card__body">
              <RichText text={item.body} />
            </p>
          </Reveal>
        );
      })}
    </div>
  );
}
