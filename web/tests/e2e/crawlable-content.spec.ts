import { expect, test, type Page } from "@playwright/test";

/**
 * Every route must ship its content to a crawler without anyone clicking
 * anything.
 *
 * The loader/intro gate is a visual layer, not a content switch. It used to be
 * both: the homepage mounted its body only after the explore click, and every
 * other gated route wrapped its body in `aria-hidden="true"` plus a
 * `display: none`. A crawler measures the text a page actually renders, so
 * both techniques erased the entire page — the live site reported 200-550
 * characters per route while shipping 2,500-16,000, and the homepage rendered
 * zero visible links.
 *
 * These tests assert the two halves of the contract that keeps that from
 * coming back: the body is rendered and extractable before any interaction,
 * and the intro is still exactly one non-scrollable screen.
 */

/** SEO tooling flags anything under 1.5K characters as a thin page. */
const THIN_PAGE_FLOOR = 1_500;

const gatedRoutes = [
  "/",
  "/about",
  "/blog",
  "/book",
  "/contact",
  "/how-we-work",
  "/industry",
  "/industry/dentists",
  "/industry/ecommerce",
  "/industry/estate-agents",
  "/industry/fitness-coaches",
  "/industry/gyms-fitness-studios",
  "/industry/hospitality",
  "/industry/physios-chiropractors",
  "/industry/salons-barbers",
  "/industry/trades",
  "/pricing",
  "/services",
  "/services/ai-automation",
  "/services/ai-consulting",
  "/services/ai-receptionists",
  "/services/ai-voice-agents",
  "/services/app-development",
  "/services/content-creation",
  "/services/web-design-development",
] as const;

/**
 * `innerText` is the closest thing the platform has to "what a crawler
 * extracts": it is layout-driven, so it drops `display: none` and
 * `visibility: hidden` subtrees exactly the way an extractor does, while
 * keeping content that is merely clipped or transparent.
 */
async function renderedText(page: Page) {
  return page.evaluate(() => ({
    text: document.body.innerText.trim().length,
    links: document.querySelectorAll("a[href]").length,
    ariaHiddenBodies: document.querySelectorAll(
      '[class*="experience__body"][aria-hidden="true"]',
    ).length,
    hiddenBodies: [
      ...document.querySelectorAll(
        '[class*="experience__body"], .ss-hv2__body, footer.ss-footer',
      ),
    ].filter((node) => {
      const style = getComputedStyle(node);
      return style.display === "none" || style.visibility === "hidden";
    }).length,
  }));
}

for (const path of gatedRoutes) {
  test(`crawlable without interaction: ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });

    // Deliberately no click, no scroll — this is the crawler's view.
    await expect
      .poll(async () => (await renderedText(page)).text, { timeout: 20_000 })
      .toBeGreaterThan(THIN_PAGE_FLOOR);

    const proof = await renderedText(page);
    expect(proof.ariaHiddenBodies).toBe(0);
    expect(proof.hiddenBodies).toBe(0);
    expect(proof.links).toBeGreaterThan(10);
  });
}

/**
 * The other half of the contract. Making the body extractable must not make it
 * reachable: a gated route is still a single screen the visitor cannot scroll
 * past until they open it.
 */
for (const path of ["/", "/services/ai-voice-agents", "/industry/dentists"]) {
  test(`gated intro is still one non-scrollable screen: ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect
      .poll(
        async () =>
          page.evaluate(() =>
            document.documentElement.getAttribute("data-scroll-lock"),
          ),
        { timeout: 20_000 },
      )
      .toBe("on");

    const metrics = await page.evaluate(() => {
      window.scrollTo(0, 5_000);
      return {
        scrollHeight: document.documentElement.scrollHeight,
        viewport: window.innerHeight,
        scrollY: window.scrollY,
      };
    });

    expect(metrics.scrollY).toBe(0);
    // One screen, allowing a couple of pixels of sub-pixel rounding.
    expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.viewport + 4);
  });
}
