/**
 * Guided phone walkthrough for the Web Design live showcase.
 *
 * The demo sites are cross-origin, so their documents cannot be script-
 * scrolled from this page (opaque iframes, no postMessage contract, no CORS
 * on their sitemaps). The walkthrough therefore renders each page in an
 * iframe sized to the page's FULL measured height at the phone's logical
 * viewport (390×844) and translates that tall frame upward inside the phone
 * screen's clip — the real production page, genuinely travelling past the
 * viewport, with element-level motion standing in for the internal scroll the
 * browser's security model forbids.
 *
 * The page list and per-page heights come from
 * `generated/walkthrough-pages.json`, produced by
 * `scripts/generate-demo-walkthrough.mjs` from each demo site's sitemap and
 * rendered primary navigation — never a hand-maintained list.
 *
 * Sequence per page: connect → brief settle → scroll top-to-bottom → hold at
 * the bottom (`WALKTHROUGH_BOTTOM_DWELL_MS`) → advance to the next page's
 * top. After the final page's hold the walkthrough asks its owner to stand
 * the demo down (`onEnded`). A generation counter invalidates every timer and
 * animation the moment the walkthrough deactivates, so repeated start/stop
 * toggles can never leak timers, stack animations, or fire stale callbacks.
 *
 * Reduced motion: no animated scrolling — each page holds at its top, steps
 * once to its bottom, holds, then advances.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { animate, type MotionValue } from "motion/react";

import rawWalkthrough from "./generated/walkthrough-pages.json";
import type { ShowcaseSiteId } from "./showcase-state";

export type WalkthroughPage = {
  path: string;
  title: string;
  /** Full document height at the walkthrough viewport, in logical px. */
  height: number;
};

export type WalkthroughSite = {
  origin: string;
  pages: WalkthroughPage[];
};

/** Logical phone viewport the walkthrough pages were measured at. */
export const WALKTHROUGH_VIEWPORT = rawWalkthrough.viewport;

/** Auto-scroll speed through a page, in logical px per second. */
export const WALKTHROUGH_SCROLL_SPEED = 1300;
/** Hold at each page's bottom before moving to the next page. */
export const WALKTHROUGH_BOTTOM_DWELL_MS = 1000;
/** Settle after a page connects before its scroll begins. */
export const WALKTHROUGH_SETTLE_MS = 700;
/** Reduced motion: hold at a page's top before stepping to its bottom. */
export const WALKTHROUGH_REDUCED_HOLD_MS = 2400;

const walkthroughSites = rawWalkthrough.sites as Record<
  string,
  WalkthroughSite | undefined
>;

/** Pages for one demo site; null when no usable generated data exists. */
export function walkthroughSite(id: ShowcaseSiteId): WalkthroughSite | null {
  const site = walkthroughSites[id];
  if (!site) {
    return null;
  }
  const pages = site.pages.filter(
    (page) => page.path.startsWith("/") && page.height > 0,
  );
  return pages.length > 0 ? { origin: site.origin, pages } : null;
}

/** How far a page scrolls: everything beyond the first phone viewport. */
export function pageScrollDistance(page: WalkthroughPage): number {
  return Math.max(0, page.height - WALKTHROUGH_VIEWPORT.height);
}

/**
 * Seconds for one page's top-to-bottom travel. Clamped so short pages still
 * read as a deliberate pan and very long pages cannot stall the tour.
 */
export function pageScrollDuration(distance: number): number {
  return Math.min(16, Math.max(1.6, distance / WALKTHROUGH_SCROLL_SPEED));
}

