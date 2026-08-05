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
    // 27 launch routes: 26 since the 2026-07-07 blog teardown plus
    // /industry/aesthetic-clinics (2026-08-05). Article routes return through
    // the blog automation.
    expect(futureRouteManifest).toHaveLength(27);
    expect(validateFutureRouteManifest(futureRouteManifest)).toEqual([]);
    expect(new Set(futureRouteManifest.map((route) => route.path)).size).toBe(27);
    expect(futureRouteManifest.filter((route) => route.lifecycle === "draft")).toEqual(
      [],
    );
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
    expect(getFutureRouteByPath("/industry/dentists")?.routeGroup).toBe("industries");
    expect(getFutureRouteByPath("/services/dentists")).toBeUndefined();
    expect(
      getFutureRouteByPath("/services/website-design-development"),
    ).toBeUndefined();
    expect(getFutureRouteByPath("/services/ai-agents-automation")).toBeUndefined();
    expect(getFutureRouteByPath("/about/")).toBeUndefined();
    expect(getFutureRouteByPath("/not-a-route")).toBeUndefined();
  });
});
