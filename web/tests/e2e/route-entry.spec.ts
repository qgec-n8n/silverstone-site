import { expect, test, type Page } from "@playwright/test";

const serviceRoutes = [
  {
    path: "/services/web-design-development",
    loader: "Aligning message, movement and measurement",
    pill: /Custom digital experience/i,
    // The Aether intro's teaser title — distinct from the body's public H1
    // by design (intro teases, body delivers); it is not repeated in <main>.
    title: "Make the website earn its place",
    // The real public H1 rendered once the body opens.
    bodyHeading: "A website engineered to move buyers forward",
    button: "Explore the commercial website system",
  },
  {
    path: "/services/app-development",
    loader: "Reducing the idea to its most valuable working state",
    pill: /Product intelligence \/ First release/i,
    title: "Prove the workflow before expanding the product",
    bodyHeading: "Build the smallest app that proves the value",
    button: "Map the first release",
  },
  {
    path: "/services/ai-voice-agents",
    loader: "Synchronising speech, action and human fallback",
    pill: /Conversational systems \/ Voice/i,
    title: "Give every call a controlled next state",
    bodyHeading: "Voice agents built for real conversations",
    button: "Explore the call architecture",
  },
] as const;

/**
 * The CoreSpin loader, addressed by element rather than by bare role.
 *
 * A route's body is rendered (inert and clipped) from the first paint so it
 * stays indexable, and some bodies carry their own `role="status"` live
 * regions — `.ss-lvd__status` on the voice route, for one. A bare
 * `getByRole("status")` matches those too and trips strict mode.
 */
function loaderStatus(page: Page) {
  return page.locator(".ss-loader[role='status']");
}

/**
 * The intro splash title. Deliberately NOT a heading: the route's only H1 is
 * the body hero's, so the splash renders as a plain element (see
 * RouteExperienceIntro) and has to be addressed by class, not by role.
 */
function introTitle(page: Page) {
  return page.locator(".ss-service-intro__title");
}

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

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

for (const route of serviceRoutes) {
  test(`route-entry sequence works for ${route.path}`, async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto(route.path);

    await expect(loaderStatus(page)).toContainText(route.loader);
    await expect(introTitle(page)).toHaveCount(0);

    await waitForRouteIntro(page);
    await expect(
      page
        .getByLabel(new RegExp(`${escapeRegExp(route.title)} intro`, "i"))
        .getByText(route.pill),
    ).toBeVisible();
    await expect(introTitle(page)).toHaveText(route.title);
    await expect(introTitle(page)).toBeVisible();
    await expect(page.getByRole("button", { name: route.button })).toBeVisible();

    await openBody(page, route.button);
    await expect(page.getByRole("main")).toContainText(route.bodyHeading);

    await page.getByRole("button", { name: /return to route intro/i }).click();
    await waitForRouteIntro(page);
    await expect(page.getByRole("button", { name: route.button })).toBeFocused();

    await page.reload();
    await expect(loaderStatus(page)).toContainText(route.loader);
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
  await expect(loaderStatus(page)).toContainText(
    "Aligning message, movement and measurement",
    { timeout: 6_000 },
  );
  await waitForRouteIntro(page);
  await expect(
    page.getByRole("button", { name: "Explore the commercial website system" }),
  ).toBeVisible();
});

test("noncanonical service aliases return 404", async ({ request }) => {
  for (const path of [
    "/services/website-design-development",
    "/services/ai-agents-automation",
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test("route-entry sequence remains usable with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/services/ai-receptionists");

  await expect(loaderStatus(page)).toContainText(
    "Converging every inquiry into the right next action",
  );
  await waitForRouteIntro(page);
  await openBody(page, "Open the front-desk system");
  await expect(page.getByRole("main")).toContainText(
    "A front desk that answers, qualifies, and knows when to hand over",
  );

  await page.getByRole("button", { name: /return to route intro/i }).click();
  await waitForRouteIntro(page);
  await expect(
    page.getByRole("button", { name: "Open the front-desk system" }),
  ).toBeVisible();
});
