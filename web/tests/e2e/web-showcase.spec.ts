import { expect, test, type Locator } from "@playwright/test";

async function readPhoneGeometry(phone: Locator) {
  return phone.evaluate((root) => {
    const screen = root.querySelector<HTMLElement>(".ss-folio-phone__screen");
    const island = root.querySelector<HTMLElement>(".ss-folio-phone__island");
    const viewport = root.querySelector<HTMLElement>(".ss-folio-phone__viewport");
    const frame = root.querySelector<HTMLIFrameElement>(".ss-folio-phone__frame");
    const shot = root.querySelector<HTMLElement>(".ss-folio-phone__shot");
    const browserBar = root.querySelector<HTMLElement>(".ss-folio-phone__browser-bar");
    if (!screen || !island || !viewport || !frame || !shot || !browserBar) {
      return null;
    }

    const screenBox = screen.getBoundingClientRect();
    const islandBox = island.getBoundingClientRect();
    const viewportBox = viewport.getBoundingClientRect();
    const frameBox = frame.getBoundingClientRect();
    const shotBox = shot.getBoundingClientRect();
    const browserBarBox = browserBar.getBoundingClientRect();
    return {
      logicalWidth: frame.style.width,
      overflow: getComputedStyle(viewport).overflow,
      touchAction: getComputedStyle(frame).touchAction,
      shotRadius: getComputedStyle(shot).borderRadius,
      safeGap: viewportBox.top - islandBox.bottom,
      safeTop: viewportBox.top - screenBox.top,
      safeBottom: screenBox.bottom - viewportBox.bottom,
      browserBarHeight: browserBarBox.height,
      shotLeftDelta: shotBox.left - viewportBox.left,
      shotRightDelta: shotBox.right - viewportBox.right,
      leftDelta: frameBox.left - viewportBox.left,
      rightDelta: frameBox.right - viewportBox.right,
      topDelta: frameBox.top - viewportBox.top,
      bottomDelta: frameBox.bottom - viewportBox.bottom,
      pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
    };
  });
}

async function readRearDesktopAppearance(windowDevice: Locator) {
  return windowDevice.evaluate((device) => {
    const window = device.querySelector<HTMLElement>(".ss-folio-window");
    const visual = device.querySelector<HTMLElement>(".ss-folio-window__visual");
    const poster = device.querySelector<HTMLElement>(".ss-folio-window__poster");
    const shade = device.querySelector<HTMLElement>(".ss-folio-device__depth-shade");
    if (!window || !visual || !poster || !shade) return null;

    return {
      windowPhase: window.dataset.phase,
      windowBorder: getComputedStyle(window).borderColor,
      visualVisibility: getComputedStyle(visual).visibility,
      visualOpacity: getComputedStyle(visual).opacity,
      posterVisibility: getComputedStyle(poster).visibility,
      posterOpacity: getComputedStyle(poster).opacity,
      shadeOpacity: getComputedStyle(shade).opacity,
      shadeBackdrop: getComputedStyle(shade).backdropFilter,
    };
  });
}

async function readForegroundPhoneBounds(phoneDevice: Locator) {
  return phoneDevice.evaluate((device) => {
    const phone = device.querySelector<HTMLElement>(".ss-folio-phone");
    const viewport = device.closest<HTMLElement>(".ss-folio-device-viewport");
    if (!phone || !viewport) return null;
    const phoneBox = phone.getBoundingClientRect();
    const viewportBox = viewport.getBoundingClientRect();
    return {
      phoneTop: phoneBox.top,
      phoneBottom: phoneBox.bottom,
      viewportTop: viewportBox.top,
      viewportBottom: viewportBox.bottom,
    };
  });
}

