import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { PRICING_FAQ } from "../../src/data/pricing-faq";

/**
 * /pricing is the only route that publishes prices, which changes what
 * "correct" means for it:
 *
 *  · every published figure must be in the SERVED bytes, not assembled by the
 *    client — a price a crawler cannot read is a price that does not exist;
 *  · the FAQ answers must be in the served bytes too, because the page's
 *    FAQPage structured data is built from the same strings and Google
 *    requires the two to match. That is why the accordion collapses with CSS
 *    and `inert` instead of unmounting;
 *  · the accordion must be fully operable from the keyboard, one panel at a
 *    time, with the ARIA wiring a Radix accordion would have given for free.
 */

/** Skips the loader/Aether-intro gate for this one navigation. */
const BODY_URL = "/pricing#pricing-packages";

const PUBLISHED_FIGURES = [
  // Implementation packages
  "£2,000–£10,000",
  "£10,000–£50,000",
  "£50,000+",
  // Support retainers
  "From £350",
  "From £1,250",
  "£10,000+",
  // Implementation breakdown
  "£500",
  "12 weeks",
  // Website build tiers
  "£1,500",
  "£2,750",
  "£4,750",
  "From £7,500",
  // Website page bands
  "1–10 pages",
  "11–25 pages",
  "26–50 pages",
  "51–100+ pages",
  // Maintenance, hosting and handover
  "£65/month",
  "£125/month",
  "£225/month",
  "Custom quote",
  "£15/month",
  "£25/month",
  "£350 one-off",
  // Bespoke engagements
  "Price on application",
  // Secondary hero model
  "£3,000",
  "£10,000–£25,000",
];

function decode(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function textOfMain(html: string) {
  const main = /<main\b[^>]*>([\S\s]*?)<\/main>/i.exec(html)?.[1] ?? "";
  return decode(
    main
      .replaceAll(/<(script|style)\b[^>]*>[\S\s]*?<\/\1>/gi, " ")
      .replaceAll(/<[^>]+>/g, " ")
      .replaceAll(/\s+/g, " "),
  );
}

/**
 * The composition is a lazily-imported chunk, so hydration briefly swaps the
 * prerendered body for the Suspense fallback (which renders the H1 and nothing
 * else). Waiting only on a prerendered element therefore lets an assertion land
 * on a tree React is about to replace — hence waiting for the network to settle
 * and for the last section on the page to exist before asserting anything.
 */
async function openBody(page: Page) {
  await page.goto(BODY_URL, { waitUntil: "networkidle" });
  await expect(page.locator(".ss-pri-faq__trigger")).toHaveCount(PRICING_FAQ.length);
  await expect(page.locator("#pricing-packages")).toBeVisible();
}

test.describe("pricing content is served, not assembled", () => {
  test("every published figure is in the served HTML", async ({ request }) => {
    const response = await request.get("/pricing");
    expect(response.status()).toBe(200);
    const text = textOfMain(await response.text());

    for (const figure of PUBLISHED_FIGURES) {
      expect(text, `served /pricing is missing ${figure}`).toContain(figure);
    }
  });

  test("every FAQ answer is in the served HTML and matches the FAQPage graph", async ({
    request,
  }) => {
    const html = await (await request.get("/pricing")).text();
    const text = textOfMain(html);

    for (const item of PRICING_FAQ) {
      expect(text, `question missing: ${item.question}`).toContain(item.question);
      expect(text, `answer missing for: ${item.question}`).toContain(item.answer);
    }

    const blocks = [
      ...html.matchAll(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\S\s]*?)<\/script>/gi,
      ),
    ];
    // One JSON-LD block per document is the sitewide contract (route-parity).
    expect(blocks).toHaveLength(1);

    const graph = JSON.parse(
      decode(blocks[0]?.[1] ?? "{}").replaceAll("\\u003c", "<"),
    ) as { "@graph": { "@type": string; mainEntity?: unknown }[] };
    const faq = graph["@graph"].find((entry) => entry["@type"] === "FAQPage");
    expect(faq).toBeDefined();

    const questions = (faq?.mainEntity ?? []) as {
      name: string;
      acceptedAnswer: { text: string };
    }[];
    expect(questions).toHaveLength(PRICING_FAQ.length);
    for (const [index, question] of questions.entries()) {
      expect(question.name).toBe(PRICING_FAQ[index]?.question);
      expect(question.acceptedAnswer.text).toBe(PRICING_FAQ[index]?.answer);
    }
  });

  test("no retired no-rate-card positioning survives anywhere in the document", async ({
    request,
  }) => {
    const html = (await (await request.get("/pricing")).text()).toLowerCase();
    for (const phrase of [
      "rate card",
      "no public price",
      "no generic packages",
      "budget bands",
      "investment by design",
    ]) {
      expect(html, `still present: ${phrase}`).not.toContain(phrase);
    }
  });
});

