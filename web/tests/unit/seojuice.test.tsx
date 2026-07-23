import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SeoJuiceScripts } from "~/lib/integrations/seojuice";

// SEOJuice's suggestions.v1.js rewrites <title>, replaces og:image and injects
// a second <h1> into <main> at runtime (measured on live production, see the
// component's doc comment). The prerendered HTML is the reviewed source of
// truth for that metadata, so the optimiser stays off unless someone opts in
// deliberately. These tests exist to make re-enabling it a conscious act
// rather than an accident.
describe("SeoJuiceScripts", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("renders nothing by default", () => {
    const { container } = render(<SeoJuiceScripts />);

    expect(container.innerHTML).toBe("");
  });

  it("stays disabled in a production build until VITE_SEOJUICE_ENABLED opts in", () => {
    // Production alone used to be the only gate; it is no longer sufficient.
    vi.stubEnv("VITE_STAGING_MODE", "false");

    const { container } = render(<SeoJuiceScripts />);

    expect(container.innerHTML).toBe("");
  });

  it("ships neither the CDN script nor the tracking pixel while disabled", () => {
    const { container } = render(<SeoJuiceScripts />);

    expect(container.querySelector('script[src*="seojuice"]')).toBeNull();
    expect(container.innerHTML).not.toContain("smart.seojuice.io");
  });
});
