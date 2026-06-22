import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("foundation shell loads without runtime errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  const response = await page.goto("/");

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole("heading", { name: "Silverstone web foundation" }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,nofollow,noarchive",
  );
  expect(response?.headers()["x-robots-tag"]).toBe("noindex,nofollow,noarchive");
  expect(consoleErrors).toEqual([]);
});

test("@a11y foundation shell has no serious or critical axe violations", async ({
  page,
}) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const blockingViolations = results.violations.filter((violation) =>
    ["critical", "serious"].includes(violation.impact ?? ""),
  );

  expect(blockingViolations).toEqual([]);
});

test("development-only component route is absent from production", async ({
  request,
}) => {
  const response = await request.get("/__components");

  expect(response.status()).toBe(404);
  expect(await response.text()).not.toContain("Component lab");
});
