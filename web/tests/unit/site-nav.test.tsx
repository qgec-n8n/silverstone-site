import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { SiteNavDisclosure } from "~/components/layout/site-nav";

describe("SiteNavDisclosure", () => {
  it("opens through keyboard interaction and exposes aria-expanded", async () => {
    const user = userEvent.setup();

    render(
      <SiteNavDisclosure label="Resources" links={[{ href: "#forms", label: "Forms" }]}>
        Quick links
      </SiteNavDisclosure>,
    );

    const trigger = screen.getByRole("button", { name: "Resources" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.tab();
    await user.keyboard("{Enter}");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Forms" })).toBeVisible();
  });
});
