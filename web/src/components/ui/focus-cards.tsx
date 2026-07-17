import {
  Children,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

import { cn } from "~/lib/utils";

type FocusCardsProps = {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
};

/**
 * Aceternity Focus Cards adapted as a generic composition primitive. The live
 * registry's sibling-focus state is preserved, while blur and hidden copy are
 * removed so every linked article remains readable and keyboard-accessible.
 */
export function FocusCards({ children, className, itemClassName }: FocusCardsProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const items = Children.toArray(children);

  function handlePointerEnter(event: PointerEvent<HTMLDivElement>, index: number) {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      setFocusedIndex(index);
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocusedIndex(null);
    }
  }

  return (
    <div
      className={cn("ss-focus-cards", className)}
      onPointerLeave={() => setFocusedIndex(null)}
    >
      {items.map((child, index) => (
        <div
          className={cn("ss-focus-cards__item", itemClassName)}
          data-focus-state={
            focusedIndex === null ? "idle" : focusedIndex === index ? "active" : "quiet"
          }
          key={index}
          onBlurCapture={handleBlur}
          onFocusCapture={() => setFocusedIndex(index)}
          onPointerEnter={(event) => handlePointerEnter(event, index)}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
