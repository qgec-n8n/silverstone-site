import { useEffect, useRef, type ReactNode } from "react";

type ScrollProviderProps = {
  /** Resolved from the motion policy (`scrollChoreography`). */
  enabled: boolean;
  children: ReactNode;
};

/**
 * Single scroll owner for the V2 homepage. GSAP, ScrollTrigger, and Lenis are
 * dynamically imported inside the effect so the heavy modules never touch the
 * SSR/prerender path or the initial bundle, and never execute a browser global
 * at module scope.
 *
 * Lenis is driven by GSAP's ticker (one RAF loop) and feeds ScrollTrigger.update
 * so smooth scroll and scroll-linked animation share a single source of truth.
 * Two choreographies run: a hero-field parallax drift and the process-rail fill
 * (written as the `--ss-hv2-progress` custom property, smoothed by its CSS
 * transition). Reduced motion / the minimal tier (`enabled === false`) skips all
 * of it and instead presents the process rail as a completed line.
 */
export function ScrollProvider({ enabled, children }: ScrollProviderProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return undefined;
    }

    const railFill = root.querySelector('[data-ss-gsap="process-rail"]');

    if (!enabled) {
      // No choreography: show the rail full rather than as an empty track.
      if (railFill instanceof HTMLElement) {
        railFill.style.setProperty("--ss-hv2-progress", "100%");
      }
      return undefined;
    }

    const lifecycle = { disposed: false };
    let teardown: (() => void) | undefined;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }, lenisModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (lifecycle.disposed) {
        return;
      }

      const Lenis = lenisModule.default;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ duration: 1.1, smoothWheel: true });

      const syncScrollTrigger = () => {
        ScrollTrigger.update();
      };
      lenis.on("scroll", syncScrollTrigger);

      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const ctx = gsap.context(() => {
        // Hero field drifts slower than the page for cinematic depth.
        const heroField = root.querySelector('[data-ss-gsap="hero-field"]');
        const heroStage = heroField?.closest(".ss-hv2-hero");
        if (heroField && heroStage) {
          gsap.to(heroField, {
            yPercent: 14,
            ease: "none",
            scrollTrigger: {
              trigger: heroStage,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // Process rail fills as the steps scroll through the viewport.
        const processBlock =
          railFill?.closest(".ss-hv2-process") ?? railFill?.closest("section");
        if (railFill instanceof HTMLElement && processBlock) {
          ScrollTrigger.create({
            trigger: processBlock,
            start: "top 75%",
            end: "bottom 65%",
            onUpdate: (self) => {
              railFill.style.setProperty(
                "--ss-hv2-progress",
                `${(self.progress * 100).toFixed(2)}%`,
              );
            },
          });
        }
      }, root);

      // Positions depend on lazily-mounted hero media; recompute once wired up.
      ScrollTrigger.refresh();

      teardown = () => {
        ctx.revert();
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.off("scroll", syncScrollTrigger);
        lenis.destroy();
        if (railFill instanceof HTMLElement) {
          railFill.style.removeProperty("--ss-hv2-progress");
        }
      };
    })();

    return () => {
      lifecycle.disposed = true;
      teardown?.();
    };
  }, [enabled]);

  return (
    <div ref={rootRef} className="ss-hv2__content">
      {children}
    </div>
  );
}
