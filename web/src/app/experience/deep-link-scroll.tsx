import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

import { useAppExperience } from "~/app/experience/app-experience";
import { armRevealBypass } from "~/motion/reveal-bypass";

/**
 * Single shared mechanism for every cross-page "deep link" in the app (the
 * header's Book pill, service/industry final CTAs, the floating demos
 * launcher): navigate to `path#target-id` and this effect scrolls to it once
 * the destination is actually visible. `headerHidden` is false only once the
 * loader/hero-lock/route-intro gate has fully cleared for the current route,
 * so a link into a still-gated page (e.g. a demo anchor on a service page)
 * waits for that gate instead of scrolling to a hidden, zero-height target.
 *
 * Landing directly on an action surface bypasses the entrance choreography:
 * a cross-page (or initial-load) deep link jumps straight to the target and
 * arms the reveal bypass so the section is simply there, fully shown — no
 * scroll tour, no staggered entrance between the click and the calendar,
 * form or demo frame. A same-page anchor click keeps the smooth scroll for
 * spatial continuity, but the destination still reveals immediately on
 * arrival.
 *
 * The target's route chunk is code-split, so its id can take longer than a
 * couple of frames to mount (slowest in dev, on a cold chunk fetch) — a
 * MutationObserver waits for it to actually appear instead of guessing a
 * fixed retry budget, with a generous timeout as a safety net.
 */
const GIVE_UP_AFTER_MS = 8000;

/** Instant jump: reveals triggered in the next beat are the landing view. */
const LANDING_BYPASS_MS = 1200;

/** Smooth same-page scroll: window long enough to cover the travel time. */
const SAME_PAGE_BYPASS_MS = 2400;

export function useDeepLinkScroll(): void {
  const location = useLocation();
  const { headerHidden } = useAppExperience();
  const seenPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    if (headerHidden) {
      return undefined;
    }

    // A pathname is only "seen" once its gate has cleared — from then on,
    // further hash changes on it are in-page anchor clicks, not landings.
    const isLanding = seenPathnameRef.current !== location.pathname;
    seenPathnameRef.current = location.pathname;

    const hash = location.hash;
    if (!hash) {
      return undefined;
    }

    const id = decodeURIComponent(hash.slice(1));

    const scrollToTarget = (target: HTMLElement) => {
      armRevealBypass(isLanding ? LANDING_BYPASS_MS : SAME_PAGE_BYPASS_MS);
      const behavior = isLanding ? "auto" : "smooth";
      if (id.startsWith("demo-")) {
        /* The global document scroll padding reserves the fixed header for
           ordinary anchors. Demo relocations are different: the header hides
           during a desktop downward jump but remains visible on mobile. Use
           an explicit offset so both final positions are intentional. */
        const rootFontSize = Number.parseFloat(
          window.getComputedStyle(document.documentElement).fontSize,
        );
        const breathingRoom = Number.isFinite(rootFontSize) ? rootFontSize : 16;
        const isDesktop = window.matchMedia("(min-width: 64rem)").matches;
        const headerHeight =
          document.querySelector<HTMLElement>("[data-site-header]")?.offsetHeight ?? 0;
        const offset = breathingRoom + (isDesktop ? 0 : headerHeight);
        const top = window.scrollY + target.getBoundingClientRect().top - offset;
        window.scrollTo({ behavior, top: Math.max(0, top) });
      } else {
        target.scrollIntoView({ behavior, block: "start" });
      }
      if (!target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }
      target.focus({ preventScroll: true });
    };

    const existing = document.getElementById(id);
    if (existing) {
      scrollToTarget(existing);
      return undefined;
    }

    const observer = new MutationObserver(() => {
      const target = document.getElementById(id);
      if (target) {
        observer.disconnect();
        scrollToTarget(target);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const timeout = window.setTimeout(() => observer.disconnect(), GIVE_UP_AFTER_MS);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [location.pathname, location.hash, headerHidden]);
}

/** Mounted once at the app root so every route benefits without wiring per page. */
export function DeepLinkScrollHandler(): null {
  useDeepLinkScroll();
  return null;
}
