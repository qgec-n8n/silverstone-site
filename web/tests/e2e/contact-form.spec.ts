import { expect, test, type Locator, type Page } from "@playwright/test";

async function advance(form: Locator) {
  await form.locator('button[type="submit"]').evaluate((button) => {
    (button as HTMLButtonElement).click();
  });
}

async function expectNoPanelOverflow(form: Locator) {
  expect(
    await form
      .locator(".ss-enq__viewport")
      .evaluate((viewport) => viewport.scrollHeight - viewport.clientHeight),
  ).toBeLessThanOrEqual(1);
}

async function expectSingleLine(locator: Locator) {
  const result = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      whiteSpace: style.whiteSpace,
      horizontalOverflow: element.scrollWidth - element.clientWidth,
    };
  });
  expect(result.whiteSpace).toBe("nowrap");
  expect(result.horizontalOverflow).toBeLessThanOrEqual(1);
}

async function setRequiredDetails(page: Page) {
  await page.getByLabel("Name").fill("Visual Review");
  await page.getByLabel("Work email").fill("review@example.com");
}

test("desktop enquiry panels fill one stable shell without empty bottom space", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop-only enquiry composition");
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/contact#contact-form");

  const form = page.getByRole("form", { name: "Silverstone enquiry form" });
  await expect(page.getByRole("button", { name: "See demos" })).toHaveCount(0);
  await expect(form).toHaveAttribute("data-enq-shell", "desktop");
  const baselineHeight = await form.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  const headings = [
    "Frame the engagement",
    "Map today’s operation",
    "Where should the reply go?",
    "Describe what should change",
  ];

  for (const [index, heading] of headings.entries()) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await expectNoPanelOverflow(form);
    expect(
      Math.abs(
        (await form.evaluate((element) => element.getBoundingClientRect().height)) -
          baselineHeight,
      ),
    ).toBeLessThanOrEqual(1);

    const bottomGap = await form.locator(".ss-enq__fields").evaluate((fields) => {
      const lastModule = fields.lastElementChild;
      if (!lastModule) return Number.POSITIVE_INFINITY;
      return (
        fields.getBoundingClientRect().bottom -
        lastModule.getBoundingClientRect().bottom
      );
    });
    expect(bottomGap).toBeLessThanOrEqual(1);

    if (heading === "Where should the reply go?") await setRequiredDetails(page);
    if (index < headings.length - 1) await advance(form);
  }
});

test("mobile enquiry shell ignores height-only browser chrome changes", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile-only viewport behavior");
  await page.setViewportSize({ width: 390, height: 667 });
  await page.goto("/contact#contact-form");

  const form = page.getByRole("form", { name: "Silverstone enquiry form" });
  await expect(form).toHaveAttribute("data-enq-shell", "mobile");
  const initialHeight = await form.evaluate(
    (element) => element.getBoundingClientRect().height,
  );

  await page.setViewportSize({ width: 390, height: 780 });
  await expect
    .poll(() => form.evaluate((element) => element.getBoundingClientRect().height))
    .toBeCloseTo(initialHeight, 0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const reloadedHeight = await form.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  expect(reloadedHeight).toBeGreaterThan(initialHeight);
});

test("mobile panels fit at 320px and every slider label remains single-line", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile-only enquiry composition");
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/contact#contact-form");

  const form = page.getByRole("form", { name: "Silverstone enquiry form" });
  const stages: readonly {
    heading: string;
    sliderLabels: readonly (readonly string[])[];
  }[] = [
    {
      heading: "Choose a starting point",
      sliderLabels: [],
    },
    {
      heading: "Budget and timing",
      sliderLabels: [["<£1k", "£1–3k", "£3–10k", "£10k+", "Unsure"]],
    },
    {
      heading: "Today’s workload",
      sliderLabels: [
        ["<10", "10–50", "50–200", "200+", "Unsure"],
        ["<2", "2–5", "5–15", "15+", "Unsure"],
      ],
    },
    { heading: "Channels and systems", sliderLabels: [] },
    { heading: "Automation and sign-off", sliderLabels: [] },
    { heading: "Where should replies go?", sliderLabels: [] },
    { heading: "What should change?", sliderLabels: [] },
  ];

  for (const [stageIndex, stage] of stages.entries()) {
    await expect(page.getByRole("heading", { name: stage.heading })).toBeVisible();
    await expectNoPanelOverflow(form);

    const sliders = form.locator('.ss-enq__slider input[type="range"]');
    expect(await sliders.count()).toBe(stage.sliderLabels.length);
    for (const [sliderIndex, labels] of stage.sliderLabels.entries()) {
      const slider = sliders.nth(sliderIndex);
      const instrument = slider.locator("xpath=..");
      const readout = instrument.locator(".ss-enq__slider-readout strong");
      const ticks = instrument.locator(".ss-enq__slider-ticks span");

      await slider.focus();
      await slider.press("Home");
      for (const [valueIndex, label] of labels.entries()) {
        if (valueIndex > 0) await slider.press("ArrowRight");
        await expect(readout).toHaveText(label);
        await expectSingleLine(readout);
      }
      for (const tick of await ticks.all()) await expectSingleLine(tick);
    }

    if (stage.heading === "Where should replies go?") await setRequiredDetails(page);
    if (stageIndex < stages.length - 1) await advance(form);
  }

  const sendButton = form.getByRole("button", { name: "Send" });
  await expect(sendButton).toBeVisible();
  await expectSingleLine(sendButton);
});
