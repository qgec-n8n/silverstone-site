import { expect, test, type Locator, type Page } from "@playwright/test";

async function advance(form: Locator) {
  await form.locator('button[type="submit"]').evaluate((button) => {
    (button as HTMLButtonElement).click();
  });
}

async function expectNoInternalScroll(form: Locator) {
  // The console has no scrollable interior on either shell: every element
  // inside the form must be content-sized. The message textarea is the one
  // legitimate scroller (long placeholder or long messages).
  const overflowing = await form.evaluate((root): string[] => {
    const nodes: Element[] = [root, ...root.querySelectorAll("*")];
    return nodes
      .filter((node) => {
        if (node.tagName === "TEXTAREA") return false;
        const style = getComputedStyle(node);
        const scrollable = ["auto", "scroll"].includes(style.overflowY);
        return scrollable && node.scrollHeight - node.clientHeight > 1;
      })
      .map((node) => node.getAttribute("class") ?? node.tagName);
  });
  expect(overflowing).toEqual([]);
}

/** Chips and cards keep their real input stretched across the styled label,
 * so the input itself is the honest click target (it's opacity-0, which
 * Playwright's actionability check refuses without force). */
function pickOption(form: Locator, name: string, value: string) {
  return form.locator(`input[name="${name}"][value="${value}"]`).click({
    force: true,
  });
}

async function expectNoHorizontalOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
}

/** Fit contract: the whole console sits inside the browser viewport. */
async function expectFitsViewport(page: Page, form: Locator) {
  const viewport = page.viewportSize();
  if (!viewport) throw new Error("viewport size unavailable");
  const height = await form.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  expect(height).toBeLessThanOrEqual(viewport.height);
}

/** Copy contract: nothing button-like ever renders more than two text lines. */
async function expectButtonCopyMaxTwoLines(form: Locator) {
  const overLimit = await form.evaluate((root): string[] => {
    const controls = root.querySelectorAll(
      "button, .ss-enq__card span, .ss-core-form__seg-option span",
    );
    const offenders: string[] = [];
    for (const el of controls) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const tops: number[] = [];
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.textContent?.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const rect of range.getClientRects()) {
          if (rect.width > 1 && rect.height > 1) {
            if (!tops.some((top) => Math.abs(top - rect.top) < rect.height / 2)) {
              tops.push(rect.top);
            }
          }
        }
      }
      if (tops.length > 2) {
        offenders.push(
          `${el.textContent.trim().slice(0, 40)} (${String(tops.length)})`,
        );
      }
    }
    return offenders;
  });
  expect(overLimit).toEqual([]);
}

async function fillRequiredSendFields(page: Page) {
  await page.getByLabel("Name").fill("Visual Review");
  await page.getByLabel("Work email").fill("review@example.com");
  await page
    .getByLabel("What would you like to improve?")
    .fill("Reviewing the enquiry console end to end.");
  await page.getByRole("checkbox").check();
}

test("desktop console walks three dossier stages beside a live brief rail", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop-only enquiry composition");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/contact#contact-form");

  const form = page.getByRole("form", { name: "Silverstone inquiry form" });
  await expect(form).toHaveAttribute("data-enq-shell", "desktop");

  // Rail chrome: step list, empty manifest, reply promise.
  const rail = form.locator(".ss-enq__rail");
  await expect(rail.getByRole("button", { name: "Focus" })).toBeVisible();
  await expect(rail.getByText("Answers you choose are attached here.")).toBeVisible();
  await expect(rail.getByText("Replies within one working day.")).toBeVisible();

  // Stage 1: choosing an interest lands in the live brief manifest.
  await expect(
    page.getByRole("heading", { name: "What should we look at?" }),
  ).toBeVisible();
  await pickOption(form, "interest", "AI Receptionists");
  await expect(rail.locator(".ss-enq__manifest dd").first()).toHaveText(
    "AI Receptionists",
  );
  await expectNoInternalScroll(form);
  await expectFitsViewport(page, form);
  await expectButtonCopyMaxTwoLines(form);

  await advance(form);
  await expect(
    page.getByRole("heading", { name: "How you operate today" }),
  ).toBeFocused();
  await expectNoInternalScroll(form);
  await expectFitsViewport(page, form);
  await expectButtonCopyMaxTwoLines(form);

  await advance(form);
  await expect(page.getByRole("heading", { name: "Send your inquiry" })).toBeFocused();
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Work email")).toBeVisible();
  await expectNoInternalScroll(form);
  await expectFitsViewport(page, form);
  await expectButtonCopyMaxTwoLines(form);

  // Completed steps stay reachable from the rail.
  await rail.getByRole("button", { name: "Focus" }).click();
  await expect(
    page.getByRole("heading", { name: "What should we look at?" }),
  ).toBeFocused();
});

