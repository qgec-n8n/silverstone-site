import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { expect, test, type Page } from "@playwright/test";

import type { ApprovedServiceContent } from "../../src/content/services/approved-services";
import { serviceCopyByRoute } from "../../src/features/services-v2/content/copy";

/**
 * The gated route-entry sequence: loader → Aether intro splash → the Explore
 * pill expanding into the body → the return control collapsing it back.
 *
 * Every string asserted here is read from the file that produces it rather
 * than transcribed into this one. That is deliberate. These expectations used
 * to be hand-copied, so an ordinary copy edit to a route's splash — new loader
 * line, retuned pill, reworded button — failed the suite even though the
 * sequence it exists to guard was perfectly healthy. Reading the source of
 * truth keeps the test on the wiring (does the splash render this route's
 * entry, does the body carry this route's H1, does the gate open and come
 * back) and lets the copy move freely.
 *
 * `approved-services.json` is what `~/data/route-experiences` itself reads for
 * these routes; it is loaded with `readFileSync` rather than imported because
 * Playwright's loader will not take a JSON import without an import attribute.
 */
const approvedServices = JSON.parse(
  readFileSync(
    resolve(process.cwd(), "src/content/services/generated/approved-services.json"),
    "utf8",
  ),
) as Record<string, ApprovedServiceContent>;

const serviceRoutes = (
  [
    "/services/web-design-development",
    "/services/app-development",
    "/services/ai-voice-agents",
  ] as const
).map((path) => {
  const service = approvedServices[path];
  if (!service) {
    // A route dropping out of the approved set would silently empty this
    // table, so it fails loudly at collection time instead.
    throw new Error(`No approved service content for ${path}`);
  }

  return {
    entry: service.routeEntry,
    // The route's real public H1, rendered once the body opens — distinct from
    // the splash's teaser title by design. Emphasis markdown renders as <em>,
    // so the text check uses the plain form.
    bodyHeading: serviceCopyByRoute[path].h1.replaceAll("*", ""),
    path,
  };
});

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

/**
 * Click the floating return-to-intro control.
 *
 * On phones that control is deliberately withheld until the visitor has
 * scrolled past the one-screen hero (see `app/experience/mobile-chrome-gate.tsx`
 * and the `max-width: 40rem` block near `.ss-hv2-return` in
 * styles/visual/home-v2.css), so scroll the way a visitor would and wait on the
 * gate's own attribute rather than on a pixel count. Above 40rem the attribute
 * is never set and nothing is ever hidden, so the scroll is skipped and the
 * desktop project exercises exactly the sequence it always did.
 */
async function clickReturnToRouteIntro(page: Page) {
  const phone = await page.evaluate(
    () => window.matchMedia("(max-width: 40rem)").matches,
  );
  if (phone) {
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight);
    });
    await expect(page.locator("html")).toHaveAttribute("data-mobile-chrome", "ready", {
      timeout: 5_000,
    });
  }
  await page.getByRole("button", { name: /return to intro/i }).click();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

for (const route of serviceRoutes) {
  const { entry } = route;

  test(`route-entry sequence works for ${route.path}`, async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto(route.path);

    await expect(loaderStatus(page)).toContainText(entry.loaderText);
    await expect(introTitle(page)).toHaveCount(0);

    await waitForRouteIntro(page);
    const splash = page.getByLabel(
      new RegExp(`${escapeRegExp(entry.title)} intro`, "i"),
    );
    await expect(splash).toBeVisible();
    /*
     * The pill ships in two forms — the full line and a phone-length one — and
     * CSS shows exactly one per viewport (see `.ss-hv2-kicker__text`). Both are
     * always in the markup, so a text check covers either project while the
     * visibility check proves the kicker itself renders.
     */
    const kicker = splash.locator(".ss-hv2-kicker");
    await expect(kicker).toBeVisible();
    await expect(kicker).toContainText(entry.pill);
    await expect(introTitle(page)).toHaveText(entry.title);
    await expect(introTitle(page)).toBeVisible();
    await expect(page.getByRole("button", { name: entry.buttonLabel })).toBeVisible();

    await openBody(page, entry.buttonLabel);
    await expect(page.getByRole("main")).toContainText(route.bodyHeading);

    await clickReturnToRouteIntro(page);
    await waitForRouteIntro(page);
    await expect(page.getByRole("button", { name: entry.buttonLabel })).toBeFocused();

    await page.reload();
    await expect(loaderStatus(page)).toContainText(entry.loaderText);
    await waitForRouteIntro(page);
  });
}

test("client navigation from a hub card does not reload the document", async ({
  page,
}) => {
  test.setTimeout(45_000);
  await page.goto("/services");
  await waitForRouteIntro(page);
  await openBody(page, "Explore our services");

  /*
   * This test used to assert that the click replayed the CoreSpin loader and
   * the destination intro. It only ever saw that because the /services hub
   * cards were bare `<a>` elements, so the click was a full document load —
   * not the client navigation the test was named for. The cards are now real
   * React Router `Link`s, which is the point: internal navigation is gate-free
   * (roughly 5.7s down to ~100ms) and deliberately does NOT replay the loader.
   *
   * So the contract asserted here is the one that now matters: the document is
   * never reloaded, and the destination renders its own content.
   */
  await page.evaluate(() => {
    (window as unknown as { __ssNoReload?: true }).__ssNoReload = true;
  });

  await page
    .getByRole("link", { name: /Web Design & Development/i })
    .first()
    .click();

  await expect(page).toHaveURL(/\/services\/web-design-development$/);
  await expect(page.locator("h1")).toHaveText(
    "Web design and development engineered to move buyers forward",
  );

  // Survives only if the SPA never tore the document down.
  expect(
    await page.evaluate(
      () => (window as unknown as { __ssNoReload?: true }).__ssNoReload === true,
    ),
  ).toBe(true);
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
    "An AI receptionist that knows when to hand over",
  );

  await clickReturnToRouteIntro(page);
  await waitForRouteIntro(page);
  await expect(
    page.getByRole("button", { name: "Open the front-desk system" }),
  ).toBeVisible();
});
