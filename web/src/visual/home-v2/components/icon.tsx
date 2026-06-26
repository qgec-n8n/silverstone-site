import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Check,
  Diamond,
  Gauge,
  Globe,
  Headset,
  type LucideIcon,
  MapPin,
  PencilRuler,
  PhoneCall,
  Plug,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Unlock,
  UserCheck,
  Workflow,
  Zap,
} from "~/components/icons/lucide";

/**
 * Explicit, tree-shakeable registry of the lucide marks referenced by the V2
 * homepage data. Typed as an index signature so lookups are `LucideIcon |
 * undefined` under `noUncheckedIndexedAccess`, forcing a safe fallback.
 */
const ICONS: Record<string, LucideIcon> = {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Check,
  Diamond,
  Gauge,
  Globe,
  Headset,
  MapPin,
  PencilRuler,
  PhoneCall,
  Plug,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Unlock,
  UserCheck,
  Workflow,
  Zap,
};

type IconProps = {
  name: string;
  className?: string;
  strokeWidth?: number;
};

export function Icon({ name, className, strokeWidth = 1.5 }: IconProps) {
  const Resolved = ICONS[name] ?? Sparkles;
  return (
    <Resolved aria-hidden="true" className={className} strokeWidth={strokeWidth} />
  );
}
