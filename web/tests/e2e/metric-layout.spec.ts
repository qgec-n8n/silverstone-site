import { expect, test, type Page } from "@playwright/test";

import { PUBLISHED_BLOG_POSTS } from "../../src/data/blog-posts";

const BENCHMARK_ROUTES = [
  "/services",
  "/industry",
  "/how-we-work",
  "/services/web-design-development",
  "/services/app-development",
  "/services/ai-voice-agents",
  "/services/ai-receptionists",
  "/services/content-creation",
  "/services/ai-automation",
  "/services/ai-consulting",
  "/industry/estate-agents",
  "/industry/salons-barbers",
  "/industry/aesthetic-clinics",
  "/industry/ecommerce",
  "/industry/dentists",
  "/industry/fitness-coaches",
  "/industry/hospitality",
  "/industry/trades",
  "/industry/physios-chiropractors",
  "/industry/gyms-fitness-studios",
] as const;

const ARTICLE_METRIC_ROUTES = PUBLISHED_BLOG_POSTS.filter((post) =>
  post.articleBody.some((section) => section.metricPanel?.items.length),
).map((post) => `/blog/${post.slug}`);

const VIEWPORT_WIDTHS = [320, 768, 1440, 1920] as const;

test.describe.configure({ mode: "serial" });

type FitFailure = {
  clientWidth: number;
  fontSize: string;
  scrollWidth: number;
  text: string;
  whiteSpace: string;
};

async function settleResponsiveLayout(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => resolve());
        });
      }),
  );
}

async function settleViewport(page: Page, width: number) {
  await expect.poll(() => page.evaluate(() => window.innerWidth)).toBe(width);
  await settleResponsiveLayout(page);
}

async function openRouteBody(page: Page, path: string) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(path, { waitUntil: "load" });
  const serviceExperience = page.locator(".ss-service-experience[data-service-state]");
  const routeExperience = page.locator(
    ".ss-route-experience[data-route-experience-state]",
  );
  const usesServiceState = (await serviceExperience.count()) > 0;
  const experience = usesServiceState ? serviceExperience : routeExperience;
  const stateAttribute = usesServiceState
    ? "data-service-state"
    : "data-route-experience-state";
  await expect(experience).toBeAttached();
  const exploreButton = page.locator(".ss-service-intro button").first();
  await expect(exploreButton).toBeVisible({ timeout: 20_000 });
  await expect(experience).toHaveAttribute(stateAttribute, "intro");
  await exploreButton.click();
  await expect(experience).toHaveAttribute(stateAttribute, "body", {
    timeout: 10_000,
  });

  await expect(page.locator(".ss-srv2-bench__grid")).toBeVisible();
  await settleResponsiveLayout(page);
}

async function reopenRouteBodyAfterResize(page: Page) {
  const serviceExperience = page.locator(".ss-service-experience[data-service-state]");
  const routeExperience = page.locator(
    ".ss-route-experience[data-route-experience-state]",
  );
  const usesServiceState = (await serviceExperience.count()) > 0;
  const experience = usesServiceState ? serviceExperience : routeExperience;
  const stateAttribute = usesServiceState
    ? "data-service-state"
    : "data-route-experience-state";
  if ((await experience.getAttribute(stateAttribute)) === "body") {
    return;
  }

  const benchmark = page.locator(".ss-srv2-bench__grid");
  const exploreButton = page.locator(".ss-service-intro button").first();

  await expect(exploreButton).toBeVisible({ timeout: 10_000 });
  await exploreButton.click();
  await expect(experience).toHaveAttribute(stateAttribute, "body", {
    timeout: 10_000,
  });
  await expect(benchmark).toBeVisible();
  await settleResponsiveLayout(page);
}

async function fitFailures(page: Page, selector: string): Promise<FitFailure[]> {
  return page.locator(selector).evaluateAll((nodes) =>
    nodes.flatMap((node) => {
      const element = node as HTMLElement;
      const styles = window.getComputedStyle(element);
      const text = element.textContent.trim();
      const fits = element.scrollWidth <= element.clientWidth + 1;

      return fits && styles.whiteSpace === "nowrap"
        ? []
        : [
            {
              clientWidth: element.clientWidth,
              fontSize: styles.fontSize,
              scrollWidth: element.scrollWidth,
              text,
              whiteSpace: styles.whiteSpace,
            },
          ];
    }),
  );
}

test("every shared verified-results value stays complete on one line", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "The explicit viewport matrix runs once in the desktop project.",
  );
  test.setTimeout(150_000);
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const route of BENCHMARK_ROUTES) {
    await openRouteBody(page, route);

    for (const width of VIEWPORT_WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await settleViewport(page, width);
      await reopenRouteBodyAfterResize(page);
      expect(
        await fitFailures(page, ".ss-srv2-bench .ss-srv2-metric__value"),
        `${route} has a clipped or wrapped verified result at ${String(width)}px`,
      ).toEqual([]);
    }
  }
});

test("every article metric value stays complete on one line", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chromium",
    "The explicit viewport matrix runs once in the desktop project.",
  );
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const route of ARTICLE_METRIC_ROUTES) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route, { waitUntil: "load" });
    await expect(page.locator(".ss-blog-article__metrics")).toBeVisible();
    await settleResponsiveLayout(page);

    for (const width of VIEWPORT_WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await settleViewport(page, width);
      expect(
        await fitFailures(page, ".ss-blog-article__metrics dd"),
        `${route} has a clipped or wrapped article metric at ${String(width)}px`,
      ).toEqual([]);
    }
  }
});
