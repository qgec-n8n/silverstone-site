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
    tagline: "Phone lines that never miss",
    description:
      "Natural-sounding voice agents answer, qualify and book — capturing every call your team can't reach.",
    href: "/services/ai-voice-agents",
    icon: "PhoneCall",
    highlights: ["Answer in under 10s", "Qualify & route", "Live call summaries"],
    accent: "cyan",
  },
  {
    id: "receptionists",
    index: "02",
    title: "AI Receptionists",
    tagline: "A front desk that never sleeps",
    description:
      "Calls, chat and messaging handled around the clock, with bookings written straight into your calendar.",
    href: "/services/ai-receptionists",
    icon: "Headset",
    highlights: ["24/7 coverage", "Calendar-aware", "Human handoff"],
    accent: "blue",
  },
  {
    id: "automation",
    index: "03",
    title: "AI Agents & Automation",
    tagline: "Workflows that run themselves",
    description:
      "Agentic workflows connect the tools you already use and clear repetitive back-office work end to end.",
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
    highlights: ["iOS, Android & web", "Secure by design", "Built to scale"],
    accent: "blue",
  },
  {
    id: "content",
    index: "06",
    title: "Content Creation",
    tagline: "Visibility on autopilot",
    description:
      "AI-assisted content and SEO systems that keep you discoverable and compounding reach month over month.",
    href: "/services/content-creation",
    icon: "Sparkles",
    highlights: ["SEO engines", "Always-on output", "Brand-safe"],
    accent: "violet",
  },
] as const;