async function readPhoneControlGeometry(phoneControls: Locator) {
  return phoneControls.evaluate((controls) => {
    const screen = controls.parentElement;
    const phone = controls.closest<HTMLElement>(".ss-folio-phone");
    const island = phone?.querySelector<HTMLElement>(".ss-folio-phone__island");
    const viewport = phone?.querySelector<HTMLElement>(".ss-folio-phone__viewport");
    if (!screen || !island || !viewport) return null;
    const controlsBox = controls.getBoundingClientRect();
    const screenBox = screen.getBoundingClientRect();
    const islandBox = island.getBoundingClientRect();
    const viewportBox = viewport.getBoundingClientRect();
    const buttonBoxes = Array.from(controls.querySelectorAll("button"), (button) => {
      const box = button.getBoundingClientRect();
      return {
        width: box.width,
        height: box.height,
        cssWidth: Number.parseFloat(getComputedStyle(button).width),
      };
    });
    return {
      topInset: controlsBox.top - screenBox.top,
      bottomClearance: viewportBox.top - controlsBox.bottom,
      islandClearance: controlsBox.left - islandBox.right,
      buttonBoxes,
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
    const activePair = scene.locator('.ss-folio-device-slide[data-active="true"]');
    const mobile = scene.getByRole("button", { name: "Mobile", exact: true });
    await mobile.click();
    await expect(mobile).toHaveAttribute("aria-pressed", "true");
    // The devices are untouchable mid-orbit; wait for them to settle.
    await expect(scene.locator(".ss-folio-scene__stage")).not.toHaveAttribute(
      "data-orbiting",
      "true",
    );

    const phoneDevice = activePair.locator(".ss-folio-device--phone");
    const rearDesktop = activePair.locator(".ss-folio-device--window");
    const foregroundBounds = await readForegroundPhoneBounds(phoneDevice);
    expect(foregroundBounds).not.toBeNull();
    expect(foregroundBounds?.phoneTop ?? -1).toBeGreaterThanOrEqual(
      (foregroundBounds?.viewportTop ?? 0) - 0.75,
    );
    expect(
      foregroundBounds?.phoneBottom ?? Number.POSITIVE_INFINITY,
    ).toBeLessThanOrEqual((foregroundBounds?.viewportBottom ?? 0) + 0.75);

    const rearDesktopBeforeLive = await readRearDesktopAppearance(rearDesktop);
    expect(rearDesktopBeforeLive).not.toBeNull();
    expect(rearDesktopBeforeLive?.visualVisibility).toBe("visible");

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
    expect(await readRearDesktopAppearance(rearDesktop)).toEqual(rearDesktopBeforeLive);

    const phoneControls = activePair.locator(
      ".ss-folio-phone__screen > [data-phone-controls]",
    );
    await expect(phoneControls).toBeVisible();
    await expect(phoneControls.locator("button")).toHaveCount(2);
    const controlGeometry = await readPhoneControlGeometry(phoneControls);
    expect(controlGeometry).not.toBeNull();
    expect(controlGeometry?.topInset ?? -1).toBeGreaterThanOrEqual(0);
    expect(controlGeometry?.bottomClearance ?? -1).toBeGreaterThanOrEqual(0);
    expect(controlGeometry?.islandClearance ?? -1).toBeGreaterThanOrEqual(0);
    for (const box of controlGeometry?.buttonBoxes ?? []) {
      expect(box.cssWidth).toBe(24);
      expect(box.width).toBeLessThanOrEqual(30);
      expect(box.height).toBeLessThanOrEqual(30);
    }

    const geometry = await readPhoneGeometry(activePair.locator(".ss-folio-phone"));
    expect(geometry).not.toBeNull();
    expect(geometry?.logicalWidth).toBe("390px");
    expect(geometry?.overflow).toBe("clip");
    expect(geometry?.touchAction).toContain("pan-y");
    expect(geometry?.shotRadius).toBe("0px");
    expect(geometry?.safeTop ?? 0).toBeGreaterThan(0);
    expect(geometry?.safeGap ?? -1).toBeGreaterThanOrEqual(0);
    expect(
      Math.abs((geometry?.safeBottom ?? 99) - (geometry?.browserBarHeight ?? 0)),
    ).toBeLessThanOrEqual(0.75);
    expect(Math.abs(geometry?.shotLeftDelta ?? 99)).toBeLessThanOrEqual(0.75);
    expect(Math.abs(geometry?.shotRightDelta ?? 99)).toBeLessThanOrEqual(0.75);
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
    const cloudsGeometry = await readPhoneGeometry(
      activePair.locator(".ss-folio-phone"),
    );
    expect(Math.abs(cloudsGeometry?.rightDelta ?? 99)).toBeLessThanOrEqual(0.75);
    expect(cloudsGeometry?.safeGap ?? -1).toBeGreaterThanOrEqual(0);
    expect(cloudsGeometry?.touchAction).toContain("pan-y");
    expect(cloudsGeometry?.shotRadius).toBe("0px");

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

    await activePair.locator(".ss-folio-phone").focus();
    await page.keyboard.press("Escape");
    await expect(scene).toHaveAttribute("data-phase", "idle");
    await expect(scene.locator(".ss-folio-phone__frame")).toHaveCount(0);
  });

  test("foreground phone and sensor controls clear the narrow composed frame", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium");
    await page.setViewportSize({ width: 800, height: 1_000 });
    await page.route("https://ownly-housing.netlify.app/**", (route) =>
      route.fulfill({
        body: "<!doctype html><html><head><meta name='viewport' content='width=device-width,initial-scale=1'></head><body style='margin:0;min-height:4000px'>Ownly mobile page</body></html>",
        contentType: "text/html",
        status: 200,
      }),
    );

    await page.goto("/services/web-design-development#demo-web-design");
    const scene = page.locator(".ss-folio-scene[data-current]");
    await expect(scene).toBeVisible({ timeout: 10_000 });
    const activePair = scene.locator('.ss-folio-device-slide[data-active="true"]');
    const phoneDevice = activePair.locator(".ss-folio-device--phone");
    const rearDesktop = activePair.locator(".ss-folio-device--window");

    await scene.getByRole("button", { name: "Mobile", exact: true }).click();
    await expect(scene.locator(".ss-folio-scene__stage")).toHaveAttribute(
      "data-orbiting",
      "true",
    );
    await expect(scene.locator(".ss-folio-scene__stage")).not.toHaveAttribute(
      "data-orbiting",
      "true",
      { timeout: 2_000 },
    );

    const bounds = await readForegroundPhoneBounds(phoneDevice);
    expect(bounds).not.toBeNull();
    expect(bounds?.phoneBottom ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(
      (bounds?.viewportBottom ?? 0) + 0.75,
    );

    const rearBeforeLive = await readRearDesktopAppearance(rearDesktop);
    await scene.locator('[data-activate-phone="ownly-housing"]').click();
    await expect(scene).toHaveAttribute("data-phase", "live");
    expect(await readRearDesktopAppearance(rearDesktop)).toEqual(rearBeforeLive);

    const controls = activePair.locator(
      ".ss-folio-phone__screen > [data-phone-controls]",
    );
    await expect(controls).toBeVisible();
    // The physical island contracts around the arriving controls; inspect the
    // settled handset geometry rather than the intentional shared-black-band
    // overlap during that brief chrome morph.
    await expect
      .poll(async () => (await readPhoneControlGeometry(controls))?.islandClearance)
      .toBeGreaterThanOrEqual(1);
    const geometry = await readPhoneControlGeometry(controls);
    expect(geometry).not.toBeNull();
    expect(geometry?.topInset ?? -1).toBeGreaterThanOrEqual(0);
    expect(geometry?.bottomClearance ?? -1).toBeGreaterThanOrEqual(0);
    expect(geometry?.islandClearance ?? -1).toBeGreaterThanOrEqual(1);
    for (const box of geometry?.buttonBoxes ?? []) {
      expect(box.cssWidth).toBe(24);
      expect(box.width).toBeLessThanOrEqual(30);
      expect(box.height).toBeLessThanOrEqual(30);
    }
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
        await new Promise((resolve) => setTimeout(resolve, 300));
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
    const activePair = scene.locator('.ss-folio-device-slide[data-active="true"]');
    await scene.locator('[data-activate="ownly-housing"]').click();
    await expect(scene).toHaveAttribute("data-phase", "connecting");
    await expect(scene).toHaveAttribute("data-phase", "live");
    await expect(scene.locator("iframe")).toHaveCount(1);

    const ownlyGeometry = await activePair
      .locator(".ss-folio-window")
      .evaluate((root) => {
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
    await activePair.locator(".ss-folio-window").focus();
    await page.keyboard.press("Escape");
    await expect(scene).toHaveAttribute("data-phase", "idle");
    await expect(scene.locator("iframe")).toHaveCount(0);
  });

  test("project copy morphs in place while complete device pairs travel on the rail", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium");
    await page.goto("/services/web-design-development#demo-web-design");

    const scene = page.locator(".ss-folio-scene[data-current]");
    await expect(scene).toBeVisible({ timeout: 10_000 });
    const stage = scene.locator(".ss-folio-scene__stage");
    const deviceRail = scene.locator(".ss-folio-device-rail");
    const deviceViewport = scene.locator(".ss-folio-device-viewport");
    const ownlySlide = deviceRail.locator('[data-project="ownly-housing"]');
    const cloudsSlide = deviceRail.locator('[data-project="aesthetics-by-clouds"]');
    const clouds = scene.getByRole("button", {
      name: "Aesthetics by Clouds",
      exact: true,
    });
    const ownly = scene.getByRole("button", { name: "Ownly Housing", exact: true });

    const anchoredBefore = await scene.evaluate((root) => {
      const intro = root.querySelector<HTMLElement>(".ss-folio-scene__intro");
      if (!intro) return null;
      return {
        introTop: intro.offsetTop,
        introHeight: intro.offsetHeight,
      };
    });

    await expect(ownlySlide.locator(".ss-folio-device")).toHaveCount(2);
    await expect(cloudsSlide.locator(".ss-folio-device")).toHaveCount(2);
    await expect(cloudsSlide).toHaveAttribute("inert", "");
    await expect(cloudsSlide.locator("iframe")).toHaveCount(0);

    const beforeDevices = await deviceRail.evaluate((rail) => {
      const read = (project: string) => {
        const slide = rail.querySelector(`[data-project="${project}"]`);
        const windowDevice = slide?.querySelector(".ss-folio-device--window");
        const phoneDevice = slide?.querySelector(".ss-folio-device--phone");
        const poster = slide?.querySelector(".ss-folio-window__poster");
        if (!windowDevice || !phoneDevice || !poster) return null;
        const windowBox = windowDevice.getBoundingClientRect();
        const phoneBox = phoneDevice.getBoundingClientRect();
        const posterBox = poster.getBoundingClientRect();
        return {
          windowX: windowBox.x,
          phoneX: phoneBox.x,
          posterOffset: posterBox.x - windowBox.x,
        };
      };
      return { ownly: read("ownly-housing"), clouds: read("aesthetics-by-clouds") };
    });
    const railWidth = await deviceViewport.evaluate(
      (element) => element.getBoundingClientRect().width,
    );
    await clouds.click();
    await expect(scene).toHaveAttribute("data-demo", "aesthetics-by-clouds");
    await expect(stage).toHaveAttribute("data-rail-moving", "true");

    const outgoingSamples = await deviceRail.evaluate(async (rail) => {
      const positions: number[] = [];
      for (let frame = 0; frame < 12; frame += 1) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        positions.push(new DOMMatrixReadOnly(getComputedStyle(rail).transform).m41);
      }
      return positions;
    });
    expect(
      outgoingSamples.some((position) => position < -1 && position > -railWidth + 1),
    ).toBe(true);

    const movingDevices = await deviceRail.evaluate((rail) => {
      const read = (project: string) => {
        const slide = rail.querySelector(`[data-project="${project}"]`);
        const windowDevice = slide?.querySelector(".ss-folio-device--window");
        const phoneDevice = slide?.querySelector(".ss-folio-device--phone");
        const poster = slide?.querySelector(".ss-folio-window__poster");
        if (!windowDevice || !phoneDevice || !poster) return null;
        const windowBox = windowDevice.getBoundingClientRect();
        const phoneBox = phoneDevice.getBoundingClientRect();
        const posterBox = poster.getBoundingClientRect();
        return {
          windowX: windowBox.x,
          phoneX: phoneBox.x,
          posterOffset: posterBox.x - windowBox.x,
        };
      };
      return { ownly: read("ownly-housing"), clouds: read("aesthetics-by-clouds") };
    });
    expect(movingDevices.ownly?.windowX ?? 99).toBeLessThan(
      beforeDevices.ownly?.windowX ?? 0,
    );
    expect(movingDevices.ownly?.phoneX ?? 99).toBeLessThan(
      beforeDevices.ownly?.phoneX ?? 0,
    );
    expect(
      Math.abs(
        (movingDevices.ownly?.posterOffset ?? 99) -
          (beforeDevices.ownly?.posterOffset ?? 0),
      ),
    ).toBeLessThan(1);

    await expect(stage).not.toHaveAttribute("data-rail-moving", "true", {
      timeout: 2_000,
    });
    await expect(deviceRail).toHaveAttribute("data-rail-index", "1");
    const settled = await deviceRail.evaluate(
      (rail) => new DOMMatrixReadOnly(getComputedStyle(rail).transform).m41,
    );
    expect(settled).toBeCloseTo(-railWidth, 0);
    await expect(cloudsSlide).toHaveAttribute("data-active", "true");
    await expect(cloudsSlide.locator(".ss-folio-window__poster")).toHaveAttribute(
      "alt",
      /Aesthetics by Clouds/i,
    );
    await expect(cloudsSlide.locator(".ss-folio-phone__shot")).toHaveAttribute(
      "alt",
      /Aesthetics by Clouds/i,
    );
    await expect(cloudsSlide.locator(".ss-folio-phone__browser-domain")).toContainText(
      "aestheticsbyclouds.netlify.app",
    );
    await expect(ownlySlide).toHaveAttribute("aria-hidden", "true");
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
        filter: getComputedStyle(title).filter,
      })),
    ).toEqual(
      expect.objectContaining({
        accent: "#536035",
        color: "rgba(0, 0, 0, 0)",
      }),
    );
    expect(
      await cloudsTitle.evaluate((title) => getComputedStyle(title).backgroundImage),
    ).toContain("oklch");
    expect(
      await cloudsTitle.evaluate((title) => getComputedStyle(title).filter),
    ).not.toBe("none");
    expect(
      await clouds.evaluate((button) => getComputedStyle(button).backgroundImage),
    ).not.toBe("none");

    const anchoredAfter = await scene.evaluate((root) => {
      const intro = root.querySelector<HTMLElement>(".ss-folio-scene__intro");
      if (!intro) return null;
      return {
        introTop: intro.offsetTop,
        introHeight: intro.offsetHeight,
      };
    });
    expect(anchoredAfter).not.toBeNull();
    expect(anchoredBefore).not.toBeNull();
    for (const key of ["introTop", "introHeight"] as const) {
      expect(
        Math.abs((anchoredAfter?.[key] ?? 99) - (anchoredBefore?.[key] ?? 0)),
      ).toBeLessThan(1);
    }

    await ownly.click();
    await expect(stage).toHaveAttribute("data-rail-moving", "true");
    const incomingSamples = await deviceRail.evaluate(async (rail) => {
      const positions: number[] = [];
      for (let frame = 0; frame < 12; frame += 1) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        positions.push(new DOMMatrixReadOnly(getComputedStyle(rail).transform).m41);
      }
      return positions;
    });
    expect(
      incomingSamples.some((position) => position < -1 && position > -railWidth + 1),
    ).toBe(true);
    expect(incomingSamples.at(-1) ?? -railWidth).toBeGreaterThan(
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
      await deviceRail.evaluate(
        (rail) => new DOMMatrixReadOnly(getComputedStyle(rail).transform).m41,
      ),
    ).toBeCloseTo(0, 0);
  });

  test("inactive depth glass is darker on the rear device and mirrors with focus", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium");
    await page.goto("/services/web-design-development#demo-web-design");

    const scene = page.locator(".ss-folio-scene[data-current]");
    await expect(scene).toBeVisible({ timeout: 10_000 });
    const activePair = scene.locator('.ss-folio-device-slide[data-active="true"]');
    const windowDevice = activePair.locator(".ss-folio-device--window");
    const phoneDevice = activePair.locator(".ss-folio-device--phone");
    const windowShade = windowDevice.locator(".ss-folio-device__depth-shade");
    const phoneShade = phoneDevice.locator(".ss-folio-device__depth-shade");

    await expect(windowDevice).toHaveAttribute("data-plane", "front");
    await expect(phoneDevice).toHaveAttribute("data-plane", "back");
    expect(await windowShade.evaluate((shade) => getComputedStyle(shade).opacity)).toBe(
      "0",
    );
    expect(await phoneShade.evaluate((shade) => getComputedStyle(shade).opacity)).toBe(
      "1",
    );
    expect(
      await phoneShade.evaluate((shade) => getComputedStyle(shade).backdropFilter),
    ).toContain("blur");
    await expect(phoneDevice.locator(".ss-folio-phone__shot")).toBeVisible();

    await scene.getByRole("button", { name: "Mobile", exact: true }).click();
    await expect(scene.locator(".ss-folio-scene__stage")).toHaveAttribute(
      "data-orbiting",
      "true",
    );
    await expect(scene.locator(".ss-folio-scene__stage")).not.toHaveAttribute(
      "data-orbiting",
      "true",
      { timeout: 2_000 },
    );
    await expect(windowDevice).toHaveAttribute("data-plane", "back");
    await expect(phoneDevice).toHaveAttribute("data-plane", "front");
    expect(await windowShade.evaluate((shade) => getComputedStyle(shade).opacity)).toBe(
      "1",
    );
    expect(await phoneShade.evaluate((shade) => getComputedStyle(shade).opacity)).toBe(
      "0",
    );
    await expect(windowDevice.locator(".ss-folio-window__poster")).toBeVisible();
    expect(
      await windowDevice
        .locator(".ss-folio-window__visual")
        .evaluate((visual) => getComputedStyle(visual).visibility),
    ).toBe("visible");
  });

  test("reduced motion swaps device depth without orbit travel", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/services/web-design-development#demo-web-design");

    const scene = page.locator(".ss-folio-scene[data-current]");
    await expect(scene).toBeVisible({ timeout: 10_000 });
    const activePair = scene.locator('.ss-folio-device-slide[data-active="true"]');
    const mobile = scene.getByRole("button", { name: "Mobile", exact: true });
    await mobile.click();

    await expect(mobile).toHaveAttribute("aria-pressed", "true");
    await expect(activePair.locator(".ss-folio-device--window")).toHaveAttribute(
      "data-plane",
      "back",
    );
    await expect(activePair.locator(".ss-folio-device--phone")).toHaveAttribute(
      "data-plane",
      "front",
    );
    expect(
      await activePair.locator(".ss-folio-device--window").evaluate((device) => ({
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
    await expect(scene.locator(".ss-folio-device-rail")).toHaveAttribute(
      "data-rail-index",
      "1",
    );
    const reducedRail = await scene
      .locator(".ss-folio-device-slide")
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
    const activePair = scene.locator('.ss-folio-device-slide[data-active="true"]');
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
    await expect(activePair.locator(".ss-folio-device--window")).toHaveAttribute(
      "inert",
      "",
    );
  });

  test("mobile rail keeps each phone centered with a seamless website viewport", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-chromium");
    await page.goto("/services/web-design-development#demo-web-design");

    const scene = page.locator(".ss-folio-scene[data-current]");
    await expect(scene).toBeVisible({ timeout: 10_000 });
    const stage = scene.locator(".ss-folio-scene__stage");
    const activePair = scene.locator('.ss-folio-device-slide[data-active="true"]');

    const readPosterFit = () =>
      activePair.locator(".ss-folio-phone").evaluate((phone) => {
        const viewport = phone.querySelector<HTMLElement>(".ss-folio-phone__viewport");
        const shot = phone.querySelector<HTMLElement>(".ss-folio-phone__shot");
        const bar = phone.querySelector<HTMLElement>(".ss-folio-phone__browser-bar");
        if (!viewport || !shot || !bar) return null;
        const phoneBox = phone.getBoundingClientRect();
        const stageBox = phone
          .closest(".ss-folio-scene__stage")
          ?.getBoundingClientRect();
        const viewportBox = viewport.getBoundingClientRect();
        const shotBox = shot.getBoundingClientRect();
        return {
          phoneCenter: phoneBox.left + phoneBox.width / 2,
          stageCenter: stageBox?.x,
          stageWidth: stageBox?.width,
          leftDelta: shotBox.left - viewportBox.left,
          rightDelta: shotBox.right - viewportBox.right,
          radius: getComputedStyle(shot).borderRadius,
          barHeight: bar.getBoundingClientRect().height,
          pageOverflow: document.documentElement.scrollWidth - innerWidth,
        };
      });

    const ownly = await readPosterFit();
    expect(ownly?.radius).toBe("0px");
    expect(ownly?.barHeight ?? 0).toBeGreaterThan(0);
    expect(Math.abs(ownly?.leftDelta ?? 99)).toBeLessThanOrEqual(0.75);
    expect(Math.abs(ownly?.rightDelta ?? 99)).toBeLessThanOrEqual(0.75);
    expect(ownly?.pageOverflow ?? 99).toBeLessThanOrEqual(0);
    expect(
      Math.abs(
        (ownly?.phoneCenter ?? 0) -
          ((ownly?.stageCenter ?? 0) + (ownly?.stageWidth ?? 0) / 2),
      ),
    ).toBeLessThanOrEqual(1);

    await scene
      .getByRole("button", { name: "Aesthetics by Clouds", exact: true })
      .click();
    await expect(stage).toHaveAttribute("data-rail-moving", "true");
    await expect(stage).not.toHaveAttribute("data-rail-moving", "true", {
      timeout: 2_000,
    });
    await expect(scene.locator(".ss-folio-device-rail")).toHaveAttribute(
      "data-rail-index",
      "1",
    );
    const clouds = await readPosterFit();
    expect(clouds?.radius).toBe("0px");
    expect(clouds?.barHeight ?? 0).toBeGreaterThan(0);
    expect(Math.abs(clouds?.leftDelta ?? 99)).toBeLessThanOrEqual(0.75);
    expect(Math.abs(clouds?.rightDelta ?? 99)).toBeLessThanOrEqual(0.75);
    expect(clouds?.pageOverflow ?? 99).toBeLessThanOrEqual(0);
    expect(
      Math.abs(
        (clouds?.phoneCenter ?? 0) -
          ((clouds?.stageCenter ?? 0) + (clouds?.stageWidth ?? 0) / 2),
      ),
    ).toBeLessThanOrEqual(1);
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
