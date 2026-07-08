import { STORY_PANELS } from "~/data/home-v2";

import { SectionShell } from "../components/section-shell";
import { StoryImageCard } from "../components/story-image-card";

/** Alternating cinematic image + copy panels. */
export function ImageStorytelling() {
  return (
    <SectionShell
      eyebrow="In practice"
      title={
        <>
          What it feels like when nothing <span className="ss-signal-text">slips</span>.
        </>
      }
      containerSize="wide"
    >
      <div className="mt-14 flex flex-col gap-16 lg:gap-24">
        {STORY_PANELS.map((panel) => (
          <StoryImageCard key={panel.id} panel={panel} />
        ))}
      </div>
    </SectionShell>
  );
}
