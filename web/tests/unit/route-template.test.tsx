import { render, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import {
  AppExperienceProvider,
  useAppExperience,
} from "~/app/experience/app-experience";
import { futureRouteManifest } from "~/data/future-routes";
import { MotionProvider } from "~/motion";
import { IndustryPage } from "~/routes/templates/industry-page";

function OpenRouteBody() {
  const { completeRouteOpening, dismissLoader, openRouteBody } = useAppExperience();
  useEffect(() => {
    dismissLoader();
    openRouteBody();
    completeRouteOpening();
  }, [completeRouteOpening, dismissLoader, openRouteBody]);
  return null;
}

describe("route templates", () => {
  it("renders valid sibling breadcrumb list items for hydration", async () => {
    const route = futureRouteManifest.find(
      (candidate) => candidate.path === "/services/dentists",
    );
    if (!route) {
      throw new Error("Dentists route fixture is missing");
    }

    const { container } = render(
      <MemoryRouter initialEntries={[route.path]}>
        <MotionProvider>
          <AppExperienceProvider>
            <OpenRouteBody />
            <IndustryPage route={route} />
          </AppExperienceProvider>
        </MotionProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        container.querySelectorAll('[data-slot="breadcrumb-separator"]'),
      ).toHaveLength(2);
    });
    expect(container.querySelectorAll("li > li")).toHaveLength(0);
  });
});
