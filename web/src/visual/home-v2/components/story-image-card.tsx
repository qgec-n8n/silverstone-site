import { ExpandableImage } from "~/components/media/expandable-image";
import type { StoryPanel } from "~/data/home-v2";
import { cn } from "~/lib/utils";

import { Reveal } from "./reveal";

type StoryImageCardProps = {
  panel: StoryPanel;
};

/**
 * One image-storytelling row: cinematic media on one side, copy on the other.
 * Desktop ordering follows `panel.align`; on mobile the media always leads. The
 * media and the copy block each reveal as their own target with a small stagger.
 */
export function StoryImageCard({ panel }: StoryImageCardProps) {
  const mediaRight = panel.align === "right";

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <Reveal className={cn(mediaRight && "lg:order-2")} kind="image">
        <figure className="ss-hv2-story__media">
          <ExpandableImage alt={panel.alt} src={panel.image}>
            <img
              src={panel.image}
              alt={panel.alt}
              className="ss-hv2-img-mask"
              loading="lazy"
              decoding="async"
            />
          </ExpandableImage>
        </figure>
      </Reveal>

      <Reveal
        delayMs={110}
        className={cn("flex flex-col gap-4", mediaRight && "lg:order-1")}
        kind="section"
      >
        <span className="ss-eyebrow font-mono text-[color:var(--ss-v2-signal-cyan-soft)]">
          {panel.eyebrow}
        </span>
        <h3 className="ss-hv2-display text-3xl sm:text-4xl">{panel.title}</h3>
        <p className="ss-lead ss-hv2-copy">{panel.body}</p>
      </Reveal>
    </div>
  );
}
