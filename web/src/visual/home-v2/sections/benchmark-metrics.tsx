import { OUTCOME_PATTERNS } from "~/data/home-v2";

import { Icon } from "../components/icon";
import { Reveal } from "../components/reveal";
import { SectionShell } from "../components/section-shell";

/** Business outcome patterns without unsupported numerical claims. */
export function BenchmarkMetrics() {
  return (
    <SectionShell
      eyebrow="Business outcomes"
      title={
        <>
          Where better systems change the <span className="ss-chrome-text">day</span>.
        </>
      }
      lead="The homepage is built around practical commercial problems: missed intent, slow admin, weak journeys and disconnected tools. Silverstone designs the operating system that gives each one a clear next action."
      containerSize="wide"
    >
      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {OUTCOME_PATTERNS.map((pattern, index) => (
          <Reveal key={pattern.id} delayMs={index * 70} className="h-full">
            <article className="ss-hv2-outcome">
              <span className="ss-hv2-outcome__icon">
                <Icon name={pattern.icon} className="size-5" />
              </span>
              <div className="flex flex-col gap-2">
                <p className="ss-hv2-card__index">{pattern.problem}</p>
                <h3 className="ss-hv2-card__title text-2xl">{pattern.outcome}</h3>
                <p className="text-[color:var(--ss-v2-titanium)]">{pattern.detail}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
