import { expect, test } from "@playwright/test";

test.describe("web design live showcase", () => {
  test("standing the phone's mobile demo down preserves scroll and focus", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium");

    // The production demos only allow Silverstone's production origin to frame
    // them. Fulfil the embed request locally so this regression check exercises
    // the host lifecycle without depending on external CSP or network timing.
    await page.route("https://ownly-housing.netlify.app/**", async (route) => {
      await route.fulfill({
        body: "<!doctype html><html><body style='min-height:12040px'>Mobile page</body></html>",
        contentType: "text/html",
        status: 200,
      });
    });

    await page.goto("/services/web-design-development#demo-web-design");

    const scene = page.locator(
      '.ss-folio-scene[data-demo="ownly-housing"][data-current]',
    );
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

    await expect(scene).toHaveAttribute("data-phase", "live");
    await expect(scene.locator(".ss-folio-phone__frame")).toHaveCount(1);
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
  });

  test("reduced motion swaps device depth without orbit travel", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/services/web-design-development#demo-web-design");

    const scene = page.locator(
      '.ss-folio-scene[data-demo="ownly-housing"][data-current]',
    );
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
