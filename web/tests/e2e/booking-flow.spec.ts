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
  expect(Math.abs(actual.documentTop - baseline.documentTop)).toBeLessThanOrEqual(3);
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
  test.skip(isMobile, "Phones run the dedicated mobile flow, covered below");
  await page.goto("/book#booking-calendar");
  const shell = page.getByTestId("booking-shell");
  await shell.scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Choose your moment" })).toBeVisible();
  const baseline = await shellGeometry(shell);

  /* Stage 1 — Date & time: the calendar stays put, only the time list scrolls. */
  const availableDay = page
    .locator(".ss-booking-calendar__day.is-available button")
    .first();
  await expect(availableDay).toBeVisible();
  const calendarPane = page.locator(".ss-booking-calendar-pane");
  const calendarBefore = await calendarPane.boundingBox();
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

  /* The legend reads from its own pane row with clear air below the final
     week — it must never overlap the day grid. */
  const legendClearance = await calendarPane.evaluate((element) => {
    const legend = element.querySelector<HTMLElement>(".ss-booking-calendar-legend");
    const grid = element.querySelector(".ss-booking-calendar__grid");
    if (!legend || !grid || legend.offsetParent === null) return null;
    return legend.getBoundingClientRect().top - grid.getBoundingClientRect().bottom;
  });
  if (legendClearance !== null) {
    expect(legendClearance).toBeGreaterThanOrEqual(4);
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

  /* Stage 3 — Your details: everything fits with no internal scrollbar. */
  const detailsBody = page.locator(".ss-booking-details__body");
  await expect(detailsBody).toBeVisible();
  expect(
    await detailsBody.evaluate(
      (element) => element.scrollHeight - element.clientHeight,
    ),
  ).toBeLessThanOrEqual(1);
  expect(
    await detailsBody.evaluate((element) => getComputedStyle(element).overflowY),
  ).not.toBe("auto");

  /* Inline errors never resize the shell. */
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

test("a claimed slot is invalidated and availability refreshes", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "The shared conflict handler is exercised through desktop");
  await page.goto("/book?bookingFixture=lost-slot#booking-calendar");
  const availableDay = page
    .locator(".ss-booking-calendar__day.is-available button")
    .first();
  await availableDay.click();
  const times = page.getByTestId("booking-times-scroll");
  await expect(times.locator("button").first()).toBeVisible();
  const initialTimeCount = await times.locator("button").count();
  await times.locator("button").first().click();
  await page.getByRole("button", { name: "Continue with this time" }).click();
  await completeQualification(page);
  await page.getByRole("textbox", { name: "Name" }).fill("Ada Lovelace");
  await page.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Confirm booking" }).click();

  await expect(
    page.getByText(
      "That time is no longer available. Availability has been refreshed — choose another highlighted time.",
    ),
  ).toBeVisible();
  await expect(page.locator(".ss-booking-calendar__day.is-selected")).toHaveCount(1);
  await expect(times.locator("button")).toHaveCount(initialTimeCount - 1);
  await expect(page.locator(".ss-booking-calendar-pane__status")).toContainText(
    "open dates in view",
  );
});

test("month navigation reaches the booking horizon and stops", async ({ page }) => {
  await page.goto("/book#booking-calendar");
  const caption = page.locator(".ss-booking-calendar__caption-label");
  await expect(caption).toBeVisible();

  const nextButton = page.getByRole("button", { name: /Go to the Next Month/i });
  /* Walk forward to the far edge of the (now twelve-month) horizon rather than a
     hard-coded month count, asserting live availability at every step. */
  let steps = 0;
  while (!(await nextButton.isDisabled()) && steps < 18) {
    const previousCaption = await caption.innerText();
    await nextButton.click();
    await expect(caption).not.toHaveText(previousCaption);
    await expect(page.locator(".ss-booking-calendar-pane__status")).toContainText(
      "open dates in view",
    );
    steps += 1;
  }

  /* The extended horizon must allow materially more than the old three months. */
  expect(steps).toBeGreaterThan(3);
  await expect(nextButton).toBeDisabled();
  const availableDays = page.locator(
    ".ss-booking-calendar__day.is-available .ss-booking-calendar__day-button",
  );
  await expect(availableDays.first()).toBeEnabled();
  expect(await availableDays.count()).toBeGreaterThan(0);
  expect(
    await page.locator(".ss-booking-calendar__day.is-disabled.is-available").count(),
  ).toBe(0);
});

