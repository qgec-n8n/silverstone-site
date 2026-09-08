import { expect, test, type Page } from "@playwright/test";

/**
 * The phone fold contract for the secondary hero: on every route that renders
 * one, the hero occupies exactly one screen, so the animated scroll cue is the
 * last thing above the fold and the TrustStrip starts immediately below it.
 * The composition is driven by --mhero-stage (declared in
 * styles/visual/home-v2.css, aliased as --srv2-mobile-stage by the shared hero
 * in styles/services-v2/services-v2.css), so the regression this guards against
 * is copy or chrome growing past the stage on short screens — which used to
 * push the cue and the trust band off-screen by as much as 70px.
 */
const ROUTES = [
  "/",
  "/services",
  "/services/ai-receptionists",
  "/services/web-design-development",
  "/industry",
  "/industry/dentists",
  "/industry/aesthetic-clinics",
  // The three longest console eyebrows on the site (53, 50 and 45 characters).
  // Their intro column used to be sized by that label rather than by the
  // viewport, so the H1, the manifest and both pills were cut off at the right
  // edge on every phone width — invisible to this spec until these routes
  // joined it and the horizontal assertion below existed.
  "/industry/estate-agents",
  "/industry/physios-chiropractors",
  "/industry/gyms-fitness-studios",
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
/**
 * The CTA row has to read as a closing beat, not as part of the cue's band.
 * 18px is the site's own floor: /about carries the tallest phone hero column
 * and clears the cue by 17.95px at 390x844, which is that floor minus the
 * sub-pixel rounding of a stack built entirely from clamp()ed rem values —
 * hence the tolerance, the same shape as FOLD_TOLERANCE_PX above. It is a
 * real guard, not a rubber stamp: the first pass at the tall-stage retune
 * drove this route to 5.7px here and to -2px (pills overlapping the cue) at
 * 430x932 before the growth was recalibrated against it.
 */
const CUE_CLEARANCE_PX = 18;
const CUE_CLEARANCE_TOLERANCE_PX = 0.5;

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
  // Both heroes now also carry the shared `.ss-mhero__actions` grid class; the
  // per-family selectors stay here so a missing shared class fails the parity
  // test loudly rather than silently skipping this assertion.
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
  /*
   * Horizontal escape. Measured per DESCENDANT and against the VIEWPORT, not
   * against the hero box: the defect this catches (an un-wrappable console
   * eyebrow feeding the grid column's min-content width) stretches the hero
   * box itself, so anything measured relative to the hero reads as fitting
   * perfectly while the content sits off-screen. `scrollWidth` alone does not
   * catch it either — the hero clips its overflow, so the page never gains a
   * horizontal scrollbar; the content is simply gone.
   */
  let heroMaxRight: number | null = null;
  if (hero) {
    for (const node of hero.querySelectorAll("*")) {
      const box = node.getBoundingClientRect();
      if (box.width === 0 && box.height === 0) continue;
      if (heroMaxRight === null || box.right > heroMaxRight) heroMaxRight = box.right;
    }
  }

  /*
   * The tagline replaces both the deck and the lead on phones, so it is the
   * hero's only prose. Two lines is a copy-budget failure, not a layout one —
   * the same Range trick as the CTA label above, and the reason
   * MOBILE_HERO_TAGLINE_MAX_CHARS can only ever approximate it.
   */
  let taglineLines: number | null = null;
  let taglineText: string | null = null;
  const tagline = document.querySelector(".ss-mhero__tagline");
  if (tagline) {
    taglineText = tagline.textContent.trim();
    const range = document.createRange();
    range.selectNodeContents(tagline);
    taglineLines = new Set(
      [...range.getClientRects()]
        .filter((box) => box.width > 0 && box.height > 0)
        .map((box) => Math.round(box.top)),
    ).size;
  }

  return {
    viewportHeight: window.innerHeight,
    viewportWidth: window.innerWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
    heroMaxRight,
    taglineLines,
    taglineText,
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
          // The cue owns the band at the foot of the stage, so the CTA row is
          // the last beat of the composition and has to finish clear of it —
          // touching reads as one crowded block rather than as two beats.
          expect(
            cue.top - m.actions.bottom,
            `${label}: clearance between the CTAs and the scroll cue`,
          ).toBeGreaterThanOrEqual(CUE_CLEARANCE_PX - CUE_CLEARANCE_TOLERANCE_PX);
        }

        // Nothing in the hero may sit outside the viewport. `+ 1` absorbs
        // sub-pixel rounding on a fractional device width only.
        expect(
          m.heroMaxRight ?? 0,
          `${label}: hero content reaches x=${(m.heroMaxRight ?? 0).toFixed(1)} in a ${String(m.viewportWidth)}px viewport`,
        ).toBeLessThanOrEqual(m.viewportWidth + 1);
        expect(m.documentScrollWidth, `${label}: the page scrolls sideways`).toBe(
          m.viewportWidth,
        );

        // One line at the reference widths; 320 is allowed a second, since a
        // 45-character line cannot always survive a 320px column.
        if (m.taglineLines !== null) {
          expect(
            m.taglineLines,
            `${label}: tagline "${m.taglineText ?? ""}" runs to ${String(m.taglineLines)} lines`,
          ).toBeLessThanOrEqual(viewport.width <= 320 ? 2 : 1);
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
 * The phone composition is one shared component
 * (features/services-v2/components/mobile-hero-stack.tsx) rendered by both
 * heroes, so the homepage must present the same beats, in the same order, as
 * every other route. This is what stops the homepage quietly drifting back into
 * its own centred phone treatment.
 */
test.describe("mobile secondary hero parity", () => {
  test.skip(({ isMobile }) => !isMobile, "portrait-phone rule (max-width: 40rem)");

  test("the homepage renders the same phone beats as a shared hero", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width: 390, height: 844 });

    const readBeats = async (path: string) => {
      await openBody(page, path);
      return page.evaluate(() => {
        const BEATS = [
          "ss-mhero__tagline",
          "ss-mhero__manifest",
          "ss-mhero__row",
          "ss-mhero__actions",
        ];
        return [...document.querySelectorAll(`.${BEATS.join(", .")}`)].flatMap(
          (element) => {
            const name = BEATS.find((beat) => element.classList.contains(beat));
            if (!name) return [];
            // A beat that is present but not rendered is not parity.
            return getComputedStyle(element).display === "none"
              ? [`${name}:hidden`]
              : [name];
          },
        );
      });
    };

    const home = await readBeats("/");
    const shared = await readBeats("/about");

    expect(shared, "the shared hero's phone beats").toEqual([
      "ss-mhero__tagline",
      "ss-mhero__manifest",
      "ss-mhero__row",
      "ss-mhero__row",
      "ss-mhero__row",
      "ss-mhero__actions",
    ]);
    expect(home, "the homepage's phone beats differ from the shared hero's").toEqual(
      shared,
    );
  });
});

