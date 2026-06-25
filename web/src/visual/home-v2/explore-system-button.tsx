import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useAppExperience } from "~/app/experience/app-experience";

import { getScrollHandle } from "./lenis-handle";

const TARGET_ID = "system";
const CARD_LAYOUT_ID = "ss-explore-card";
const DISSOLVE_AFTER_MS = 520;
const FOCUS_AFTER_MS = 720;

function headerOffsetPx(): number {
  if (typeof window === "undefined") {
    return 0;
  }
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--ss-layout-header",
  );
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Hero "Explore the system" action — the homepage's only primary CTA while the
 * hero is locked. It uses the exact layout-morph mechanic from the supplied Hero
 * Button Expendable component (a shared `layoutId` card that expands from the
 * button into a full-bleed panel with a spring transition). When the morph
 * completes it hands control to the experience coordinator: the homepage hero
 * unlocks (scroll released, header revealed), the reader is carried to
 * {@link SecondaryHero} (`#system`) and focus lands there. The panel then
 * dissolves to reveal the body. Reduced-motion skips the morph and performs the
 * same unlock + scroll + focus immediately. Escape cancels an in-flight morph
 * and returns focus to the button. History is never mutated.
 */
export function ExploreSystemButton() {
  const reduceMotion = useReducedMotion() ?? false;
  const { unlockHomepageHero } = useAppExperience();
  const [used, setUsed] = useState(false);
  const [open, setOpen] = useState(false);
  const revealedRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const reveal = useCallback(() => {
    if (revealedRef.current) {
      return;
    }
    revealedRef.current = true;
    // Release the lock first so the scroll container is interactive again, then
    // carry the reader to the system section on the next frame.
    unlockHomepageHero();
    const run = () => {
      const target = document.getElementById(TARGET_ID);
      if (!target) {
        return;
      }
      const handle = getScrollHandle();
      if (handle) {
        handle.scrollTo(`#${TARGET_ID}`, {
          offset: -headerOffsetPx(),
          duration: reduceMotion ? 0 : 1.1,
        });
      } else {
        target.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      }
      timersRef.current.push(
        window.setTimeout(
          () => {
            target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          },
          reduceMotion ? 0 : FOCUS_AFTER_MS,
        ),
      );
    };
    if (typeof window === "undefined") {
      run();
    } else {
      window.requestAnimationFrame(run);
    }
  }, [reduceMotion, unlockHomepageHero]);

  const handleActivate = useCallback(() => {
    if (used) {
      return;
    }
    if (reduceMotion) {
      setUsed(true);
      reveal();
      return;
    }
    // Remove the button and mount the overlay in one commit so framer-motion
    // morphs the shared `layoutId` card from the button into the full panel.
    setUsed(true);
    setOpen(true);
  }, [used, reduceMotion, reveal]);

  const handleMorphComplete = useCallback(() => {
    if (!open || revealedRef.current) {
      return;
    }
    reveal();
    timersRef.current.push(
      window.setTimeout(() => setOpen(false), DISSOLVE_AFTER_MS),
    );
  }, [open, reveal]);

  // Escape cancels a morph that has not yet revealed the body.
  useEffect(() => {
    if (!open || revealedRef.current) {
      return undefined;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !revealedRef.current) {
        clearTimers();
        setOpen(false);
        setUsed(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, clearTimers]);

  return (
    <LayoutGroup id="ss-explore">
      {!used ? (
        <motion.button
          ref={buttonRef}
          type="button"
          onClick={handleActivate}
          className="ss-explore-cta"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            layoutId={CARD_LAYOUT_ID}
            className="ss-explore-cta__bg"
            style={{ borderRadius: 999 }}
            aria-hidden="true"
          />
          <span className="ss-explore-cta__label">
            Explore the system
            <ArrowRight className="size-[1.05rem]" aria-hidden="true" />
          </span>
        </motion.button>
      ) : null}

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <div className="ss-explore-overlay" aria-hidden="true">
                  <motion.div
                    layoutId={CARD_LAYOUT_ID}
                    className="ss-explore-overlay__card"
                    style={{ borderRadius: 28 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.55 }}
                    exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
                    onLayoutAnimationComplete={handleMorphComplete}
                  >
                    <motion.span
                      className="ss-explore-overlay__glow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                    />
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </LayoutGroup>
  );
}

export default ExploreSystemButton;
