import { describe, expect, it } from "vitest";

import {
  getRouteVisualBackgroundMode,
  isIndustryBackgroundRoute,
  normalizeVisualRoutePath,
} from "~/visual/route-backgrounds";

describe("route visual background mapping", () => {
  it("normalizes paths without changing root", () => {
    expect(normalizeVisualRoutePath("/")).toBe("/");
    expect(normalizeVisualRoutePath("industries/")).toBe("/industries");
    expect(normalizeVisualRoutePath("/industries/estate-agents?preview=true")).toBe(
      "/industries/estate-agents",
    );
  });

  it("recognizes industry routes without changing their background mode", () => {
    for (const pathname of [
      "/industries",
      "/industries/",
      "/industries/estate-agents",
    ]) {
      expect(isIndustryBackgroundRoute(pathname)).toBe(true);
      expect(getRouteVisualBackgroundMode(pathname)).toEqual({
        body: "particles",
        intro: "aether",
      });
    }
  });

  it("keeps services, homepage, company, conversion, blog, legal, and error paths on existing backgrounds", () => {
    for (const pathname of [
      "/",
      "/about",
      "/how-we-work",
      "/services",
      "/services/ai-automation",
      "/services/estate-agents",
      "/pricing",
      "/book",
      "/contact",
      "/blog",
      "/blog/example",
      "/privacy-policy",
      "/does-not-exist",
    ]) {
      expect(isIndustryBackgroundRoute(pathname)).toBe(false);
      expect(getRouteVisualBackgroundMode(pathname)).toEqual({
        body: "particles",
        intro: "aether",
      });
    }
  });
});
