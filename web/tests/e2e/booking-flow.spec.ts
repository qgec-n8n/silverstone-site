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

async function completeQualification(page: Page) {
  await page.getByRole("button", { name: "Web design & development" }).click();
  await page.getByLabel("Industry").selectOption("Hospitality");
  await page.getByRole("button", { name: "£3k–£10k" }).click();
  await page.getByRole("button", { name: "Within a month" }).click();
  await page.getByRole("button", { name: "Continue to availability" }).click();
  await expect(
    page.getByRole("heading", { name: "Choose a precise moment" }),
  ).toBeVisible();
}

test("native booking keeps a fixed shell and a local time-only scroll region", async ({
  page,
  isMobile,
}) => {
  await page.goto("/book#booking-calendar");
  const shell = page.getByTestId("booking-shell");
  await shell.scrollIntoViewIfNeeded();
  const baseline = await shellGeometry(shell);

  await completeQualification(page);
  expectStable(await shellGeometry(shell), baseline);

  const availableDay = page
    .locator(".ss-booking-calendar__day.is-available button")
    .first();
  await expect(availableDay).toBeVisible();
  const calendarPane = page.locator(".ss-booking-calendar-pane");
  await availableDay.click();

  const times = page.getByTestId("booking-times-scroll");
  await expect(times.locator("button").first()).toBeVisible();
  const calendarBefore = isMobile ? null : await calendarPane.boundingBox();
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
  await page.getByRole("button", { name: "Continue to details" }).click();
  await expect(page.getByRole("heading", { name: "Add the essentials" })).toBeVisible();
  expectStable(await shellGeometry(shell), baseline);

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

test("short-height mobile keeps every qualifier control inside the fixed stage", async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    "Run once from the desktop project with an explicit short viewport",
  );
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/book#booking-calendar");
  const shell = page.getByTestId("booking-shell");
  await expect(
    page.getByRole("heading", { name: "Frame the call in under a minute" }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await shell.scrollIntoViewIfNeeded();
  const baseline = await shellGeometry(shell);
  const stageViewport = page.locator(".ss-booking-shell__viewport");
  const lastTimingChoice = page.getByRole("button", { name: "Just exploring" });
  await expect(lastTimingChoice).toBeVisible();

  const viewportBox = await stageViewport.boundingBox();
  const controlBox = await lastTimingChoice.boundingBox();
  expect(viewportBox).not.toBeNull();
  expect(controlBox).not.toBeNull();
  expect((controlBox?.y ?? 0) + (controlBox?.height ?? 0)).toBeLessThanOrEqual(
    (viewportBox?.y ?? 0) + (viewportBox?.height ?? 0) + 1,
  );

  await completeQualification(page);
  expectStable(await shellGeometry(shell), baseline);
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
    page.getByRole("heading", { name: "Frame the call in under a minute" }),
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

  expect(await analyzeBooking()).toEqual([]);
  await completeQualification(page);
  await expect(
    page.locator(".ss-booking-calendar__day.is-available button").first(),
  ).toBeVisible();
  expect(await analyzeBooking()).toEqual([]);
});
