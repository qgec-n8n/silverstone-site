import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

type ShellGeometry = { height: number; documentTop: number };

async function shellGeometry(shell: Locator): Promise<ShellGeometry> {
  return shell.evaluate((element) => {
    const rectangle = element.getBoundingClientRect();
    return { height: rectangle.height, documentTop: rectangle.top + window.scrollY };
  });
}

function expectStable(actual: ShellGeometry, baseline: ShellGeometry) {
  expect(Math.abs(actual.height - baseline.height)).toBeLessThanOrEqual(1);
  expect(Math.abs(actual.documentTop - baseline.documentTop)).toBeLessThanOrEqual(1);
}

async function mustBox(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("Expected a visible bounding box");
  return box;
}

async function selectFirstSlot(page: Page) {
  const availableDay = page
    .locator(".ss-booking-calendar__day.is-available button")
    .first();
  await expect(availableDay).toBeVisible();
  await availableDay.click();
  const times = page.getByTestId("booking-times-scroll");
  await expect(times.locator("button").first()).toBeVisible();
  await times.locator("button").first().click();
}

async function completeQualification(page: Page) {
  await page.getByRole("button", { name: "Web design & development" }).click();
  await page.getByLabel("Industry").selectOption("Hospitality");
  await page.getByRole("button", { name: "£3k–£10k" }).click();
  await page.getByRole("button", { name: "Within a month" }).click();
  await page.getByRole("button", { name: "Continue to your details" }).click();
  await expect(page.getByRole("heading", { name: "Add the essentials" })).toBeVisible();
}

