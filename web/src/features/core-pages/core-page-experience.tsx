import "~/styles/services-v2/services-v2.css";
import "~/styles/core-pages/core-pages.css";

import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useMemo, useState, type CSSProperties, type ReactNode } from "react";

import {
  ArrowUpRight,
  Bot,
  CalendarCheck,
  Check,
  CheckCircle2Icon,
  Database,
  FileText,
  Gauge,
  GitBranch,
  InfoIcon,
  Layers,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Workflow,
  type LucideIcon,
} from "~/components/icons/lucide";
import type { FutureRouteRecord } from "~/data/route-schema";
import {
  BenchmarkConsole,
  RelatedRail,
} from "~/features/services-v2/components/sections";
import { ScrollCue } from "~/features/services-v2/components/secondary-hero";
import {
  Eyebrow,
  Reveal,
  RichText,
  SectionHead,
  ServiceButton,
} from "~/features/services-v2/components/primitives";
import {
  SignatureChrome,
  SignatureStatusBar,
} from "~/features/services-v2/signatures/signature-chrome";
import { TrustStrip } from "~/visual/home-v2/sections/trust-strip";

type CorePath = "/how-we-work" | "/blog" | "/about" | "/pricing" | "/contact" | "/book";

type Card = {
  body: string;
  href?: string;
  icon?: LucideIcon;
  label?: string;
  title: string;
};

type CorePage = {
  accent: string;
  accent2: string;
  eyebrow: string;
  final: { body: string; button: string; heading: string };
  h1: string;
  icon: LucideIcon;
  image?: { alt: string; src: string };
  lead: string;
  metrics?: string[];
  points: string[];
  proofCaption?: string;
  related: { href: string; label: string; title: string }[];
  sections: {
    cards?: Card[];
    heading: string;
    icon?: LucideIcon;
    lead?: string;
    mode?: "cards" | "split" | "timeline" | "rail";
    paragraphs?: string[];
  }[];
  showcase: "delivery" | "editorial" | "studio" | "pricing" | "contact" | "booking";
};

