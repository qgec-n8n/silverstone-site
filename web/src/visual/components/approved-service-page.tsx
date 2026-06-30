import { type ReactElement, type ReactNode } from "react";
import * as m from "motion/react-m";

import { TextLink } from "~/components/ui/text-link";
import {
  ArrowRight,
  Check,
  Gauge,
  Headset,
  PencilRuler,
  PhoneCall,
  Plug,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Workflow,
  type LucideIcon,
} from "~/components/icons/lucide";
import { benchmarkDisclaimer } from "~/data/benchmark-metrics";
import {
  type ApprovedServiceContent,
  type ApprovedServiceRoute,
} from "~/content/services/approved-services";
import { CallFlowOscilloscope } from "~/visual/components/signatures/call-flow-oscilloscope";
import { ConversionPathLens } from "~/visual/components/signatures/conversion-path-lens";
import { EditorialLoom } from "~/visual/components/signatures/editorial-loom";
import { FrontDeskConvergence } from "~/visual/components/signatures/front-desk-convergence";
import { ProcessLattice } from "~/visual/components/signatures/process-lattice";
import { ProductStateStack } from "~/visual/components/signatures/product-state-stack";

type RouteArtDirection = {
  variant: string;
  image: {
    desktop: string;
    mobile: string;
    width: number;
    height: number;
    alt: string;
    caption: string;
    loading: "eager" | "lazy";
  };
  icon: LucideIcon;
  signature: ReactElement;
};

const routeArt: Record<ApprovedServiceRoute, RouteArtDirection> = {
  "/services/web-design-development": {
    variant: "web",
    image: {
      desktop: "/approved-images/general-services-1.png",
      mobile: "/approved-images/general-services-1-mobile.png",
      width: 2528,
      height: 1696,
      alt: "Illustrative reception and enquiry-capture panel.",
      caption:
        "Illustrative system view. This conceptual panel supports the conversion-system narrative and is not a live client dashboard.",
      loading: "eager",
    },
    icon: PencilRuler,
    signature: <ConversionPathLens />,
  },
  "/services/app-development": {
    variant: "app",
    image: {
      desktop: "/approved-images/services_data_integration.jpg",
      mobile: "/approved-images/services_data_integration_mobile.jpg",
      width: 2528,
      height: 1696,
      alt: "Illustrative systems and data integration panel.",
      caption:
        "Illustrative product and systems panel. It explains app architecture and operational data flow, not a deployed client application.",
      loading: "eager",
    },
    icon: Plug,
    signature: <ProductStateStack />,
  },
  "/services/ai-voice-agents": {
    variant: "voice",
    image: {
      desktop: "/approved-images/services_lead_followup.jpg",
      mobile: "/approved-images/services_lead_followup_mobile.jpg",
      width: 2528,
      height: 1696,
      alt: "Illustrative automated lead follow-up panel.",
      caption:
        "Illustrative conversation and follow-up surface. Call states and outcomes are synthetic until approved integrations exist.",
      loading: "eager",
    },
    icon: PhoneCall,
    signature: <CallFlowOscilloscope />,
  },
  "/services/ai-receptionists": {
    variant: "reception",
    image: {
      desktop: "/approved-images/general-services-1.png",
      mobile: "/approved-images/general-services-1-mobile.png",
      width: 2528,
      height: 1696,
      alt: "Illustrative reception and enquiry-capture panel.",
      caption:
        "Illustrative front-desk operating surface. It shows reception routing concepts, not live customer conversations.",
      loading: "eager",
    },
    icon: Headset,
    signature: <FrontDeskConvergence />,
  },
  "/services/content-creation": {
    variant: "content",
    image: {
      desktop: "/approved-images/general-services-2a.png",
      mobile: "/approved-images/general-services-2a-mobile.png",
      width: 2528,
      height: 1696,
      alt: "Illustrative modular service package panel.",
      caption:
        "Illustrative editorial-system panel. The checklist is conceptual and does not promise a fixed content volume.",
      loading: "eager",
    },
    icon: Sparkles,
    signature: <EditorialLoom />,
  },
  "/services/ai-automation": {
    variant: "automation",
    image: {
      desktop: "/approved-images/services_workflow_automation.jpg",
      mobile: "/approved-images/services_workflow_automation_mobile.jpg",
      width: 2528,
      height: 1696,
      alt: "Illustrative workflow automation and reporting interface.",
      caption:
        "Illustrative workflow and observability panel. It is conceptual and separated from benchmark evidence.",
      loading: "eager",
    },
    icon: Workflow,
    signature: <ProcessLattice />,
  },
  "/services/ai-consulting": {
    variant: "consulting",
    image: {
      desktop: "/approved-images/services_consulting.jpg",
      mobile: "/approved-images/services_consulting_mobile.jpg",
      width: 2528,
      height: 1696,
      alt: "Illustrative AI consulting and readiness audit panel.",
      caption:
        "Illustrative advisory and readiness panel. It is not a client audit, procurement recommendation or forecast.",
      loading: "eager",
    },
    icon: Search,
    signature: <OpportunityMatrix />,
  },
};

