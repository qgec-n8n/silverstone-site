import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import BackgroundGradientSnippet from "~/components/ui/background-gradient-snippet";
import CybercoreBackground from "~/components/ui/cybercore-section-hero";
import { RouteBackgroundLayer } from "~/visual/route-background-layer";

const originalMatchMedia = window.matchMedia;

function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: query === "(prefers-reduced-motion: reduce)" ? matches : false,
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

afterEach(() => {
  vi.restoreAllMocks();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: originalMatchMedia,
  });
});

describe("CybercoreBackground", () => {
  it("renders the expected structural layers", async () => {
    setReducedMotion(false);

    const { container } = render(<CybercoreBackground beamCount={4} />);

    expect(container.querySelector(".scene.ss-cybercore-scene")).toBeInTheDocument();
    expect(container.querySelector(".floor")).toBeInTheDocument();
    expect(container.querySelector(".main-column")).toBeInTheDocument();
    expect(container.querySelector(".light-stream-container")).toBeInTheDocument();

    await waitFor(() => {
      expect(container.querySelectorAll(".light-beam")).toHaveLength(4);
    });
  });

  it("generates 70 beams by default", async () => {
    setReducedMotion(false);

    const { container } = render(<CybercoreBackground />);

    await waitFor(() => {
      expect(container.querySelectorAll(".light-beam")).toHaveLength(70);
    });
  });

  it("regenerates beams when beamCount changes", async () => {
    setReducedMotion(false);

    const { container, rerender } = render(<CybercoreBackground beamCount={2} />);

    await waitFor(() => {
      expect(container.querySelectorAll(".light-beam")).toHaveLength(2);
    });

    rerender(<CybercoreBackground beamCount={5} />);

    await waitFor(() => {
      expect(container.querySelectorAll(".light-beam")).toHaveLength(5);
    });
  });

  it("cleans up rendered beams on unmount", async () => {
    setReducedMotion(false);

    const { container, unmount } = render(<CybercoreBackground beamCount={3} />);

    await waitFor(() => {
      expect(container.querySelectorAll(".light-beam")).toHaveLength(3);
    });

    unmount();

    expect(container).toBeEmptyDOMElement();
  });

  it("keeps a static reduced-motion surface without animated beams", () => {
    setReducedMotion(true);

    const { container } = render(<CybercoreBackground />);

    expect(container.querySelector(".scene.ss-cybercore-scene")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(container.querySelector(".floor")).toBeInTheDocument();
    expect(container.querySelector(".main-column")).toBeInTheDocument();
    expect(container.querySelectorAll(".light-beam")).toHaveLength(0);
  });

  it("does not render the 21st.dev demo shell classes or copy", () => {
    setReducedMotion(true);

    const { container } = render(<CybercoreBackground />);

    for (const selector of [
      ".content-wrapper",
      ".main-header",
      ".logo",
      ".hero-section",
      ".cta-button",
    ]) {
      expect(container.querySelector(selector)).not.toBeInTheDocument();
    }

    expect(container).not.toHaveTextContent(
      /CYBERCORE|Enter the Grid|Explore the Network/i,
    );
  });

  it("keeps required structural selectors and user-supplied Cybercore keyframes available", () => {
    const css = readFileSync(
      resolve(process.cwd(), "src/styles/industry-backgrounds.css"),
      "utf8",
    );

    for (const selector of [
      ".ss-cybercore-scene.scene",
      ".ss-cybercore-scene .floor",
      ".ss-cybercore-scene .main-column",
      ".ss-cybercore-scene .light-stream-container",
      ".ss-cybercore-scene .light-beam",
      ".ss-cybercore-scene .light-beam.primary",
      ".ss-cybercore-scene .light-beam.secondary",
    ]) {
      expect(css).toContain(selector);
    }

    for (const keyframe of [
      "@keyframes rise",
      "@keyframes fade",
      "@keyframes floorGlow",
      "@keyframes mainGlow",
      "@keyframes moveGrid",
    ]) {
      expect(css).toContain(keyframe);
    }
  });
});

describe("BackgroundGradientSnippet", () => {
  it("renders the static radial field and fine grid", () => {
    const { container } = render(<BackgroundGradientSnippet />);
    const root = container.querySelector('[data-ss-background="industry-gradient"]');

    expect(root).toBeInTheDocument();
    expect(root?.children).toHaveLength(2);
    expect(root?.children[0]?.getAttribute("class")).toContain("radial-gradient");
    expect(root?.children[1]?.getAttribute("class")).toContain("linear-gradient");
  });
});

describe("RouteBackgroundLayer", () => {
  it("mounts Cybercore only for industry intro routes", async () => {
    setReducedMotion(false);

    const { container } = render(
      <RouteBackgroundLayer
        cybercoreBeamCount={2}
        pathname="/industries/estate-agents"
        phase="intro"
      />,
    );

    expect(
      container.querySelector('[data-ss-background="cybercore"]'),
    ).toBeInTheDocument();
    expect(container.querySelector(".ss-hv2-hero__canvas")).not.toBeInTheDocument();
    expect(container.querySelector("[data-particles-host]")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(container.querySelectorAll(".light-beam")).toHaveLength(2);
    });
  });

  it("mounts the gradient only for industry body routes", () => {
    const { container } = render(
      <RouteBackgroundLayer pathname="/industries" phase="body" />,
    );

    expect(
      container.querySelector('[data-ss-background="industry-gradient"]'),
    ).toBeInTheDocument();
    expect(container.querySelector(".ss-hv2-hero__canvas")).not.toBeInTheDocument();
    expect(container.querySelector("[data-particles-host]")).not.toBeInTheDocument();
  });

  it("keeps non-industry body routes on particles", () => {
    const { container } = render(
      <RouteBackgroundLayer
        particlesEnabled={false}
        pathname="/services/estate-agents"
        phase="body"
      />,
    );

    expect(container.querySelector(".ss-hv2-backdrop")).toBeInTheDocument();
    expect(
      container.querySelector('[data-ss-background="industry-gradient"]'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-ss-background="cybercore"]'),
    ).not.toBeInTheDocument();
  });

  it("renders one major route background at a time", () => {
    const { container, rerender } = render(
      <RouteBackgroundLayer pathname="/industries" phase="body" />,
    );

    expect(
      container.querySelectorAll(
        "[data-ss-background], .ss-hv2-hero__field, .ss-hv2-backdrop",
      ),
    ).toHaveLength(1);

    rerender(
      <RouteBackgroundLayer
        particlesEnabled={false}
        pathname="/services/ai-automation"
        phase="body"
      />,
    );

    expect(
      container.querySelectorAll(
        "[data-ss-background], .ss-hv2-hero__field, .ss-hv2-backdrop",
      ),
    ).toHaveLength(1);
  });
});