const pages: Record<CorePath, CorePage> = {
  "/how-we-work": {
    accent: "#22d3ee",
    accent2: "#7c5cff",
    eyebrow: "The Silverstone method",
    final: {
      body: "Bring one business process, customer journey or digital product decision. We will help decide what belongs in the first release, what should wait and where people must stay accountable.",
      button: "Book a discovery call",
      heading: "Start with one real problem",
    },
    h1: "From business problem to working system",
    icon: Workflow,
    lead: "A disciplined delivery route for AI, automation, web and app work: diagnosis first, bounded scope, explicit decision gates, tested implementation and human oversight after launch.",
    metrics: [
      "2–4 weeks — Time to first working automation",
      "98% — Extraction accuracy on structured documents",
      "65% — Document-processing cost reduction",
      "10x — Faster document turnaround",
    ],
    points: [
      "Problem, data and people mapped before architecture",
      "Acceptance criteria and decision gates made visible",
      "Launch treated as a controlled handover, not a reveal",
    ],
    proofCaption:
      "Verified Silverstone AI performance figures show why disciplined scope, clean data and explicit acceptance criteria matter.",
    related: [
      { href: "/services/ai-consulting", label: "Service", title: "AI consulting" },
      { href: "/pricing", label: "Commercial", title: "Pricing model" },
      { href: "/book", label: "Next step", title: "Discovery call" },
    ],
    sections: [
      {
        heading: "Judgement before build",
        icon: Target,
        lead: "The first decision is not which tool to use. It is which problem deserves capital, senior attention and operational change.",
        mode: "cards",
        cards: [
          {
            icon: Search,
            title: "Diagnose the current reality",
            body: "Map the people, systems, handoffs, exceptions and commercial consequence before a solution is proposed.",
          },
          {
            icon: Target,
            title: "Define the first intervention",
            body: "Select a bounded release around value, feasibility, risk and a measurable acceptance standard.",
          },
          {
            icon: Layers,
            title: "Design the system behaviour",
            body: "Plan the workflow, interface, content, data and escalation path as one operating experience.",
          },
          {
            icon: CheckCircle2Icon,
            title: "Deliver under real conditions",
            body: "Test intended journeys, edge cases, missing data, permissions and failure paths before handover.",
          },
        ],
      },
      {
        heading: "What remains human",
        icon: UserCheck,
        lead: "Automation should make accountability clearer, not blur it.",
        paragraphs: [
          "Where a decision carries financial, legal, reputational or personal consequence, the workflow needs a named owner and a working escalation path.",
          "Silverstone designs the boundary: what can happen automatically, what needs review, who owns exceptions and what gets logged for later improvement.",
        ],
      },
      {
        heading: "Where projects lose control",
        icon: ShieldCheck,
        mode: "rail",
        cards: [
          {
            title: "The tool becomes the strategy",
            body: "The project is shaped around a platform instead of the business problem.",
          },
          {
            title: "Scope expands invisibly",
            body: "Every review introduces another small requirement without a commercial decision.",
          },
          {
            title: "The demo becomes the test",
            body: "The ideal path works while real exceptions, permissions and fallbacks fail.",
          },
          {
            title: "Nobody owns the live system",
            body: "Prompts, accounts, automations and decisions become undocumented dependencies.",
          },
        ],
      },
    ],
    showcase: "delivery",
  },
  "/blog": {
    accent: "#38bdf8",
    accent2: "#d36bcb",
    eyebrow: "Silverstone Intelligence",
    final: {
      body: "Use the library to sharpen the decision, then move to the route that can turn it into a controlled system.",
      button: "Book a discovery call",
      heading: "Turn research into a decision",
    },
    h1: "Intelligence for better technology decisions",
    icon: FileText,
    lead: "Practical analysis for leaders deciding what to automate, what to design, what to measure and where human judgement still belongs.",
    metrics: [
      "3,000 — Bookings in 12 months",
      "3x → 20x — SEO and PPC ROI",
      "60% — Manual operations overhead reduction",
      "17% → 46% — Lead-to-patient conversion rate",
    ],
    points: [
      "Guides organised by commercial decision, not content volume",
      "Evidence, implementation risk and governance treated together",
      "Clear routes from research into service, pricing or discovery",
    ],
    proofCaption:
      "Verified Silverstone AI results are used to frame better questions about scope, method and transferability.",
    related: [
      { href: "/services", label: "Services", title: "Service architecture" },
      { href: "/how-we-work", label: "Process", title: "Delivery framework" },
      { href: "/pricing", label: "Commercial", title: "Investment model" },
    ],
    sections: [
      {
        heading: "Start with the decision in front of you",
        icon: Search,
        mode: "cards",
        cards: [
          {
            href: "/how-we-work",
            label: "Partner selection",
            title: "Choosing the right AI partner",
            body: "What evidence should sit behind a credible proposal, and how agency, consultancy, platform and freelancer models differ.",
          },
          {
            href: "/services/ai-consulting",
            label: "Strategy",
            title: "Selecting the first opportunity",
            body: "How to prioritise possible automations by value, feasibility, risk and ownership.",
          },
          {
            href: "/pricing",
            label: "Commercial",
            title: "Understanding cost and value",
            body: "Build cost, usage, support and change separated from optimistic ROI claims.",
          },
          {
            href: "/services/ai-automation",
            label: "Governance",
            title: "Implementing responsibly",
            body: "Human oversight, fallback, testing and disclosure before the system goes live.",
          },
        ],
      },
      {
        heading: "Featured insight",
        icon: ShieldCheck,
        lead: "AI automation and UK GDPR: a practical guide for SMEs.",
        paragraphs: [
          "A useful automation is not only technically possible. It must have a lawful, understandable and operationally controlled relationship with the data it uses.",
          "The guide examines purpose, access, minimisation, human review and the questions to resolve before launch.",
        ],
      },
      {
        heading: "Explore by topic",
        icon: Layers,
        mode: "cards",
        cards: [
          {
            href: "/services/ai-consulting",
            title: "AI strategy",
            body: "Roadmaps, provider selection and opportunity audits.",
          },
          {
            href: "/services/ai-receptionists",
            title: "AI receptionists",
            body: "Enquiry handling, booking, escalation and operating rules.",
          },
          {
            href: "/services/ai-voice-agents",
            title: "Voice agents",
            body: "Latency, consent, call flows and human takeover.",
          },
          {
            href: "/services/web-design-development",
            title: "Web and conversion",
            body: "Information architecture, forms, performance and measurement.",
          },
          {
            href: "/services/app-development",
            title: "Apps and products",
            body: "First-release strategy for maintainable internal and customer tools.",
          },
          {
            href: "/industry",
            title: "Industry applications",
            body: "Sector-specific systems for nine UK operating realities.",
          },
        ],
      },
    ],
    showcase: "editorial",
  },
  "/about": {
    accent: "#a78bfa",
    accent2: "#22d3ee",
    eyebrow: "The Silverstone standard",
    final: {
      body: "The clearest way to understand Silverstone is to examine how the work is diagnosed, scoped, designed, tested and handed over.",
      button: "Explore the delivery framework",
      heading: "See the judgement become a working system",
    },
    h1: "A premium technology partner built around better judgement",
    icon: Sparkles,
    lead: "Silverstone joins commercial strategy, digital craft, engineering, AI and automation in one accountable model for businesses that expect serious delivery.",
    image: {
      alt: "Cinematic Silverstone studio scene with a dark operating surface and luminous system interface.",
      src: "/home-v2/studio-mission.webp",
    },
    points: [
      "Strategy, copy, design, engineering, AI and automation connected",
      "Selective scope, exact communication and visible ownership",
      "Human responsibility kept explicit where consequence matters",
    ],
    related: [
      { href: "/services", label: "Services", title: "What we build" },
      { href: "/how-we-work", label: "Method", title: "How we work" },
      { href: "/blog", label: "Thinking", title: "Insights" },
    ],
    sections: [
      {
        heading: "One accountable system, six disciplines",
        icon: Layers,
        mode: "cards",
        cards: [
          {
            href: "/services/ai-consulting",
            icon: Target,
            title: "Strategy",
            body: "Define the commercial problem, first release and evidence required to justify expansion.",
          },
          {
            href: "/services/content-creation",
            icon: FileText,
            title: "Copy",
            body: "Give propositions, interfaces and journeys language precise enough to reduce uncertainty.",
          },
          {
            href: "/services/web-design-development",
            icon: Sparkles,
            title: "Design",
            body: "Shape experiences that feel clear, intentional and appropriate to the standard of the business.",
          },
          {
            href: "/services/app-development",
            icon: Database,
            title: "Engineering",
            body: "Build maintainable products, integrations and interfaces around defined acceptance criteria.",
          },
          {
            href: "/services/ai-voice-agents",
            icon: Bot,
            title: "AI",
            body: "Use models where interpretation, conversation or generation creates genuine value and clear review.",
          },
          {
            href: "/services/ai-automation",
            icon: Workflow,
            title: "Automation",
            body: "Connect data, actions, approvals and handoffs while keeping exceptions visible.",
          },
        ],
      },
      {
        heading: "Premium is a standard of attention",
        icon: ShieldCheck,
        paragraphs: [
          "Premium does not mean adding complexity or withholding clarity. It means treating the important details as important.",
          "Assumptions, dependencies, exclusions, third-party costs and human responsibilities should be visible before they become points of dispute.",
        ],
      },
      {
        heading: "Proof without theatre",
        icon: CheckCircle2Icon,
        mode: "rail",
        cards: [
          {
            title: "Evidence before claim",
            body: "Client outcomes, benchmarks, demonstrations and methods are different classes of proof.",
          },
          {
            title: "Operating reality before novelty",
            body: "A concept only matters when it fits the people, data and systems that must sustain it.",
          },
          {
            title: "Quality before unnecessary scale",
            body: "Channels, features and agents must earn their place in the first release.",
          },
          {
            title: "Maintainability before dependency",
            body: "Accounts, prompts, code, documentation and decisions cannot disappear into an opaque model.",
          },
        ],
      },
    ],
    showcase: "studio",
  },
  "/pricing": {
    accent: "#7fe9f0",
    accent2: "#f0789a",
    eyebrow: "Investment by design",
    final: {
      body: "A serious proposal should make deliverables, exclusions, assumptions, dependencies, client responsibilities, acceptance criteria, usage costs, support and change control visible.",
      button: "Discuss scope and pricing",
      heading: "Price the problem properly",
    },
    h1: "Bespoke investment, defined after discovery",
    icon: Gauge,
    lead: "No generic packages, rate cards, budget bands or artificial anchors. Silverstone prices the problem, scope, risk and execution standard after discovery.",
    metrics: [
      "£16,800.00 — Annual direct cost savings",
      "3.84x — Return on investment",
      "-77% — Reduction in admin time",
      "10+ hours — Saved per person per month",
      "15 hours/week — Time saved",
    ],
    points: [
      "No public price until the real scope is understood",
      "Third-party usage, integrations and support made visible",
      "Written proposals shaped around a defined first release",
    ],
    proofCaption:
      "Verified Silverstone AI results show why scope should be priced against commercial value and operating reality, not a generic menu.",
    related: [
      { href: "/services/ai-automation", label: "Service", title: "Automation" },
      { href: "/how-we-work", label: "Process", title: "Delivery framework" },
      { href: "/book", label: "Next step", title: "Discuss scope" },
    ],
    sections: [
      {
        heading: "Why there is no rate card",
        icon: InfoIcon,
        paragraphs: [
          "A public rate card works when the product is fixed. Silverstone’s work is deliberately bespoke.",
          "The same label can describe a narrow workflow or a multi-channel operating system with integrations, data risk, escalation logic and support. One number would conceal the real scope or shape the project around a price.",
        ],
      },
      {
        heading: "What the investment must cover",
        icon: Layers,
        mode: "cards",
        cards: [
          {
            title: "Commercial definition",
            body: "Problem selection, baseline, first-release scope and expansion evidence.",
          },
          {
            title: "Experience and system design",
            body: "Customer journey, content, interface, workflow, data, permissions and fallbacks.",
          },
          {
            title: "Implementation and assurance",
            body: "Engineering, configuration, testing, acceptance, security and launch control.",
          },
          {
            title: "Ownership and evolution",
            body: "Documentation, handover, monitoring, support, third-party usage and change.",
          },
        ],
      },
      {
        heading: "The shapes an engagement can take",
        icon: GitBranch,
        mode: "rail",
        cards: [
          {
            title: "Strategic definition",
            body: "Current-state analysis, opportunity selection, roadmap, governance or solution direction.",
          },
          {
            title: "Focused first release",
            body: "A bounded workflow, website, application feature or customer journey with limited dependencies.",
          },
          {
            title: "Integrated programme",
            body: "Work spanning multiple journeys, systems, channels or disciplines.",
          },
          {
            title: "Ongoing evolution",
            body: "Monitoring, optimisation, support, new scope or continued product development.",
          },
        ],
      },
    ],
    showcase: "pricing",
  },
  "/contact": {
    accent: "#5ec5d0",
    accent2: "#a97cc0",
    eyebrow: "Direct correspondence",
    final: {
      body: "Use Contact for a written question, partnership enquiry or scheduler fallback. Use Book when a focused 30-minute conversation is the more direct route.",
      button: "Book a discovery call",
      heading: "Prefer a conversation?",
    },
    h1: "Start with the question that matters",
    icon: MessageSquare,
    lead: "Send concise written context about the process, journey or project question in front of you. The page is calm by design: no response-time promise, no pressure, no unnecessary data.",
    points: [
      "Accessible written route for project and partnership questions",
      "Name, work email and message kept clear and required",
      "Staging submissions are mocked; production email remains protected",
    ],
    related: [
      { href: "/book", label: "Live route", title: "Book a call" },
      { href: "/services", label: "Services", title: "Explore services" },
      { href: "/privacy-policy", label: "Governance", title: "Privacy policy" },
    ],
    sections: [
      {
        heading: "Contact or Book?",
        icon: GitBranch,
        mode: "cards",
        cards: [
          {
            title: "Use Contact when",
            body: "You want to ask a question first, need an accessible alternative to the calendar, or written context will make the reply more useful.",
          },
          {
            title: "Use Book when",
            body: "There is a real process, customer journey or digital problem and a live conversation will resolve the next step faster.",
          },
        ],
      },
    ],
    showcase: "contact",
  },
  "/book": {
    accent: "#22d3ee",
    accent2: "#f0789a",
    eyebrow: "30-minute discovery",
    final: {
      body: "No technical preparation is required. Bring one process, journey or digital problem and enough context to decide the sensible next step.",
      button: "Send a written enquiry",
      heading: "Need a written route instead?",
    },
    h1: "Book a 30-minute discovery call",
    icon: CalendarCheck,
    lead: "A focused, no-obligation conversation for businesses with one real process, customer journey or digital problem to improve.",
    points: [
      "Bring one problem, not a full technical specification",
      "Fit, no-fit or a smaller first step are all valid outcomes",
      "Staging keeps the scheduler disabled to prevent real bookings",
    ],
    related: [
      { href: "/how-we-work", label: "Process", title: "How we work" },
      { href: "/pricing", label: "Commercial", title: "Pricing model" },
      { href: "/contact", label: "Fallback", title: "Contact" },
    ],
    sections: [
      {
        heading: "Who the call is for",
        icon: Target,
        mode: "cards",
        cards: [
          {
            title: "A strong fit",
            body: "You can name a process, journey or product decision that affects time, response, conversion, delivery quality, visibility or control.",
          },
          {
            title: "Not ready yet",
            body: "The brief is only “we need AI”, there is no process owner, or the main aim is a generic price without discussing scope.",
          },
        ],
      },
      {
        heading: "What we will discuss",
        icon: MessageSquare,
        mode: "rail",
        cards: [
          {
            title: "Current reality",
            body: "What happens today, where friction appears and which systems or channels shape the journey.",
          },
          {
            title: "Commercial consequence",
            body: "Why the problem matters: time, experience, response, capacity, conversion, control or risk.",
          },
          {
            title: "Decision boundary",
            body: "What could be automated, built or redesigned, and what should remain human.",
          },
          {
            title: "Sensible next step",
            body: "Whether the opportunity merits a defined scope, advisory step, smaller release or no project.",
          },
        ],
      },
    ],
    showcase: "booking",
  },
};