test("mobile flow walks one decision per screen with no internal scroll", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Dedicated mobile flow");
  await page.goto("/book#booking-calendar");
  const shell = page.getByTestId("booking-shell");
  await expect(shell).toHaveAttribute("data-flow", "mobile");
  const baseline = await shellGeometry(shell);

  /* Nothing inside the shell may be a working vertical scroller. */
  const assertNoInternalScroll = async () => {
    const overflowing = await shell.evaluate((root) =>
      [...root.querySelectorAll("*")]
        .filter((element) => {
          const scrollable = element.scrollHeight - element.clientHeight > 1;
          if (!scrollable) return false;
          const overflowY = getComputedStyle(element).overflowY;
          return overflowY === "auto" || overflowY === "scroll";
        })
        .map((element) => element.className),
    );
    expect(overflowing).toEqual([]);
  };

  /* 01a — Day. */
  await expect(page.getByRole("heading", { name: "Pick a day" })).toBeVisible();
  await assertNoInternalScroll();
  const availableDay = page
    .locator(".ss-booking-calendar__day.is-available button")
    .first();
  await expect(availableDay).toBeVisible();
  await availableDay.click();

  /* 01b — Time dial: first slot pre-armed, stepping moves the readout. */
  await expect(page.getByRole("heading", { name: "Choose your moment" })).toBeVisible();
  /* The readout animates via AnimatePresence, so the outgoing and incoming
     time can briefly coexist — always read the newest (last) element. */
  const readout = page.locator(".ss-booking-mdial__readout strong").last();
  await expect(readout).toHaveText(/^\d{2}:\d{2}$/);
  const firstTime = await readout.innerText();
  await page.getByRole("button", { name: "Later time" }).click();
  await expect(page.locator(".ss-booking-mdial__readout strong").last()).not.toHaveText(
    firstTime,
  );
  await expect(page.locator(".ss-booking-mdial__track i[data-active]")).toHaveCount(1);
  await assertNoInternalScroll();
  expectStable(await shellGeometry(shell), baseline);
  await page.getByRole("button", { name: /^Lock in / }).click();

  /* 02a — Focus. */
  await expect(
    page.getByRole("heading", { name: "What should we look at?" }),
  ).toBeVisible();
  await assertNoInternalScroll();
  await page.getByRole("button", { name: "Web design & development" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  /* 02b — Context. */
  await expect(
    page.getByRole("heading", { name: "Frame the conversation" }),
  ).toBeVisible();
  await page.getByLabel("Industry").selectOption("Hospitality");
  await page.getByLabel("Indicative budget").selectOption("£3k–£10k");
  await page.getByLabel("Timing").selectOption("Within a month");
  await assertNoInternalScroll();
  await page.getByRole("button", { name: "Continue" }).click();

  /* 03a — Details. */
  await expect(
    page.getByRole("heading", { name: "Who are we meeting?" }),
  ).toBeVisible();
  await page.getByRole("textbox", { name: "Name" }).fill("Ada Lovelace");
  await page.getByRole("textbox", { name: "Email" }).fill("ada@example.com");
  await assertNoInternalScroll();
  await page.getByRole("button", { name: "Review booking" }).click();

  /* 03b — Consent. */
  await expect(page.getByRole("heading", { name: "Lock it in" })).toBeVisible();
  await expect(page.locator(".ss-booking-details__summary")).toBeVisible();
  await page.getByRole("checkbox").check();
  await assertNoInternalScroll();
  expectStable(await shellGeometry(shell), baseline);
  await page.getByRole("button", { name: "Confirm booking" }).click();

  /* 04 — Confirmed. */
  await expect(
    page.getByRole("heading", { name: "Preview booking simulated" }),
  ).toBeVisible();
  await expect(page.getByText("ada@example.com")).toBeVisible();
  await assertNoInternalScroll();
  expectStable(await shellGeometry(shell), baseline);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
});

test("mobile flow keeps selections and re-routes validation to the right panel", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Dedicated mobile flow");
  await page.goto("/book#booking-calendar");
  await expect(page.getByRole("heading", { name: "Pick a day" })).toBeVisible();
  await page.locator(".ss-booking-calendar__day.is-available button").first().click();
  await expect(page.getByRole("heading", { name: "Choose your moment" })).toBeVisible();
  const chosenTime = await page
    .locator(".ss-booking-mdial__readout strong")
    .innerText();

  /* The day chip returns to the calendar with the day still selected. */
  await page.locator(".ss-booking-mtime__day-chip").click();
  await expect(page.locator(".ss-booking-calendar__day.is-selected")).toHaveCount(1);
  await page.getByRole("button", { name: "Choose a time" }).click();
  await expect(page.locator(".ss-booking-mdial__readout strong")).toHaveText(
    chosenTime,
  );
  await page.getByRole("button", { name: /^Lock in / }).click();

  /* Skipping ahead with an empty name bounces back to Details. */
  await page.getByRole("button", { name: "Web design & development" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Industry").selectOption("Hospitality");
  await page.getByLabel("Indicative budget").selectOption("£3k–£10k");
  await page.getByLabel("Timing").selectOption("Within a month");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Review booking" }).click();
  await expect(page.getByText("Enter your name.")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Who are we meeting?" }),
  ).toBeVisible();
});

test("selections survive navigating backwards through the workflow", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Phones run the dedicated mobile flow, covered above");
  await page.goto("/book#booking-calendar");
  await expect(page.getByRole("heading", { name: "Choose your moment" })).toBeVisible();
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
  await expect(page.getByRole("heading", { name: "Choose your moment" })).toBeVisible();
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

  /* ≤44rem wide: the dedicated mobile flow activates (Day panel first). */
  await page.setViewportSize({ width: 700, height: 900 });
  await page.goto("/book#booking-calendar");
  await expect(page.getByRole("heading", { name: "Pick a day" })).toBeVisible();
  await expect(page.getByTestId("booking-shell")).toHaveAttribute(
    "data-flow",
    "mobile",
  );
  await expect(page.locator(".ss-booking-times-pane")).toHaveCount(0);

  /* Short but desktop-wide: stays a compact desktop composition. */
  await page.setViewportSize({ width: 1180, height: 620 });
  await page.goto("/book#booking-calendar");
  await expect(page.getByRole("heading", { name: "Choose your moment" })).toBeVisible();
  await expect(page.getByTestId("booking-shell")).toHaveAttribute(
    "data-flow",
    "desktop",
  );
  await expect(page.locator(".ss-booking-calendar-pane")).toBeVisible();
  await expect(page.locator(".ss-booking-times-pane")).toBeVisible();

  /* Representative phones: the shell and every calendar region fit without
     internal scrolling, clipping, or overlap. */
  for (const [width, height] of [
    [320, 568],
    [360, 640],
    [390, 844],
  ] as const) {
    const label = `${String(width)}x${String(height)}`;
    await page.setViewportSize({ width, height });
    await page.goto("/book#booking-calendar");
    const shell = page.getByTestId("booking-shell");
    await expect(page.getByRole("heading", { name: "Pick a day" })).toBeVisible();
    await expect(page.locator(".ss-booking-calendar-pane__status")).toContainText(
      "open dates in view",
    );
    await shell.evaluate((element) => {
      document.documentElement.style.scrollBehavior = "auto";
      const fixedHeader = [...document.querySelectorAll("header")].find(
        (candidate) => getComputedStyle(candidate).position === "fixed",
      );
      const headerHeight = fixedHeader?.getBoundingClientRect().height ?? 0;
      const documentTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, documentTop - headerHeight - 16);
    });
    const box = await mustBox(shell);
    const fixedHeaderBottom = await page.evaluate(() => {
      const fixedHeader = [...document.querySelectorAll("header")].find(
        (candidate) => getComputedStyle(candidate).position === "fixed",
      );
      return fixedHeader?.getBoundingClientRect().bottom ?? 0;
    });
    expect(box.width, `${label} shell width`).toBeLessThanOrEqual(width);
    expect(box.height, `${label} shell height`).toBeLessThanOrEqual(height);
    expect(box.y, `${label} below fixed header`).toBeGreaterThanOrEqual(
      fixedHeaderBottom,
    );
    expect(box.y + box.height, `${label} shell bottom visible`).toBeLessThanOrEqual(
      height + 1,
    );

    const geometry = await page
      .locator(".ss-booking-calendar-pane")
      .evaluate((pane) => {
        const status = pane.querySelector<HTMLElement>(
          ".ss-booking-calendar-pane__status",
        );
        const grid = pane.querySelector<HTMLElement>(".ss-booking-calendar__grid");
        const legend = pane.querySelector<HTMLElement>(".ss-booking-calendar-legend");
        const caption = pane.querySelector<HTMLElement>(
          ".ss-booking-calendar__caption-label",
        );
        const nav = pane.querySelector<HTMLElement>(".ss-booking-calendar__nav");
        if (!status || !grid || !legend || !caption || !nav) {
          throw new Error("Expected every mobile calendar region");
        }
        const paneRect = pane.getBoundingClientRect();
        const statusRect = status.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();
        const legendRect = legend.getBoundingClientRect();
        const captionRect = caption.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        return {
          statusToGrid: gridRect.top - statusRect.bottom,
          gridToLegend: legendRect.top - gridRect.bottom,
          captionInside:
            captionRect.left >= paneRect.left - 1 &&
            captionRect.right <= paneRect.right + 1,
          navInside:
            navRect.left >= paneRect.left - 1 && navRect.right <= paneRect.right + 1,
          noPaneOverflow:
            pane.scrollWidth <= pane.clientWidth + 1 &&
            pane.scrollHeight <= pane.clientHeight + 1,
        };
      });
    expect(geometry.statusToGrid, `${label} status clearance`).toBeGreaterThanOrEqual(
      0,
    );
    expect(geometry.gridToLegend, `${label} legend clearance`).toBeGreaterThanOrEqual(
      0,
    );
    expect(geometry.captionInside, `${label} month label contained`).toBe(true);
    expect(geometry.navInside, `${label} navigation contained`).toBe(true);
    expect(geometry.noPaneOverflow, `${label} no pane overflow`).toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      `${label} no page overflow`,
    ).toBe(true);
  }

  /* Tablet width retains the desktop side-by-side composition and remains
     contained, proving the phone-only redesign did not spill past its media
     boundary. */
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/book#booking-calendar");
  await expect(page.getByTestId("booking-shell")).toHaveAttribute(
    "data-flow",
    "desktop",
  );
  const tabletCalendar = await mustBox(page.locator(".ss-booking-calendar-pane"));
  const tabletTimes = await mustBox(page.locator(".ss-booking-times-pane"));
  expect(tabletTimes.x).toBeGreaterThanOrEqual(
    tabletCalendar.x + tabletCalendar.width - 1,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
});

