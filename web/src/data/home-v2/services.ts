/**
 * Services universe — the Display Cards constellation on the V2 homepage.
 * Routes are validated against `web/src/data/approved-routes.ts`.
 */

export type ServiceUniverseCard = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  href: string;
  /** lucide-react icon name resolved by the card component. */
  icon: string;
  highlights: readonly string[];
  /** Token-driven accent used for the card glow + iconography. */
  accent: "cyan" | "blue" | "violet" | "platinum";
};

export const SERVICE_UNIVERSE: readonly ServiceUniverseCard[] = [
  {
    id: "voice-agents",
    index: "01",
    title: "AI Voice Agents",
    tagline: "Controlled call workflows",
    description:
      "Natural-sounding voice agents answer, qualify and book with clear escalation when a human decision is needed.",
    href: "/services/ai-voice-agents",
    icon: "PhoneCall",
    highlights: ["Fast response", "Qualify & route", "Conversation summaries"],
    accent: "cyan",
  },
  {
    id: "receptionists",
    index: "02",
    title: "AI Receptionists",
    tagline: "Qualified enquiry routing",
    description:
      "Calls, chat and messages handled against your rules, with bookings routed into the right calendar or handoff.",
    href: "/services/ai-receptionists",
    icon: "Headset",
    highlights: ["Extended coverage", "Calendar-aware", "Human handoff"],
    accent: "blue",
  },
  {
    id: "automation",
    index: "03",
    title: "AI Agents & Automation",
    tagline: "Governed workflow systems",
    description:
      "Agentic workflows connect the tools you already use and move repetitive back-office work through accountable controls.",
    href: "/services/ai-automation",
    icon: "Workflow",
    highlights: ["Document processing", "Lead follow-up", "System sync"],
    accent: "violet",
  },
  {
    id: "web",
    index: "04",
    title: "Web Design & Development",
    tagline: "Sites engineered to convert",
    description:
      "Fast, considered websites built around the journey that turns a first visit into a booked enquiry.",
    href: "/services/web-design-development",
    icon: "Globe",
    highlights: ["Conversion-first", "Core Web Vitals", "Booking flows"],
    accent: "cyan",
  },
  {
    id: "app",
    index: "05",
    title: "App Development",
    tagline: "Product-grade mobile & web apps",
    description:
      "Bespoke applications that extend your operation — from member portals to internal operating tools.",
    href: "/services/app-development",
    icon: "Smartphone",
    highlights: ["Mobile & web", "Secure by design", "Built to scale"],
    accent: "blue",
  },
  {
    id: "content",
    index: "06",
    title: "Content Creation",
    tagline: "Governed authority assets",
    description:
      "AI-assisted content and SEO systems that turn your expertise into controlled, searchable publishing assets.",
    href: "/services/content-creation",
    icon: "Sparkles",
    highlights: ["SEO systems", "Governed output", "Brand-safe"],
    accent: "violet",
  },
] as const;
