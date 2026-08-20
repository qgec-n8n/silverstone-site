import { expect, test, type Page } from "@playwright/test";

/**
 * The phone fold contract for the shared secondary hero: on every route that
 * renders it, the hero occupies exactly one screen, so the animated scroll cue
 * is the last thing above the fold and the TrustStrip starts immediately
 * below it. The composition is driven by --srv2-mobile-stage (see the
 * `max-width: 40rem` block in styles/services-v2/services-v2.css), so the
 * regression this guards against is copy or chrome growing past the stage on
 * short screens — which used to push the cue and the trust band off-screen by
 * as much as 70px.
 */
const ROUTES = [
  "/",
  "/services",
  "/services/ai-receptionists",
  "/services/web-design-development",
  "/industry",
  "/industry/dentists",
  "/industry/aesthetic-clinics",
  "/about",
  "/pricing",
  "/contact",
  "/book",
  "/how-we-work",
  "/blog",
] as const;

/** Portrait phones from the smallest still-supported screen to the largest. */
const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 360, height: 640 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
] as const;

/** The hero's bottom edge may sit this far off the fold before it reads wrong. */
const FOLD_TOLERANCE_PX = 1.5;
/** The TrustStrip starts on the next pixel row; a hairline border is fine. */
const TRUST_GAP_TOLERANCE_PX = 4;

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
      document.documentElement.getAttribute("data-homepage-state") === "body" ||
      document.documentElement.getAttribute("data-gate-free") === "on",
    undefined,
    { timeout: 20_000 },
  );
  // The hero's entrance reveals finish ~1.4s after mount; measuring earlier
  // reads transformed boxes rather than settled ones.
  await page.waitForTimeout(2200);
}

function measure() {
  // The homepage's secondary hero is its own component (`.ss-hv2-secondary`);
  // every other route shares the services-v2 one. Both answer to the same
  // fold contract, so both are measured here.
  const hero =
    document.querySelector(".ss-srv2-hero") ??
    document.querySelector(".ss-hv2-secondary");
  const cue =
    document.querySelector(".ss-srv2-hero__scrollcue") ??
    document.querySelector(".ss-hv2-secondary__cue--intro");
  const actions =
    document.querySelector(".ss-srv2-hero__actions") ??
    document.querySelector(".ss-hv2-secondary__actions");
  const trust = document.querySelector(".ss-hv2-trust");
  // The animated rail is the cue's only variable dimension — the word above it
  // is a fixed 10px on every route.
  const rail = document.querySelector(
    ".ss-srv2-hero__scrollcue .ss-hv2-scrollcue__rail, .ss-hv2-secondary__cue--intro .ss-hv2-scrollcue__rail",
  );
  const primaryCta =
    document.querySelector(".ss-srv2-hero__actions .ss-srv2-btn--primary") ??
    document.querySelector(".ss-hv2-secondary__actions a");
  const rect = (element: Element | null) => {
    if (!element) return null;
    const box = element.getBoundingClientRect();
    return { top: box.top, bottom: box.bottom, height: box.height };
  };
  /*
   * Visual line count for the CTA label. Counting distinct rect tops over a
   * Range across the label's text nodes only — the trailing arrow is an <svg>,
   * and an svg's rect would read as its own line and inflate every count.
   */
  let ctaLines: number | null = null;
  let ctaLabel: string | null = null;
  if (primaryCta) {
    ctaLabel = primaryCta.textContent.trim();
    const textNodes = [...primaryCta.childNodes].filter(
      (node) =>
        node.nodeType === Node.TEXT_NODE && (node.textContent ?? "").trim() !== "",
    );
    if (textNodes.length > 0) {
      const range = document.createRange();
      range.setStartBefore(textNodes[0] as Node);
      range.setEndAfter(textNodes[textNodes.length - 1] as Node);
      ctaLines = new Set(
        [...range.getClientRects()]
          .filter((box) => box.width > 0 && box.height > 0)
          .map((box) => Math.round(box.top)),
      ).size;
    }
  }
  return {
    viewportHeight: window.innerHeight,
    hero: rect(hero),
    cue: rect(cue),
    actions: rect(actions),
    trust: rect(trust),
    railHeight: rail ? getComputedStyle(rail).height : null,
    ctaLines,
    ctaLabel,
  };
}

test.describe("mobile secondary hero fold", () => {
  test.skip(
    ({ isMobile }) => !isMobile,
    "the fold contract is a portrait-phone rule (max-width: 40rem)",
  );

  for (const path of ROUTES) {
    test(`one screen tall on every phone: ${path}`, async ({ page }) => {
      test.setTimeout(180_000);

      for (const viewport of VIEWPORTS) {
        await page.setViewportSize(viewport);
        await openBody(page, path);

        const label = `${path} @ ${String(viewport.width)}x${String(viewport.height)}`;
        const m = await page.evaluate(measure);

        const { hero, cue } = m;
        expect(hero, `${label}: no secondary hero`).not.toBeNull();
        expect(cue, `${label}: no scroll cue`).not.toBeNull();
        if (!hero || !cue) continue;

        expect(
          Math.abs(hero.bottom - m.viewportHeight),
          `${label}: hero bottom is ${hero.bottom.toFixed(1)}, fold is ${String(m.viewportHeight)}`,
        ).toBeLessThanOrEqual(FOLD_TOLERANCE_PX);

        expect(
          cue.bottom,
          `${label}: scroll cue ends below the fold`,
        ).toBeLessThanOrEqual(m.viewportHeight + FOLD_TOLERANCE_PX);

        if (m.trust) {
          expect(
            m.trust.top,
            `${label}: trust bar starts above the fold`,
          ).toBeGreaterThanOrEqual(m.viewportHeight - FOLD_TOLERANCE_PX);
          expect(
            m.trust.top - m.viewportHeight,
            `${label}: gap between the fold and the trust bar`,
          ).toBeLessThanOrEqual(TRUST_GAP_TOLERANCE_PX);
        }

        if (m.actions) {
          // The cue band also reserves clearance for the floating demo /
          // consent / return controls pinned to the viewport's bottom corners,
          // so the CTAs must finish above it, not merely above the fold.
          expect(
            m.actions.bottom,
            `${label}: CTAs run into the reserved chrome band`,
          ).toBeLessThanOrEqual(cue.top);
        }

        // A wrapped label reads as two stacked fragments inside the pill. The
        // squeeze is the short-viewport tier, where the two actions share one
        // row and each button keeps only half of it.
        expect(
          m.ctaLines,
          `${label}: primary CTA "${m.ctaLabel ?? ""}" wraps onto ${String(m.ctaLines)} lines`,
        ).toBe(1);
      }
    });
  }
});

