import { expect, test } from "@playwright/test";

const representativeRoutes = [
  "/",
  "/services",
  "/services/dentists",
  "/industries",
  "/how-we-work",
  "/blog",
  "/blog/ai-receptionist-small-business-2026",
  "/pricing",
  "/privacy-policy",
];

const representativeSourceCopy = [
  {
    path: "/about",
    text: "The work starts with a named problem, an accountable owner and a defined first release. Technology choices follow the workflow, not the other way around.",
  },
  {
    path: "/services/dentists",
    text: "Clinical questions must be separated from administrative ones",
  },
  {
    path: "/blog/ai-receptionist-small-business-2026",
    text: "The original article content is temporarily withheld while claim evidence, source provenance or duplication decisions are being reviewed.",
  },
];

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

    await expect(page.getByText(comparison.text, { exact: true })).toBeVisible();
    await expect(page.locator("main form, main iframe")).toHaveCount(0);
  });
}
