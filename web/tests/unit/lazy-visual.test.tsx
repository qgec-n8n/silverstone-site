import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  createLazyVisual,
  LazyVisualBoundary,
} from "~/lib/visuals/lazy-visual-boundary";

const HeavyVisual = createLazyVisual(() =>
  Promise.resolve({
    default: () => <p>Heavy visual</p>,
  }),
);

describe("LazyVisualBoundary", () => {
  it("renders a non-WebGL fallback until a heavy module is requested", () => {
    render(
      <LazyVisualBoundary
        fallback={<p>Static visual fallback</p>}
        enabled={false}
        visual={HeavyVisual}
      />,
    );

    expect(screen.getByText("Static visual fallback")).toBeVisible();
    expect(screen.queryByText("Heavy visual")).not.toBeInTheDocument();
  });
});
