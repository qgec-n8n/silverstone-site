import { expect, test, type Page } from "@playwright/test";

/**
 * The expandable hero button: the intro's Explore pill grows into the route
 * body, and the return control collapses the body back into the pill. The
 * body wrapper is the morphing layer — it carries `data-explore-stage` for
 * the duration of each morph — so both directions are asserted on that
 * element's live geometry, sampled every animation frame.
 */

type Box = { x: number; y: number; w: number; h: number };

type Sample = {
  phase: string | null;
  pill: Box | null;
  stage:
    | (Box & {
        hasBody: boolean;
        isBodyWrapper: boolean;
        opacity: number;
        scrollTop: number;
      })
    | null;
  state: string | null;
  t: number;
};

const routes = [
  {
    path: "/",
    body: ".ss-hv2__body",
    returnName: /return to intro/i,
    stateAttr: "data-homepage-state",
  },
  {
    path: "/services/ai-voice-agents",
    body: ".ss-service-experience__body",
    returnName: /return to route intro/i,
    stateAttr: "data-route-experience-state",
  },
  {
    path: "/about",
    body: ".ss-route-experience__body",
    returnName: /return to route intro/i,
    stateAttr: "data-route-experience-state",
  },
] as const;

const PILL = "button.ss-explore-cta";
const PILL_BACKGROUND = ".ss-explore-cta__bg";

function center(box: Box) {
  return { x: box.x + box.w / 2, y: box.y + box.h / 2 };
}

