import { expect, test } from "@playwright/test";

const representativeRoutes = [
  "/",
  "/services",
  "/services/dentists",
  "/blog",
  "/blog/ai-receptionist-small-business-2026",
  "/pricing",
  "/privacy-policy",
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
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /^https:\/\/silverstone-ai\.com/,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
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
