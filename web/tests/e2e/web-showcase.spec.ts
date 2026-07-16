import { expect, test, type Locator } from "@playwright/test";

async function readPhoneGeometry(phone: Locator) {
  return phone.evaluate((root) => {
    const screen = root.querySelector<HTMLElement>(".ss-folio-phone__screen");
    const island = root.querySelector<HTMLElement>(".ss-folio-phone__island");
    const viewport = root.querySelector<HTMLElement>(".ss-folio-phone__viewport");
    const frame = root.querySelector<HTMLIFrameElement>(".ss-folio-phone__frame");
    if (!screen || !island || !viewport || !frame) {
      return null;
    }

    const screenBox = screen.getBoundingClientRect();
    const islandBox = island.getBoundingClientRect();
    const viewportBox = viewport.getBoundingClientRect();
    const frameBox = frame.getBoundingClientRect();
    return {
      logicalWidth: frame.style.width,
      overflow: getComputedStyle(viewport).overflow,
      safeGap: viewportBox.top - islandBox.bottom,
      safeTop: viewportBox.top - screenBox.top,
      leftDelta: frameBox.left - viewportBox.left,
      rightDelta: frameBox.right - viewportBox.right,
      topDelta: frameBox.top - viewportBox.top,
      bottomDelta: frameBox.bottom - viewportBox.bottom,
      pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
}

test.describe("web design live showcase", () => {
  test("standing the phone's mobile demo down preserves scroll and focus", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium");

    // The production demos only allow Silverstone's production origin to frame
    // them. Fulfil the embed request locally so this regression check exercises
    // the host lifecycle without depending on external CSP or network timing.
    await page.route("https://ownly-housing.netlify.app/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 140));
      await route.fulfill({
        body: "<!doctype html><html><head><meta name='viewport' content='width=device-width,initial-scale=1'></head><body style='margin:0;min-height:12040px'>Ownly mobile page</body></html>",
        contentType: "text/html",
        status: 200,
      });
    });
    await page.route("https://aestheticsbyclouds.netlify.app/**", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 140));
      await route.fulfill({
        body: "<!doctype html><html><head><meta name='viewport' content='width=device-width,initial-scale=1'></head><body style='margin:0;min-height:12040px'>Clouds mobile page</body></html>",
        contentType: "text/html",
        status: 200,
      });
    });

    await page.goto("/services/web-design-development#demo-web-design");

    const scene = page.locator(".ss-folio-scene[data-current]");
    await expect(scene).toBeVisible({ timeout: 10_000 });
    const mobile = scene.getByRole("button", { name: "Mobile", exact: true });
    await mobile.click();
    await expect(mobile).toHaveAttribute("aria-pressed", "true");
    // The devices are untouchable mid-orbit; wait for them to settle.
    await expect(scene.locator(".ss-folio-scene__stage")).not.toHaveAttribute(
      "data-orbiting",
      "true",
    );

    const activate = scene.locator('[data-activate-phone="ownly-housing"]');
    await activate.scrollIntoViewIfNeeded();
    const activateBox = await activate.boundingBox();
    expect(activateBox).not.toBeNull();
    if (!activateBox) {
      return;
    }
    await page.mouse.click(
      activateBox.x + activateBox.width / 2,
      activateBox.y + activateBox.height / 2,
    );

    await expect(scene).toHaveAttribute("data-phase", "connecting");
    await expect(scene.locator(".ss-folio-phone__veil")).toContainText(
      "ownly-housing.netlify.app",
    );
    await expect(scene).toHaveAttribute("data-phase", "live");
    await expect(scene.locator(".ss-folio-phone__frame")).toHaveCount(1);
    const geometry = await readPhoneGeometry(scene.locator(".ss-folio-phone"));
    expect(geometry).not.toBeNull();
    expect(geometry?.logicalWidth).toBe("390px");
    expect(geometry?.overflow).toBe("clip");
    expect(geometry?.safeTop ?? 0).toBeGreaterThan(0);
    expect(geometry?.safeGap ?? -1).toBeGreaterThanOrEqual(0);
    expect(Math.abs(geometry?.leftDelta ?? 99)).toBeLessThanOrEqual(0.75);
    expect(Math.abs(geometry?.rightDelta ?? 99)).toBeLessThanOrEqual(0.75);
    expect(Math.abs(geometry?.topDelta ?? 99)).toBeLessThanOrEqual(0.75);
    expect(Math.abs(geometry?.bottomDelta ?? 99)).toBeLessThanOrEqual(0.75);
    expect(geometry?.pageOverflow ?? 99).toBeLessThanOrEqual(0);

    const ownlyRestart = scene.getByRole("button", {
      name: "Restart the Ownly Housing mobile demo",
      exact: true,
    });
    await ownlyRestart.click();
    await expect(scene).toHaveAttribute("data-phase", "connecting");
    await expect(scene).toHaveAttribute("data-phase", "live");
    const beforeCancel = await page.evaluate(() => window.scrollY);

    const standby = scene.getByRole("button", {
      name: "Return the Ownly Housing demo to standby",
      exact: true,
    });
    const standbyBox = await standby.boundingBox();
    expect(standbyBox).not.toBeNull();
    if (!standbyBox) {
      return;
    }
    await page.mouse.click(
      standbyBox.x + standbyBox.width / 2,
      standbyBox.y + standbyBox.height / 2,
    );

    await expect(scene).toHaveAttribute("data-phase", "idle");
    await expect(scene.locator(".ss-folio-phone__frame")).toHaveCount(0);
    await expect(activate).toBeFocused();
    expect(await page.evaluate(() => window.scrollY)).toBe(beforeCancel);

    const clouds = scene.getByRole("button", {
      name: "Aesthetics by Clouds",
      exact: true,
    });
    await clouds.click();
    await expect(scene).toHaveAttribute("data-demo", "aesthetics-by-clouds");
    await expect(scene.locator(".ss-folio-scene__stage")).toHaveAttribute(
      "data-rail-moving",
      "true",
    );
    await expect(scene.locator(".ss-folio-scene__stage")).not.toHaveAttribute(
      "data-rail-moving",
      "true",
      { timeout: 2_000 },
    );

    const cloudsActivate = scene.locator(
      '[data-activate-phone="aesthetics-by-clouds"]',
    );
    await cloudsActivate.click();
    await expect(scene).toHaveAttribute("data-phase", "connecting");
    await expect(scene).toHaveAttribute("data-phase", "live");
    await expect(scene.locator(".ss-folio-phone__frame")).toHaveCount(1);
    const cloudsGeometry = await readPhoneGeometry(scene.locator(".ss-folio-phone"));
    expect(Math.abs(cloudsGeometry?.rightDelta ?? 99)).toBeLessThanOrEqual(0.75);
    expect(cloudsGeometry?.safeGap ?? -1).toBeGreaterThanOrEqual(0);

    const cloudsRestart = scene.getByRole("button", {
      name: "Restart the Aesthetics by Clouds mobile demo",
      exact: true,
    });
    await cloudsRestart.click();
    await expect(scene).toHaveAttribute("data-phase", "connecting");
    await expect(scene).toHaveAttribute("data-phase", "live");

    await scene.getByRole("button", { name: "Ownly Housing", exact: true }).click();
    await expect(scene).toHaveAttribute("data-phase", "idle");
    await expect(scene.locator(".ss-folio-phone__frame")).toHaveCount(0);
    await expect(scene.locator(".ss-folio-scene__stage")).toHaveAttribute(
      "data-rail-moving",
      "true",
    );
    await expect(scene.locator(".ss-folio-scene__stage")).not.toHaveAttribute(
      "data-rail-moving",
      "true",
      { timeout: 2_000 },
    );
    await scene
      .getByRole("button", { name: "Aesthetics by Clouds", exact: true })
      .click();
    await expect(scene.locator(".ss-folio-scene__stage")).toHaveAttribute(
      "data-rail-moving",
      "true",
    );
    await expect(scene.locator(".ss-folio-scene__stage")).not.toHaveAttribute(
      "data-rail-moving",
      "true",
      { timeout: 2_000 },
    );
    await scene.locator('[data-activate-phone="aesthetics-by-clouds"]').click();
    await expect(scene).toHaveAttribute("data-phase", "live");

    await scene.locator(".ss-folio-phone").focus();
    await page.keyboard.press("Escape");
    await expect(scene).toHaveAttribute("data-phase", "idle");
    await expect(scene.locator(".ss-folio-phone__frame")).toHaveCount(0);
  });

  test("window demos preserve exclusive loading, restart, switch and Escape lifecycles", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium");
    for (const origin of [
      "https://ownly-housing.netlify.app/**",
      "https://aestheticsbyclouds.netlify.app/**",
    ]) {
      await page.route(origin, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 120));
        await route.fulfill({
          body: "<!doctype html><html><body style='margin:0;min-height:4000px'>Desktop demo</body></html>",
          contentType: "text/html",
          status: 200,
        });
      });
    }

    await page.goto("/services/web-design-development#demo-web-design");
    const scene = page.locator(".ss-folio-scene[data-current]");
    await expect(scene).toBeVisible({ timeout: 10_000 });
    await scene.locator('[data-activate="ownly-housing"]').click();
    await expect(scene).toHaveAttribute("data-phase", "connecting");
    await expect(scene).toHaveAttribute("data-phase", "live");
    await expect(scene.locator("iframe")).toHaveCount(1);

    const ownlyGeometry = await scene.locator(".ss-folio-window").evaluate((root) => {
      const screen = root.querySelector<HTMLElement>(".ss-folio-window__screen");
      const frame = root.querySelector<HTMLIFrameElement>(".ss-folio-window__frame");
      if (!screen || !frame) return null;
      const screenBox = screen.getBoundingClientRect();
      const frameBox = frame.getBoundingClientRect();
      return {
        logicalWidth: frame.style.width,
        rightDelta: frameBox.right - screenBox.right,
        bottomDelta: frameBox.bottom - screenBox.bottom,
      };
    });
    expect(ownlyGeometry?.logicalWidth).toBe("1440px");
    expect(Math.abs(ownlyGeometry?.rightDelta ?? 99)).toBeLessThanOrEqual(0.75);
    expect(Math.abs(ownlyGeometry?.bottomDelta ?? 99)).toBeLessThanOrEqual(0.75);

    await scene
      .getByRole("button", { name: "Restart the Ownly Housing demo", exact: true })
      .click();
    await expect(scene).toHaveAttribute("data-phase", "connecting");
    await expect(scene).toHaveAttribute("data-phase", "live");

    await scene
      .getByRole("button", { name: "Aesthetics by Clouds", exact: true })
      .click();
    await expect(scene).toHaveAttribute("data-phase", "idle");
    await expect(scene.locator("iframe")).toHaveCount(0);
    await expect(scene.locator(".ss-folio-scene__stage")).toHaveAttribute(
      "data-rail-moving",
      "true",
    );
    await expect(scene.locator(".ss-folio-scene__stage")).not.toHaveAttribute(
      "data-rail-moving",
      "true",
      { timeout: 2_000 },
    );

    await scene.locator('[data-activate="aesthetics-by-clouds"]').click();
    await expect(scene).toHaveAttribute("data-phase", "connecting");
    await expect(scene).toHaveAttribute("data-phase", "live");
    await expect(scene.locator("iframe")).toHaveCount(1);
    await scene.locator(".ss-folio-window").focus();
    await page.keyboard.press("Escape");
    await expect(scene).toHaveAttribute("data-phase", "idle");
    await expect(scene.locator("iframe")).toHaveCount(0);
  });

  test("project copy morphs in place while both website visuals travel on the rail", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium");
    await page.goto("/services/web-design-development#demo-web-design");

    const scene = page.locator(".ss-folio-scene[data-current]");
    await expect(scene).toBeVisible({ timeout: 10_000 });
    const stage = scene.locator(".ss-folio-scene__stage");
    const windowRail = scene.locator(".ss-folio-window__rail");
    const phoneRail = scene.locator(".ss-folio-phone__rail");
    const clouds = scene.getByRole("button", {
      name: "Aesthetics by Clouds",
      exact: true,
    });
    const ownly = scene.getByRole("button", { name: "Ownly Housing", exact: true });

    const anchoredBefore = await scene.evaluate((root) => {
      const intro = root.querySelector(".ss-folio-scene__intro");
      const domain = root.querySelector(".ss-folio-window__addr-domain");
      if (!intro || !domain) return null;
      const introBox = intro.getBoundingClientRect();
      const domainBox = domain.getBoundingClientRect();
      return {
        introTop: introBox.top,
        introHeight: introBox.height,
        domainLeft: domainBox.left,
        domainTop: domainBox.top,
      };
    });

    const windowWidth = await scene
      .locator(".ss-folio-window__visual")
      .evaluate((element) => element.getBoundingClientRect().width);
    await clouds.click();
    await expect(scene).toHaveAttribute("data-demo", "aesthetics-by-clouds");
    await expect(stage).toHaveAttribute("data-rail-moving", "true");

    const outgoingSamples = await windowRail.evaluate(async (rail) => {
      const positions: number[] = [];
      for (let frame = 0; frame < 12; frame += 1) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        positions.push(new DOMMatrixReadOnly(getComputedStyle(rail).transform).m41);
      }
      return positions;
    });
    expect(
      outgoingSamples.some((position) => position < -1 && position > -windowWidth + 1),
    ).toBe(true);

    await expect(stage).not.toHaveAttribute("data-rail-moving", "true", {
      timeout: 2_000,
    });
    await expect(windowRail).toHaveAttribute("data-rail-index", "1");
    await expect(phoneRail).toHaveAttribute("data-rail-index", "1");
    const settled = await windowRail.evaluate(
      (rail) => new DOMMatrixReadOnly(getComputedStyle(rail).transform).m41,
    );
    expect(settled).toBeCloseTo(-windowWidth, 0);
    await expect(
      windowRail.locator('.ss-folio-visual-slide[data-active="true"] img'),
    ).toHaveAttribute("alt", /Aesthetics by Clouds/i);
    await expect(
      phoneRail.locator('.ss-folio-visual-slide[data-active="false"]'),
    ).toHaveAttribute("aria-hidden", "true");
    await expect(scene.locator(".ss-folio-visual-rail iframe")).toHaveCount(0);
    await expect(scene.locator("iframe")).toHaveCount(0);

    const cloudsTitle = scene.locator(
      '.ss-folio-scene__intro-layer[data-active="true"] .ss-folio-scene__headline',
    );
    await expect(cloudsTitle).toHaveAttribute(
      "data-title-accent",
      "aesthetics-by-clouds",
    );
    expect(
      await cloudsTitle.evaluate((title) => ({
        accent: title.style.getPropertyValue("--demo-title-tint"),
        background: getComputedStyle(title).backgroundImage,
        color: getComputedStyle(title).color,
      })),
    ).toEqual(
      expect.objectContaining({
        accent: "#536035",
        color: "rgba(0, 0, 0, 0)",
      }),
    );
    expect(
      await clouds.evaluate((button) => getComputedStyle(button).backgroundImage),
    ).not.toBe("none");

    const anchoredAfter = await scene.evaluate((root) => {
      const intro = root.querySelector(".ss-folio-scene__intro");
      const domain = root.querySelector(".ss-folio-window__addr-domain");
      if (!intro || !domain) return null;
      const introBox = intro.getBoundingClientRect();
      const domainBox = domain.getBoundingClientRect();
      return {
        introTop: introBox.top,
        introHeight: introBox.height,
        domainLeft: domainBox.left,
        domainTop: domainBox.top,
      };
    });
    expect(anchoredAfter).not.toBeNull();
    expect(anchoredBefore).not.toBeNull();
    for (const key of ["introTop", "introHeight", "domainLeft", "domainTop"] as const) {
      expect(
        Math.abs((anchoredAfter?.[key] ?? 99) - (anchoredBefore?.[key] ?? 0)),
      ).toBeLessThan(1);
    }

    await ownly.click();
    await expect(stage).toHaveAttribute("data-rail-moving", "true");
    const incomingSamples = await windowRail.evaluate(async (rail) => {
      const positions: number[] = [];
      for (let frame = 0; frame < 12; frame += 1) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        positions.push(new DOMMatrixReadOnly(getComputedStyle(rail).transform).m41);
      }
      return positions;
    });
    expect(
      incomingSamples.some((position) => position < -1 && position > -windowWidth + 1),
    ).toBe(true);
    expect(incomingSamples.at(-1) ?? -windowWidth).toBeGreaterThan(
      incomingSamples[0] ?? 0,
    );
    await expect(stage).not.toHaveAttribute("data-rail-moving", "true", {
      timeout: 2_000,
    });
    expect(
      await scene
        .locator(
          '.ss-folio-scene__intro-layer[data-active="true"] .ss-folio-scene__headline',
        )
        .evaluate((title) => title.style.getPropertyValue("--demo-title-tint")),
    ).toBe("#5e0000");
    expect(
      await windowRail.evaluate(
        (rail) => new DOMMatrixReadOnly(getComputedStyle(rail).transform).m41,
      ),
    ).toBeCloseTo(0, 0);
  });

  test("reduced motion swaps device depth without orbit travel", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/services/web-design-development#demo-web-design");

    const scene = page.locator(".ss-folio-scene[data-current]");
    await expect(scene).toBeVisible({ timeout: 10_000 });
    const mobile = scene.getByRole("button", { name: "Mobile", exact: true });
    await mobile.click();

    await expect(mobile).toHaveAttribute("aria-pressed", "true");
    await expect(scene.locator(".ss-folio-device--window")).toHaveAttribute(
      "data-plane",
      "back",
    );
    await expect(scene.locator(".ss-folio-device--phone")).toHaveAttribute(
      "data-plane",
      "front",
    );
    expect(
      await scene.locator(".ss-folio-device--window").evaluate((device) => ({
        reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        transform: getComputedStyle(device).transform,
        transitionProperty: getComputedStyle(device).transitionProperty,
      })),
    ).toEqual({
      reduced: true,
      transform: "none",
      transitionProperty: "opacity",
    });

    await scene
      .getByRole("button", { name: "Aesthetics by Clouds", exact: true })
      .click();
    await expect(scene).toHaveAttribute("data-demo", "aesthetics-by-clouds");
    await expect(scene.locator(".ss-folio-scene__stage")).not.toHaveAttribute(
      "data-rail-moving",
      "true",
    );
    await expect(scene.locator(".ss-folio-window__rail")).toHaveAttribute(
      "data-rail-index",
      "1",
    );
    const reducedRail = await scene
      .locator(".ss-folio-visual-slide")
      .first()
      .evaluate((slide) => ({
        transitionDurationMs:
          Number.parseFloat(getComputedStyle(slide).transitionDuration) * 1000,
        reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      }));
    expect(reducedRail.reduced).toBe(true);
    expect(reducedRail.transitionDurationMs).toBeLessThanOrEqual(0.01);
  });

  test("showcase controls follow a logical visible keyboard order", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium");
    await page.goto("/services/web-design-development#demo-web-design");

    const scene = page.locator(
      '.ss-folio-scene[data-demo="ownly-housing"][data-current]',
    );
    await expect(scene).toBeVisible({ timeout: 10_000 });
    const ownly = scene.getByRole("button", { name: "Ownly Housing", exact: true });
    const clouds = scene.getByRole("button", {
      name: "Aesthetics by Clouds",
      exact: true,
    });
    const desktop = scene.getByRole("button", { name: "Desktop", exact: true });
    const mobile = scene.getByRole("button", { name: "Mobile", exact: true });
    const visit = scene.getByRole("link", { name: "Open live site", exact: true });
    const windowLink = scene.getByRole("link", {
      name: "Open the Ownly Housing website in a new tab",
      exact: true,
    });
    const activate = scene.locator(".ss-folio-window__activate");

    await ownly.focus();
    await expect(ownly).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(clouds).toBeFocused();
    expect(
      await clouds.evaluate((button) => getComputedStyle(button).boxShadow),
    ).not.toBe("none");
    for (const next of [desktop, mobile, visit, windowLink, activate]) {
      await page.keyboard.press("Tab");
      await expect(next).toBeFocused();
    }

    await mobile.focus();
    await page.keyboard.press("Enter");
    await expect(mobile).toHaveAttribute("aria-pressed", "true");
    await expect(scene.locator(".ss-folio-device--window")).toHaveAttribute(
      "inert",
      "",
    );
  });

  test("particle canvas and engine survive repeated demo-section scrolling", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium");
    await page.goto("/services/web-design-development#demo-web-design");

    const scene = page.locator(
      '.ss-folio-scene[data-demo="ownly-housing"][data-current]',
    );
    await expect(scene).toBeVisible({ timeout: 10_000 });
    const canvas = page.locator('[data-particles-host="body"] canvas');
    await expect(canvas).toHaveCount(1, { timeout: 10_000 });
    await expect
      .poll(() =>
        page.evaluate(() => (Array.isArray(window.pJSDom) ? window.pJSDom.length : 0)),
      )
      .toBe(1);

    const canvasHandle = await canvas.elementHandle();
    expect(canvasHandle).not.toBeNull();
    if (!canvasHandle) {
      return;
    }
    const instanceHandle = await page.evaluateHandle(() => window.pJSDom?.[0]);
    const checksum = () =>
      page.evaluate(() => {
        const particleCanvas = document.querySelector<HTMLCanvasElement>(
          '[data-particles-host="body"] canvas',
        );
        const context = particleCanvas?.getContext("2d");
        if (!particleCanvas || !context) {
          return { alpha: 0, hash: 0 };
        }
        const pixels = context.getImageData(
          0,
          0,
          particleCanvas.width,
          particleCanvas.height,
        ).data;
        let alpha = 0;
        let hash = 2_166_136_261;
        for (let index = 0; index < pixels.length; index += 16) {
          const value =
            (pixels[index] ?? 0) +
            (pixels[index + 1] ?? 0) +
            (pixels[index + 2] ?? 0) +
            (pixels[index + 3] ?? 0);
          alpha += pixels[index + 3] ?? 0;
          hash = Math.imul(hash ^ value, 16_777_619) >>> 0;
        }
        return { alpha, hash };
      });

    const before = await checksum();
    await scene.scrollIntoViewIfNeeded();
    for (let cycle = 0; cycle < 6; cycle += 1) {
      await page.mouse.wheel(0, 720);
      await page.waitForTimeout(80);
      await page.mouse.wheel(0, -720);
      await page.waitForTimeout(80);
    }
    await page.setViewportSize({ width: 390, height: 760 });
    await page.waitForTimeout(120);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(320);
    const after = await checksum();

    await expect(canvas).toHaveCount(1);
    expect(
      await canvasHandle.evaluate(
        (original) =>
          original.isConnected &&
          document.querySelector('[data-particles-host="body"] canvas') === original,
      ),
    ).toBe(true);
    expect(
      await page.evaluate(
        (original) => window.pJSDom?.[0] === original,
        instanceHandle,
      ),
    ).toBe(true);
    expect(await page.evaluate(() => window.pJSDom?.length)).toBe(1);
    expect(before.alpha).toBeGreaterThan(0);
    expect(after.alpha).toBeGreaterThan(0);
    expect(after.hash).not.toBe(before.hash);
  });
});