/** Short human label for the HUD, from the page title's leading segment. */
export function pageLabel(page: WalkthroughPage): string {
  const fromTitle = page.title.split("|")[0]?.trim();
  if (fromTitle) {
    return fromTitle;
  }
  const slug = page.path.split("/").filter(Boolean).pop() ?? "";
  if (!slug) {
    return "Home";
  }
  const words = slug.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export type WalkthroughStage = "loading" | "touring";

export function useShowcaseWalkthrough({
  active,
  site,
  reducedMotion,
  y,
  onEnded,
}: {
  /** True while this site's phone surface owns the live demo. */
  active: boolean;
  site: WalkthroughSite | null;
  reducedMotion: boolean;
  /** Vertical travel of the tall page frame, in logical px (≤ 0). */
  y: MotionValue<number>;
  /** Called exactly once per run when the tour finishes or must abort. */
  onEnded: () => void;
}): {
  pageIndex: number;
  stage: WalkthroughStage;
  currentPage: WalkthroughPage | null;
  /** Wire to the walkthrough iframe's onLoad. */
  onFrameLoad: () => void;
} {
  const [pageIndex, setPageIndex] = useState(0);
  const [stage, setStage] = useState<WalkthroughStage>("loading");
  const [wasActive, setWasActive] = useState(active);
  const pageIndexRef = useRef(0);
  const stageRef = useRef<WalkthroughStage>("loading");
  // Every activation restarts the tour from its first page — adjusted during
  // render (not in an effect) so the reset lands in the same commit that
  // mounts the first page's frame.
  if (active !== wasActive) {
    setWasActive(active);
    if (active) {
      setPageIndex(0);
      setStage("loading");
    }
  }
  const runRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const siteRef = useRef(site);
  const reducedMotionRef = useRef(reducedMotion);
  const onEndedRef = useRef(onEnded);
  useEffect(() => {
    siteRef.current = site;
    reducedMotionRef.current = reducedMotion;
    onEndedRef.current = onEnded;
  }, [site, reducedMotion, onEnded]);

  const halt = useCallback(() => {
    runRef.current += 1;
    controlsRef.current?.stop();
    controlsRef.current = null;
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const schedule = useCallback((run: number, delayMs: number, step: () => void) => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      if (run === runRef.current) {
        step();
      }
    }, delayMs);
  }, []);

  const finishPage = useCallback(
    (run: number, index: number) => {
      schedule(run, WALKTHROUGH_BOTTOM_DWELL_MS, () => {
        const pages = siteRef.current?.pages ?? [];
        const next = index + 1;
        if (next >= pages.length) {
          onEndedRef.current();
          return;
        }
        y.set(0);
        pageIndexRef.current = next;
        setPageIndex(next);
        stageRef.current = "loading";
        setStage("loading");
      });
    },
    [schedule, y],
  );

  const beginPage = useCallback(
    (run: number, index: number) => {
      const page = siteRef.current?.pages[index];
      if (!page) {
        onEndedRef.current();
        return;
      }
      const distance = pageScrollDistance(page);
      if (reducedMotionRef.current) {
        schedule(run, WALKTHROUGH_REDUCED_HOLD_MS, () => {
          y.set(-distance);
          finishPage(run, index);
        });
        return;
      }
      controlsRef.current = animate(y, -distance, {
        duration: pageScrollDuration(distance),
        ease: "easeInOut",
        onComplete: () => {
          if (run === runRef.current) {
            finishPage(run, index);
          }
        },
      });
    },
    [finishPage, schedule, y],
  );

  const onFrameLoad = useCallback(() => {
    // In-page redirects refire onLoad mid-tour; only a loading page starts.
    if (stageRef.current !== "loading") {
      return;
    }
    const run = runRef.current;
    schedule(run, WALKTHROUGH_SETTLE_MS, () => {
      if (stageRef.current !== "loading") {
        return;
      }
      stageRef.current = "touring";
      setStage("touring");
      beginPage(run, pageIndexRef.current);
    });
  }, [beginPage, schedule]);

  useEffect(() => {
    if (!active) {
      return undefined;
    }
    runRef.current += 1;
    pageIndexRef.current = 0;
    stageRef.current = "loading";
    y.set(0);

    // A hidden tab cannot host a meaningful tour; stand the demo down rather
    // than let timers pile up for a resume nobody asked for.
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        onEndedRef.current();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      halt();
      y.set(0);
    };
  }, [active, halt, y]);

  return {
    pageIndex,
    stage,
    currentPage: site?.pages[pageIndex] ?? null,
    onFrameLoad,
  };
}