test.describe("pricing page structure", () => {
  test("has one h1 and an unbroken heading hierarchy", async ({ page }) => {
    await openBody(page);

    const levels = await page.evaluate(() =>
      [...document.querySelectorAll("main h1, main h2, main h3, main h4")].map((node) =>
        Number(node.tagName.slice(1)),
      ),
    );

    expect(levels.filter((level) => level === 1)).toHaveLength(1);
    expect(levels[0]).toBe(1);
    let previous = levels[0] ?? 1;
    for (const level of levels) {
      expect(
        level - previous,
        `heading jumped from h${String(previous)} to h${String(level)}`,
      ).toBeLessThanOrEqual(1);
      previous = level;
    }
  });

  test("hero CTAs point at the established conversion routes", async ({ page }) => {
    await openBody(page);
    const hero = page.locator(".ss-srv2-hero");
    await expect(
      hero.getByRole("link", { name: "Get a custom quote" }),
    ).toHaveAttribute("href", "/contact#contact-form");
    await expect(
      hero.getByRole("link", { name: "Schedule a consultation" }),
    ).toHaveAttribute("href", "/book#booking-calendar");
    await expect(
      page.getByRole("link", { name: "Discuss scope and pricing" }),
    ).toHaveAttribute("href", "/book#booking-calendar");
  });

  test("does not overflow horizontally", async ({ page }) => {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await openBody(page);
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        overflow.scrollWidth,
        `horizontal overflow at ${String(width)}px`,
      ).toBeLessThanOrEqual(overflow.clientWidth);
    }
  });
});

test("@a11y pricing page has no serious or critical axe violations", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await openBody(page);

  // Once with everything collapsed, once with an answer open — the accordion's
  // ARIA wiring is hand-rolled here (Radix unmounts closed panels, which would
  // take the answers out of the crawlable HTML), so both states are checked.
  for (const step of ["collapsed", "expanded"] as const) {
    if (step === "expanded") {
      await page.locator(".ss-pri-faq__trigger").first().click();
      await expect(page.locator(".ss-pri-faq__trigger").first()).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    }

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    const blocking = results.violations.filter((violation) =>
      ["critical", "serious"].includes(violation.impact ?? ""),
    );
    expect(blocking, `axe violations while ${step}`).toEqual([]);
  }
});

test.describe("pricing FAQ", () => {
  test("is keyboard operable with correct ARIA and one panel open at a time", async ({
    page,
  }) => {
    await openBody(page);

    const triggers = page.locator(".ss-pri-faq__trigger");
    await expect(triggers).toHaveCount(PRICING_FAQ.length);

    const first = triggers.first();
    const second = triggers.nth(1);

    await expect(first).toHaveAttribute("aria-expanded", "false");
    const panelId = await first.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    const firstPanel = page.locator(`#${String(panelId)}`);
    await expect(firstPanel).toHaveAttribute("role", "region");

    // Open with the keyboard, not a click.
    await first.focus();
    await page.keyboard.press("Enter");
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(firstPanel).not.toHaveAttribute("inert", /.*/);
    await expect(page.getByText(PRICING_FAQ[0]?.answer ?? "")).toBeVisible();

    // Arrow keys move between triggers.
    await page.keyboard.press("ArrowDown");
    await expect(second).toBeFocused();

    // Opening the second closes the first.
    await page.keyboard.press(" ");
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");

    // Collapsible: pressing again closes it.
    await page.keyboard.press("Enter");
    await expect(second).toHaveAttribute("aria-expanded", "false");
  });

  test("keeps collapsed answers in the DOM but out of the tab order", async ({
    page,
  }) => {
    await openBody(page);

    const answers = await page.evaluate(() =>
      [...document.querySelectorAll(".ss-pri-faq__panel-inner p")].map((node) =>
        node.textContent.trim(),
      ),
    );
    expect(answers).toEqual(PRICING_FAQ.map((item) => item.answer));

    // Polled: the prerendered markup and the hydrated tree both carry `inert`,
    // but asserting on a single snapshot can land mid-hydration.
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            [...document.querySelectorAll(".ss-pri-faq__panel")].filter((node) =>
              node.hasAttribute("inert"),
            ).length,
        ),
      )
      .toBe(PRICING_FAQ.length);
  });
});

test.describe("pricing page under reduced motion", () => {
  test("shows every instrument at its settled value", async ({ page }) => {
    // Emulated on the page rather than declared via `test.use`, so the
    // preference is provably in force before the first paint the assertions
    // below read.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openBody(page);
    expect(
      await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
    ).toBe(true);

    // Budget allocation and page-band meters must not be left at scaleX(0).
    const collapsed = await page.evaluate(
      () =>
        [
          ...document.querySelectorAll(".ss-pri-alloc__fill, .ss-pri-meter__fill"),
        ].filter((node) => {
          const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
          return matrix.a < 0.99;
        }).length,
    );
    expect(collapsed).toBe(0);

    // The hero instrument's calibration marker does not render at all.
    await expect(page.locator(".ss-pri-model__marker")).toHaveCount(0);

    // Prices are still readable.
    await expect(page.locator(".ss-pri-tier__figure").first()).toBeVisible();
  });
});
