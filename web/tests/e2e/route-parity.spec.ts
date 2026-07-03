import { expect, test, type Page } from "@playwright/test";

const representativeRoutes = [
  "/",
  "/services",
  "/industry/dentists",
  "/services/dentists",
  "/industry",
  "/industries",
  "/how-we-work",
  "/blog",
  "/blog/ai-receptionist-small-business-2026",
  "/pricing",
  "/contact",
  "/book",
  "/privacy-policy",
];

const representativeSourceCopy = [
  {
    path: "/about",
    text: "A premium technology partner built around better judgement",
  },
  {
    path: "/industry/dentists",
    text: "Recall & rebooking",
  },
  {
    path: "/blog/ai-receptionist-small-business-2026",
    text: "The original article content is temporarily withheld while claim evidence, source provenance or duplication decisions are being reviewed.",
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

test("rebuilt contact route renders a staging-safe enquiry form", async ({ page }) => {
  await page.goto("/contact");

  await expect(
    page.getByRole("heading", { name: "Start with the question that matters" }),
  ).toBeVisible();
  await expect(page.getByRole("form")).toHaveCount(1);
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Work email")).toBeVisible();
  await expect(page.getByRole("button", { name: "Send enquiry" })).toBeVisible();
});

test("rebuilt book route exposes Calendly destination without embedding live booking", async ({
  page,
}) => {
  await page.goto("/book");

  await expect(
    page.getByRole("heading", { name: "Book a 30-minute discovery call" }),
  ).toBeVisible();
  await expect(page.locator("main iframe")).toHaveCount(0);
  await expect(
    page.getByText("Production scheduler: https://calendly.com/silverstone-ai/30min"),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact instead" })).toHaveAttribute(
    "href",
    "/contact",
  );
});
