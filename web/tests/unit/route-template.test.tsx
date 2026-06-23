import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { futureRouteManifest } from "~/data/future-routes";
import { IndustryPage } from "~/routes/templates/industry-page";

describe("route templates", () => {
  it("renders valid sibling breadcrumb list items for hydration", () => {
    const route = futureRouteManifest.find(
      (candidate) => candidate.path === "/services/dentists",
    );
    if (!route) {
      throw new Error("Dentists route fixture is missing");
    }

    const { container } = render(<IndustryPage route={route} />);

    expect(container.querySelectorAll("li > li")).toHaveLength(0);
    expect(
      container.querySelectorAll('[data-slot="breadcrumb-separator"]'),
    ).toHaveLength(2);
  });
});
