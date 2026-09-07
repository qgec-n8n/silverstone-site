import { expect, test, type Page } from "@playwright/test";

function required<T>(value: T | null | undefined, message: string): T {
  if (value == null) {
    throw new Error(message);
  }

  return value;
}

async function openBlogBody(page: Page) {
  await page.goto("/blog");
  await expect(page.locator("html")).toHaveAttribute(
    "data-route-experience-state",
    "intro",
    { timeout: 12_000 },
  );
  await page.getByRole("button", { name: "Open the Insights library" }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-route-experience-state",
    "body",
    { timeout: 8_000 },
  );
  await expect(page.locator(".ss-featured-insights")).toBeVisible();
}

async function alignFeatureBelowHeader(page: Page) {
  await page.evaluate(() => {
    const section = document.querySelector<HTMLElement>(".ss-featured-insights");
    const headerHeight = Math.max(
      0,
      ...Array.from(
        document.querySelectorAll("header"),
        (header) => header.getBoundingClientRect().height,
      ),
    );

    if (section) {
      window.scrollTo(
        0,
        section.getBoundingClientRect().top + window.scrollY - headerHeight,
      );
    }
  });
}

/**
 * Blocks until the featured grid has stopped moving.
 *
 * A viewport resize re-runs the grid and restarts the card transitions, the
 * hero images may still be decoding, and — the input that actually breaks
 * these assertions — a web font may still be swapping in, which changes the
 * text-driven height of every card body. A fixed sleep covers all of that
 * only while the machine is idle; under worker contention the measurement
 * lands mid-settle and the sub-pixel geometry tolerances (1-3px) fail.
 *
 * So wait on the three real signals in order — fonts, images, then several
 * consecutive animation frames reporting identical rects — rather than
 * guessing a duration.
 */
async function settleFeatureLayout(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await page.waitForFunction(
    () =>
      Array.from(
        document.querySelectorAll<HTMLImageElement>(".ss-featured-insights img"),
      ).every((image) => image.complete),
    undefined,
    { timeout: 15_000 },
  );
  await page.evaluate(
    async () =>
      new Promise<void>((resolve) => {
        const measure = () =>
          Array.from(
            document.querySelectorAll(
              ".ss-featured-primary, .ss-featured-support__link, .ss-featured-support__media",
            ),
            (element) => {
              const box = element.getBoundingClientRect();
              return `${String(box.width)}x${String(box.height)}@${String(box.top)}`;
            },
          ).join("|");

        let previous = measure();
        let stableFrames = 0;
        // ~2s of frames: enough for the 360ms card transitions, and a bound so
        // a permanently animating element cannot hang the run.
        let framesLeft = 120;
        const tick = () => {
          const current = measure();
          stableFrames = current === previous ? stableFrames + 1 : 0;
          previous = current;
          framesLeft -= 1;
          if (stableFrames >= 3 || framesLeft <= 0) {
            resolve();
            return;
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
  );
}

test("desktop Featured Intelligence is compact, ordered and viewport-fit", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "mobile-chromium");

  const viewports = [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 1280, height: 720 },
  ];

  await page.setViewportSize(required(viewports.at(0), "Desktop viewport missing"));
  await openBlogBody(page);

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await alignFeatureBelowHeader(page);
    await settleFeatureLayout(page);

    const geometry = await page.evaluate(() => {
      const rect = (element: Element) => {
        const box = element.getBoundingClientRect();
        return {
          bottom: box.bottom,
          height: box.height,
          left: box.left,
          top: box.top,
          width: box.width,
        };
      };
      const section = document.querySelector<HTMLElement>(".ss-featured-insights");
      if (!section) {
        throw new Error("Featured Intelligence section missing");
      }
      const primary = section.querySelector<HTMLElement>(".ss-featured-primary");
      if (!primary) {
        throw new Error("Primary featured card missing");
      }
      const supporting = Array.from(
        section.querySelectorAll<HTMLElement>(".ss-featured-support"),
        rect,
      );
      const supportingMedia = Array.from(
        section.querySelectorAll<HTMLImageElement>(".ss-featured-support__media img"),
        rect,
      );
      const supportingMediaFrames = Array.from(
        section.querySelectorAll<HTMLElement>(".ss-featured-support__media"),
        rect,
      );
      const supportingLinks = Array.from(
        section.querySelectorAll<HTMLAnchorElement>(".ss-featured-support__link"),
        rect,
      );
      const headerHeight = Math.max(
        0,
        ...Array.from(
          document.querySelectorAll("header"),
          (header) => header.getBoundingClientRect().height,
        ),
      );

      return {
        documentWidth: document.documentElement.scrollWidth,
        headerHeight,
        primary: rect(primary),
        section: rect(section),
        supporting,
        supportingLinks,
        supportingMedia,
        supportingMediaFrames,
      };
    });

    expect(geometry.section.height).toBeLessThanOrEqual(
      viewport.height - geometry.headerHeight + 1,
    );
    expect(geometry.supporting).toHaveLength(2);
    const first = required(geometry.supporting.at(0), "Supporting card 1 missing");
    const second = required(geometry.supporting.at(1), "Supporting card 2 missing");
    // The primary is the large square: both supports stack in a column to
    // its right, together spanning exactly the primary's height.
    expect(Math.abs(first.top - geometry.primary.top)).toBeLessThan(1);
    expect(second.top).toBeGreaterThan(first.bottom);
    expect(first.left).toBeGreaterThan(geometry.primary.left + geometry.primary.width);
    expect(Math.abs(first.left - second.left)).toBeLessThan(1);
    expect(Math.abs(first.width - second.width)).toBeLessThan(1);
    expect(Math.abs(first.height - second.height)).toBeLessThan(1);
    const columnGap = second.top - first.bottom;
    expect(columnGap).toBeGreaterThan(0);
    expect(
      Math.abs(geometry.primary.height - (first.height + columnGap + second.height)),
    ).toBeLessThan(2);
    expect(Math.abs(second.bottom - geometry.primary.bottom)).toBeLessThan(2);
    expect(geometry.primary.width).toBeGreaterThan(first.width * 1.8);
    for (const [index, media] of geometry.supportingMedia.entries()) {
      const link = required(
        geometry.supportingLinks.at(index),
        `Supporting link ${String(index + 1)} missing`,
      );
      const frame = required(
        geometry.supportingMediaFrames.at(index),
        `Supporting media frame ${String(index + 1)} missing`,
      );
      const where = `viewport ${String(viewport.width)} card ${String(index + 1)}: frame ${String(frame.width)}x${String(frame.height)} link ${String(link.width)}x${String(link.height)}`;
      expect(Math.abs(frame.width - link.width), where).toBeLessThan(3);
      expect(Math.abs(frame.height - link.height), where).toBeLessThan(3);
      expect(media.width).toBeGreaterThanOrEqual(frame.width);
      expect(media.height).toBeGreaterThanOrEqual(frame.height);
    }
    expect(geometry.documentWidth).toBeLessThanOrEqual(viewport.width);
  }

  const feature = page.locator(".ss-featured-insights");
  await expect(feature.locator('[data-featured-card="primary"]')).toHaveCount(1);
  await expect(feature.locator('[data-featured-card="supporting"]')).toHaveCount(2);
  await expect(feature.getByRole("link")).toHaveCount(3);
  await expect(feature.locator("a a, a button, button a")).toHaveCount(0);
});

