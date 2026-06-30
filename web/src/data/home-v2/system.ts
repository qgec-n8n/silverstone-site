/**
 * Qualitative homepage operating-system narrative. Keep this free of invented
 * performance figures, customer names, integrations or unsupported proof.
 */

export type SystemLayer = {
  id: string;
  title: string;
  summary: string;
  icon: string;
  accent: "cyan" | "blue" | "violet" | "platinum";
};

export const SYSTEM_LAYERS: readonly SystemLayer[] = [
  {
    id: "strategy",
    title: "Strategy",
    summary: "Find the operational pressure points worth solving first.",
    icon: "Search",
    accent: "platinum",
  },
  {
    id: "design",
    title: "Design",
    summary: "Specify journeys, handoffs, safeguards and the customer experience.",
    icon: "PencilRuler",
    accent: "cyan",
  },
  {
    id: "agents",
    title: "AI agents",
    summary: "Give routine conversations and decisions a governed operating model.",
    icon: "Sparkles",
    accent: "blue",
  },
  {
    id: "software",
    title: "Software",
    summary:
      "Build the websites, applications and interfaces that make the system usable.",
    icon: "Globe",
    accent: "violet",
  },
  {
    id: "integrations",
    title: "Integrations",
    summary:
      "Connect calendars, forms, CRM, data and workflow tools where access allows.",
    icon: "Plug",
    accent: "cyan",
  },
  {
    id: "optimisation",
    title: "Optimisation",
    summary: "Review the signal, tune the system and improve the operating rhythm.",
    icon: "TrendingUp",
    accent: "platinum",
  },
] as const;

export type OutcomePattern = {
  id: string;
  problem: string;
  outcome: string;
  detail: string;
  icon: string;
};

export const OUTCOME_PATTERNS: readonly OutcomePattern[] = [
  {
    id: "missed-enquiries",
    problem: "Missed enquiries",
    outcome: "Respond while intent is still fresh",
    detail:
      "Voice, form and message workflows can capture the request, ask the next question and route it to the right place.",
    icon: "PhoneCall",
  },
  {
    id: "admin-drag",
    problem: "Admin drag",
    outcome: "Move repetitive work out of the team queue",
    detail:
      "Document handling, follow-up, reminders and internal updates can be standardised without losing human review.",
    icon: "Workflow",
  },
  {
    id: "weak-journeys",
    problem: "Weak digital journeys",
    outcome: "Turn attention into booked conversations",
    detail:
      "Websites, applications and content systems are designed around the journey from first visit to next step.",
    icon: "Globe",
  },
  {
    id: "disconnected-tools",
    problem: "Disconnected tools",
    outcome: "Create one operational picture",
    detail:
      "Silverstone maps the stack, identifies viable connection points and designs clear handoffs before build.",
    icon: "Plug",
  },
] as const;

export type IndustrySignal = {
  id: string;
  name: string;
  need: string;
  href: string;
};

export const INDUSTRY_SIGNALS: readonly IndustrySignal[] = [
  {
    id: "estate-agents",
    name: "Estate agents",
    need: "Property enquiries, viewing requests and follow-up that need fast routing.",
    href: "/industries/estate-agents",
  },
  {
    id: "hospitality",
    name: "Hospitality",
    need: "Bookings, messages and guest questions that arrive outside quiet office hours.",
    href: "/industries/hospitality",
  },
  {
    id: "trades",
    name: "Trades",
    need: "Job leads, missed calls and quote follow-up that can slip during site work.",
    href: "/industries/trades",
  },
  {
    id: "fitness",
    name: "Gyms and studios",
    need: "Membership enquiries, class interest and reminders across busy front desks.",
    href: "/industries/gyms-fitness-studios",
  },
  {
    id: "clinics",
    name: "Clinics and practices",
    need: "Patient enquiries, appointment intent and admin handoffs that need care.",
    href: "/industries/physios-chiropractors",
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    need: "Product questions, abandoned journeys and support requests that shape revenue.",
    href: "/industries/ecommerce",
  },
] as const;
