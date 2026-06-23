import { describe, expect, it } from "vitest";

import { normalizeRouteRequestPath } from "~/routes/shared/route-data";

describe("route loader path normalization", () => {
  it("maps React Router prerender data requests back to canonical paths", () => {
    expect(normalizeRouteRequestPath("/services/dentists.data")).toBe(
      "/services/dentists",
    );
    expect(normalizeRouteRequestPath("/services/dentists")).toBe("/services/dentists");
  });
});
