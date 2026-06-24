import { INTEGRATIONS_ROW_A, INTEGRATIONS_ROW_B } from "~/data/home-v2";

import { MarqueeRow } from "../components/marquee-row";
import { SectionShell } from "../components/section-shell";

type IntegrationCarouselProps = {
  marqueeEnabled: boolean;
};

/** Two counter-scrolling rows of local integration marks. */
export function IntegrationCarousel({ marqueeEnabled }: IntegrationCarouselProps) {
  return (
    <SectionShell
      eyebrow="Connected"
      title={
        <>
          Plugs into the tools you <span className="ss-chrome-text">already run</span>.
        </>
      }
      lead="No rip-and-replace. Silverstone connects across voice, messaging, calendars, CRM and commerce."
      align="center"
      containerSize="wide"
    >
      <div className="mt-12 flex flex-col gap-4">
        <MarqueeRow
          marks={INTEGRATIONS_ROW_A}
          enabled={marqueeEnabled}
          direction="normal"
          durationSeconds={46}
        />
        <MarqueeRow
          marks={INTEGRATIONS_ROW_B}
          enabled={marqueeEnabled}
          direction="reverse"
          durationSeconds={52}
        />
      </div>
    </SectionShell>
  );
}
