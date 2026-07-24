import { SERVICE_UNIVERSE } from "~/data/home-v2";

import { DisplayCard } from "../components/display-card";
import { Reveal } from "../components/reveal";
import { SectionShell } from "../components/section-shell";

/** The services "operating system" — six Display Cards in a constellation grid. */
export function ServicesUniverse() {
  return (
    <SectionShell
      id="services"
      eyebrow="The system"
      title={
        <>
          One studio.{" "}
          <span className="ss-signal-text" data-sig="aqua">
            Every layer
          </span>{" "}
          of your operation.
        </>
      }
      lead="Six connected capabilities that plug into the tools you already run — deployed on their own or as one operating system."
      containerSize="wide"
    >
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_UNIVERSE.map((card, index) => (
          <Reveal key={card.id} delayMs={index * 70} kind="card" className="h-full">
            <DisplayCard card={card} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
