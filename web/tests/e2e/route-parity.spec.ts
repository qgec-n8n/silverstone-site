import { expect, test, type Page } from "@playwright/test";

const representativeRoutes = [
  "/",
  "/services",
  "/industry/dentists",
  "/industry",
  "/how-we-work",
  "/blog",
  "/pricing",
  "/contact",
  "/book",
  "/privacy-policy",
];

const representativeSourceCopy = [
  {
    path: "/about",
    text: "A London AI automation agency working across the UK and US",
  },
  {
    path: "/industry/dentists",
    text: "Recall & rebooking",
  },
];

async function revealRouteTextIfNeeded(page: Page, text: string) {
  const targetText = page.getByText(text, { exact: true }).first();
  if (await targetText.isVisible().catch(() => false)) {
    return;
  }

  const exploreButton = page.locator(".ss-service-intro button").first();
  const hasRouteEntry = await exploreButton
    .waitFor({ state: "visible", timeout: 12_000 })
    .then(() => true)
    .catch(() => false);
  if (hasRouteEntry) {
    await exploreButton.click();
  }

  // Opening the route hands over to the CoreSpin loader, which paints a
  // full-bleed overlay while it plays its exit. Route text becomes visible
  // before that overlay leaves the DOM, so a click issued on the strength of
  // a visible heading alone is intercepted by `.ss-loader[data-phase]`.
  // Waiting for the overlay itself is the real signal; "hidden" covers both
  // the detached and the still-mounted-but-finished cases.
  await page
    .locator(".ss-loader")
    .waitFor({ state: "hidden", timeout: 15_000 })
    .catch(() => {
      // A route that never mounted a loader (a direct, gate-free entry) has
      // nothing to wait for.
    });
}

for (const path of representativeRoutes) {
  test(`route parity: ${path}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });

    const response = await page.goto(path);

    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /^https:\/\/silverstone-ai\.com/,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      "noindex,nofollow,noarchive",
    );
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
    expect(response?.headers()["x-robots-tag"]).toBe("noindex,nofollow,noarchive");
    expect(consoleErrors).toEqual([]);
  });
}

test("unknown routes return a genuine 404", async ({ request }) => {
  const response = await request.get("/route-that-does-not-exist");

  expect(response.status()).toBe(404);
});

for (const comparison of representativeSourceCopy) {
  test(`source content comparison: ${comparison.path}`, async ({ page }) => {
    await page.goto(comparison.path);

    // Route-entry pages need the intro opened; bespoke core pages render directly.
    await revealRouteTextIfNeeded(page, comparison.text);
    await expect(page.getByText(comparison.text, { exact: true })).toBeVisible({
      timeout: 15_000,
    });
    if (comparison.path !== "/about") {
      await expect(page.locator("main form, main iframe")).toHaveCount(0);
    }
  });
}

test("rebuilt contact route renders a staging-safe enquiry form", async ({
  page,
}, testInfo) => {
  // The console sequences the same content as three desktop stages or four
  // mobile steps; both paths end at the send stage.
  const mobile = testInfo.project.name === "mobile-chromium";
  await page.goto("/contact");
  await revealRouteTextIfNeeded(page, "Start with the question that matters");

  await expect(
    page.getByRole("heading", { name: "Start with the question that matters" }),
  ).toBeVisible();
  await expect(page.getByRole("form")).toHaveCount(1);
  const advanceButton = page.locator(
    'form[aria-label="Silverstone inquiry form"] button[type="submit"]',
  );
  await advanceButton.click();
  await expect(
    page.getByRole("heading", {
      name: mobile ? "Scope and timing" : "How you operate today",
    }),
  ).toBeFocused();
  const remainingQualifierPanels = mobile ? 2 : 1;
  for (let hop = 0; hop < remainingQualifierPanels; hop += 1) {
    await advanceButton.click();
  }
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Work email")).toBeVisible();
  await expect(page.getByRole("button", { name: "Send inquiry" })).toBeVisible();
});

test("rebuilt book route exposes the native staging-safe booking console", async ({
  page,
}, testInfo) => {
  const mobile = testInfo.project.name === "mobile-chromium";
  await page.goto("/book");
  await revealRouteTextIfNeeded(page, "Book a 30-minute discovery call");

  await expect(
    page.getByRole("heading", { name: "Book a 30-minute discovery call" }),
  ).toBeVisible();
  await expect(page.locator("main iframe")).toHaveCount(0);
  await expect(page.getByTestId("booking-shell")).toHaveAttribute(
    "data-booking-mode",
    "mock",
  );
  await expect(
    page.getByRole("navigation", { name: "Booking progress" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: mobile ? "Pick a day" : "Choose your moment",
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact instead" })).toHaveAttribute(
    "href",
    "/contact#contact-form",
  );
});