function inlineMarkdown(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const token = match[0];
    const index = match.index;
    if (index > cursor) {
      nodes.push(text.slice(cursor, index));
    }
    if (token.startsWith("`")) {
      nodes.push(<code key={`${token}-${String(index)}`}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={`${token}-${String(index)}`}>{token.slice(2, -2)}</strong>,
      );
    } else {
      nodes.push(<em key={`${token}-${String(index)}`}>{token.slice(1, -1)}</em>);
    }
    cursor = index + token.length;
  }
  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }
  return nodes;
}

type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = markdown.split("\n");
  let index = 0;

  while (index < lines.length) {
    const line = lines[index]?.trim() ?? "";
    if (!line) {
      index += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading?.[1] && heading[2]) {
      blocks.push({
        type: "heading",
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2],
      });
      index += 1;
      continue;
    }

    if (line.startsWith("> ")) {
      blocks.push({ type: "quote", text: line.replace(/^>\s*/, "") });
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while ((lines[index]?.trim() ?? "").startsWith("- ")) {
        items.push((lines[index]?.trim() ?? "").replace(/^- /, ""));
        index += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (/^\d+\.\s/.test(lines[index]?.trim() ?? "")) {
        items.push((lines[index]?.trim() ?? "").replace(/^\d+\.\s/, ""));
        index += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      (lines[index]?.trim() ?? "") &&
      !/^(#{1,3})\s+/.test(lines[index]?.trim() ?? "") &&
      !(lines[index]?.trim() ?? "").startsWith("- ") &&
      !/^\d+\.\s/.test(lines[index]?.trim() ?? "") &&
      !(lines[index]?.trim() ?? "").startsWith("> ")
    ) {
      paragraph.push(lines[index]?.trim() ?? "");
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

function MarkdownContent({
  className,
  markdown,
  skipFirstH1 = false,
}: {
  className?: string;
  markdown: string;
  skipFirstH1?: boolean;
}) {
  const parsedBlocks = parseMarkdown(markdown);
  const firstH1Index = skipFirstH1
    ? parsedBlocks.findIndex((block) => block.type === "heading" && block.level === 1)
    : -1;
  const blocks = parsedBlocks.filter((_block, index) => index !== firstH1Index);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = `h${String(block.level)}` as "h1" | "h2" | "h3";
          return <Tag key={`${block.text}-${String(index)}`}>{block.text}</Tag>;
        }
        if (block.type === "quote") {
          return (
            <blockquote key={`${block.text}-${String(index)}`}>
              {inlineMarkdown(block.text)}
            </blockquote>
          );
        }
        if (block.type === "ul" || block.type === "ol") {
          const List = block.type;
          return (
            <List key={`list-${String(index)}`}>
              {block.items.map((item) => (
                <li key={item}>{inlineMarkdown(item)}</li>
              ))}
            </List>
          );
        }
        return (
          <p key={`${block.text}-${String(index)}`}>{inlineMarkdown(block.text)}</p>
        );
      })}
    </div>
  );
}

function ServicePicture({ service }: { service: ApprovedServiceContent }) {
  const art = routeArt[service.route];
  return (
    <m.figure
      className="ss-approved-service__image"
      initial={{ opacity: 0, clipPath: "inset(8% 8% 8% 8% round 24px)" }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 24px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <picture>
        <source media="(max-width: 767px)" srcSet={art.image.mobile} />
        <img
          src={art.image.desktop}
          alt={art.image.alt}
          width={art.image.width}
          height={art.image.height}
          loading={art.image.loading}
          decoding="async"
          fetchPriority={art.image.loading === "eager" ? "high" : "auto"}
        />
      </picture>
      <figcaption>{art.image.caption}</figcaption>
    </m.figure>
  );
}

function CardsSection({
  items,
  title,
  variant,
}: {
  items: { label: string; body: string }[];
  title: string;
  variant: "feature" | "outcome";
}) {
  const icons =
    variant === "feature"
      ? [PencilRuler, Workflow, Gauge, Plug]
      : [Check, TrendingUp, ShieldCheck];
  return (
    <section className="ss-approved-service__cards" data-card-family={variant}>
      <div className="ss-approved-service__section-head">
        <span>{variant === "feature" ? "Component microcopy" : "Outcome framing"}</span>
        <h2>{title}</h2>
      </div>
      <div className="ss-approved-service__card-grid">
        {items.map((item, index) => {
          const Icon = icons[index % icons.length] ?? Sparkles;
          return (
            <m.article
              className="ss-approved-service__card"
              key={item.label}
              initial={{ opacity: 0, y: 24, rotateX: -8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.05, duration: 0.62 }}
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
            >
              <Icon aria-hidden="true" />
              <h3>{item.label}</h3>
              <p>{item.body}</p>
            </m.article>
          );
        })}
      </div>
    </section>
  );
}

function BenchmarkPanel({ service }: { service: ApprovedServiceContent }) {
  return (
    <section
      className="ss-approved-service__benchmarks"
      aria-label="Published benchmark evidence"
    >
      <div className="ss-approved-service__section-head">
        <span>Published benchmark evidence</span>
        <h2>Evidence is context, not a promise</h2>
      </div>
      <div className="ss-approved-service__metric-grid">
        {service.componentMicrocopy.benchmark.metrics.map((metric, index) => {
          const [value = metric, label = "approved benchmark"] = metric.split(" — ");
          return (
            <m.article
              className="ss-approved-service__metric"
              key={metric}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{
                delay: index * 0.08,
                type: "spring",
                stiffness: 160,
                damping: 22,
              }}
            >
              <strong>{value}</strong>
              <span>{label}</span>
            </m.article>
          );
        })}
      </div>
      <p>{service.componentMicrocopy.benchmark.caption}</p>
      <p className="ss-approved-service__disclaimer">{benchmarkDisclaimer}</p>
    </section>
  );
}

