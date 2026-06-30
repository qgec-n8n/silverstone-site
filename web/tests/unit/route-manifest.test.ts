import { describe, expect, it } from "vitest";

import {
  futureRouteManifest,
  getFutureRouteByPath,
  validateFutureRouteManifest,
} from "~/data/future-routes";
import {
  activeRedirects,
  legacyRouteManifest,
  validateLegacyRouteManifest,
} from "~/data/legacy-routes";

describe("route migration manifests", () => {
  it("assigns one validated future disposition to every A-01 canonical route", () => {
    expect(futureRouteManifest).toHaveLength(59);
    expect(validateFutureRouteManifest(futureRouteManifest)).toEqual([]);
    expect(new Set(futureRouteManifest.map((route) => route.path)).size).toBe(59);
    expect(
      futureRouteManifest
        .filter((route) => route.lifecycle === "draft")
        .map((route) => route.path),
    ).toEqual(["/blog/ai-lead-capture-trades-uk-2026"]);
  });

  it("represents every SEO baseline row with one legacy disposition", () => {
    expect(legacyRouteManifest).toHaveLength(133);
    expect(validateLegacyRouteManifest(legacyRouteManifest)).toEqual([]);

    const dispositionCounts = legacyRouteManifest.reduce<Record<string, number>>(
      (counts, route) => ({
        ...counts,
        [route.disposition]: (counts[route.disposition] ?? 0) + 1,
      }),
      {},
    );
    expect(dispositionCounts.retained).toBe(49);
    expect(dispositionCounts.redirected).toBe(80);
    expect(dispositionCounts.consolidated).toBe(2);
    expect(dispositionCounts.draft).toBe(1);
    expect(dispositionCounts.removed).toBe(1);
  });

  it("removes redirect cycles and duplicate active sources from the future plan", () => {
    expect(
      activeRedirects.some((redirect) => redirect.sourcePath === redirect.targetPath),
    ).toBe(false);
    expect(new Set(activeRedirects.map((redirect) => redirect.sourcePath)).size).toBe(
      activeRedirects.length,
    );
  });

  it("resolves known routes and rejects unknown paths", () => {
    expect(getFutureRouteByPath("/services/dentists")?.routeGroup).toBe("industries");
    expect(getFutureRouteByPath("/services/website-design-development")?.path).toBe(
      "/services/web-design-development",
    );
    expect(getFutureRouteByPath("/services/ai-agents-automation")?.path).toBe(
      "/services/ai-automation",
    );
    expect(getFutureRouteByPath("/not-a-route")).toBeUndefined();
  });
});
