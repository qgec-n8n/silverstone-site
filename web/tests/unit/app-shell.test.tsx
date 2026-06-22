import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppShell } from "~/app/components/app-shell";

describe("AppShell", () => {
  it("provides skip navigation and semantic landmarks", () => {
    render(
      <AppShell>
        <h1>Foundation content</h1>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: "Skip to content" })).toHaveAttribute(
      "href",
      "#main-content",
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toContainElement(
      screen.getByRole("heading", { name: "Foundation content" }),
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
