import { act, render } from "@testing-library/react";
import { useRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useRevealStart } from "~/motion/use-reveal-start";

/*
 * Sibling grouping: a reveal whose own trigger fires wakes the other reveals
 * in the same item container (the nearest grid/flex ancestor), so a card grid
 * enters as one wave. jsdom honours inline `display` in getComputedStyle,
 * which is enough to exercise the container heuristic without a layout
 * engine. Each `Item` stamps whether its start has resolved on its element,
 * so the test can read who was woken from the DOM.
 */

function Item({
  id,
  inView,
  loaded = true,
}: {
  id: string;
  inView: boolean;
  loaded?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const start = useRevealStart(ref, inView, 0, loaded);
  return <div data-item={id} data-started={start !== null} ref={ref} />;
}

function started(container: HTMLElement): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const item of container.querySelectorAll<HTMLElement>("[data-item]")) {
    result[item.dataset.item ?? ""] = item.dataset.started === "true";
  }
  return result;
}

function tall(element: Element, height: number) {
  element.getBoundingClientRect = () => ({
    bottom: height,
    height,
    left: 0,
    right: 100,
    top: 0,
    width: 100,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
}

describe("useRevealStart sibling grouping", () => {
  beforeEach(() => {
    vi.spyOn(performance, "now").mockImplementation(() => 1_000);
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
  });

  it("wakes every reveal in the same grid when one fires", () => {
    const view = render(
      <div style={{ display: "grid" }}>
        <Item id="a" inView={false} />
        <Item id="b" inView={false} />
        <Item id="c" inView={false} />
      </div>,
    );
    expect(started(view.container)).toEqual({ a: false, b: false, c: false });

    act(() => {
      view.rerender(
        <div style={{ display: "grid" }}>
          <Item id="a" inView={false} />
          <Item id="b" inView />
          <Item id="c" inView={false} />
        </div>,
      );
    });

    expect(started(view.container)).toEqual({ a: true, b: true, c: true });
  });

  it("finds the grid through a list item wrapper", () => {
    const tree = (first: boolean) => (
      <ul style={{ display: "grid" }}>
        <li>
          <Item id="a" inView={first} />
        </li>
        <li>
          <Item id="b" inView={false} />
        </li>
      </ul>
    );
    const view = render(tree(false));
    act(() => {
      view.rerender(tree(true));
    });
    expect(started(view.container)).toEqual({ a: true, b: true });
  });

  it("leaves reveals in ordinary block flow to fire on their own", () => {
    const tree = (first: boolean) => (
      <div>
        <Item id="heading" inView={first} />
        <Item id="paragraph" inView={false} />
      </div>
    );
    const view = render(tree(false));
    act(() => {
      view.rerender(tree(true));
    });
    expect(started(view.container)).toEqual({ heading: true, paragraph: false });
  });

  it("never treats a landmark as an item container", () => {
    const tree = (first: boolean) => (
      <section style={{ display: "flex" }}>
        <Item id="a" inView={first} />
        <Item id="b" inView={false} />
      </section>
    );
    const view = render(tree(false));
    act(() => {
      view.rerender(tree(true));
    });
    expect(started(view.container)).toEqual({ a: true, b: false });
  });

  it("refuses a container taller than a few viewports", () => {
    const tree = (first: boolean) => (
      <div data-column style={{ display: "flex" }}>
        <Item id="a" inView={first} />
        <Item id="b" inView={false} />
      </div>
    );
    const view = render(tree(false));
    const column = view.container.querySelector("[data-column]");
    if (!column) {
      throw new Error("column missing");
    }
    tall(column, 800 * 4 + 1);
    act(() => {
      view.rerender(tree(true));
    });
    expect(started(view.container)).toEqual({ a: true, b: false });
  });

  it("keeps a woken image reveal waiting for its image", () => {
    const tree = (first: boolean, loaded: boolean) => (
      <div style={{ display: "grid" }}>
        <Item id="a" inView={first} />
        <Item id="image" inView={false} loaded={loaded} />
      </div>
    );
    const view = render(tree(false, false));
    act(() => {
      view.rerender(tree(true, false));
    });
    expect(started(view.container)).toEqual({ a: true, image: false });

    act(() => {
      view.rerender(tree(true, true));
    });
    expect(started(view.container)).toEqual({ a: true, image: true });
  });
});
