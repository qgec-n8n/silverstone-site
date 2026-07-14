import { useEffect, useRef, type RefObject } from "react";

/**
 * Fraction of the showcase section that must remain visible for a live demo
 * to keep running. Below this the demo is no longer meaningfully watchable,
 * so all playback (embeds, walkthrough timers, scroll animation) stands down.
 */
export const SHOWCASE_EXIT_RATIO = 0.12;

/**
 * Viewport-exit deactivation for a live showcase demo. While `active`, an
 * IntersectionObserver watches the section; when its visible fraction falls
 * below `SHOWCASE_EXIT_RATIO`, `onExit` fires (once — the observer only
 * exists while a demo is active, and deactivation flips `active` off).
 * Returning to the section never auto-resumes anything: re-entry simply shows
 * the standby state again.
 */
export function useShowcasePresence({
  active,
  sectionRef,
  onExit,
}: {
  active: boolean;
  sectionRef: RefObject<HTMLElement | null>;
  onExit: () => void;
}): void {
  const onExitRef = useRef(onExit);
  useEffect(() => {
    onExitRef.current = onExit;
  }, [onExit]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!active || !section || typeof IntersectionObserver === "undefined") {
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio < SHOWCASE_EXIT_RATIO) {
            onExitRef.current();
          }
        }
      },
      { threshold: [0, SHOWCASE_EXIT_RATIO] },
    );
    observer.observe(section);
    return () => {
      observer.disconnect();
    };
  }, [active, sectionRef]);
}
