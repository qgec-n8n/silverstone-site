import { PROCESS_STEPS } from "~/data/home-v2";

import { Icon } from "../components/icon";
import { Reveal } from "../components/reveal";
import { SectionShell } from "../components/section-shell";

/** The Silverstone method — a four-step narrative with a scroll-driven rail. */
export function ProcessStory() {
  return (
    <SectionShell
      eyebrow="The method"
      title={
        <>
          From missed calls to a{" "}
          <span className="ss-signal-text" data-sig="magenta">
            working system
          </span>
          .
        </>
      }
      lead="A clear route from problem to live automation — with you in control at every checkpoint."
    >
      <div className="ss-hv2-process relative mt-14">
        <div className="ss-hv2-process__rail" aria-hidden="true">
          <span className="ss-hv2-process__rail-fill" data-ss-gsap="process-rail" />
        </div>
        <ol className="flex flex-col gap-10">
          {PROCESS_STEPS.map((step, index) => (
            <li key={step.id}>
              <Reveal delayMs={index * 60} className="relative flex gap-5">
                <span className="ss-hv2-step__marker">{step.number}</span>
                <div className="flex flex-col gap-2 pt-1.5">
                  <div className="flex items-center gap-3">
                    <Icon
                      name={step.icon}
                      className="size-5 text-[color:var(--ss-v2-signal-cyan-soft)]"
                    />
                    <h3 className="ss-hv2-card__title text-2xl">{step.title}</h3>
                  </div>
                  <p className="font-semibold text-[color:var(--ss-v2-platinum)]">
                    {step.summary}
                  </p>
                  <p className="text-[color:var(--ss-v2-titanium)]">{step.detail}</p>
                  <p className="ss-hv2-card__index mt-1">{step.outcome}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
