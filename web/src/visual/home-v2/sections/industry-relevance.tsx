import { Link } from "react-router";

import { INDUSTRY_SIGNALS } from "~/data/home-v2";

import { Icon } from "../components/icon";
import { Reveal } from "../components/reveal";
import { SectionShell } from "../components/section-shell";

/** Industry relevance without fabricated proof or industry-specific metrics. */
export function IndustryRelevance() {
  return (
    <SectionShell
      id="industries"
      eyebrow="Industry relevance"
      title={
        <>
          Built for businesses where <span className="ss-chrome-text">response</span>{" "}
          matters.
        </>
      }
      lead="Silverstone adapts the same system architecture to different operating realities: appointments, bookings, enquiries, quotes, support and follow-up."
      containerSize="wide"
    >
      <div className="ss-hv2-industries mt-14">
        {INDUSTRY_SIGNALS.map((industry, index) => (
          <Reveal key={industry.id} delayMs={index * 60} kind="card" className="h-full">
            <Link to={industry.href} className="ss-hv2-industry">
              <span className="ss-hv2-industry__mark" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex flex-col gap-2">
                <span className="ss-hv2-card__title text-xl">{industry.name}</span>
                <span className="text-sm text-[color:var(--ss-v2-titanium)]">
                  {industry.need}
                </span>
              </span>
              <Icon name="ArrowUpRight" className="ss-hv2-industry__arrow size-4" />
            </Link>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