/**
 * Floating controls — the demos launcher, the return-to-intro button and the
 * Silktide consent icon — are held off the phone hero until the visitor has
 * scrolled past it (src/app/experience/mobile-chrome-gate.tsx stamps
 * `html[data-mobile-chrome="ready"]`). That gate is what let the hero reclaim
 * the 7.4rem band it used to reserve for them, so it is load-bearing for the
 * fold contract above, not just a cosmetic nicety.
 */
const GATED_CONTROLS = [
  ".ss-demo-launcher",
  ".ss-hv2-return",
  // Consent is pre-seeded in playwright.config.ts, so the widget shows its
  // persistent icon rather than the first-visit prompt. It is still optional:
  // the widget is fetched from a CDN and may be absent offline.
  "#stcm-icon",
] as const;

function controlVisibility() {
  const read = (selector: string) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const style = getComputedStyle(element);
    if (style.display === "none") return null;
    return {
      visibility: style.visibility,
      opacity: Number(style.opacity),
      pointerEvents: style.pointerEvents,
    };
  };
  return {
    ready: document.documentElement.getAttribute("data-mobile-chrome"),
    ".ss-demo-launcher": read(".ss-demo-launcher"),
    ".ss-hv2-return": read(".ss-hv2-return"),
    "#stcm-icon": read("#stcm-icon"),
  };
}

test.describe("mobile hero floating controls", () => {
  test.skip(({ isMobile }) => !isMobile, "portrait-phone rule (max-width: 40rem)");

  for (const path of ["/services/ai-receptionists", "/industry/dentists"]) {
    test(`hidden over the hero, shown past the trust strip: ${path}`, async ({
      page,
    }) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width: 390, height: 844 });
      await openBody(page, path);

      const atRest = await page.evaluate(controlVisibility);
      expect(atRest.ready, `${path}: the gate opened before any scrolling`).toBeNull();
      let present = 0;
      for (const selector of GATED_CONTROLS) {
        const state = atRest[selector];
        if (!state) continue;
        present += 1;
        expect(state.visibility, `${path}: ${selector} visible over the hero`).toBe(
          "hidden",
        );
        expect(state.opacity, `${path}: ${selector} opaque over the hero`).toBe(0);
        expect(
          state.pointerEvents,
          `${path}: ${selector} still tappable over the hero`,
        ).toBe("none");
      }
      expect(
        present,
        `${path}: no floating control was rendered at all`,
      ).toBeGreaterThan(0);

      // Scroll until the trust strip's bottom edge is well inside the upper
      // half of the viewport — past the gate's 50% threshold.
      await page.evaluate(() => {
        const trust = document.querySelector(".ss-hv2-trust");
        const target = trust
          ? window.scrollY +
            trust.getBoundingClientRect().bottom -
            window.innerHeight * 0.4
          : window.innerHeight * 0.7;
        window.scrollTo(0, target);
      });
      await page.waitForTimeout(600);

      const scrolled = await page.evaluate(controlVisibility);
      expect(scrolled.ready, `${path}: the gate did not open past the hero`).toBe(
        "ready",
      );
      for (const selector of GATED_CONTROLS) {
        const state = scrolled[selector];
        if (!state) continue;
        expect(
          state.visibility,
          `${path}: ${selector} still hidden past the hero`,
        ).toBe("visible");
        expect(state.opacity, `${path}: ${selector} not fully faded in`).toBe(1);
      }

      // …and back off again when the reader returns to the hero.
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(600);

      const back = await page.evaluate(controlVisibility);
      expect(back.ready, `${path}: the gate stayed open back at the hero`).toBeNull();
      for (const selector of GATED_CONTROLS) {
        const state = back[selector];
        if (!state) continue;
        expect(
          state.visibility,
          `${path}: ${selector} stayed visible back at the hero`,
        ).toBe("hidden");
      }
    });
  }
});

