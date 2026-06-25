import { expect, test, type Page } from "@playwright/test";

const trustSignals = [
  "UK-built",
  "London-based",
  "Human-reviewed automation",
  "No lock-in pilots",
  "Live in weeks",
  "GDPR-conscious by design",
] as const;

async function waitForIntro(page: Page) {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-homepage-state", "intro", {
    timeout: 12_000,
  });
}

async function scrollMetrics(page: Page) {
  return page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    viewport: window.innerHeight,
    y: window.scrollY,
  }));
}

async function homepageRuntimeProof(page: Page) {
  return page.evaluate(() => {
    const host = document.querySelector<HTMLElement>('[data-particles-host="body"]');
    const instance = Array.isArray(window.pJSDom) ? window.pJSDom[0] : undefined;
    const pJS = instance?.pJS as
      | {
          canvas?: { el?: HTMLCanvasElement };
          interactivity?: {
            mouse?: { pos_x?: number; pos_y?: number };
            status?: string;
          };
        }
      | undefined;
    const system = document.querySelector("#system")?.getBoundingClientRect();
    const trustShell = document
      .querySelector(".ss-hv2-trust-shell")
      ?.getBoundingClientRect();
    const script = document.querySelector<HTMLScriptElement>(
      'script[data-silverstone-particles="local"]',
    );

    return {
      ctaLogoSrc: document.querySelector(".ss-hv2-cta__emblem")?.getAttribute("src"),
      footerLogoSrc: document.querySelector(".ss-footer__logo")?.getAttribute("src"),
      hasCustomBodyCanvas: Boolean(
        document.querySelector(
          ".ss-hv2-backdrop__particles:not([data-particles-host])",
        ),
      ),
      hasSystemImage: Boolean(document.querySelector(".ss-hv2-secondary__media img")),
      nativeCanvasCount: document.querySelectorAll(
        '[data-particles-host="body"] canvas.particles-js-canvas-el',
      ).length,
      nativeCanvasInsideHost: Boolean(pJS?.canvas?.el && host?.contains(pJS.canvas.el)),
      pJSDomLength: Array.isArray(window.pJSDom) ? window.pJSDom.length : null,
      particlesJSType: typeof window.particlesJS,
      scriptPackage: script?.dataset.silverstoneParticlesPackage ?? null,
      scriptSrc: script?.getAttribute("src") ?? null,
      signalMetrics: document.querySelectorAll(".ss-hv2-system-signal__metric").length,
      signalRows: document.querySelectorAll(".ss-hv2-system-signal__row").length,
      systemBottomDelta: system ? Math.abs(system.bottom - window.innerHeight) : null,
      trustWidth: trustShell?.width ?? null,
      viewportWidth: window.innerWidth,
      coarsePointer: window.matchMedia("(pointer: coarse)").matches,
      hoverStatus: pJS?.interactivity?.status ?? null,
      hoverX: pJS?.interactivity?.mouse?.pos_x ?? null,
      hoverY: pJS?.interactivity?.mouse?.pos_y ?? null,
    };
  });
}

