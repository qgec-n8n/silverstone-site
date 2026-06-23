import { useEffect, useState } from "react";

import { useReducedMotion } from "~/components/accessibility/use-reduced-motion";

export type PageTransition = {
  entered: boolean;
  className: string;
};

/**
 * Drives the one-shot page-entry transition. Reduced motion resolves to entered
 * immediately (no transition); otherwise it flips on the next animation frame so
 * the entry settle can run from the initial paint.
 */
export function usePageTransition(): PageTransition {
  const { reducedMotion } = useReducedMotion();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setAnimated(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  // Reduced motion resolves to entered without a settle transition; the derived
  // value keeps state out of the effect body.
  const entered = animated || reducedMotion;

  return {
    entered,
    className: entered ? "ss-page is-entered" : "ss-page",
  };
}
