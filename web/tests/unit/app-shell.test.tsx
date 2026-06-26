import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import {
  AppExperienceProvider,
  useAppExperience,
} from "~/app/experience/app-experience";
import { AppShell } from "~/components/layout/app-shell";

// The header is intentionally inert + aria-hidden while the opening loader is up.
// Dismiss it on mount so this landmark test asserts against the post-loader
// resting state, where the banner and primary navigation are exposed.
function DismissLoader() {
  const { dismissLoader } = useAppExperience();
  useEffect(() => {
    dismissLoader();
  }, [dismissLoader]);
  return null;
}

describe("AppShell", () => {
  it("provides skip navigation and semantic landmarks", () => {
    // Mirror production: AppShell always renders inside AppExperienceProvider
    // (root Layout), which the header depends on via useAppExperience. Use a
    // non-home, non-service route so neither homepage nor service intro chrome
    // gating applies to this landmark assertion.
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <AppExperienceProvider>
          <DismissLoader />
          <AppShell>
            <h1>Foundation content</h1>
          </AppShell>
        </AppExperienceProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
      "href",
      "#main-content",
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toContainElement(
      screen.getByRole("heading", { name: "Foundation content" }),
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