async function systemViewportProof(page: Page) {
  return page.evaluate(() => {
    const section = document.querySelector<HTMLElement>("#system");
    const sectionRect = section?.getBoundingClientRect();
    const trustShell = document
      .querySelector(".ss-hv2-trust-shell")
      ?.getBoundingClientRect();
    const visibleDescendants = section
      ? Array.from(section.querySelectorAll<HTMLElement | SVGElement>("*")).filter(
          (el) => {
            const rect = el.getBoundingClientRect();
            const style = getComputedStyle(el);
            return (
              rect.width > 0.5 &&
              rect.height > 0.5 &&
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              style.position !== "fixed"
            );
          },
        )
      : [];
    const maxBottom =
      sectionRect && visibleDescendants.length > 0
        ? Math.max(...visibleDescendants.map((el) => el.getBoundingClientRect().bottom))
        : (sectionRect?.bottom ?? 0);

    return {
      hasSystemImage: Boolean(document.querySelector("#system img")),
      nativeCanvasCount: document.querySelectorAll(
        '[data-particles-host="body"] canvas.particles-js-canvas-el',
      ).length,
      pJSDomLength: Array.isArray(window.pJSDom) ? window.pJSDom.length : null,
      sectionBottomDelta: sectionRect
        ? Math.abs(sectionRect.bottom - window.innerHeight)
        : null,
      sectionContentOverflow: sectionRect ? maxBottom - sectionRect.bottom : null,
      sectionHeight: sectionRect?.height ?? null,
      signalMetrics: document.querySelectorAll(".ss-hv2-system-signal__metric").length,
      signalRows: document.querySelectorAll(".ss-hv2-system-signal__row").length,
      trustTopDelta: trustShell ? Math.abs(trustShell.top - window.innerHeight) : null,
      trustWidth: trustShell?.width ?? null,
      viewportWidth: window.innerWidth,
    };
  });
}

test("homepage intro is isolated until Explore opens the body", async ({ page }) => {
  await waitForIntro(page);

  await expect(page.locator("header")).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);
  await expect(page.locator("#system")).toHaveCount(0);
  await expect(page.locator(".ss-hv2-backdrop")).toHaveCount(0);
  expect(await scrollMetrics(page)).toMatchObject({ y: 0 });
  await expect
    .poll(async () => {
      const metrics = await scrollMetrics(page);
      return metrics.height - metrics.viewport;
    })
    .toBe(0);

  await page.evaluate(() => window.scrollTo(0, 500));
  await expect.poll(async () => (await scrollMetrics(page)).y).toBe(0);

  await page.evaluate(() => {
    const appWindow = window as Window & {
      __ssHomepageStateObserver?: MutationObserver;
      __ssHomepageStateRecords?: {
        hasBody: boolean;
        overflow: number;
        state: string | null;
      }[];
    };
    const root = document.querySelector(".ss-hv2");
    const record = () => {
      appWindow.__ssHomepageStateRecords?.push({
        hasBody: Boolean(document.querySelector("#system")),
        overflow: document.documentElement.scrollHeight - window.innerHeight,
        state: root?.getAttribute("data-homepage-state") ?? null,
      });
    };

    appWindow.__ssHomepageStateObserver?.disconnect();
    appWindow.__ssHomepageStateRecords = [];
    record();
    if (root) {
      appWindow.__ssHomepageStateObserver = new MutationObserver(record);
      appWindow.__ssHomepageStateObserver.observe(root, {
        attributeFilter: ["data-homepage-state"],
        attributes: true,
      });
    }
  });

  await page.getByRole("button", { name: "Explore the system" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-homepage-state", "body", {
    timeout: 5_000,
  });
  const transitionProof = await page.evaluate(() => {
    const appWindow = window as Window & {
      __ssHomepageStateObserver?: MutationObserver;
      __ssHomepageStateRecords?: {
        hasBody: boolean;
        overflow: number;
        state: string | null;
      }[];
    };
    appWindow.__ssHomepageStateObserver?.disconnect();
    return appWindow.__ssHomepageStateRecords ?? [];
  });
  const openingRecords = transitionProof.filter((record) => record.state === "opening");
  expect(transitionProof.map((record) => record.state)).toContain("opening");
  expect(openingRecords.every((record) => !record.hasBody)).toBe(true);
  expect(openingRecords.every((record) => record.overflow === 0)).toBe(true);

  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator('[data-particles-host="body"] canvas')).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "The Silverstone System" }),
  ).toBeVisible();
  await expect(page.locator(".ss-hv2-trust__item")).toHaveText([...trustSignals]);
  await expect(page.locator(".ss-hv2-secondary__media img")).toHaveCount(0);

  await page.mouse.move(96, 140);
  await page.waitForTimeout(120);
  const proof = await homepageRuntimeProof(page);
  expect(proof.particlesJSType).toBe("function");
  expect(proof.pJSDomLength).toBe(1);
  expect(proof.nativeCanvasCount).toBe(1);
  expect(proof.nativeCanvasInsideHost).toBe(true);
  expect(proof.scriptPackage).toBe("particles.js");
  expect(proof.scriptSrc ?? "").toMatch(
    /(?:\/node_modules\/particles\.js\/particles\.js|\/assets\/particles-[\w-]+\.js)$/,
  );
  expect(proof.scriptSrc).not.toContain("cdn");
  expect(proof.hasCustomBodyCanvas).toBe(false);
  expect(proof.hasSystemImage).toBe(false);
  expect(proof.signalMetrics).toBe(4);
  expect(proof.signalRows).toBe(4);
  expect(proof.systemBottomDelta).not.toBeNull();
  expect(proof.systemBottomDelta ?? 999).toBeLessThanOrEqual(1.5);
  expect(proof.trustWidth ?? 0).toBeGreaterThanOrEqual(proof.viewportWidth - 2);
  expect(proof.ctaLogoSrc).toBe("/brand/silverstone-ai-logo-dark-v3.png");
  expect(proof.footerLogoSrc).toBe("/brand/silverstone-ai-logo-dark-v3.png");
  if (proof.coarsePointer) {
    expect(proof.hoverStatus).toBeNull();
  } else {
    expect(proof.hoverStatus).toBe("mousemove");
    expect(typeof proof.hoverX).toBe("number");
    expect(typeof proof.hoverY).toBe("number");
  }

  const headerColorAtTop = await page
    .locator("header")
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect.poll(async () => (await scrollMetrics(page)).y).toBeGreaterThan(0);
  const headerColorAfterScroll = await page
    .locator("header")
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(headerColorAtTop).toBe("rgb(255, 255, 255)");
  expect(headerColorAfterScroll).toBe("rgb(255, 255, 255)");

  await page.getByRole("button", { name: "Return to intro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-homepage-state", "intro", {
    timeout: 5_000,
  });
  await expect(page.locator("header")).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);
  await expect(page.locator("#system")).toHaveCount(0);
  await expect(page.locator(".ss-hv2-backdrop")).toHaveCount(0);
  await expect(page.locator("canvas.particles-js-canvas-el")).toHaveCount(0);
  await expect
    .poll(async () =>
      page.evaluate(() => (Array.isArray(window.pJSDom) ? window.pJSDom.length : null)),
    )
    .toBe(0);
  await expect(page.getByRole("button", { name: "Explore the system" })).toBeFocused();
  await expect.poll(async () => (await scrollMetrics(page)).y).toBe(0);
});