async function startSampler(page: Page, stateAttr: string, bodySelector: string) {
  await page.evaluate(
    ([attr, body]) => {
      const win = window as Window & { __morph?: { on: boolean; samples: Sample[] } };
      const samples: Sample[] = [];
      win.__morph = { on: true, samples };
      const PILL_BACKGROUND_SELECTOR = ".ss-explore-cta__bg";
      const rect = (el: Element) => {
        const r = el.getBoundingClientRect();
        return { x: r.left, y: r.top, w: r.width, h: r.height };
      };
      const tick = () => {
        if (!win.__morph?.on) {
          return;
        }
        const stage = document.querySelector<HTMLElement>("[data-explore-stage]");
        const pill = document.querySelector(PILL_BACKGROUND_SELECTOR);
        samples.push({
          phase: stage?.getAttribute("data-explore-stage") ?? null,
          pill: pill ? rect(pill) : null,
          stage: stage
            ? {
                ...rect(stage),
                hasBody: stage.querySelector("h1, #system, #main-content") !== null,
                isBodyWrapper: stage.matches(body),
                opacity: Number(getComputedStyle(stage).opacity),
                scrollTop: stage.scrollTop,
              }
            : null,
          state: document.documentElement.getAttribute(attr),
          t: performance.now(),
        });
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    [stateAttr, bodySelector] as const,
  );
}

async function stopSampler(page: Page): Promise<Sample[]> {
  return page.evaluate(() => {
    const win = window as Window & { __morph?: { on: boolean; samples: Sample[] } };
    if (!win.__morph) {
      return [];
    }
    win.__morph.on = false;
    return win.__morph.samples;
  });
}

function stageSamples(samples: Sample[], phase: "closing" | "opening") {
  return samples.flatMap((sample) =>
    sample.phase === phase && sample.stage ? [{ ...sample, stage: sample.stage }] : [],
  );
}

function expectNearPill(
  box: Box,
  pill: Box,
  viewport: { width: number; height: number },
) {
  // The first/last sampled frame can already be a frame or two into the
  // spring, which moves fastest at the start, so "at the pill" means: still
  // a small box, well under half the screen, centred on the pill.
  expect(box.w).toBeLessThanOrEqual(Math.max(pill.w * 2.2, viewport.width * 0.45));
  expect(box.h).toBeLessThanOrEqual(Math.max(pill.h * 4, viewport.height * 0.35));
  expect(Math.abs(center(box).x - center(pill).x)).toBeLessThanOrEqual(100);
  expect(Math.abs(center(box).y - center(pill).y)).toBeLessThanOrEqual(140);
}

function expectFullViewport(box: Box, viewport: { width: number; height: number }) {
  // A sample can land a frame into the spring (which moves fastest at its
  // start), so "the full viewport" allows a few percent of travel.
  expect(box.w).toBeGreaterThanOrEqual(viewport.width * 0.9);
  expect(box.h).toBeGreaterThanOrEqual(viewport.height * 0.85);
  expect(Math.abs(box.x)).toBeLessThanOrEqual(viewport.width * 0.05);
  expect(Math.abs(box.y)).toBeLessThanOrEqual(viewport.height * 0.05);
}

for (const route of routes) {
  test(`the explore pill expands into the body and collapses back on ${route.path}`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    const viewport = page.viewportSize();
    if (!viewport) {
      throw new Error("viewport is required");
    }

    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute(route.stateAttr, "intro", {
      timeout: 20_000,
    });
    const pill = page.locator(PILL).first();
    await expect(pill).toBeVisible();
    // Let the intro's staggered entrance land so the pill is at rest.
    await page.waitForTimeout(2_600);
    const pillBox = await page
      .locator(PILL_BACKGROUND)
      .first()
      .evaluate((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left, y: r.top, w: r.width, h: r.height };
      });
    expect(pillBox.w).toBeGreaterThan(80);

    // ---- Open: the body grows out of the pill ---------------------------
    await startSampler(page, route.stateAttr, route.body);
    await pill.click();
    await expect(page.locator("html")).toHaveAttribute(route.stateAttr, "body", {
      timeout: 12_000,
    });
    const openSamples = await stopSampler(page);
    const opening = stageSamples(openSamples, "opening");
    expect(opening.length).toBeGreaterThanOrEqual(6);

    const firstOpen = opening[0]?.stage;
    const lastOpen = opening[opening.length - 1]?.stage;
    if (!firstOpen || !lastOpen) {
      throw new Error("no opening samples");
    }
    expectNearPill(firstOpen, pillBox, viewport);
    // It fades in rather than popping in: some sampled frame is well below
    // full opacity (the first sample may already be a frame or two along).
    expect(Math.min(...opening.map((sample) => sample.stage.opacity))).toBeLessThan(
      0.95,
    );
    expectFullViewport(lastOpen, viewport);
    expect(lastOpen.opacity).toBeGreaterThan(0.98);
    // …and it is held at exactly full size until the route flips to `body`.
    expect(opening.some((sample) => sample.stage.w >= viewport.width - 2)).toBe(true);
    for (let index = 1; index < opening.length; index += 1) {
      const previous = opening[index - 1]?.stage;
      const current = opening[index]?.stage;
      if (!previous || !current) {
        continue;
      }
      expect(current.w).toBeGreaterThanOrEqual(previous.w - 1);
      expect(current.h).toBeGreaterThanOrEqual(previous.h - 1);
    }
    // The layer that grows IS the body — not a stand-in curtain.
    expect(opening.every((sample) => sample.stage.isBodyWrapper)).toBe(true);
    expect(opening.every((sample) => sample.stage.hasBody)).toBe(true);
    // The pill's own background mirrors the morph while it crossfades out.
    // (On phones the pill already spans most of the screen, so the cap is
    // the viewport itself.)
    const pillDuringOpen = opening[Math.floor(opening.length / 2)]?.pill;
    expect(pillDuringOpen?.w ?? 0).toBeGreaterThan(
      Math.min(pillBox.w * 1.5, viewport.width * 0.9),
    );

    await expect(page.locator("[data-explore-stage]")).toHaveCount(0);
    // The body is live again: interactive, and back in normal flow.
    await expect(page.locator(route.body)).not.toHaveAttribute("inert", "");

    // ---- Close: what is on screen collapses back into the pill ----------
    const phone = await page.evaluate(
      () => window.matchMedia("(max-width: 40rem)").matches,
    );
    const scrollTarget = phone ? viewport.height : 600;
    await page.evaluate((y) => window.scrollTo(0, y), scrollTarget);
    await expect
      .poll(async () => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(scrollTarget * 0.5);
    if (phone) {
      await expect(page.locator("html")).toHaveAttribute(
        "data-mobile-chrome",
        "ready",
        {
          timeout: 5_000,
        },
      );
    }
    const scrollBefore = await page.evaluate(() => window.scrollY);

    await startSampler(page, route.stateAttr, route.body);
    await page.getByRole("button", { name: route.returnName }).click();
    await expect(page.locator("html")).toHaveAttribute(route.stateAttr, "intro", {
      timeout: 12_000,
    });
    const closeSamples = await stopSampler(page);
    const closing = stageSamples(closeSamples, "closing");
    expect(closing.length).toBeGreaterThanOrEqual(6);

    const firstClose = closing[0]?.stage;
    const lastClose = closing[closing.length - 1]?.stage;
    if (!firstClose || !lastClose) {
      throw new Error("no closing samples");
    }
    expectFullViewport(firstClose, viewport);
    expect(firstClose.opacity).toBeGreaterThan(0.9);
    // The collapsing layer shows the part of the body the visitor was looking at.
    expect(firstClose.scrollTop).toBeGreaterThanOrEqual(
      Math.min(scrollBefore, 200) * 0.8,
    );
    expectNearPill(lastClose, pillBox, viewport);
    for (let index = 1; index < closing.length; index += 1) {
      const previous = closing[index - 1]?.stage;
      const current = closing[index]?.stage;
      if (!previous || !current) {
        continue;
      }
      expect(current.w).toBeLessThanOrEqual(previous.w + 1);
      expect(current.h).toBeLessThanOrEqual(previous.h + 1);
    }
    expect(closing.every((sample) => sample.stage.isBodyWrapper)).toBe(true);
    expect(closing.every((sample) => sample.stage.hasBody)).toBe(true);
    // Nothing ever grows during a close.
    expect(closing.every((sample) => sample.stage.w <= viewport.width + 1)).toBe(true);

    // Everything is put back: no stage, no leftover inline transforms.
    await expect(page.locator("[data-explore-stage]")).toHaveCount(0);
    const residue = await page.evaluate(
      ([body]) => ({
        bodyTransform: document.querySelector<HTMLElement>(body)?.style.transform ?? "",
        pillTransform:
          document.querySelector<HTMLElement>(".ss-explore-cta__bg")?.style.transform ??
          "",
      }),
      [route.body] as const,
    );
    expect(residue.bodyTransform).toBe("");
    expect(residue.pillTransform).toBe("");
    await expect(page.locator(PILL).first()).toBeVisible();
    await expect(page.locator(PILL).first()).toBeEnabled();
  });
}
