import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useReducedMotion } from "~/components/accessibility/use-reduced-motion";

class MatchMediaStub {
  matches: boolean;
  media: string;
  onchange: ((event: MediaQueryListEvent) => void) | null = null;
  #listeners = new Set<(event: MediaQueryListEvent) => void>();

  constructor(media: string, matches: boolean) {
    this.media = media;
    this.matches = matches;
  }

  addEventListener(_type: string, listener: (event: MediaQueryListEvent) => void) {
    this.#listeners.add(listener);
  }

  removeEventListener(_type: string, listener: (event: MediaQueryListEvent) => void) {
    this.#listeners.delete(listener);
  }

  dispatch(matches: boolean) {
    this.matches = matches;
    const event = { matches, media: this.media } as MediaQueryListEvent;
    this.#listeners.forEach((listener) => listener(event));
    this.onchange?.(event);
  }
}

function MotionProbe() {
  const { motionPreference, reducedMotion } = useReducedMotion();
  return <div>{`${motionPreference}:${String(reducedMotion)}`}</div>;
}

describe("useReducedMotion", () => {
  it("tracks matchMedia preference changes", async () => {
    const mediaQuery = new MatchMediaStub("(prefers-reduced-motion: reduce)", false);
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: () => mediaQuery,
    });

    render(<MotionProbe />);
    expect(screen.getByText("no-preference:false")).toBeVisible();

    act(() => {
      mediaQuery.dispatch(true);
    });

    expect(await screen.findByText("reduce:true")).toBeVisible();
  });
});
