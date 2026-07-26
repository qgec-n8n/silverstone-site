import {
  INTEGRATIONS_ROW_A,
  INTEGRATIONS_ROW_B,
  INTEGRATIONS_ROW_C,
} from "~/data/home-v2";

import { MarqueeRow } from "../components/marquee-row";
import { SectionShell } from "../components/section-shell";

type IntegrationCarouselProps = {
  marqueeEnabled: boolean;
};

/** Three counter-scrolling rows of coloured, icon-only integration marks. */
export function IntegrationCarousel({ marqueeEnabled }: IntegrationCarouselProps) {
  return (
    <SectionShell
      tone="orchid"
      eyebrow="Connected"
      title={
        <>
          Plugs into the tools you{" "}
          <span className="ss-signal-text" data-sig="orchid">
            already run
          </span>
          .
        </>
      }
      lead="No rip-and-replace assumption. Silverstone starts by mapping your existing stack, then confirms the safest connection points for voice, messaging, calendars, CRM, commerce, automation and data."
      align="center"
      containerSize="wide"
    >
      <div className="ss-hv2-integrations mt-12">
        <div className="ss-hv2-integrations__rows">
          <MarqueeRow
            marks={INTEGRATIONS_ROW_A}
            enabled={marqueeEnabled}
            direction="normal"
            durationSeconds={52}
            label="Integration logos, row one"
          />
          <MarqueeRow
            marks={INTEGRATIONS_ROW_B}
            enabled={marqueeEnabled}
            direction="reverse"
            durationSeconds={60}
            label="Integration logos, row two"
          />
          <MarqueeRow
            marks={INTEGRATIONS_ROW_C}
            enabled={marqueeEnabled}
            direction="normal"
            durationSeconds={56}
            label="Integration logos, row three"
          />
        </div>
      </div>
    </SectionShell>
  );
}