test("@a11y native booking stages have no serious or critical axe violations", async ({
  page,
  isMobile,
}) => {
  await page.goto("/book#booking-calendar");

  const analyzeBooking = async () => {
    const results = await new AxeBuilder({ page })
      .include('[data-testid="booking-shell"]')
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    return results.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? ""),
    );
  };

  if (isMobile) {
    /* Mobile flow: Day, dial and Focus panels. */
    await expect(page.getByRole("heading", { name: "Pick a day" })).toBeVisible();
    await expect(
      page.locator(".ss-booking-calendar__day.is-available button").first(),
    ).toBeVisible();
    expect(await analyzeBooking()).toEqual([]);

    await page.locator(".ss-booking-calendar__day.is-available button").first().click();
    await expect(
      page.getByRole("heading", { name: "Choose your moment" }),
    ).toBeVisible();
    await expect(page.locator(".ss-booking-mdial__readout strong")).toHaveText(
      /^\d{2}:\d{2}$/,
    );
    expect(await analyzeBooking()).toEqual([]);

    await page.getByRole("button", { name: /^Lock in / }).click();
    await expect(
      page.getByRole("heading", { name: "What should we look at?" }),
    ).toBeVisible();
    expect(await analyzeBooking()).toEqual([]);
    return;
  }

  await expect(page.getByRole("heading", { name: "Choose your moment" })).toBeVisible();
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