/**
 * The scroll cue is one component, so it is one size. Routes are spread across
 * parallel workers above, which cannot compare notes, so the cross-route
 * comparison lives in its own test: one representative route per hero family —
 * the homepage's own secondary hero, a services-v2 route and a core page — read
 * back to back at every phone size.
 *
 * The regression this catches is a per-family override drifting apart: the
 * shared hero used to drop its rail to 24px on short screens while the
 * homepage's stayed at 28px, so the same cue read a size smaller on 24 routes
 * than on the homepage at the same viewport.
 */
test.describe("mobile scroll cue", () => {
  test.skip(({ isMobile }) => !isMobile, "portrait-phone rule (max-width: 40rem)");

  test("is the same size on every route at a given viewport", async ({ page }) => {
    test.setTimeout(180_000);

    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport);
      const label = `${String(viewport.width)}x${String(viewport.height)}`;
      const heights: Record<string, string | null> = {};

      for (const path of ["/", "/services/ai-receptionists", "/pricing"]) {
        await openBody(page, path);
        heights[path] = (await page.evaluate(measure)).railHeight;
      }

      const distinct = new Set(
        Object.values(heights).map((height) => height ?? "none"),
      );
      expect([...distinct], `${label}: ${JSON.stringify(heights)}`).toHaveLength(1);
    }
  });
});

/**
 * The signal manifest is the one hero beat with no component-level Reveal, so
 * its entrance is CSS. It has to land after the lead (840ms) and before the
 * CTAs (1310ms) — and, whatever the timing, never leave a row invisible.
 */
test.describe("mobile secondary hero manifest reveal", () => {
  test.skip(
    ({ isMobile }) => !isMobile,
    "the manifest entrance is a portrait-phone rule (max-width: 40rem)",
  );

  test("the manifest card animates in between the lead and the CTAs", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openBody(page, "/services/ai-receptionists");

    const animation = await page.evaluate(() => {
      const panel = document.querySelector(".ss-srv2-hero__caps");
      if (!panel) return null;
      const style = getComputedStyle(panel);
      return {
        name: style.animationName,
        delay: style.animationDelay,
        fill: style.animationFillMode,
      };
    });

    expect(animation).not.toBeNull();
    expect(animation?.name).toBe("srv2-caps-panel-in");
    // After the lead's 840ms reveal, before its own rows at 980ms.
    expect(Number.parseFloat(animation?.delay ?? "0") * 1000).toBeGreaterThan(840);
    expect(Number.parseFloat(animation?.delay ?? "0") * 1000).toBeLessThan(980);
    // `forwards` would freeze the settled transform and kill later transforms.
    expect(animation?.fill).toBe("backwards");
  });

  test("every manifest row settles fully visible", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openBody(page, "/services/ai-receptionists");

    const opacities = await page.evaluate(() => {
      const panel = document.querySelector(".ss-srv2-hero__caps");
      const rows = [...document.querySelectorAll(".ss-srv2-hero__cap")];
      return {
        panel: panel ? Number(getComputedStyle(panel).opacity) : null,
        rows: rows.map((row) => Number(getComputedStyle(row).opacity)),
      };
    });

    expect(opacities.panel).toBe(1);
    expect(opacities.rows.length).toBeGreaterThan(0);
    for (const value of opacities.rows) {
      expect(value).toBe(1);
    }
  });
});

test.describe("mobile secondary hero manifest reveal (reduced motion)", () => {
  test.skip(({ isMobile }) => !isMobile, "portrait-phone rule (max-width: 40rem)");

  test("no manifest entrance when the visitor asks for less motion", async ({
    page,
  }) => {
    // Emulated before the first navigation so hydration itself sees `reduce`
    // — the row reveals branch on it at render time, not on a later change.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await openBody(page, "/services/ai-receptionists");

    const state = await page.evaluate(() => {
      const panel = document.querySelector(".ss-srv2-hero__caps");
      const rows = [...document.querySelectorAll(".ss-srv2-hero__cap")];
      return {
        animationName: panel ? getComputedStyle(panel).animationName : null,
        panelOpacity: panel ? Number(getComputedStyle(panel).opacity) : null,
        rowOpacities: rows.map((row) => Number(getComputedStyle(row).opacity)),
      };
    });

    expect(state.animationName).toBe("none");
    expect(state.panelOpacity).toBe(1);
    for (const value of state.rowOpacities) {
      expect(value).toBe(1);
    }
  });
});
