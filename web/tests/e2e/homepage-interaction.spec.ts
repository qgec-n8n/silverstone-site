import { expect, test, type Page } from "@playwright/test";

const trustSignals = [
  "UK-built",
  "London-based",
  "Human-reviewed automation",
  "No lock-in pilots",
  "Live in weeks",
  "GDPR-conscious by design",
] as const;

async function waitForIntro(page: Page) {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-homepage-state", "intro", {
    timeout: 12_000,
  });
}

async function scrollMetrics(page: Page) {
  return page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    viewport: window.innerHeight,
    y: window.scrollY,
  }));
}

test("homepage intro is isolated until Explore opens the body", async ({ page }) => {
  await waitForIntro(page);

  await expect(page.locator("header")).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);
  await expect(page.locator("#system")).toHaveCount(0);
  await expect(page.locator(".ss-hv2-backdrop")).toHaveCount(0);
  expect(await scrollMetrics(page)).toMatchObject({ y: 0 });
  await expect
    .poll(async () => {
      const metrics = await scrollMetrics(page);
      return metrics.height - metrics.viewport;
    })
    .toBe(0);

  await page.evaluate(() => window.scrollTo(0, 500));
  await expect.poll(async () => (await scrollMetrics(page)).y).toBe(0);

  await page.getByRole("button", { name: "Explore the system" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-homepage-state", "opening");
  await expect(page.locator("#system")).toHaveCount(0);
  await expect
    .poll(async () => {
      const metrics = await scrollMetrics(page);
      return metrics.height - metrics.viewport;
    })
    .toBe(0);

  await expect(page.locator("html")).toHaveAttribute("data-homepage-state", "body", {
    timeout: 5_000,
  });
  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator(".ss-hv2-backdrop canvas")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "The Silverstone System" }),
  ).toBeVisible();
  await expect(page.locator(".ss-hv2-trust__item")).toHaveText([...trustSignals]);

  const headerColorAtTop = await page
    .locator("header")
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect.poll(async () => (await scrollMetrics(page)).y).toBeGreaterThan(0);
  const headerColorAfterScroll = await page
    .locator("header")
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(headerColorAtTop).toBe("rgb(255, 255, 255)");
  expect(headerColorAfterScroll).toBe("rgb(255, 255, 255)");

  await page.getByRole("button", { name: "Return to intro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-homepage-state", "intro", {
    timeout: 5_000,
  });
  await expect(page.locator("header")).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);
  await expect(page.locator("#system")).toHaveCount(0);
  await expect(page.locator(".ss-hv2-backdrop")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Explore the system" })).toBeFocused();
  await expect.poll(async () => (await scrollMetrics(page)).y).toBe(0);
});
