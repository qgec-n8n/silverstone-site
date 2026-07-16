import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { clearAvailabilityCache } from "~/features/booking/booking-api";
import { BookingPanel } from "~/features/core-pages/booking-panel";

afterEach(() => clearAvailabilityCache());

describe("BookingPanel", () => {
  it("preserves qualification, slot and details state through edits and mock confirmation", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <BookingPanel mode="mock" />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Web design & development" }));
    await user.selectOptions(screen.getByLabelText("Industry"), "Hospitality");
    await user.click(screen.getByRole("button", { name: "£3k–£10k" }));
    await user.click(screen.getByRole("button", { name: "Within a month" }));
    await user.click(screen.getByRole("button", { name: "Continue to availability" }));

    await screen.findByRole("heading", { name: "Choose a precise moment" });
    await waitFor(() => {
      expect(
        container.querySelector(".ss-booking-calendar__day.is-available button"),
      ).not.toBeNull();
    });
    const availableDay = container.querySelector<HTMLButtonElement>(
      ".ss-booking-calendar__day.is-available button",
    );
    if (!availableDay) throw new Error("Expected one available day");
    fireEvent.click(availableDay);

    const timeRegion = screen.getByLabelText("Scrollable available time slots");
    await waitFor(() => {
      expect(within(timeRegion).getAllByRole("button").length).toBeGreaterThan(4);
    });
    await user.click(within(timeRegion).getAllByRole("button")[0] as HTMLButtonElement);
    await user.click(screen.getByRole("button", { name: "Continue to details" }));

    await screen.findByRole("heading", { name: "Add the essentials" });
    await user.click(screen.getByRole("button", { name: "Confirm booking" }));
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus();
    expect(screen.getByText("Enter your name.")).toBeVisible();

    await user.type(screen.getByRole("textbox", { name: "Name" }), "Ada Lovelace");
    await user.type(screen.getByRole("textbox", { name: "Email" }), "ada@example.com");
    await user.type(
      screen.getByRole("textbox", { name: "Company Optional" }),
      "Analytical Engines",
    );
    await user.type(
      screen.getByRole("textbox", {
        name: "Useful context Optional · 600 characters",
      }),
      "Improve our enquiry journey.",
    );
    await user.click(screen.getByRole("checkbox"));

    await user.click(screen.getByRole("button", { name: "Back" }));
    await screen.findByRole("heading", { name: "Choose a precise moment" });
    await user.click(screen.getByRole("button", { name: "Back" }));
    await screen.findByRole("heading", { name: "Frame the call in under a minute" });
    expect(
      screen.getByRole("button", { name: "Web design & development" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Continue to availability" }));
    await screen.findByRole("heading", { name: "Choose a precise moment" });
    expect(screen.getByRole("button", { name: "Continue to details" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Continue to details" }));
    await screen.findByRole("heading", { name: "Add the essentials" });
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Ada Lovelace");
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue(
      "ada@example.com",
    );

    await user.click(screen.getByRole("button", { name: "Confirm booking" }));
    await screen.findByRole("heading", { name: "Preview booking simulated" });
    expect(
      screen.getByText("No appointment or email was created in this safe preview."),
    ).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("ada@example.com")).toBeVisible());
    expect(
      screen.getByText(/Web design & development · Hospitality · £3k–£10k/),
    ).toBeVisible();
  });

  it("blocks incomplete qualification without changing the fixed workflow stage", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <BookingPanel mode="mock" />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: "Continue to availability" }));

    expect(
      screen.getByRole("heading", { name: "Frame the call in under a minute" }),
    ).toBeVisible();
    expect(screen.getByRole("alert")).toHaveTextContent("Choose at least one service");
  });
});