test("featured cards use restrained 3D motion and flatten for reduced motion", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "mobile-chromium");

  await page.setViewportSize({ width: 1366, height: 768 });
  await openBlogBody(page);
  const card = page.locator(".ss-featured-primary .ss-3d-card");
  await card.scrollIntoViewIfNeeded();
  const cardBox = await card.boundingBox();
  const initialCardBox = required(cardBox, "Primary 3D card box missing");

  await page.mouse.move(
    initialCardBox.x + initialCardBox.width * 0.12,
    initialCardBox.y + initialCardBox.height * 0.18,
  );
  await expect(card).toHaveAttribute("data-3d-enabled", "true");
  await expect(card).toHaveAttribute("data-3d-active", "true");
  await expect
    .poll(() =>
      card
        .locator(".ss-3d-card__stage")
        .evaluate((element) => getComputedStyle(element).transform),
    )
    .not.toBe("none");

  const tiltedBox = await card.locator(".ss-3d-card__stage").boundingBox();
  const activeCardBox = required(tiltedBox, "Tilted 3D card box missing");
  expect(Math.abs(activeCardBox.width - initialCardBox.width)).toBeLessThan(24);
  expect(Math.abs(activeCardBox.height - initialCardBox.height)).toBeLessThan(24);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.getByRole("button", { name: "Open the Insights library" }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-route-experience-state",
    "body",
    { timeout: 8_000 },
  );

  const reducedCard = page.locator(".ss-featured-primary .ss-3d-card");
  await reducedCard.scrollIntoViewIfNeeded();
  const reducedBox = await reducedCard.boundingBox();
  const flatCardBox = required(reducedBox, "Reduced-motion card box missing");
  await page.mouse.move(flatCardBox.x + 12, flatCardBox.y + 12);
  await expect(reducedCard).toHaveAttribute("data-3d-enabled", "false");
  await expect(reducedCard).toHaveAttribute("data-3d-active", "false");
  await expect(reducedCard.locator(".ss-3d-card__stage")).toHaveCSS(
    "transform",
    "none",
  );
});

