import { expect, test, type Page } from "@playwright/test";

/**
 * The mobile drawer's navigation contract.
 *
 * Two defects motivated this file, both only reachable through the drawer and
 * both invisible on desktop:
 *
 *   1. The drawer pins the body with `position: fixed` while it is open (the
 *      standard iOS rubber-band workaround) and used to hand that captured
 *      offset back on the way out — onto whatever page was now on screen. A
 *      visitor who was 1600px down one page and picked another from the menu
 *      landed 1600px down the NEW one, well past its secondary hero.
 *
 *   2. The drawer closed on click rather than on arrival, so it uncovered the
 *      page being LEFT for the whole pending navigation (measured at ~800ms on
 *      a throttled connection): the previous page's hero appeared as though it
 *      were the destination, then was replaced by the real one.
 *
 * Both assertions below are frame-level, because both defects were transient.
 */

const START = "/services/ai-receptionists";
const DEEP_SCROLL = 1600;
/** Enough of a stall that the pending window is unmissable at 60fps. The
 * preview server answers instantly, which is precisely the condition under
 * which the uncovered-outgoing-page defect stays invisible. */
const DESTINATION_DELAY_MS = 700;

async function openBody(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  const explore = page.locator("button.ss-explore-cta").first();
  if (
    await explore.waitFor({ state: "visible", timeout: 15_000 }).then(
      () => true,
      () => false,
    )
  ) {
    await explore.click();
  }
  await page.waitForFunction(
    () =>
      document.documentElement.getAttribute("data-route-experience-state") === "body" ||
      document.documentElement.getAttribute("data-gate-free") === "on",
    undefined,
    { timeout: 20_000 },
  );
}

async function openDrawer(page: Page) {
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
}

/**
 * Samples every animation frame from the tap until the page settles, recording
 * any frame where the OUTGOING hero is on screen with no drawer covering it.
 */
async function watchForStaleFrames(page: Page, outgoingH1: string) {
  await page.evaluate((outgoing) => {
    const w = window as unknown as { __staleFrames: number[]; __raf: number };
    w.__staleFrames = [];
    const started = performance.now();
    const tick = () => {
      const covered = Boolean(document.getElementById("mobile-nav"));
      const firstH1 = document.querySelector("h1")?.textContent.trim() ?? "";
      if (!covered && firstH1 === outgoing) {
        w.__staleFrames.push(Math.round(performance.now() - started));
      }
      w.__raf = requestAnimationFrame(tick);
    };
    tick();
  }, outgoingH1);
}

async function collectStaleFrames(page: Page) {
  return page.evaluate(() => {
    const w = window as unknown as { __staleFrames: number[]; __raf: number };
    cancelAnimationFrame(w.__raf);
    return w.__staleFrames;
  });
}

test.describe("mobile drawer navigation", () => {
  test.skip(
    ({ isMobile }) => !isMobile,
    "the drawer is the mobile-only nav surface (lg:hidden)",
  );

  test("a destination picked from the drawer opens at its own hero", async ({
    page,
  }) => {
    await openBody(page, START);
    await page.evaluate((y) => window.scrollTo(0, y), DEEP_SCROLL);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(DEEP_SCROLL - 200);

    const outgoingH1 = (await page.locator("h1").first().textContent())?.trim() ?? "";

    // Hold the destination's route data back so the pending window is real.
    // Registered after the start page has loaded so only the navigation pays.
    await page.route("**/pricing.data", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, DESTINATION_DELAY_MS));
      await route.continue();
    });

    await openDrawer(page);
    await watchForStaleFrames(page, outgoingH1);
    await page.getByRole("link", { name: "Pricing", exact: true }).first().tap();

    await page.waitForURL("**/pricing", { timeout: 20_000 });
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();

    const staleFrames = await collectStaleFrames(page);
    expect(staleFrames, "outgoing hero was uncovered mid-navigation").toEqual([]);

    // The destination owns its own scroll position, and the body pin is gone.
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    expect(await page.evaluate(() => getComputedStyle(document.body).position)).toBe(
      "static",
    );

    const heroTop = await page
      .locator("h1")
      .first()
      .evaluate((node) => node.getBoundingClientRect().top);
    expect(heroTop).toBeGreaterThan(0);
    expect(heroTop).toBeLessThan(page.viewportSize()?.height ?? 844);
  });

  test("dismissing the drawer without navigating keeps the reading position", async ({
    page,
  }) => {
    await openBody(page, START);
    await page.evaluate((y) => window.scrollTo(0, y), DEEP_SCROLL);
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(DEEP_SCROLL - 200);
    const before = await page.evaluate(() => window.scrollY);

    await openDrawer(page);
    await page.getByRole("button", { name: "Close menu" }).last().click();
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();

    expect(await page.evaluate(() => window.scrollY)).toBe(before);
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("a link to the page already open closes the drawer immediately", async ({
    page,
  }) => {
    await openBody(page, "/pricing");
    await openDrawer(page);
    await page.getByRole("link", { name: "Pricing", exact: true }).first().tap();

    // No route body swaps, so there is nothing to hold the drawer open for.
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden({
      timeout: 2_000,
    });
    expect(await page.evaluate(() => getComputedStyle(document.body).position)).toBe(
      "static",
    );
  });
});
