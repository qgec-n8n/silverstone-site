/**
 * Global navigation data for the V2 shell — header mega menus, primary links
 * and footer columns. Routes are the canonical Silverstone IA; service and
 * industry slugs live under `/services/*`.
 */
import {
  Globe,
  Headset,
  type LucideIcon,
  PhoneCall,
  Smartphone,
  Sparkles,
  Workflow,
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
  items: readonly NavLeaf[];
};

export const SERVICES_MENU: NavMenu = {
  id: "services",
  label: "Services",
  href: "/services",
  viewAllLabel: "View all services",
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
      description: "Qualified enquiry routing",
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
  label: "Industries",
  href: "/industry",
  viewAllLabel: "View all industries",
  items: [
    { href: "/industry/estate-agents", label: "Estate Agents" },
    { href: "/industry/hospitality", label: "Hospitality" },
    { href: "/industry/salons-barbers", label: "Salons & Barbers" },
    { href: "/industry/trades", label: "Trades & Home Services" },
    { href: "/industry/ecommerce", label: "eCommerce Brands" },
    { href: "/industry/physios-chiropractors", label: "Physio & Chiropractic" },
    { href: "/industry/dentists", label: "Dental Practices" },
    { href: "/industry/gyms-fitness-studios", label: "Gyms & Fitness Studios" },
    { href: "/industry/fitness-coaches", label: "Fitness Coaches" },
  ],
};

export const PRIMARY_LINKS: readonly NavLeaf[] = [
  { href: "/how-we-work", label: "How we work" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
];

export const PRIMARY_CTA: NavLeaf = {
  href: "/book",
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
      ...INDUSTRIES_MENU.items.slice(0, 6).map(({ href, label }) => ({ href, label })),
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
