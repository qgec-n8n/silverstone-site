import type { StoryPanel } from "~/data/home-v2";
import { cn } from "~/lib/utils";
import { useSectionReveal } from "~/visual/hooks/use-section-reveal";

type StoryImageCardProps = {
  panel: StoryPanel;
};

/**
 * One image-storytelling row: cinematic media on one side, copy on the other.
 * Desktop ordering follows `panel.align`; on mobile the media always leads.
 */
export function StoryImageCard({ panel }: StoryImageCardProps) {
  const { ref, revealed } = useSectionReveal();
  const mediaRight = panel.align === "right";

  return (
    <div
      ref={ref}
      data-revealed={revealed}
      className="ss-hv2-reveal grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
    >
      <figure className={cn("ss-hv2-story__media", mediaRight && "lg:order-2")}>
        <img src={panel.image} alt={panel.alt} loading="lazy" decoding="async" />
      </figure>

      <div className={cn("flex flex-col gap-4", mediaRight && "lg:order-1")}>
        <span className="ss-eyebrow font-mono text-[color:var(--ss-v2-signal-cyan-soft)]">
          {panel.eyebrow}
        </span>
        <h3 className="ss-hv2-display text-3xl sm:text-4xl">{panel.title}</h3>
        <p className="ss-lead text-[color:var(--ss-v2-titanium)]">{panel.body}</p>
      </div>
    </div>
  );
}
