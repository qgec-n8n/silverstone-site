import { render, screen, waitFor } from "@testing-library/react";
import * as m from "motion/react-m";

import { MotionProvider, loadDomMaxFeatures } from "~/motion";

describe("MotionProvider", () => {
  it("renders essential content before async animation features resolve", () => {
    render(
      <MotionProvider>
        <h1>Visible route content</h1>
      </MotionProvider>,
    );

    expect(
      screen.getByRole("heading", { name: /visible route content/i }),
    ).toBeInTheDocument();
  });

  it("supports lightweight m components inside the LazyMotion boundary", () => {
    render(
      <MotionProvider>
        <m.div initial={false} animate={{ opacity: 1 }}>
          Animated content
        </m.div>
      </MotionProvider>,
    );

    expect(screen.getByText(/animated content/i)).toBeInTheDocument();
  });

  it("loads the domMax feature bundle asynchronously", async () => {
    await expect(loadDomMaxFeatures()).resolves.toEqual(
      expect.objectContaining({
        animation: expect.anything(),
        drag: expect.anything(),
        layout: expect.anything(),
      }),
    );
  });

  it("keeps reduced-motion content visible", async () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    render(
      <MotionProvider>
        <m.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Reduced motion readable copy
        </m.p>
      </MotionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/reduced motion readable copy/i)).toBeVisible();
    });
  });
});
