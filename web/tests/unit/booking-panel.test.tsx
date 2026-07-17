import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";

import { clearAvailabilityCache } from "~/features/booking/booking-api";
import { BookingPanel } from "~/features/core-pages/booking-panel";

afterEach(() => clearAvailabilityCache());

async function selectFirstAvailableSlot(container: HTMLElement) {
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
  fireEvent.click(within(timeRegion).getAllByRole("button")[0] as HTMLButtonElement);
}

describe("BookingPanel", () => {
  it("runs Date & time → Qualify → Details → Confirmed and preserves state backwards", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <BookingPanel mode="mock" />
      </MemoryRouter>,
    );

    /* Stage 1: Date & time is the entry stage. */
    await screen.findByRole("heading", { name: "Choose your moment" });
    expect(
      screen.getByRole("button", { name: "Continue with this time" }),
    ).toBeDisabled();
    await selectFirstAvailableSlot(container);
    await user.click(screen.getByRole("button", { name: "Continue with this time" }));

    /* Stage 2: Qualify. */
    await screen.findByRole("heading", { name: "Frame the call in under a minute" });
    await user.click(screen.getByRole("button", { name: "Web design & development" }));
    await user.selectOptions(screen.getByLabelText("Industry"), "Hospitality");
    await user.click(screen.getByRole("button", { name: "£3k–£10k" }));
    await user.click(screen.getByRole("button", { name: "Within a month" }));
    await user.click(screen.getByRole("button", { name: "Continue to your details" }));

    /* Stage 3: Your details — invalid submit focuses the first invalid field. */
    await screen.findByRole("heading", { name: "Add the essentials" });
    await user.click(screen.getByRole("button", { name: "Confirm booking" }));
    await screen.findByText("Enter your name.");
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveFocus();

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

    /* Backwards navigation keeps every selection. */
    await user.click(screen.getByRole("button", { name: "Back" }));
    await screen.findByRole("heading", { name: "Frame the call in under a minute" });
    expect(
      screen.getByRole("button", { name: "Web design & development" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Back" }));
    await screen.findByRole("heading", { name: "Choose your moment" });
    /* The chosen date and slot survive leaving and re-entering the stage. */
    await waitFor(() => {
      expect(
        container.querySelector(".ss-booking-calendar__day.is-selected"),
      ).not.toBeNull();
    });
    expect(
      screen.getByRole("button", { name: "Continue with this time" }),
    ).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Continue with this time" }));
    await screen.findByRole("heading", { name: "Frame the call in under a minute" });
    await user.click(screen.getByRole("button", { name: "Continue to your details" }));
    await screen.findByRole("heading", { name: "Add the essentials" });
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue("Ada Lovelace");
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue(
      "ada@example.com",
    );

    /* Stage 4: Confirmed (mock booking). */
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

  it("blocks progression without a selected slot and without full qualification", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <BookingPanel mode="mock" />
      </MemoryRouter>,
    );

    await screen.findByRole("heading", { name: "Choose your moment" });
    /* No slot chosen: the primary action stays disabled. */
    expect(
      screen.getByRole("button", { name: "Continue with this time" }),
    ).toBeDisabled();

    await selectFirstAvailableSlot(container);
    await user.click(screen.getByRole("button", { name: "Continue with this time" }));
    await screen.findByRole("heading", { name: "Frame the call in under a minute" });

    await user.click(screen.getByRole("button", { name: "Continue to your details" }));
    expect(
      screen.getByRole("heading", { name: "Frame the call in under a minute" }),
    ).toBeVisible();
    expect(screen.getByRole("alert")).toHaveTextContent("Choose at least one service");
  });
});
