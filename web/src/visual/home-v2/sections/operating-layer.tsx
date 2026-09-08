import type { CSSProperties } from "react";

import { Icon } from "../components/icon";
import { Reveal } from "../components/reveal";
import { SectionShell } from "../components/section-shell";

type OperatingPrinciple = {
  icon: string;
  label: string;
  detail: string;
};

/**
 * How the studio operates. These three used to open the body inside the
 * secondary hero; that hero now states what Silverstone AI *is*, and the
 * operating narrative follows the trust strip instead — below the fold, where
 * a reader who already knows the category learns how the work is run.
 */
const PRINCIPLES: readonly OperatingPrinciple[] = [
  {
    icon: "Unlock",
    label: "No lock-in pilots",
    detail: "Prove the value on real work first, then commit when it earns it.",
  },
  {
    icon: "Zap",
    label: "Live in weeks",
    detail: "From audit to a working system in weeks, not quarters.",
  },
  {
    icon: "UserCheck",
    label: "Human-in-the-loop",
    detail: "Your team keeps oversight of every decision the system makes.",
  },
] as const;

/** The Silverstone System — the operating layer, stated as three commitments. */
export function OperatingLayer() {
  return (
    <SectionShell
      tone="sky"
      id="operating-layer"
      eyebrow="Operating layer"
      title={
        <>
          The Silverstone{" "}
          <span className="ss-signal-text" data-sig="sky">
            System
          </span>
        </>
      }
      lead="Calls, messages, bookings and follow-ups converge into a single operating layer. Silverstone AI answers in seconds, captures the detail and routes the work, while your team keeps oversight of every outcome."
      containerSize="wide"
    >
      {/* Same card as the Standard's pillars, so the two commitment sections
          read as one family down the page. */}
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {PRINCIPLES.map((principle, index) => (
          <Reveal
            key={principle.label}
            delayMs={index * 70}
            kind="card"
            className="h-full"
          >
            <article
              className="ss-hv2-pillar h-full"
              style={{ "--ss-hv2-accent": "var(--ss-v2-sky)" } as CSSProperties}
            >
              <span className="ss-hv2-pillar__icon">
                <Icon name={principle.icon} className="size-5" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="ss-hv2-card__title text-xl">{principle.label}</h3>
                <p className="ss-hv2-pillar__text text-sm">{principle.detail}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