test("desktop console fits a short laptop viewport on every stage", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop-only enquiry composition");
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/contact#contact-form");

  const form = page.getByRole("form", { name: "Silverstone inquiry form" });
  const headings = [
    "What should we look at?",
    "How you operate today",
    "Send your inquiry",
  ];
  for (const [index, heading] of headings.entries()) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await expectFitsViewport(page, form);
    await expectButtonCopyMaxTwoLines(form);
    if (index < headings.length - 1) await advance(form);
  }
});

test("desktop send stage validates identity, message and consent in place", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop-only enquiry composition");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/contact#contact-form");

  const form = page.getByRole("form", { name: "Silverstone inquiry form" });
  await advance(form);
  await advance(form);
  await expect(page.getByRole("heading", { name: "Send your inquiry" })).toBeVisible();

  await advance(form);
  await expect(page.getByText("Add the name we should reply to.")).toBeVisible();
  await expect(page.getByText("Add the email address for our reply.")).toBeVisible();
  await expect(
    page.getByText("A sentence or two is enough to route this properly."),
  ).toBeVisible();
  await expect(
    page.getByText("Please confirm you're happy to be contacted about this."),
  ).toBeVisible();

  await fillRequiredSendFields(page);
  await expect(page.getByRole("button", { name: "Send inquiry" })).toBeEnabled();
});

test("mobile flow runs four content-sized steps with honest skip labels", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile-only enquiry composition");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contact#contact-form");

  const form = page.getByRole("form", { name: "Silverstone inquiry form" });
  await expect(form).toHaveAttribute("data-enq-shell", "mobile");
  await expect(form.locator(".ss-enq__rail")).toHaveCount(0);

  const steps: readonly { heading: string; skippable: boolean }[] = [
    { heading: "What should we look at?", skippable: false },
    { heading: "Scope and timing", skippable: true },
    { heading: "Your operation today", skippable: true },
    { heading: "Send your inquiry", skippable: false },
  ];

  for (const [index, stepDef] of steps.entries()) {
    await expect(page.getByRole("heading", { name: stepDef.heading })).toBeVisible();
    await expectNoInternalScroll(form);
    await expectNoHorizontalOverflow(page);
    await expectFitsViewport(page, form);
    await expectButtonCopyMaxTwoLines(form);
    if (index < steps.length - 1) {
      const submit = form.locator('button[type="submit"]');
      await expect(submit).toHaveText(
        new RegExp(stepDef.skippable ? "Skip" : "Continue"),
      );
      await advance(form);
    }
  }

  await expect(page.getByRole("button", { name: "Send inquiry" })).toBeVisible();
});

test("mobile qualifier answers flip Skip to Continue and surface in the brief", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile-only enquiry composition");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contact#contact-form");

  const form = page.getByRole("form", { name: "Silverstone inquiry form" });
  await advance(form);
  await expect(page.getByRole("heading", { name: "Scope and timing" })).toBeVisible();

  const submit = form.locator('button[type="submit"]');
  await expect(submit).toHaveText(/Skip/);
  await pickOption(form, "budget", "£3k–£10k");
  await expect(submit).toHaveText(/Continue/);

  await advance(form);
  await advance(form);
  await expect(page.getByRole("heading", { name: "Send your inquiry" })).toBeVisible();
  await expect(form.locator(".ss-enq__brief-line")).toContainText("£3k–£10k");
});

test("mobile flow fits a compact 667px phone on every step", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile-only enquiry composition");
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/contact#contact-form");

  const form = page.getByRole("form", { name: "Silverstone inquiry form" });
  const headings = [
    "What should we look at?",
    "Scope and timing",
    "Your operation today",
    "Send your inquiry",
  ];
  for (const [index, heading] of headings.entries()) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await expectFitsViewport(page, form);
    await expectButtonCopyMaxTwoLines(form);
    if (index < headings.length - 1) await advance(form);
  }
});

test("mobile flow fits a 320px viewport without horizontal overflow", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile-only enquiry composition");
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/contact#contact-form");

  const form = page.getByRole("form", { name: "Silverstone inquiry form" });
  const headings = [
    "What should we look at?",
    "Scope and timing",
    "Your operation today",
    "Send your inquiry",
  ];
  for (const [index, heading] of headings.entries()) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expectNoInternalScroll(form);
    await expectFitsViewport(page, form);
    if (index < headings.length - 1) await advance(form);
  }
});
