import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll } from "vitest";

beforeAll(() => {
  // jsdom does not implement matchMedia. Components that read motion
  // preferences (useReducedMotion -> useSyncExternalStore) call it during
  // render, so provide a non-reduced default unless a test overrides it.
  if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }),
    });
  }

  if (typeof window !== "undefined") {
    window.scrollTo = () => undefined;
  }

  if (
    typeof window !== "undefined" &&
    typeof window.IntersectionObserver !== "function"
  ) {
    class IntersectionObserverStub implements IntersectionObserver {
      readonly root: Element | Document | null = null;
      readonly rootMargin = "0px";
      readonly thresholds: readonly number[] = [0];

      disconnect() {
        return undefined;
      }

      observe() {
        return undefined;
      }

      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }

      unobserve() {
        return undefined;
      }
    }

    Object.defineProperty(window, "IntersectionObserver", {
      configurable: true,
      value: IntersectionObserverStub,
      writable: true,
    });
    Object.defineProperty(globalThis, "IntersectionObserver", {
      configurable: true,
      value: IntersectionObserverStub,
      writable: true,
    });
  }
});

afterEach(() => {
  cleanup();
});
