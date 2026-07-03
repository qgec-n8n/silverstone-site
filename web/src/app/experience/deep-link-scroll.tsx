import { useEffect } from "react";
import { useLocation } from "react-router";

import { useAppExperience } from "~/app/experience/app-experience";

/**
 * Single shared mechanism for every cross-page "deep link" in the app (the
 * header's Book pill, service/industry final CTAs, the floating demos
 * launcher): navigate to `path#target-id` and this effect scrolls to it once
 * the destination is actually visible. `headerHidden` is false only once the
 * loader/hero-lock/route-intro gate has fully cleared for the current route,
 * so a link into a still-gated page (e.g. a demo anchor on a service page)
 * waits for that gate instead of scrolling to a hidden, zero-height target.
 *
 * The target's route chunk is code-split, so its id can take longer than a
 * couple of frames to mount (slowest in dev, on a cold chunk fetch) — a
 * MutationObserver waits for it to actually appear instead of guessing a
 * fixed retry budget, with a generous timeout as a safety net.
 */
const GIVE_UP_AFTER_MS = 8000;

export function useDeepLinkScroll(): void {
  const location = useLocation();
  const { headerHidden } = useAppExperience();

  useEffect(() => {
    const hash = location.hash;
    if (!hash || headerHidden) {
      return undefined;
    }

    const id = decodeURIComponent(hash.slice(1));

    const scrollToTarget = (target: HTMLElement) => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
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
