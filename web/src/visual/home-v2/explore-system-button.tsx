import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "~/components/ui/button";

import { getScrollHandle } from "./lenis-handle";

const TARGET_ID = "system";
const BRIDGE_LAYOUT_ID = "ss-explore-bridge";
const SCROLL_AFTER_MS = 460;
const CLOSE_AFTER_MS = 920;
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
 * Hero "Explore the system" action. Instead of navigating away, it expands a
 * luminous shared-layout bridge (framer-motion `layoutId`) and brings the
 * reader to the {@link SecondaryHero} (`#system`) within the page. The bridge is
 * purely decorative (`pointer-events: none`, `aria-hidden`): the real work is a
 * smooth scroll plus moving focus to the target section, so keyboard, pointer,
 * reduced-motion and direct-scroll journeys all reach the same place. Escape
 * cancels an in-flight bridge and returns focus to the button. Browser history
 * is never mutated, so back/forward stay intact.
 */
export function ExploreSystemButton() {
  const reduceMotion = useReducedMotion() ?? false;
  const [bridging, setBridging] = useState(false);
  const [used, setUsed] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const scrollToSystem = useCallback(() => {
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
  }, [reduceMotion]);

  const handleActivate = useCallback(() => {
    if (reduceMotion) {
      scrollToSystem();
      return;
    }
    clearTimers();
    setUsed(true);
    setBridging(true);
    timersRef.current.push(
      window.setTimeout(scrollToSystem, SCROLL_AFTER_MS),
      window.setTimeout(() => setBridging(false), CLOSE_AFTER_MS),
    );
  }, [reduceMotion, scrollToSystem, clearTimers]);

  useEffect(() => {
    if (!bridging) {
      return undefined;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearTimers();
        setBridging(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bridging, clearTimers]);

  return (
    <LayoutGroup id="ss-explore">
      <Button
        ref={buttonRef}
        type="button"
        size="lg"
        variant="outline"
        className="ss-explore-btn relative overflow-hidden"
        onClick={handleActivate}
      >
        <span className="relative z-10">Explore the system</span>
        {!used ? (
          <motion.span
            layoutId={BRIDGE_LAYOUT_ID}
            className="ss-explore-btn__chip"
            aria-hidden="true"
          />
        ) : null}
      </Button>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {bridging ? (
                <motion.div
                  key="ss-explore-bridge"
                  className="ss-explore-bridge"
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    layoutId={BRIDGE_LAYOUT_ID}
                    className="ss-explore-bridge__beam"
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </LayoutGroup>
  );
}

export default ExploreSystemButton;
