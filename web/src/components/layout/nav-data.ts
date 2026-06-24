export type NavLink = {
  description?: string;
  family?: string;
  href: string;
  label: string;
};

export const serviceLinks: NavLink[] = [
  {
    description: "Conversion-focused websites, engineered to perform.",
    family: "engineering",
    href: "/services/web-design-development",
    label: "Web Design & Development",
  },
  {
    description: "Bespoke web and mobile applications, built to scale.",
    family: "engineering",
    href: "/services/app-development",
    label: "Custom App Development",
  },
  {
    description: "Natural-sounding voice agents that answer and book.",
    family: "intelligence",
    href: "/services/ai-voice-agents",
    label: "AI Voice Agents",
  },
  {
    description: "Round-the-clock call handling, triage and routing.",
    family: "intelligence",
    href: "/services/ai-receptionists",
    label: "AI Receptionists",
  },
  {
    description: "On-brand content and repurposing at production scale.",
    family: "signal",
    href: "/services/content-creation",
    label: "Content Creation & Repurposing",
  },
  {
    description: "Connected agent workflows that remove manual steps.",
    family: "automation",
    href: "/services/ai-automation",
    label: "AI Automation & Agent Workflows",
  },
];

export const industryLinks: NavLink[] = [
  { href: "/services/estate-agents", label: "Estate Agents" },
  { href: "/services/hospitality", label: "Hospitality" },
  { href: "/services/salons-barbers", label: "Salons & Barbers" },
  { href: "/services/trades", label: "Trades & Home Services" },
  { href: "/services/ecommerce", label: "eCommerce Brands" },
  { href: "/services/physios-chiropractors", label: "Physio & Chiropractic Clinics" },
  { href: "/services/dentists", label: "Dental Practices" },
  { href: "/services/gyms-fitness-studios", label: "Gyms & Fitness Studios" },
  { href: "/services/fitness-coaches", label: "Fitness Coaches" },
];

export const primaryNavLinks: NavLink[] = [
  { href: "/how-we-work", label: "How we work" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "About" },
];

export const footerCompanyLinks: NavLink[] = [
  { href: "/how-we-work", label: "How we work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Insights" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export const footerLegalLinks: NavLink[] = [
  { href: "/privacy-policy", label: "Privacy policy" },
];

export const primaryCta: NavLink = {
  href: "/book",
  label: "Book a discovery call",
};

export const ctaPillClass =
  "ss-focus-ring ss-transition-interactive inline-flex items-center justify-center gap-2 rounded-[var(--ss-radius-pill)] bg-[var(--ss-color-action-primary-bg)] px-5 py-2.5 text-body-sm font-semibold text-[var(--ss-color-action-primary-fg)] no-underline hover:bg-[var(--ss-color-action-primary-hover-bg)] hover:shadow-[var(--ss-v2-glow-family)]";
