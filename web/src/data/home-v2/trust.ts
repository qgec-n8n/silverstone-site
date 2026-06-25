/**
 * Trust band + the "Silverstone Standard" pillars used across the V2 homepage.
 */

export type TrustSignal = {
  id: string;
  label: string;
  icon: string;
};

export const TRUST_SIGNALS: readonly TrustSignal[] = [
  { id: "uk-built", label: "UK-built", icon: "MapPin" },
  { id: "london", label: "London-based", icon: "MapPin" },
  { id: "human", label: "Human-reviewed automation", icon: "UserCheck" },
  { id: "no-lock-in", label: "No lock-in pilots", icon: "Unlock" },
  { id: "speed", label: "Live in weeks", icon: "Zap" },
  { id: "gdpr", label: "GDPR-conscious by design", icon: "ShieldCheck" },
] as const;

export type StandardPillar = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export const SILVERSTONE_STANDARD: readonly StandardPillar[] = [
  {
    id: "measurable",
    title: "No hype, just measurable wins",
    description:
      "Every engagement is scoped against outcomes you can see — hours saved, enquiries captured, revenue recovered.",
    icon: "Gauge",
  },
  {
    id: "human-control",
    title: "A human always in control",
    description:
      "Automation does the heavy lifting; people hold the judgement. Review points are built into every workflow.",
    icon: "UserCheck",
  },
  {
    id: "integrated",
    title: "Built on the tools you have",
    description:
      "We connect to your existing stack rather than forcing a rebuild — no rip-and-replace, no lock-in.",
    icon: "Plug",
  },
  {
    id: "craft",
    title: "Engineered, not bolted on",
    description:
      "Systems are designed, specified and tested like product — refined until they hold up under real load.",
    icon: "Diamond",
  },
] as const;