function isCorePath(path: string): path is CorePath {
  return path in pages;
}

function CoreShowcase({ page }: { page: CorePage }) {
  const reducedMotion = useReducedMotion() ?? false;
  const nodes = useMemo(
    () => [
      { x: 116, y: 130, label: page.showcase === "pricing" ? "Scope" : "Diagnose" },
      { x: 300, y: 94, label: page.showcase === "editorial" ? "Evidence" : "Define" },
      { x: 486, y: 130, label: page.showcase === "contact" ? "Route" : "Design" },
      { x: 486, y: 330, label: page.showcase === "booking" ? "Call" : "Deliver" },
      { x: 300, y: 406, label: page.showcase === "studio" ? "Standard" : "Govern" },
      { x: 116, y: 330, label: page.showcase === "pricing" ? "Proposal" : "Evolve" },
    ],
    [page.showcase],
  );

  return (
    <div
      className="ss-srv2-signature ss-core-sig"
      role="img"
      aria-label={`${page.eyebrow} operating diagram`}
    >
      <SignatureStatusBar label={page.eyebrow} />
      <div className="ss-srv2-signature__stage">
        <m.svg viewBox="0 0 600 520" className="ss-srv2-signature__svg">
          <defs>
            <linearGradient id={`core-gradient-${page.showcase}`} x1="0" x2="1">
              <stop offset="0%" stopColor="var(--srv2-accent)" />
              <stop offset="100%" stopColor="var(--srv2-accent-2)" />
            </linearGradient>
          </defs>
          <path
            d="M116 130 C176 68 238 68 300 94 C372 56 444 70 486 130 C560 190 556 276 486 330 C432 406 366 432 300 406 C226 438 158 404 116 330 C40 274 42 190 116 130Z"
            fill="none"
            stroke={`url(#core-gradient-${page.showcase})`}
            strokeWidth="1.4"
            strokeDasharray="6 10"
            opacity="0.72"
          />
          {nodes.map((node, index) => (
            <m.g
              key={node.label}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.78 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ amount: 0.45, once: true }}
              transition={{ duration: 0.55, delay: reducedMotion ? 0 : index * 0.08 }}
            >
              <line
                x1="300"
                y1="254"
                x2={node.x}
                y2={node.y}
                stroke="var(--srv2-hairline)"
                strokeWidth="1"
              />
              <rect
                x={node.x - 54}
                y={node.y - 24}
                width="108"
                height="48"
                rx="14"
                fill="var(--ss-v2-void-black)"
                stroke="var(--srv2-accent)"
                strokeWidth="1.4"
              />
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fill="var(--ss-v2-chrome)"
                fontFamily="var(--ss-font-mono)"
                fontSize="12"
              >
                {node.label}
              </text>
            </m.g>
          ))}
          {!reducedMotion ? (
            <m.circle
              cx="300"
              cy="254"
              r="58"
              fill="none"
              stroke="var(--srv2-accent-2)"
              strokeWidth="2"
              strokeDasharray="4 9"
              animate={{ rotate: 360 }}
              style={{ transformOrigin: "300px 254px" }}
              transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
            />
          ) : null}
          <circle
            cx="300"
            cy="254"
            r="46"
            fill="var(--ss-v2-void-black)"
            stroke="var(--srv2-accent)"
            strokeWidth="2"
          />
          <text
            x="300"
            y="250"
            textAnchor="middle"
            fill="var(--ss-v2-chrome)"
            fontFamily="var(--ss-font-mono)"
            fontSize="12"
          >
            HUMAN
          </text>
          <text
            x="300"
            y="268"
            textAnchor="middle"
            fill="var(--srv2-ink-faint)"
            fontFamily="var(--ss-font-mono)"
            fontSize="11"
          >
            judgement
          </text>
        </m.svg>
      </div>
      <SignatureChrome />
    </div>
  );
}

