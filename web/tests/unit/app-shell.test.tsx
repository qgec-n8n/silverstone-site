import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import {
  AppExperienceProvider,
  useAppExperience,
} from "~/app/experience/app-experience";
import { AppShell } from "~/components/layout/app-shell";
import { MotionProvider } from "~/motion";

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
        <MotionProvider>
          <AppExperienceProvider>
            <DismissLoader />
            <AppShell>
              <h1>Foundation content</h1>
            </AppShell>
          </AppExperienceProvider>
        </MotionProvider>
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

  it("locks body scroll while the mobile menu is open and restores it on Escape", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/about"]}>
        <MotionProvider>
          <AppExperienceProvider>
            <DismissLoader />
            <AppShell>
              <h1>Foundation content</h1>
            </AppShell>
          </AppExperienceProvider>
        </MotionProvider>
      </MemoryRouter>,
    );

    const menuButton = screen.getByRole("button", { name: /open menu/i });
    await user.click(menuButton);

    expect(screen.getByRole("dialog", { name: /site menu/i })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("");
    });
    expect(menuButton).toHaveFocus();
  });
});
