import { expect, test, type Page } from "@playwright/test";

const serviceRoutes = [
  {
    path: "/services/web-design-development",
    loader:
      "Preparing web design & development built around a clear business problem as a focused growth system.",
    pill: /Service system \/ Web Design & Development/i,
    title: "Web Design & Development built around a clear business problem",
    button: "Explore website systems",
  },
  {
    path: "/services/app-development",
    loader:
      "Preparing custom app development built around a clear business problem as a focused growth system.",
    pill: /Service system \/ Custom App Development/i,
    title: "Custom App Development built around a clear business problem",
    button: "Explore app development",
  },
  {
    path: "/services/ai-voice-agents",
    loader:
      "Preparing ai voice agents built around a clear business problem as a focused growth system.",
    pill: /Service system \/ AI Voice Agents/i,
    title: "AI Voice Agents built around a clear business problem",
    button: "Explore intelligent conversations",
  },
] as const;

async function waitForRouteIntro(page: Page) {
  await expect(page.locator("html")).toHaveAttribute(
    "data-route-experience-state",
    "intro",
    { timeout: 12_000 },
  );
}

async function openBody(page: Page, button: string) {
  await page.getByRole("button", { name: button }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-route-experience-state",
    "body",
    { timeout: 8_000 },
  );
}

for (const route of serviceRoutes) {
  test(`route-entry sequence works for ${route.path}`, async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto(route.path);

    await expect(page.getByRole("status")).toContainText(route.loader);
    await expect(page.getByRole("heading", { name: route.title })).toHaveCount(0);

    await waitForRouteIntro(page);
    await expect(page.getByText(route.pill)).toBeVisible();
    await expect(page.getByRole("heading", { name: route.title })).toBeVisible();
    await expect(page.getByRole("button", { name: route.button })).toBeVisible();

    await openBody(page, route.button);
    await expect(page.getByRole("main")).toContainText("Service architecture");

    await page.getByRole("button", { name: /return to route intro/i }).click();
    await waitForRouteIntro(page);
    await expect(page.getByRole("button", { name: route.button })).toBeFocused();

    await page.reload();
    await expect(page.getByRole("status")).toContainText(route.loader);
    await waitForRouteIntro(page);
  });
}

test("client navigation replays CoreSpin and the destination intro", async ({
  page,
}) => {
  test.setTimeout(45_000);
  await page.goto("/services");
  await waitForRouteIntro(page);
  await openBody(page, "Explore our services");

  await page
    .getByRole("link", { name: /Web Design & Development/i })
    .first()
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Preparing web design & development built around a clear business problem as a focused growth system.",
    { timeout: 6_000 },
  );
  await waitForRouteIntro(page);
  await expect(
    page.getByRole("button", { name: "Explore website systems" }),
  ).toBeVisible();
});

test("prompt service aliases resolve to canonical route experiences", async ({
  page,
}) => {
  await page.goto("/services/website-design-development");
  await expect(page.getByRole("status")).toContainText(
    "Preparing web design & development built around a clear business problem as a focused growth system.",
  );
  await waitForRouteIntro(page);
  await expect(
    page.getByRole("button", { name: "Explore website systems" }),
  ).toBeVisible();

  await page.goto("/services/ai-agents-automation");
  await expect(page.getByRole("status")).toContainText(
    "Preparing ai automation & agent workflows built around a clear business problem as a focused growth system.",
  );
  await waitForRouteIntro(page);
  await expect(
    page.getByRole("button", { name: "Explore automation systems" }),
  ).toBeVisible();
});

test("route-entry sequence remains usable with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/services/ai-receptionists");

  await expect(page.getByRole("status")).toContainText(
    "Preparing ai receptionists built around a clear business problem as a focused growth system.",
  );
  await waitForRouteIntro(page);
  await openBody(page, "Meet your AI front desk");
  await expect(page.getByRole("main")).toContainText("Service architecture");

  await page.getByRole("button", { name: /return to route intro/i }).click();
  await waitForRouteIntro(page);
  await expect(
    page.getByRole("button", { name: "Meet your AI front desk" }),
  ).toBeVisible();
});