function CoreHero({ page }: { page: CorePage }) {
  const Icon = page.icon;

  return (
    <section
      className="ss-srv2-section ss-srv2-hero ss-core-hero"
      aria-labelledby="core-page-title"
    >
      <div className="ss-srv2__container">
        <div className="ss-srv2-hero__grid">
          <div className="ss-srv2-hero__intro">
            <Reveal kind="pill" delayMs={560} trigger="mount">
              <Eyebrow icon={Icon}>{page.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal kind="section" delayMs={700} trigger="mount">
              <h1 className="ss-srv2-hero__title" id="core-page-title">
                <RichText text={page.h1} />
              </h1>
            </Reveal>
            <Reveal kind="section" delayMs={840} trigger="mount">
              <p className="ss-srv2-hero__lead">
                <RichText text={page.lead} />
              </p>
            </Reveal>
            <ul className="ss-srv2-hero__caps">
              {page.points.map((point) => (
                <li className="ss-srv2-hero__cap" key={point}>
                  <span className="ss-srv2-hero__cap-dot" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Reveal kind="cta" delayMs={1160} trigger="mount">
              <div className="ss-srv2-hero__actions">
                <ServiceButton href="/book" variant="primary">
                  Book a discovery call
                </ServiceButton>
                <ServiceButton href="/services" variant="ghost" withArrow={false}>
                  Explore services
                </ServiceButton>
              </div>
            </Reveal>
          </div>
          <div className="ss-srv2-hero__showcase">
            <Reveal kind="image" delayMs={780} trigger="mount">
              <CoreShowcase page={page} />
            </Reveal>
          </div>
        </div>
        <ScrollCue />
      </div>
    </section>
  );
}

function CoreCards({ cards }: { cards: Card[] }) {
  return (
    <div className="ss-core-cards" data-count={cards.length}>
      {cards.map((card, index) => {
        const Icon = card.icon ?? Check;
        const body = (
          <>
            <span className="ss-srv2-card__icon">
              <Icon aria-hidden="true" />
            </span>
            {card.label ? (
              <span className="ss-core-card__label">{card.label}</span>
            ) : null}
            <h3 className="ss-srv2-card__title">{card.title}</h3>
            <p className="ss-srv2-card__body">
              <RichText text={card.body} />
            </p>
            {card.href ? (
              <span className="ss-core-card__arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
            ) : null}
          </>
        );

        return (
          <Reveal key={card.title} kind="card" delayMs={index * 110}>
            {card.href ? (
              <a className="ss-srv2-card ss-core-card" href={card.href}>
                {body}
              </a>
            ) : (
              <article className="ss-srv2-card ss-core-card">{body}</article>
            )}
          </Reveal>
        );
      })}
    </div>
  );
}

function CoreRail({ cards }: { cards: Card[] }) {
  return (
    <ol className="ss-core-rail">
      {cards.map((card, index) => (
        <Reveal key={card.title} kind="card" delayMs={index * 130}>
          <li className="ss-core-rail__item">
            <span className="ss-core-rail__index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{card.title}</h3>
              <p>
                <RichText text={card.body} />
              </p>
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

function CoreProse({
  image,
  paragraphs,
}: {
  image?: CorePage["image"];
  paragraphs: string[];
}) {
  return (
    <div className="ss-core-split">
      <div className="ss-srv2-prose">
        {paragraphs.map((paragraph) => (
          <Reveal kind="section" key={paragraph}>
            <p>
              <RichText text={paragraph} />
            </p>
          </Reveal>
        ))}
      </div>
      {image ? (
        <Reveal kind="image">
          <figure className="ss-srv2-figure ss-core-image">
            <img
              src={image.src}
              alt={image.alt}
              width="1400"
              height="980"
              loading="lazy"
            />
          </figure>
        </Reveal>
      ) : null}
    </div>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  return (
    <form
      className="ss-core-form ss-srv2-beam-border"
      aria-label="Silverstone enquiry form"
      data-endpoint="/.netlify/functions/send-email"
      method="post"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) {
          setStatus("error");
          form.reportValidity();
          return;
        }
        setStatus("sent");
        form.reset();
      }}
    >
      <div className="ss-core-form__grid">
        <label>
          <span>Name</span>
          <input
            name="name"
            autoComplete="name"
            required
            placeholder="Your full name"
          />
        </label>
        <label>
          <span>Work email</span>
          <input
            name="email"
            autoComplete="email"
            type="email"
            required
            placeholder="name@company.com"
          />
        </label>
      </div>
      <div className="ss-core-form__grid">
        <label>
          <span>
            Company <em>optional</em>
          </span>
          <input
            name="company"
            autoComplete="organization"
            placeholder="Company or organisation"
          />
        </label>
        <label>
          <span>
            Area of interest <em>optional</em>
          </span>
          <select name="interest" defaultValue="">
            <option value="" disabled>
              Select the closest match
            </option>
            <option>AI and automation consulting</option>
            <option>AI automation and agent workflows</option>
            <option>AI receptionists</option>
            <option>AI voice agents</option>
            <option>Web design and development</option>
            <option>Custom app development</option>
            <option>Content creation and repurposing</option>
            <option>Partnership or other enquiry</option>
          </select>
        </label>
      </div>
      <label>
        <span>What would you like to improve?</span>
        <textarea
          name="message"
          required
          maxLength={1600}
          rows={7}
          placeholder="Describe what is happening now, the outcome you want and the systems or people involved."
        />
      </label>
      <p className="ss-core-form__note">
        Do not include passwords, payment information, health records or other sensitive
        personal data. In staging, this form confirms locally and sends no production
        email.
      </p>
      <div className="ss-core-form__actions">
        <button className="ss-srv2-btn ss-srv2-btn--primary" type="submit">
          Send enquiry
        </button>
        <a
          className="ss-srv2-btn ss-srv2-btn--ghost"
          href="mailto:info@silverstone-ai.com"
        >
          Email instead
        </a>
      </div>
      <div className="ss-core-form__status" role="status" aria-live="polite">
        {status === "sent"
          ? "Your enquiry has been recorded in the staging mock. Use the same work email if you need to add context."
          : null}
        {status === "error" ? "Check the highlighted fields before sending." : null}
      </div>
    </form>
  );
}

function BookingPanel() {
  return (
    <div className="ss-core-booking ss-srv2-beam-border" id="booking-calendar">
      <div className="ss-core-booking__calendar" aria-hidden="true">
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
          <span key={day} data-active={index === 2 ? "true" : undefined}>
            {day}
          </span>
        ))}
      </div>
      <div className="ss-core-booking__body">
        <span className="ss-srv2-bench__tag">
          <CalendarCheck aria-hidden="true" />
          Scheduler safely disabled in staging
        </span>
        <h3>Choose a discovery-call time in production</h3>
        <p>
          The active booking destination is Calendly. Staging keeps the live embed
          disabled so validation cannot create a real appointment.
        </p>
        <div className="ss-core-form__actions">
          <span className="ss-srv2-btn ss-srv2-btn--primary ss-core-btn-disabled">
            Calendly target verified
          </span>
          <a className="ss-srv2-btn ss-srv2-btn--ghost" href="/contact">
            Contact instead
          </a>
        </div>
        <p className="ss-core-booking__target">
          Production scheduler: https://calendly.com/silverstone-ai/30min
        </p>
      </div>
    </div>
  );
}

function CoreSpecificModule({ path }: { path: CorePath }) {
  if (path === "/contact") {
    return (
      <section className="ss-srv2-section" aria-labelledby="core-contact-form">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Send an enquiry"
            icon={MessageSquare}
            heading="Tell Silverstone what is happening now"
            headingId="core-contact-form"
            lead="A concise message is enough. Explain the current situation, the intended outcome and anything that materially affects the decision."
          />
          <ContactForm />
        </div>
      </section>
    );
  }

  if (path === "/book") {
    return (
      <section className="ss-srv2-section" aria-labelledby="core-booking">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Choose a time"
            icon={CalendarCheck}
            heading="Bring one real problem to the calendar"
            headingId="core-booking"
            lead="Check the displayed timezone before confirming. Do not submit passwords, payment data or sensitive personal information through the scheduler."
          />
          <BookingPanel />
        </div>
      </section>
    );
  }

  return null;
}

export function CorePageExperience({ route }: { route: FutureRouteRecord }): ReactNode {
  if (!isCorePath(route.path)) {
    return null;
  }

  const page = pages[route.path];
  const style = {
    "--srv2-accent": page.accent,
    "--srv2-accent-2": page.accent2,
  } as CSSProperties;

  return (
    <div className="ss-srv2 ss-core" data-core-route={route.path} style={style}>
      <CoreHero page={page} />
      <TrustStrip />

      {page.sections.map((section, index) => {
        const sectionId = `core-section-${String(index)}`;

        return (
          <section
            className="ss-srv2-section"
            aria-labelledby={sectionId}
            key={section.heading}
          >
            <div className="ss-srv2__container">
              <SectionHead
                eyebrow={index === 0 ? "Page argument" : "Decision support"}
                icon={section.icon}
                heading={section.heading}
                headingId={sectionId}
                lead={section.lead}
              />
              {section.cards && section.mode === "rail" ? (
                <CoreRail cards={section.cards} />
              ) : null}
              {section.cards && section.mode !== "rail" ? (
                <CoreCards cards={section.cards} />
              ) : null}
              {section.paragraphs ? (
                <CoreProse
                  image={
                    route.path === "/about" && index === 1 ? page.image : undefined
                  }
                  paragraphs={section.paragraphs}
                />
              ) : null}
            </div>
          </section>
        );
      })}

      {page.metrics ? (
        <section className="ss-srv2-section" aria-labelledby="core-proof">
          <div className="ss-srv2__container">
            <SectionHead
              eyebrow="Verified results"
              icon={TrendingUp}
              heading="Performance figures kept exact"
              headingId="core-proof"
              lead={page.proofCaption}
            />
            <BenchmarkConsole
              metrics={page.metrics}
              caption={
                page.proofCaption ?? "Verified Silverstone AI performance figures."
              }
              attribution="Verified Silverstone AI performance"
              clarification="Results achieved through Silverstone AI systems. Outcomes vary by starting process, data quality, channel mix and implementation scope."
            />
          </div>
        </section>
      ) : null}

      <CoreSpecificModule path={route.path} />

      <section className="ss-srv2-section" aria-labelledby="core-final">
        <div className="ss-srv2__container" data-width="narrow">
          <div className="ss-srv2-cta">
            <Reveal kind="section">
              <h2 className="ss-srv2-cta__title" id="core-final">
                <RichText text={page.final.heading} />
              </h2>
            </Reveal>
            <Reveal kind="section" delayMs={120}>
              <p className="ss-srv2-cta__body">{page.final.body}</p>
            </Reveal>
            <Reveal kind="cta" delayMs={260}>
              <ServiceButton
                href={route.path === "/book" ? "/contact" : "/book"}
                variant="primary"
              >
                {page.final.button}
              </ServiceButton>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="ss-srv2-section" aria-labelledby="core-related">
        <div className="ss-srv2__container">
          <SectionHead
            eyebrow="Continue"
            heading="Where this connects next"
            headingId="core-related"
          />
          <RelatedRail links={page.related} />
        </div>
      </section>
    </div>
  );
}