test("native booking runs Date & time first with a fixed shell and local time scroll", async ({
  page,
  isMobile,
}) => {
  await page.goto("/book#booking-calendar");
  const shell = page.getByTestId("booking-shell");
  await shell.scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { name: "Choose your moment" }),
  ).toBeVisible();
  const baseline = await shellGeometry(shell);

  /* Stage 1 — Date & time: the calendar stays put, only the time list scrolls. */
  const availableDay = page
    .locator(".ss-booking-calendar__day.is-available button")
    .first();
  await expect(availableDay).toBeVisible();
  const calendarPane = page.locator(".ss-booking-calendar-pane");
  const calendarBefore = isMobile ? null : await calendarPane.boundingBox();
  await availableDay.click();

  const times = page.getByTestId("booking-times-scroll");
  await expect(times.locator("button").first()).toBeVisible();
  await expect
    .poll(() =>
      times.evaluate((element) => element.scrollHeight > element.clientHeight),
    )
    .toBe(true);
  expect(await times.evaluate((element) => getComputedStyle(element).overflowY)).toBe(
    "auto",
  );
  await times.evaluate((element) => element.scrollTo({ top: element.scrollHeight }));
  expect(await times.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

  if (!isMobile) {
    expect(
      await calendarPane.evaluate((element) => getComputedStyle(element).overflowY),
    ).not.toBe("auto");
    const calendarAfter = await calendarPane.boundingBox();
    expect(calendarBefore).not.toBeNull();
    expect(calendarAfter).not.toBeNull();
    expect(
      Math.abs((calendarAfter?.x ?? 0) - (calendarBefore?.x ?? 0)),
    ).toBeLessThanOrEqual(1);
    expect(
      Math.abs((calendarAfter?.y ?? 0) - (calendarBefore?.y ?? 0)),
    ).toBeLessThanOrEqual(1);
  } else {
    await expect(calendarPane).toBeHidden();
    await expect(page.getByRole("tab", { name: /Times/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  }

  await times.locator("button").first().click();
  expectStable(await shellGeometry(shell), baseline);
  await page.getByRole("button", { name: "Continue with this time" }).click();

  /* Stage 2 — Qualify. */
  await expect(
    page.getByRole("heading", { name: "Frame the call in under a minute" }),
  ).toBeVisible();
  expectStable(await shellGeometry(shell), baseline);
  await completeQualification(page);
  expectStable(await shellGeometry(shell), baseline);

  /* Stage 3 — Your details: inline errors never resize the shell. */
  await page.getByRole("button", { name: "Confirm booking" }).click();
  await expect(page.getByText("Enter your name.")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Name" })).toBeFocused();
  expectStable(await shellGeometry(shell), baseline);

  await page.getByRole("textbox", { name: "Name" }).fill("Ada Lovelace");
  await page.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
  await page
    .getByRole("textbox", { name: "Company Optional" })
    .fill("Analytical Engines");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Confirm booking" }).click();
  await expect(page.getByText("Securing the call…")).toBeVisible();
  expectStable(await shellGeometry(shell), baseline);

  /* Stage 4 — Confirmed. */
  await expect(
    page.getByRole("heading", { name: "Preview booking simulated" }),
  ).toBeVisible();
  await expect(page.getByText("ada@example.com")).toBeVisible();
  expectStable(await shellGeometry(shell), baseline);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
});

test("selections survive navigating backwards through the workflow", async ({
  page,
}) => {
  await page.goto("/book#booking-calendar");
  await expect(
    page.getByRole("heading", { name: "Choose your moment" }),
  ).toBeVisible();
  await selectFirstSlot(page);
  await page.getByRole("button", { name: "Continue with this time" }).click();
  await expect(
    page.getByRole("heading", { name: "Frame the call in under a minute" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Web design & development" }).click();
  await page.getByLabel("Industry").selectOption("Hospitality");
  await page.getByRole("button", { name: "£3k–£10k" }).click();
  await page.getByRole("button", { name: "Within a month" }).click();

  /* Back to Date & time: the chosen date and slot are still selected. */
  await page.getByRole("button", { name: "Back" }).click();
  await expect(
    page.getByRole("heading", { name: "Choose your moment" }),
  ).toBeVisible();
  await expect(page.locator(".ss-booking-calendar__day.is-selected")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Continue with this time" }),
  ).toBeEnabled();

  /* Forward again: qualification selections are intact. */
  await page.getByRole("button", { name: "Continue with this time" }).click();
  await expect(
    page.getByRole("button", { name: "Web design & development" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Industry")).toHaveValue("Hospitality");
});

test("desktop shell scales with the viewport and fits inside it", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop-only viewport matrix");
  const REM = 16;
  const MIN_SHELL = 37 * REM;
  const MAX_SHELL = 51 * REM;
  const sizes: [number, number][] = [
    [1280, 800],
    [1440, 900],
    [1920, 1080],
    [2560, 1080],
    [1280, 720],
  ];

  for (const [width, height] of sizes) {
    const label = `${String(width)}x${String(height)}`;
    await page.setViewportSize({ width, height });
    await page.goto("/book#booking-calendar");
    const shell = page.getByTestId("booking-shell");
    await expect(
      page.getByRole("heading", { name: "Choose your moment" }),
    ).toBeVisible();

    /* Scroll with plain JS: the shell's deep-link scroll-margin makes
       scrollIntoViewIfNeeded a no-op in Chromium, and the route's own
       deep-link scroll can still be animating — poll until the whole
       console rests inside the viewport. */
    await expect
      .poll(
        () =>
          shell.evaluate((element) => {
            const r = element.getBoundingClientRect();
            if (r.top < -1) {
              window.scrollBy({ top: r.top, behavior: "instant" });
            } else if (r.bottom > window.innerHeight + 1) {
              window.scrollBy({
                top: r.bottom - window.innerHeight,
                behavior: "instant",
              });
            }
            const settled = element.getBoundingClientRect();
            return settled.top >= -1 && settled.bottom <= window.innerHeight + 1;
          }),
        { message: `${label} whole console visible once scrolled to` },
      )
      .toBe(true);

    /* Bounded, viewport-derived height. */
    const box = await mustBox(shell);
    expect(box.height, `${label} min bound`).toBeGreaterThanOrEqual(
      Math.min(MIN_SHELL, height) - 1,
    );
    expect(box.height, `${label} max bound`).toBeLessThanOrEqual(MAX_SHELL + 1);
    expect(box.height, `${label} fits viewport`).toBeLessThanOrEqual(height);

    /* Desktop composition at every desktop size — including short viewports:
       calendar and times sit side by side and the mobile tabs stay hidden. */
    await expect(page.locator(".ss-booking-availability__tabs")).toBeHidden();
    const calendar = await mustBox(page.locator(".ss-booking-calendar-pane"));
    const timesPane = await mustBox(page.locator(".ss-booking-times-pane"));
    expect(timesPane.x).toBeGreaterThan(calendar.x + calendar.width - 1);

    /* No horizontal page overflow. */
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    ).toBe(true);
  }
});

test("mobile composition activates on width alone, never on short height", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Runs from the desktop project with explicit viewports");

  /* ≤44rem wide: the tabbed mobile calendar/times composition activates. */
  await page.setViewportSize({ width: 700, height: 900 });
  await page.goto("/book#booking-calendar");
  await expect(
    page.getByRole("heading", { name: "Choose your moment" }),
  ).toBeVisible();
  await expect(page.locator(".ss-booking-availability__tabs")).toBeVisible();
  await expect(page.locator(".ss-booking-times-pane")).toBeHidden();

  /* Short but desktop-wide: stays a compact desktop composition. */
  await page.setViewportSize({ width: 1180, height: 620 });
  await page.goto("/book#booking-calendar");
  await expect(
    page.getByRole("heading", { name: "Choose your moment" }),
  ).toBeVisible();
  await expect(page.locator(".ss-booking-availability__tabs")).toBeHidden();
  await expect(page.locator(".ss-booking-calendar-pane")).toBeVisible();
  await expect(page.locator(".ss-booking-times-pane")).toBeVisible();

  /* Narrow phone: mobile composition with a viewport-bounded shell. */
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto("/book#booking-calendar");
  const shell = page.getByTestId("booking-shell");
  await shell.scrollIntoViewIfNeeded();
  await expect(page.locator(".ss-booking-availability__tabs")).toBeVisible();
  const box = await mustBox(shell);
  expect(box.width).toBeLessThanOrEqual(360);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
});

test("@a11y native booking stages have no serious or critical axe violations", async ({
  page,
}) => {
  await page.goto("/book#booking-calendar");
  await expect(
    page.getByRole("heading", { name: "Choose your moment" }),
  ).toBeVisible();

  const analyzeBooking = async () => {
    const results = await new AxeBuilder({ page })
      .include('[data-testid="booking-shell"]')
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    return results.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? ""),
    );
  };

  await expect(
    page.locator(".ss-booking-calendar__day.is-available button").first(),
  ).toBeVisible();
  expect(await analyzeBooking()).toEqual([]);

  await selectFirstSlot(page);
  await page.getByRole("button", { name: "Continue with this time" }).click();
  await expect(
    page.getByRole("heading", { name: "Frame the call in under a minute" }),
  ).toBeVisible();
  expect(await analyzeBooking()).toEqual([]);

  await completeQualification(page);
  expect(await analyzeBooking()).toEqual([]);
});