for (const viewport of [
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
  { width: 390, height: 844 },
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
] as const) {
  const viewportLabel = `${String(viewport.width)}x${String(viewport.height)}`;

  test(`homepage body fits ${viewportLabel}`, async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Viewport matrix sets exact sizes and only needs one browser project.",
    );
    await page.setViewportSize(viewport);
    await waitForIntro(page);
    await page.getByRole("button", { name: "Explore the system" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-homepage-state", "body", {
      timeout: 5_000,
    });

    const proof = await systemViewportProof(page);
    expect(proof.pJSDomLength).toBe(1);
    expect(proof.nativeCanvasCount).toBe(1);
    expect(proof.hasSystemImage).toBe(false);
    expect(proof.signalMetrics).toBe(4);
    expect(proof.signalRows).toBe(4);
    expect(proof.sectionHeight).not.toBeNull();
    expect(proof.sectionBottomDelta ?? 999).toBeLessThanOrEqual(1.5);
    expect(proof.sectionContentOverflow ?? 999).toBeLessThanOrEqual(1.5);
    expect(proof.trustTopDelta ?? 999).toBeLessThanOrEqual(1.5);
    expect(proof.trustWidth ?? 0).toBeGreaterThanOrEqual(proof.viewportWidth - 2);
  });
}