function ProcessRail({ service }: { service: ApprovedServiceContent }) {
  return (
    <section className="ss-approved-service__process">
      <div className="ss-approved-service__section-head">
        <span>Process steps</span>
        <h2>The route stays ordered</h2>
      </div>
      <ol>
        {service.componentMicrocopy.processSteps.map((step, index) => (
          <m.li
            key={step.label}
            initial={{ opacity: 0, x: index % 2 === 0 ? -22 : 22 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.58, delay: index * 0.04 }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step.label}</strong>
            <p>{step.body}</p>
          </m.li>
        ))}
      </ol>
    </section>
  );
}

function DemoSurface({ service }: { service: ApprovedServiceContent }) {
  const reserved = service.demo.configSlots.length > 0;
  return (
    <section
      className="ss-approved-service__demo"
      data-demo-mode={reserved ? "reserved" : "deterministic"}
    >
      <div className="ss-approved-service__section-head">
        <span>Demonstration</span>
        <h2>
          {reserved
            ? "Reserved integration surfaces"
            : "Deterministic demonstration module"}
        </h2>
      </div>
      <MarkdownContent
        className="ss-approved-service__demo-copy"
        markdown={service.demo.rawMarkdown}
      />
      <div className="ss-approved-service__demo-stage">
        {reserved ? (
          service.demo.configSlots.map((slot, index) => (
            <m.article
              className="ss-approved-service__reserved-frame"
              data-config-slot={slot}
              key={slot}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.08, duration: 0.7 }}
            >
              <div className="ss-approved-service__window-bar" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <strong>{slot}</strong>
              <p>
                Reserved until approved configuration, consent and source material
                exist.
              </p>
            </m.article>
          ))
        ) : (
          <m.article
            className="ss-approved-service__deterministic-panel"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.72 }}
          >
            <div className="ss-approved-service__signal-row" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <p>Illustrative state sequence</p>
            <strong>{service.publicHeadings.h2[3] ?? service.routeEntry.title}</strong>
            <small>{service.componentMicrocopy.ctaButton}</small>
          </m.article>
        )}
      </div>
    </section>
  );
}

function OpportunityMatrix() {
  const cells = [
    ["Value", "High-value work, not novelty"],
    ["Effort", "Build, buy, configure, defer"],
    ["Readiness", "Data, systems, owners"],
    ["Governance", "Risk, approval, escalation"],
  ];
  return (
    <section
      className="ss-opportunity-matrix"
      aria-label="Opportunity prioritisation matrix"
    >
      {cells.map(([label, body], index) => (
        <m.article
          key={label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: index * 0.06, duration: 0.55 }}
        >
          <span>{label}</span>
          <p>{body}</p>
        </m.article>
      ))}
    </section>
  );
}

export function ApprovedServicePageVisuals({
  service,
}: {
  service: ApprovedServiceContent;
}) {
  const art = routeArt[service.route];
  const Icon = art.icon;

  return (
    <div
      className="ss-visual-root ss-approved-service"
      data-service-variant={art.variant}
    >
      <section className="ss-approved-service__overview">
        <m.div
          className="ss-approved-service__brief"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.72 }}
        >
          <span>
            <Icon aria-hidden="true" />
            {service.routeEntry.pill}
          </span>
          <h2>{service.routeEntry.title}</h2>
          <p>{service.routeEntry.subtitle}</p>
          <TextLink href="/book">
            {service.componentMicrocopy.ctaButton}
            <ArrowRight aria-hidden="true" />
          </TextLink>
        </m.div>
        <ServicePicture service={service} />
      </section>

      <MarkdownContent
        className="ss-approved-service__copy"
        markdown={service.publicCopy}
        skipFirstH1
      />

      <CardsSection
        items={service.componentMicrocopy.featureCards}
        title="Approved capability cards"
        variant="feature"
      />

      <section className="ss-approved-service__signature" data-signature={art.variant}>
        {art.signature}
      </section>

      <CardsSection
        items={service.componentMicrocopy.outcomeCards}
        title="Approved outcome cards"
        variant="outcome"
      />
      <BenchmarkPanel service={service} />
      <ProcessRail service={service} />
      <DemoSurface service={service} />
    </div>
  );
}
