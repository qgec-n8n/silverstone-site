/**
 * Trust band + the "Silverstone Standard" pillars used across the V2 homepage.
 */

export type TrustSignal = {
  id: string;
  label: string;
  icon: string;
};

/**
 * Six facts the studio can stand behind on every page. Deliberately no
 * regulatory or certification claim: compliance positioning is handled
 * outside the site, and a chip that reads as a certificate is a claim.
 */
export const TRUST_SIGNALS: readonly TrustSignal[] = [
  { id: "markets", label: "US & UK clients", icon: "Globe" },
  { id: "london", label: "London studio, US-based team", icon: "MapPin" },
  { id: "human", label: "Human-reviewed automation", icon: "UserCheck" },
  { id: "no-lock-in", label: "Scoped before build", icon: "Unlock" },
  { id: "delivery", label: "Staged implementation", icon: "Zap" },
  { id: "coverage", label: "24-hour team coverage", icon: "Headset" },
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
    title: "No hype, just visible progress",
    description:
      "Every engagement is scoped around observable workflow improvements before build decisions are made.",
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
      "We assess your current stack first, then design the lightest viable route to connection and control.",
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
