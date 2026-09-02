/**
 * Global navigation data for the V2 shell — header mega menus, primary links
 * and footer columns. Routes are the canonical Silverstone IA; service and
 * industry slugs live under `/services/*`.
 */
import {
  Building2,
  ConciergeBell,
  Diamond,
  Dumbbell,
  Globe,
  HeartPulse,
  Headset,
  type LucideIcon,
  PhoneCall,
  Scissors,
  Send,
  ShoppingBag,
  Smartphone,
  Smile,
  Sparkles,
  Workflow,
  Wrench,
} from "~/components/icons/lucide";

export type NavLeaf = {
  href: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
};

export type NavMenu = {
  id: string;
  label: string;
  href: string;
  viewAllLabel: string;
  viewAllDescription: string;
  items: readonly NavLeaf[];
};

export const SERVICES_MENU: NavMenu = {
  id: "services",
  label: "Services",
  href: "/services",
  viewAllLabel: "View all services",
  viewAllDescription: "Browse the full service architecture",
  items: [
    {
      href: "/services/web-design-development",
      label: "Web Design & Development",
      description: "Conversion-first websites",
      icon: Globe,
    },
    {
      href: "/services/app-development",
      label: "App Development",
      description: "iOS, Android & web apps",
      icon: Smartphone,
    },
    {
      href: "/services/ai-voice-agents",
      label: "AI Voice Agents",
      description: "Controlled call workflows",
      icon: PhoneCall,
    },
    {
      href: "/services/ai-receptionists",
      label: "AI Receptionists",
      description: "Qualified inquiry routing",
      icon: Headset,
    },
    {
      href: "/services/ai-automation",
      label: "AI Automation",
      description: "Governed workflow systems",
      icon: Workflow,
    },
    {
      href: "/services/ai-consulting",
      label: "AI & Automation Consulting",
      description: "Roadmaps before tools",
      icon: Workflow,
    },
    {
      href: "/services/content-creation",
      label: "Content Creation",
      description: "Governed authority assets",
      icon: Sparkles,
    },
  ],
};

export const INDUSTRIES_MENU: NavMenu = {
  id: "industries",
  label: "Solutions",
  href: "/industry",
  viewAllLabel: "Explore all solutions",
  viewAllDescription: "One operating system for every industry",
  items: [
    {
      href: "/industry/estate-agents",
      label: "For Estate Agents",
      description: "Inquiry-to-viewing pipeline",
      icon: Building2,
    },
    {
      href: "/industry/hospitality",
      label: "For Hospitality Venues",
      description: "Guest-journey orchestration",
      icon: ConciergeBell,
    },
    {
      href: "/industry/salons-barbers",
      label: "For Salons & Barbers",
      description: "Full-diary intelligence",
      icon: Scissors,
    },
    {
      href: "/industry/aesthetic-clinics",
      label: "For Skin & Aesthetic Clinics",
      description: "Consultations, secured",
      icon: Diamond,
    },
    {
      href: "/industry/trades",
      label: "For Trades & Home Services",
      description: "Job intake & follow-through",
      icon: Wrench,
    },
    {
      href: "/industry/ecommerce",
      label: "For eCommerce Brands",
      description: "Commerce ops intelligence",
      icon: ShoppingBag,
    },
    {
      href: "/industry/physios-chiropractors",
      label: "For Physios & Chiropractors",
      description: "Clinically bounded access",
      icon: HeartPulse,
    },
    {
      href: "/industry/dentists",
      label: "For Dental Practices",
      description: "Patient access systems",
      icon: Smile,
    },
    {
      href: "/industry/gyms-fitness-studios",
      label: "For Gyms & Fitness Studios",
      description: "Trial-to-membership conversion",
      icon: Dumbbell,
    },
    {
      href: "/industry/fitness-coaches",
      label: "For Fitness Coaches",
      description: "Lead-to-client system",
      icon: Send,
    },
  ],
};

export const PRIMARY_LINKS: readonly NavLeaf[] = [
  { href: "/how-we-work", label: "How we work" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/book", label: "Book" },
];

export const PRIMARY_CTA: NavLeaf = {
  href: "/book#booking-calendar",
  label: "Book a discovery call",
};

export type FooterColumn = {
  title: string;
  links: readonly NavLeaf[];
};

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    title: "Services",
    links: [
      ...SERVICES_MENU.items.map(({ href, label }) => ({ href, label })),
      { href: "/services", label: "All services" },
    ],
  },
  {
    title: "Industries",
    links: [
      /* The footer keeps plain industry names; the "For …" framing belongs
         to the header's Solutions menu. Seven rather than six since the
         aesthetic-clinics page joined the menu at position four — widening
         the slice adds it without displacing a sector that already held a
         site-wide footer link. */
      ...INDUSTRIES_MENU.items
        .slice(0, 7)
        .map(({ href, label }) => ({ href, label: label.replace(/^For /u, "") })),
      { href: "/industry", label: "All industries" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/how-we-work", label: "How we work" },
      { href: "/about", label: "About" },
      { href: "/blog", label: "Insights" },
      { href: "/pricing", label: "Pricing" },
      { href: "/contact", label: "Contact" },
    ],
  },
];
