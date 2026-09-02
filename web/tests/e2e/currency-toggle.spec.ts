import { expect, test, type Page } from "@playwright/test";

/**
 * The display-currency contract:
 *
 *  · both currencies are in the SERVED bytes of every priced page, as
 *    "£3,000 / $3,900" — a non-rendering crawler reads both;
 *  · a browser shows exactly one side, sterling by default;
 *  · the toggle is a real radio group: keyboard operable, announced, and the
 *    choice persists across routes and reloads;
 *  · with JavaScript off, the radio still switches every price on the page.
 */

function stripTags(html: string) {
  const main = /<main\b[^>]*>([\S\s]*?)<\/main>/i.exec(html)?.[1] ?? "";
  return main
    .replaceAll(/<(script|style)\b[^>]*>[\S\s]*?<\/\1>/gi, " ")
    .replaceAll(/<[^>]+>/g, " ")
    .replaceAll(/\s+/g, " ");
}

/**
 * The instrument in the pricing hero is the target on desktop; the hero
 * showcase is not shown on phones, where the compact header toggle is used.
 */
async function visibleGroup(page: Page) {
  const hero = page.locator(
    ".ss-pri-model input[name='ss-currency-pricing'][value='gbp']",
  );
  const group = (await hero.isVisible()) ? "pricing" : "header";
  return {
    gbp: page.locator(`input[name='ss-currency-${group}'][value='gbp']`),
    usd: page.locator(`input[name='ss-currency-${group}'][value='usd']`),
    status: page
      .locator(`input[name='ss-currency-${group}']`)
      .first()
      .locator("xpath=ancestor::fieldset//*[@role='status']"),
  };
}

test("both currencies are served in the pricing HTML", async ({ request }) => {
  const html = await (await request.get("/pricing")).text();
  const text = stripTags(html);
  expect(text).toContain("£3,000 / $3,900");
  expect(text).toContain("£10,000–£25,000 / $12,500–$32,500");
  expect(text).toContain("£350 / $450");
  expect(text).toContain("£1,500 / $1,950");
  // Results stay in sterling: no dollar pair is ever attached to a measured figure.
  expect(text).toContain("£16,800.00");
  expect(text).not.toContain("£16,800.00 / $");
  // The pricing-hero instrument is prerendered with sterling checked. (The
  // site header is mounted after the route gate opens, so it is not in the
  // static document of gated routes.)
  expect(html).toContain('name="ss-currency-pricing"');
  expect(html).toMatch(/value="gbp"[^>]*checked=""|checked=""[^>]*value="gbp"/);
});

test("the toggle switches every price, persists, and is keyboard operable", async ({
  page,
}) => {
  await page.goto("/pricing#pricing-packages", { waitUntil: "networkidle" });
  await expect(page.locator("#pricing-packages")).toBeVisible();

  const pilot = page.locator(".ss-pri-ladder__point").nth(1);
  await expect(pilot).toHaveText("£3,000", { useInnerText: true });

  await page.evaluate(() => window.scrollTo(0, 0));
  const { gbp, usd, status } = await visibleGroup(page);
  await expect(gbp).toBeChecked();

  // Keyboard: focus the group and move with an arrow key.
  await gbp.focus();
  await expect(gbp).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(usd).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-currency", "usd");
  await expect(pilot).toHaveText("$3,900", { useInnerText: true });
  await expect(status).toHaveText("Prices shown in US dollars.");

  // Every instance on the page agrees: both groups follow the same store.
  for (const radio of await page
    .locator("input[name^='ss-currency'][value='usd']")
    .all()) {
    await expect(radio).toBeChecked();
  }

  // Persists across a navigation and a cold reload, before first paint — and
  // the budget bands on the contact form follow it.
  await page.goto("/contact#contact-form", { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("data-currency", "usd");
  // The desktop console renders every stage's controls; the phone flow only
  // mounts the budget step when reached, so the band check is desktop-only.
  const budgetInputs = page.locator('input[name="budget"]');
  const hasBudgetRow = (await budgetInputs.count()) > 0;
  if (hasBudgetRow) {
    await expect(
      page.locator('input[name="budget"][value="$4,000–$12,500"]'),
    ).toHaveCount(1);
    await expect(page.locator('input[name="budget"][value="£3k–£10k"]')).toHaveCount(0);
  }
  await page.reload({ waitUntil: "domcontentloaded" });
  const early = await page.evaluate(() =>
    document.documentElement.getAttribute("data-currency"),
  );
  expect(early).toBe("usd");

  // And back, through the header instrument.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page
    .locator("input[name='ss-currency-header'][value='gbp']")
    .dispatchEvent("click");
  await expect(page.locator("html")).toHaveAttribute("data-currency", "gbp");
  if (hasBudgetRow) {
    await expect(page.locator('input[name="budget"][value="£3k–£10k"]')).toHaveCount(1);
    await expect(
      page.locator('input[name="budget"][value="$4,000–$12,500"]'),
    ).toHaveCount(0);
  }
});

test("with JavaScript off, the radio still switches the visible price", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/pricing");
  const figure = page.locator(".ss-pri-tier__figure").first();
  await expect(figure).toHaveText("£2,000–£10,000", { useInnerText: true });
  // Without JavaScript the prerendered route gate never opens, so the radio
  // is activated directly rather than through a pointer; the assertion is on
  // the CSS :has() fallback, which is what a no-JS reader depends on.
  await page
    .locator(".ss-pri-model input[name='ss-currency-pricing'][value='usd']")
    .dispatchEvent("click");
  await expect(figure).toHaveText("$2,500–$12,500", { useInnerText: true });
  await context.close();
});