test("article hover surface follows hover, keyboard focus and filtering", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "mobile-chromium");

  await page.setViewportSize({ width: 1440, height: 900 });
  await openBlogBody(page);
  const grid = page.locator(".ss-insight-grid");
  await grid.scrollIntoViewIfNeeded();
  const items = grid.locator("[data-card-hover-id]");
  expect(await items.count()).toBeGreaterThan(2);

  const firstId = await items.nth(0).getAttribute("data-card-hover-id");
  const secondId = await items.nth(1).getAttribute("data-card-hover-id");
  const firstArticleId = required(firstId, "First article hover ID missing");
  const secondArticleId = required(secondId, "Second article hover ID missing");
  await items.nth(0).hover();
  await expect(grid).toHaveAttribute("data-card-hover-active", firstArticleId);
  await items.nth(1).hover();
  await expect(grid).toHaveAttribute("data-card-hover-active", secondArticleId);
  await page.waitForTimeout(300);

  const surfaceBox = await items
    .nth(1)
    .locator(".ss-card-hover-effect__surface")
    .boundingBox();
  const secondBox = await items.nth(1).boundingBox();
  const highlightBox = required(surfaceBox, "Hover surface box missing");
  const hoveredCardBox = required(secondBox, "Hovered card box missing");
  expect(Math.abs(highlightBox.x - hoveredCardBox.x)).toBeLessThan(2);
  expect(Math.abs(highlightBox.y - hoveredCardBox.y)).toBeLessThan(2);

  /* Scoped to the filter group: the category directory beneath the grid uses
     the same pill styling for its crawlable route links, and this assertion
     needs the last *filter* pill so the next Tab lands on the first card. */
  const filters = page.locator(
    '[aria-label="Filter by category"] .ss-insight-filters__pill',
  );
  await filters.last().focus();
  await page.keyboard.press("Tab");
  await expect(items.nth(0).locator(".ss-insight-card")).toBeFocused();
  await expect(grid).toHaveAttribute("data-card-hover-active", firstArticleId);
  await expect(items.nth(0).locator(".ss-insight-card")).toHaveCSS(
    "outline-style",
    "solid",
  );
  await page.keyboard.press("Shift+Tab");
  await expect(grid).not.toHaveAttribute("data-card-hover-active");

  await page.getByRole("button", { name: "Web Design & Development" }).click();
  await expect(page.getByRole("status")).toContainText("in Web Design & Development");
  expect(await grid.locator("[data-card-hover-id]").count()).toBeGreaterThan(0);

  await page.getByRole("button", { name: "All topics" }).click();
  const stableCard = grid.locator(".ss-insight-card").first();
  const stableId = await stableCard.getAttribute("data-insight-id");
  const stableHref = await stableCard.getAttribute("href");
  const expectedStableId = required(stableId, "Filtered article ID missing");
  const expectedStableHref = required(stableHref, "Filtered article link missing");
  const stableTitle = await stableCard.locator(".ss-insight-card__title").innerText();
  await page
    .getByRole("searchbox", { name: /search insights by title or topic/i })
    .fill(stableTitle);
  await expect(grid.locator(".ss-insight-card")).toHaveCount(1);
  await expect(grid.locator(".ss-insight-card")).toHaveAttribute(
    "data-insight-id",
    expectedStableId,
  );
  await expect(grid.locator(".ss-insight-card")).toHaveAttribute(
    "href",
    expectedStableHref,
  );
  await expect(grid.locator(".ss-insight-card")).not.toHaveAttribute("style");

  await page
    .getByRole("searchbox", { name: /search insights by title or topic/i })
    .fill("no-such-silverstone-topic-9x8y7z");
  await expect(page.getByText(/no topics match that search yet/i)).toBeVisible();
});

test("touch layouts are flat, stacked and free of horizontal overflow", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chromium");

  const viewports = [
    { width: 430, height: 932 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
  ];

  await page.setViewportSize(required(viewports.at(0), "Mobile viewport missing"));
  await openBlogBody(page);

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    const feature = page.locator(".ss-featured-insights");
    await feature.scrollIntoViewIfNeeded();
    const geometry = await feature.evaluate((section) => {
      const primaryElement = section.querySelector<HTMLElement>(".ss-featured-primary");
      if (!primaryElement) {
        throw new Error("Primary featured card missing on mobile");
      }
      const primary = primaryElement.getBoundingClientRect();
      const supporting = Array.from(
        section.querySelectorAll<HTMLElement>(".ss-featured-support"),
        (card) => card.getBoundingClientRect(),
      );

      return {
        documentWidth: document.documentElement.scrollWidth,
        primaryBottom: primary.bottom,
        supporting: supporting.map((card) => ({
          bottom: card.bottom,
          left: card.left,
          top: card.top,
          width: card.width,
        })),
      };
    });

    expect(geometry.supporting).toHaveLength(2);
    let previousBottom = geometry.primaryBottom;
    for (const [index, support] of geometry.supporting.entries()) {
      expect(
        support.top,
        `Supporting card ${String(index + 1)} should remain stacked`,
      ).toBeGreaterThan(previousBottom);
      previousBottom = support.bottom;
    }
    expect(geometry.documentWidth).toBeLessThanOrEqual(viewport.width);
    await expect(feature.locator('.ss-3d-card[data-3d-enabled="true"]')).toHaveCount(0);
  }
});
