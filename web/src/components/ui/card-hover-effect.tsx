import { useState, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

import { cn } from "~/lib/utils";

export type CardHoverEffectItem = {
  content: ReactNode;
  id: string;
};

type CardHoverEffectProps = {
  className?: string;
  itemClassName?: string;
  items: readonly CardHoverEffectItem[];
  layoutId?: string;
};

function itemIdFromTarget(target: EventTarget | null): string | null {
  return target instanceof Element
    ? (target.closest<HTMLElement>("[data-card-hover-id]")?.dataset.cardHoverId ?? null)
    : null;
}

/**
 * Aceternity's Card Hover Effect adapted for arbitrary, semantic card content.
 * One grid-level listener moves a shared surface by stable item ID and mirrors
 * the pointer behaviour for keyboard focus without introducing nested links.
 */
export function CardHoverEffect({
  className,
  itemClassName,
  items,
  layoutId = "card-hover-surface",
}: CardHoverEffectProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [activeId, setActiveId] = useState<string | null>(null);
  const resolvedActiveId =
    activeId && items.some((item) => item.id === activeId) ? activeId : null;

  function handlePointerOver(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
      return;
    }
    setActiveId(itemIdFromTarget(event.target));
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    setActiveId(itemIdFromTarget(event.target));
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setActiveId(null);
      return;
    }
    setActiveId(itemIdFromTarget(event.relatedTarget));
  }

  return (
    <div
      className={cn("ss-card-hover-effect", className)}
      data-card-hover-active={resolvedActiveId ?? undefined}
      onBlurCapture={handleBlur}
      onFocusCapture={handleFocus}
      onPointerLeave={() => setActiveId(null)}
      onPointerOver={handlePointerOver}
    >
      {items.map((item) => {
        const active = item.id === resolvedActiveId;

        return (
          <div
            className={cn("ss-card-hover-effect__item", itemClassName)}
            data-card-hover-id={item.id}
            data-card-hover-state={active ? "active" : "idle"}
            key={item.id}
          >
            {reduceMotion ? (
              active ? (
                <span aria-hidden="true" className="ss-card-hover-effect__surface" />
              ) : null
            ) : (
              <AnimatePresence initial={false}>
                {active ? (
                  /* The registry demo's timing: a fast fade-in, a delayed
                     fade-out, and a shared layoutId so the surface visibly
                     travels from the previous card to this one. */
                  <m.span
                    animate={{ opacity: 1, transition: { duration: 0.15 } }}
                    aria-hidden="true"
                    className="ss-card-hover-effect__surface"
                    exit={{ opacity: 0, transition: { delay: 0.2, duration: 0.15 } }}
                    initial={{ opacity: 0 }}
                    layoutId={layoutId}
                    transition={{ layout: { duration: 0.26, ease: [0.16, 1, 0.3, 1] } }}
                  />
                ) : null}
              </AnimatePresence>
            )}
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
