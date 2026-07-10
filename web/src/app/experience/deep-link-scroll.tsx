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

/**
 * Fired whenever a deep link relocates the viewport to a section. The desktop
 * header listens for it and hides immediately (see site-header.tsx), so the
 * landing position — section pill 1rem below the viewport top — is measured
 * against a minimised header rather than one that happens to still be shown.
 */
export const DEEP_LINK_JUMP_EVENT = "ss:deep-link-jump";

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
    const correctionTimers: number[] = [];
    let correctionsCancelled = false;

    const scrollToTarget = (target: HTMLElement) => {
      armRevealBypass(isLanding ? LANDING_BYPASS_MS : SAME_PAGE_BYPASS_MS);
      const behavior = isLanding ? "auto" : "smooth";
      /* Every section relocation uses one explicit offset policy: on desktop
         the header hides for the jump (the event below), leaving 1rem between
         the section's pill and the viewport top; on mobile the header never
         hides, so it is added to the same 1rem of breathing room. The scroll
         anchor is the target's enclosing section (when there is one) rather
         than the target itself — deep-link ids often sit on the section's
         heading, and the pill above that heading is what should land 1rem
         from the top. */
      const rootFontSize = Number.parseFloat(
        window.getComputedStyle(document.documentElement).fontSize,
      );
      const breathingRoom = Number.isFinite(rootFontSize) ? rootFontSize : 16;
      const isDesktop = window.matchMedia("(min-width: 64rem)").matches;
      const headerHeight =
        document.querySelector<HTMLElement>("[data-site-header]")?.offsetHeight ?? 0;
      const offset = breathingRoom + (isDesktop ? 0 : headerHeight);
      // Most links align the target's whole section so its eyebrow remains in
      // view. Explicit action surfaces (for example the Insights search board)
      // opt into self-alignment so the control itself lands at that same
      // responsive offset instead of sitting below a section introduction.
      const anchor = target.hasAttribute("data-deep-link-anchor")
        ? target
        : (target.closest<HTMLElement>(".ss-srv2-section") ?? target);
      const idealTop = () =>
        Math.max(0, window.scrollY + anchor.getBoundingClientRect().top - offset);
      let appliedTop = idealTop();
      window.scrollTo({ behavior, top: appliedTop });
      window.dispatchEvent(new CustomEvent(DEEP_LINK_JUMP_EVENT));
      if (isLanding) {
        /* A landing jump measures the page mid-load: webfonts and images that
           finish afterwards shift the content above the anchor, nudging it off
           the intended 1rem mark. Re-snap once things settle — but only while
           the viewport is still exactly where we put it, so a visitor who has
           already scrolled on is never yanked back. */
        const correct = () => {
          if (correctionsCancelled || Math.abs(window.scrollY - appliedTop) > 2) {
            return;
          }
          const top = idealTop();
          if (Math.abs(top - appliedTop) > 1) {
            appliedTop = top;
            window.scrollTo({ behavior: "auto", top });
          }
        };
        correctionTimers.push(window.setTimeout(correct, 450));
        correctionTimers.push(window.setTimeout(correct, 1200));
        if ("fonts" in document) {
          void document.fonts.ready.then(() => correct());
        }
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
      correctionsCancelled = true;
      correctionTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [location.pathname, location.hash, headerHidden]);
}

/** Mounted once at the app root so every route benefits without wiring per page. */
export function DeepLinkScrollHandler(): null {
  useDeepLinkScroll();
  return null;
}
