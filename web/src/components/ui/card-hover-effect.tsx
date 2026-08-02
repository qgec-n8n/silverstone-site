import {
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
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

function itemFromTarget(target: EventTarget | null): HTMLElement | null {
  return target instanceof Element
    ? target.closest<HTMLElement>("[data-card-hover-id]")
    : null;
}

function itemIdFromTarget(target: EventTarget | null): string | null {
  return itemFromTarget(target)?.dataset.cardHoverId ?? null;
}

type PointerPosition = { x: number; y: number };

function isSamePosition(
  previous: PointerPosition | null,
  next: PointerPosition,
): boolean {
  return previous !== null && previous.x === next.x && previous.y === next.y;
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
  /* Moving focus scrolls the newly focused card into view, which slides other
     cards under a stationary cursor; the browser then re-dispatches
     `pointerover` for whichever card the mouse now happens to sit on. That
     re-dispatch carries the unchanged cursor coordinates, so remembering the
     last pointer position — and who last claimed the surface — lets keyboard
     focus keep the surface until the mouse is genuinely moved again. */
  const lastPointerRef = useRef<PointerPosition | null>(null);
  const surfaceOwnerRef = useRef<"focus" | "pointer">("pointer");
  const resolvedActiveId =
    activeId && items.some((item) => item.id === activeId) ? activeId : null;

  function handlePointerOver(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
      return;
    }
    const position = { x: event.clientX, y: event.clientY };
    if (
      surfaceOwnerRef.current === "focus" &&
      isSamePosition(lastPointerRef.current, position)
    ) {
      return;
    }
    lastPointerRef.current = position;
    surfaceOwnerRef.current = "pointer";
    setActiveId(itemIdFromTarget(event.target));
  }

  /* A single grid-level listener writes the pointer position onto the hovered
     card as CSS variables, so the cursor-follow glow border needs no per-card
     listener and no React re-render. */
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
      return;
    }
    const item = itemFromTarget(event.target);
    const position = { x: event.clientX, y: event.clientY };
    /* A real mouse move is what hands the surface back to the pointer. */
    if (!isSamePosition(lastPointerRef.current, position)) {
      lastPointerRef.current = position;
      if (surfaceOwnerRef.current === "focus") {
        surfaceOwnerRef.current = "pointer";
        setActiveId(item?.dataset.cardHoverId ?? null);
      }
    }
    if (!item) {
      return;
    }
    const bounds = item.getBoundingClientRect();
    item.style.setProperty(
      "--glow-x",
      `${String(((event.clientX - bounds.left) / bounds.width) * 100)}%`,
    );
    item.style.setProperty(
      "--glow-y",
      `${String(((event.clientY - bounds.top) / bounds.height) * 100)}%`,
    );
  }

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    surfaceOwnerRef.current = "focus";
    setActiveId(itemIdFromTarget(event.target));
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    /* Focus keeps the surface through the blur too: tabbing out of the grid
       scrolls as well, and the parked cursor must not light a card back up. */
    surfaceOwnerRef.current = "focus";
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setActiveId(null);
      return;
    }
    setActiveId(itemIdFromTarget(event.relatedTarget));
  }

  function handlePointerLeave() {
    /* Same scroll, other direction: the grid can slide out from under a parked
       cursor, and that leave must not cancel the focused card's surface. */
    if (surfaceOwnerRef.current === "focus") {
      return;
    }
    setActiveId(null);
  }

  return (
    <div
      className={cn("ss-card-hover-effect", className)}
      data-card-hover-active={resolvedActiveId ?? undefined}
      onBlurCapture={handleBlur}
      onFocusCapture={handleFocus}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
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
            {reduceMotion ? null : (
              <span aria-hidden="true" className="ss-glow-border" />
            )}
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