/**
 * The signal manifest is the one hero beat with no component-level Reveal, so
 * its entrance is CSS. It has to land after the tagline (840ms) and before the
 * CTAs (1310ms) — and, whatever the timing, never leave a row invisible.
 */
test.describe("mobile secondary hero manifest reveal", () => {
  test.skip(
    ({ isMobile }) => !isMobile,
    "the manifest entrance is a portrait-phone rule (max-width: 40rem)",
  );

  test("the manifest card animates in between the tagline and the CTAs", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openBody(page, "/services/ai-receptionists");

    const animation = await page.evaluate(() => {
      const panel = document.querySelector(".ss-mhero__manifest");
      if (!panel) return null;
      const style = getComputedStyle(panel);
      return {
        name: style.animationName,
        delay: style.animationDelay,
        fill: style.animationFillMode,
      };
    });

    expect(animation).not.toBeNull();
    expect(animation?.name).toBe("ss-mhero-panel-in");
    // After the tagline's 840ms reveal, before its own rows at 980ms.
    expect(Number.parseFloat(animation?.delay ?? "0") * 1000).toBeGreaterThan(840);
    expect(Number.parseFloat(animation?.delay ?? "0") * 1000).toBeLessThan(980);
    // `forwards` would freeze the settled transform and kill later transforms.
    expect(animation?.fill).toBe("backwards");
  });

  test("the rows stagger in on each hero's own ladder, from CSS", async ({ page }) => {
    // Rows used to be `m.li` with a Motion `initial`, which prerenders as an
    // inline `opacity: 0` — the LCP hazard the CWV work identified, and the
    // reason the stagger never played on a cold gated entry. They are CSS now,
    // so the ladder is observable as a computed animation delay, and the
    // homepage keeps its own earlier one through the same custom property.
    await page.setViewportSize({ width: 390, height: 844 });

    const readRows = async (path: string) => {
      await openBody(page, path);
      return page.evaluate(() =>
        [...document.querySelectorAll(".ss-mhero__row")].map((row) => {
          const style = getComputedStyle(row);
          return {
            name: style.animationName,
            delayMs: Math.round(Number.parseFloat(style.animationDelay) * 1000),
            fill: style.animationFillMode,
            inlineStyle: row.getAttribute("style") ?? "",
          };
        }),
      );
    };

    const shared = await readRows("/services/ai-receptionists");
    expect(shared.map((row) => row.delayMs)).toEqual([980, 1080, 1180]);
    for (const row of shared) {
      expect(row.name).toBe("ss-mhero-row-in");
      expect(row.fill).toBe("backwards");
      // The only inline style a row may carry is its delay.
      expect(row.inlineStyle).not.toMatch(/opacity/);
    }

    const home = await readRows("/");
    expect(home.map((row) => row.delayMs)).toEqual([380, 480, 580]);
  });

  test("every manifest row settles fully visible", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openBody(page, "/services/ai-receptionists");

    const opacities = await page.evaluate(() => {
      const panel = document.querySelector(".ss-mhero__manifest");
      const rows = [...document.querySelectorAll(".ss-mhero__row")];
      return {
        panel: panel ? Number(getComputedStyle(panel).opacity) : null,
        rows: rows.map((row) => Number(getComputedStyle(row).opacity)),
      };
    });

    expect(opacities.panel).toBe(1);
    expect(opacities.rows.length).toBe(3);
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
      const panel = document.querySelector(".ss-mhero__manifest");
      const rows = [...document.querySelectorAll(".ss-mhero__row")];
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
