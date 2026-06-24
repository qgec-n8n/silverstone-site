import { useCallback, useEffect, useRef, useState } from "react";

import { useReducedMotion } from "~/components/accessibility/use-reduced-motion";

export type SectionReveal = {
  ref: (node: HTMLElement | null) => void;
  revealed: boolean;
};

/**
 * Reveals a section the first time it scrolls into view. Reduced motion (or a
 * missing IntersectionObserver) resolves to revealed immediately, so content is
 * never gated behind motion — only its settle transition is.
 *
 * Consumers must destructure the result (`const { ref, revealed } = …`) and pass
 * the bare locals; reading members off the returned object during render trips
 * the `react-hooks/refs` compiler analysis.
 */
export function useSectionReveal(): SectionReveal {
  const { reducedMotion } = useReducedMotion();
  const [intersected, setIntersected] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (node === null || reducedMotion) {
        return;
      }

      if (typeof IntersectionObserver === "undefined") {
        setIntersected(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setIntersected(true);
              observer.disconnect();
              observerRef.current = null;
              break;
            }
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [reducedMotion],
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  // Reduced motion resolves to revealed without gating content behind motion;
  // the derived value keeps state out of the effect body.
  return { ref, revealed: intersected || reducedMotion };
}
