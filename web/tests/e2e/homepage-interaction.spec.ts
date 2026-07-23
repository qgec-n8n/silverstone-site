import { expect, test, type Page } from "@playwright/test";

test.describe.configure({ mode: "serial" });

const trustSignals = [
  "UK-built",
  "London-based",
  "Human-reviewed automation",
  "Scoped before build",
  "Staged implementation",
  "GDPR-conscious by design",
] as const;

async function waitForIntro(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-homepage-state", "intro", {
    timeout: 20_000,
  });
}

/**
 * The footer IS in the document during the homepage intro — it carries the
 * homepage's crawlable link graph. What the intro guarantees is that it
 * contributes nothing to the live page: zero layout height (so the intro
 * stays a single non-scrollable screen, asserted separately) and `inert`, so
 * it is out of the tab order and the role queries in these tests resolve to
 * nothing.
 *
 * It is deliberately NOT `display: none` and NOT `aria-hidden`. Both erase
 * the footer from the text a crawler extracts, which is the whole reason the
 * footer stays mounted here; a zero-height clip parks it just as completely
 * while keeping its copy and links in the rendered page.
 */
async function expectIntroFooterParked(page: Page) {
  const footer = page.locator("footer.ss-footer");
  await expect(footer).toHaveCount(1);
  await expect(footer).toHaveAttribute("inert", "");
  await expect(footer).not.toHaveAttribute("aria-hidden", "true");

  const parked = await footer.evaluate((node) => ({
    display: getComputedStyle(node).display,
    height: Math.round(node.getBoundingClientRect().height),
    textLength: (node as HTMLElement).textContent.trim().length,
  }));
  expect(parked.display).not.toBe("none");
  expect(parked.height).toBe(0);
  expect(parked.textLength).toBeGreaterThan(400);
}

/**
 * The homepage body is MOUNTED during the intro — it is the page's entire
 * indexable surface, and gating it on the explore click left the prerendered
 * homepage shipping ~500 characters and no links at all. Isolation is a
 * layout and interaction property, not an absence: the body is `inert` and
 * collapsed to zero height behind the intro.
 *
 * Note this asserts the wrapper's own box, not its descendants'. The wrapper
 * clips them, but clipping does not shrink a child's bounding box, so a
 * `toBeVisible()` check on anything inside would still pass — and should, as
 * far as a crawler is concerned.
 */
async function expectIntroBodyParked(page: Page) {
  const body = page.locator(".ss-hv2__body");
  await expect(body).toHaveCount(1);
  await expect(body).toHaveAttribute("inert", "");
  await expect(page.locator("#system")).toHaveCount(1);

  const parked = await body.evaluate((node) => ({
    display: getComputedStyle(node).display,
    height: Math.round(node.getBoundingClientRect().height),
    bottom: Math.round(node.getBoundingClientRect().bottom),
    textLength: (node as HTMLElement).innerText.trim().length,
  }));
  expect(parked.display).not.toBe("none");
  // Clipped away below the hero rather than removed from the document.
  expect(parked.bottom).toBeGreaterThanOrEqual(page.viewportSize()?.height ?? 0);
  expect(parked.textLength).toBeGreaterThan(1_500);
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
          particles?: {
            color?: { value?: string | string[] };
            line_linked?: { color?: string };
          };
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
    const signal = document.querySelector<HTMLElement>(".ss-hv2-system-signal");
    const signalBefore = signal ? getComputedStyle(signal, "::before") : null;
    const metricValues = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".ss-hv2-system-signal__metric .ss-hv2-hero__stat-value, .ss-hv2-system-signal__row-value, .ss-hv2-metric__value",
      ),
    );
    const text = document.body.textContent;

    return {
      aetherRevealAttributeCount:
        document.querySelectorAll("[data-aether-reveal]").length,
      bodyHasForbiddenRevenue: /£100k|£300k|Revenue trajectory/.test(text),
      bodyHasIntegrationSentence: text.includes("Silverstone integrates with"),
      bodyParticleColor: pJS?.particles?.color?.value ?? null,
      bodyParticleLineColor: pJS?.particles?.line_linked?.color ?? null,
      ctaLogoSrc:
        document.querySelector(".ss-hv2-cta__emblem")?.getAttribute("src") ?? null,
      footerLogoSrc: document.querySelector(".ss-footer__logo")?.getAttribute("src"),
      hasCustomBodyCanvas: Boolean(
        document.querySelector(
          ".ss-hv2-backdrop__particles:not([data-particles-host])",
        ),
      ),
      hasSystemImage: Boolean(document.querySelector(".ss-hv2-secondary__media img")),
      hasPremiumSystemImage: Boolean(
        document.querySelector('img[src="/home-v2/silverstone-system-visual.png"]'),
      ),
      hasLiveSignalBenchmarks: text.includes("Live Signal Benchmarks"),
      metricValuesFit: metricValues.every((node) => {
        const style = getComputedStyle(node);
        return (
          style.whiteSpace === "nowrap" && node.scrollWidth <= node.clientWidth + 1
        );
      }),
      nativeCanvasCount: document.querySelectorAll(
        '[data-particles-host="body"] canvas.particles-js-canvas-el',
      ).length,
      nativeCanvasInsideHost: Boolean(pJS?.canvas?.el && host?.contains(pJS.canvas.el)),
      pJSDomLength: Array.isArray(window.pJSDom) ? window.pJSDom.length : null,
      particlesJSType: typeof window.particlesJS,
      scriptPackage: script?.dataset.silverstoneParticlesPackage ?? null,
      scriptSrc: script?.getAttribute("src") ?? null,
      signalBeforeAnimation: signalBefore?.animationName ?? null,
      signalBeforeContent: signalBefore?.content ?? null,
      signalMetrics: document.querySelectorAll(".ss-hv2-system-signal__metric").length,
      signalRows: document.querySelectorAll(".ss-hv2-system-signal__row").length,
      systemLayerLabels: Array.from(
        document.querySelectorAll<HTMLElement>(
          ".ss-hv2-system-signal__row .ss-hv2-system-signal__row-label",
        ),
      ).map((node) => node.textContent.trim()),
      outcomeCards: document.querySelectorAll(".ss-hv2-outcome").length,
      industryCards: document.querySelectorAll(".ss-hv2-industry").length,
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
      hasPremiumSystemImage: Boolean(
        document.querySelector('img[src="/home-v2/silverstone-system-visual.png"]'),
      ),
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

async function openHomepageBody(page: Page) {
  await waitForIntro(page);
  await page.getByRole("button", { name: "Explore the system" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-homepage-state", "body", {
    timeout: 10_000,
  });
  await waitForBodyParticles(page);
}

async function waitForBodyParticles(page: Page) {
  await expect
    .poll(
      async () =>
        page.evaluate(() => ({
          canvasCount: document.querySelectorAll(
            '[data-particles-host="body"] canvas.particles-js-canvas-el',
          ).length,
          pJSDomLength: Array.isArray(window.pJSDom) ? window.pJSDom.length : null,
        })),
      { timeout: 10_000 },
    )
    .toEqual({ canvasCount: 1, pJSDomLength: 1 });
}

async function footerLayoutProof(page: Page) {
  await page.locator("footer.ss-footer").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page.locator(".ss-footer__cta").evaluate((cta) => {
        const animatedWrapper = cta.parentElement?.parentElement;
        return animatedWrapper
          ? getComputedStyle(animatedWrapper).transform
          : "missing";
      }),
    )
    .toBe("none");
  return page.evaluate(() => {
    const footer = document
      .querySelector<HTMLElement>("footer.ss-footer")
      ?.getBoundingClientRect();
    const brand = document
      .querySelector<HTMLElement>(".ss-footer__brand")
      ?.getBoundingClientRect();
    const logo = document
      .querySelector<HTMLElement>(".ss-footer__brandmark")
      ?.getBoundingClientRect();
    const location = document
      .querySelector<HTMLElement>(".ss-footer__brand p:last-of-type")
      ?.getBoundingClientRect();
    const cta = document
      .querySelector<HTMLElement>(".ss-footer__cta")
      ?.getBoundingClientRect();
    const navs = Array.from(
      document.querySelectorAll<HTMLElement>(".ss-footer__main nav"),
    ).map((node) => {
      const rect = node.getBoundingClientRect();
      const heading = node.querySelector<HTMLElement>("h2")?.getBoundingClientRect();
      const links = Array.from(node.querySelectorAll<HTMLElement>("li a")).map(
        (link) => {
          const linkRect = link.getBoundingClientRect();

          return {
            bottom: linkRect.bottom,
            text: link.textContent.trim(),
            top: linkRect.top,
          };
        },
      );

      return {
        bottom: rect.bottom,
        headingTop: heading?.top ?? null,
        label: node.getAttribute("aria-label"),
        left: rect.left,
        right: rect.right,
        top: rect.top,
        links,
      };
    });
    const allServices = navs
      .find((nav) => nav.label === "Services")
      ?.links.find((link) => link.text === "All services");
    const companyLinks = navs.find((nav) => nav.label === "Company")?.links ?? [];

    return {
      allServicesTop: allServices?.top ?? null,
      brandBottom: brand?.bottom ?? null,
      brandTop: brand?.top ?? null,
      companyLastLinkBottom: companyLinks.at(-1)?.bottom ?? null,
      ctaBottom: cta?.bottom ?? null,
      ctaLeft: cta?.left ?? null,
      ctaRight: cta?.right ?? null,
      ctaTop: cta?.top ?? null,
      footerRight: footer?.right ?? null,
      locationTop: location?.top ?? null,
      logoTop: logo?.top ?? null,
      navs,
      viewportWidth: window.innerWidth,
    };
  });
}

for (const viewport of [
  { width: 1366, height: 768 },
  { width: 390, height: 844 },
] as const) {
  test(`core loader keeps spinner centered ${String(viewport.width)}x${String(
    viewport.height,
  )}`, async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Loader geometry only needs one browser project.",
    );
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".ss-loader")).toBeVisible();

    const proof = await page.evaluate(() => {
      const stage = document
        .querySelector<HTMLElement>(".ss-loader__stage")
        ?.getBoundingClientRect();
      const spinNode = document.querySelector<HTMLElement>(".ss-loader__core-spin");
      const spin = spinNode?.getBoundingClientRect();
      const emblemNode = document.querySelector<HTMLImageElement>(".ss-loader__emblem");
      const emblem = emblemNode?.getBoundingClientRect();
      const label = document
        .querySelector<HTMLElement>(".ss-loader__label")
        ?.getBoundingClientRect();
      const layers = [
        ".ss-loader__base-glow",
        ".ss-loader__outer-ring",
        ".ss-loader__main-arc",
        ".ss-loader__reverse-arc",
        ".ss-loader__inner-arc",
        ".ss-loader__orbital",
        ".ss-loader__orbital-dot",
        ".ss-loader__center-core",
      ].map((selector) => document.querySelector(selector) !== null);
      const outerNode = document.querySelector<HTMLElement>(".ss-loader__outer-ring");
      const mainNode = document.querySelector<HTMLElement>(".ss-loader__main-arc");
      const reverseNode = document.querySelector<HTMLElement>(
        ".ss-loader__reverse-arc",
      );
      const innerNode = document.querySelector<HTMLElement>(".ss-loader__inner-arc");
      const orbitalNode = document.querySelector<HTMLElement>(".ss-loader__orbital");
      const isTransparentColor = (value: string | undefined) =>
        !value || value === "rgba(0, 0, 0, 0)" || value === "transparent";
      const borderProof = (style: CSSStyleDeclaration | null) =>
        style
          ? {
              bottomColorTransparent: isTransparentColor(style.borderBottomColor),
              bottomStyle: style.borderBottomStyle,
              leftColorTransparent: isTransparentColor(style.borderLeftColor),
              leftStyle: style.borderLeftStyle,
              rightColorTransparent: isTransparentColor(style.borderRightColor),
              rightStyle: style.borderRightStyle,
              topColorTransparent: isTransparentColor(style.borderTopColor),
              topStyle: style.borderTopStyle,
            }
          : null;
      const styles = {
        inner: innerNode ? getComputedStyle(innerNode) : null,
        main: mainNode ? getComputedStyle(mainNode) : null,
        orbital: orbitalNode ? getComputedStyle(orbitalNode) : null,
        outer: outerNode ? getComputedStyle(outerNode) : null,
        reverse: reverseNode ? getComputedStyle(reverseNode) : null,
      };
      const visibleEmblem =
        emblem && emblemNode
          ? {
              centerX: emblem.left + ((172 + 692 + 1) / 2 / 860) * emblem.width,
              centerY: emblem.top + ((140 + 760 + 1) / 2 / 929) * emblem.height,
            }
          : null;

      return {
        coreSpinAsset: emblemNode?.getAttribute("src") ?? null,
        coreSpinLayersVisible: layers.every(Boolean),
        coreSpinAnimations: {
          innerDuration: styles.inner?.animationDuration ?? null,
          innerTiming: styles.inner?.animationTimingFunction ?? null,
          mainDuration: styles.main?.animationDuration ?? null,
          orbitalDuration: styles.orbital?.animationDuration ?? null,
          outerDuration: styles.outer?.animationDuration ?? null,
          reverseDirection: styles.reverse?.animationDirection ?? null,
          reverseDuration: styles.reverse?.animationDuration ?? null,
        },
        coreSpinBorders: {
          inner: borderProof(styles.inner),
          main: borderProof(styles.main),
          outer: borderProof(styles.outer),
          reverse: borderProof(styles.reverse),
        },
        coreSpinCounts: {
          loader: document.querySelectorAll(".ss-loader").length,
          spinner: document.querySelectorAll(".ss-loader__core-spin").length,
        },
        emblemVisibleCenterDeltaX: visibleEmblem
          ? Math.abs(visibleEmblem.centerX - window.innerWidth / 2)
          : null,
        emblemVisibleCenterDeltaY: visibleEmblem
          ? Math.abs(visibleEmblem.centerY - window.innerHeight / 2)
          : null,
        labelGap: stage && label ? label.top - stage.bottom : null,
        spinCenterDeltaX: spin
          ? Math.abs(spin.left + spin.width / 2 - window.innerWidth / 2)
          : null,
        spinCenterDeltaY: spin
          ? Math.abs(spin.top + spin.height / 2 - window.innerHeight / 2)
          : null,
        stageCenterDeltaX: stage
          ? Math.abs(stage.left + stage.width / 2 - window.innerWidth / 2)
          : null,
        stageCenterDeltaY: stage
          ? Math.abs(stage.top + stage.height / 2 - window.innerHeight / 2)
          : null,
      };
    });

    expect(proof.stageCenterDeltaX ?? 999).toBeLessThanOrEqual(1);
    expect(proof.stageCenterDeltaY ?? 999).toBeLessThanOrEqual(1);
    expect(proof.spinCenterDeltaX ?? 999).toBeLessThanOrEqual(1);
    expect(proof.spinCenterDeltaY ?? 999).toBeLessThanOrEqual(1);
    expect(proof.emblemVisibleCenterDeltaX ?? 999).toBeLessThanOrEqual(2);
    expect(proof.emblemVisibleCenterDeltaY ?? 999).toBeLessThanOrEqual(2);
    expect(proof.labelGap ?? 0).toBeGreaterThan(16);
    expect(proof.coreSpinLayersVisible).toBe(true);
    expect(proof.coreSpinCounts.loader).toBe(1);
    expect(proof.coreSpinCounts.spinner).toBe(1);
    expect(proof.coreSpinAsset).toBe(
      "/brand/silverstone-ai-emblem-dark-transparent.png",
    );
    expect(proof.coreSpinBorders.outer?.topStyle).toBe("dashed");
    expect(proof.coreSpinBorders.outer?.rightStyle).toBe("dashed");
    expect(proof.coreSpinBorders.outer?.bottomStyle).toBe("dashed");
    expect(proof.coreSpinBorders.outer?.leftStyle).toBe("dashed");
    expect(proof.coreSpinBorders.main?.topColorTransparent).toBe(false);
    expect(proof.coreSpinBorders.main?.rightColorTransparent).toBe(true);
    expect(proof.coreSpinBorders.main?.bottomColorTransparent).toBe(true);
    expect(proof.coreSpinBorders.main?.leftColorTransparent).toBe(true);
    expect(proof.coreSpinBorders.reverse?.topColorTransparent).toBe(true);
    expect(proof.coreSpinBorders.reverse?.rightColorTransparent).toBe(true);
    expect(proof.coreSpinBorders.reverse?.bottomColorTransparent).toBe(false);
    expect(proof.coreSpinBorders.reverse?.leftColorTransparent).toBe(true);
    expect(proof.coreSpinBorders.inner?.topColorTransparent).toBe(true);
    expect(proof.coreSpinBorders.inner?.rightColorTransparent).toBe(true);
    expect(proof.coreSpinBorders.inner?.bottomColorTransparent).toBe(true);
    expect(proof.coreSpinBorders.inner?.leftColorTransparent).toBe(false);
    expect(proof.coreSpinAnimations.outerDuration).toBe("10s");
    expect(proof.coreSpinAnimations.mainDuration).toBe("2s");
    expect(proof.coreSpinAnimations.reverseDuration).toBe("3s");
    expect(proof.coreSpinAnimations.reverseDirection).toBe("reverse");
    expect(proof.coreSpinAnimations.innerDuration).toBe("1s");
    expect(proof.coreSpinAnimations.orbitalDuration).toBe("4s");
  });
}

for (const viewport of [
  { width: 1366, height: 768 },
  { width: 390, height: 844 },
] as const) {
  test(`footer CTA layout follows viewport order ${String(viewport.width)}x${String(
    viewport.height,
  )}`, async ({ page }, testInfo) => {
    test.setTimeout(45_000);
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Footer layout matrix only needs one browser project.",
    );
    await page.setViewportSize(viewport);
    await openHomepageBody(page);

    const proof = await footerLayoutProof(page);
    expect(proof.navs).toHaveLength(3);

    if (viewport.width >= 1024) {
      const servicesNav = proof.navs.find((nav) => nav.label === "Services");
      const companyNav = proof.navs.find((nav) => nav.label === "Company");

      expect(proof.logoTop ?? 999).toBeLessThan((servicesNav?.headingTop ?? 0) - 8);
      expect(proof.locationTop ?? 999).toBeLessThanOrEqual(
        (proof.allServicesTop ?? 0) + 16,
      );
      expect(proof.ctaLeft ?? 0).toBeGreaterThanOrEqual((companyNav?.left ?? 999) - 1);
      expect(proof.ctaRight ?? 999).toBeLessThanOrEqual((companyNav?.right ?? 0) + 1);
      expect(proof.ctaTop ?? 0).toBeGreaterThan(proof.companyLastLinkBottom ?? 999);
      expect(proof.ctaRight ?? 0).toBeLessThanOrEqual((proof.footerRight ?? 0) + 1);
    } else {
      const [servicesNav, industriesNav, companyNav] = proof.navs;

      expect(servicesNav?.label).toBe("Services");
      expect(industriesNav?.label).toBe("Industries");
      expect(companyNav?.label).toBe("Company");
      expect(proof.brandBottom ?? 0).toBeLessThanOrEqual((servicesNav?.top ?? 999) + 1);
      expect(servicesNav?.bottom ?? 0).toBeLessThanOrEqual(
        (industriesNav?.top ?? 999) + 1,
      );
      expect(industriesNav?.bottom ?? 0).toBeLessThanOrEqual(
        (companyNav?.top ?? 999) + 1,
      );
      expect(proof.ctaTop ?? 0).toBeGreaterThan(proof.companyLastLinkBottom ?? 999);
      expect(proof.ctaBottom ?? 0).toBeLessThanOrEqual((companyNav?.bottom ?? 0) + 1);
    }
  });
}

test("homepage intro is isolated until Explore opens the body", async ({ page }) => {
  test.setTimeout(60_000);
  await waitForIntro(page);

  await expect(page.locator("header[data-site-header]")).toHaveCount(0);
  await expectIntroFooterParked(page);
  await expectIntroBodyParked(page);
  await expect(page.locator(".ss-hv2-backdrop")).toHaveCount(0);
  await expect(page.locator(".ss-hv2-hero__canvas")).toHaveCount(1);
  await expect(
    page.getByRole("heading", {
      name: "The operating system for businesses that refuse to miss.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Explore the system" })).toBeVisible();
  const aetherProof = await page.evaluate(() => {
    const canvas = document.querySelector<HTMLCanvasElement>(".ss-hv2-hero__canvas");
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !context) {
      return null;
    }
    const sample = context.getImageData(
      Math.floor(canvas.width * 0.15),
      Math.floor(canvas.height * 0.15),
      Math.floor(canvas.width * 0.7),
      Math.floor(canvas.height * 0.7),
    ).data;
    let bright = 0;
    for (let index = 0; index < sample.length; index += 4) {
      if (
        Math.max(sample[index] ?? 0, sample[index + 1] ?? 0, sample[index + 2] ?? 0) >
        32
      ) {
        bright += 1;
      }
    }
    return {
      height: canvas.height,
      centralBrightRatio: bright / (sample.length / 4),
      width: canvas.width,
    };
  });
  expect(aetherProof?.width).toBe(page.viewportSize()?.width);
  expect(aetherProof?.height).toBe(page.viewportSize()?.height);
  expect(aetherProof?.centralBrightRatio ?? 0).toBeGreaterThan(0.0001);
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
        bodyInert: boolean;
        overflow: number;
        state: string | null;
      }[];
    };
    const root = document.querySelector(".ss-hv2");
    const record = () => {
      appWindow.__ssHomepageStateRecords?.push({
        bodyInert: Boolean(
          document.querySelector(".ss-hv2__body")?.hasAttribute("inert"),
        ),
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
    timeout: 10_000,
  });
  const transitionProof = await page.evaluate(() => {
    const appWindow = window as Window & {
      __ssHomepageStateObserver?: MutationObserver;
      __ssHomepageStateRecords?: {
        bodyInert: boolean;
        overflow: number;
        state: string | null;
      }[];
    };
    appWindow.__ssHomepageStateObserver?.disconnect();
    return appWindow.__ssHomepageStateRecords ?? [];
  });
  const openingRecords = transitionProof.filter((record) => record.state === "opening");
  expect(transitionProof.map((record) => record.state)).toContain("opening");
  // The body is mounted throughout (it is the homepage's indexable surface),
  // so what the opening transition guarantees is that it is not yet live:
  // still inert, and still adding no scrollable height.
  expect(openingRecords.every((record) => record.bodyInert)).toBe(true);
  expect(openingRecords.every((record) => record.overflow === 0)).toBe(true);
  await waitForBodyParticles(page);

  await expect(page.locator("header[data-site-header]")).toHaveCount(1);
  await expect(page.locator("footer.ss-footer")).toHaveCount(1);
  await expect(page.locator('[data-particles-host="body"] canvas')).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "The Silverstone System" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "The Business Impact of Better Automation",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Built for businesses where response matters.",
    }),
  ).toBeVisible();
  await expect(page.locator(".ss-hv2-trust__item")).toHaveText([...trustSignals]);
  await expect(page.locator(".ss-hv2-secondary__media img")).toHaveCount(0);
  await expect(
    page.locator('img[src="/home-v2/silverstone-system-visual.png"]'),
  ).toHaveCount(1);

  await page.mouse.move(96, 140);
  await page.waitForTimeout(120);
  const proof = await homepageRuntimeProof(page);
  expect(proof.particlesJSType).toBe("function");
  expect(proof.pJSDomLength).toBe(1);
  expect(proof.nativeCanvasCount).toBe(1);
  expect(proof.nativeCanvasInsideHost).toBe(true);
  expect(proof.scriptPackage).toBe("particles.js");
  expect(proof.scriptSrc ?? "").toMatch(
    /(?:\/node_modules\/particles\.js\/particles\.js|\/assets\/particles-[\w-]+\.js|\/vendor\/particles\.js)$/,
  );
  expect(proof.scriptSrc).not.toContain("cdn");
  expect(proof.hasCustomBodyCanvas).toBe(false);
  expect(proof.hasSystemImage).toBe(false);
  expect(proof.hasPremiumSystemImage).toBe(true);
  expect(proof.hasLiveSignalBenchmarks).toBe(true);
  expect(proof.signalMetrics).toBe(4);
  expect(proof.signalRows).toBe(3);
  expect(proof.systemLayerLabels).toEqual([
    "Patient & lead growth",
    "Always answering",
    "Peak reported ROI",
  ]);
  expect(proof.outcomeCards).toBe(0);
  expect(proof.industryCards).toBe(6);
  expect(proof.systemBottomDelta).not.toBeNull();
  expect(proof.systemBottomDelta ?? 999).toBeLessThanOrEqual(1.5);
  expect(proof.trustWidth ?? 0).toBeGreaterThanOrEqual(proof.viewportWidth - 2);
  expect(proof.aetherRevealAttributeCount).toBe(0);
  expect(proof.bodyHasForbiddenRevenue).toBe(false);
  expect(proof.bodyHasIntegrationSentence).toBe(false);
  expect(proof.bodyParticleColor).toBe("#BB8AD4");
  expect(proof.bodyParticleLineColor).toBe("#BB8AD4");
  expect(proof.metricValuesFit).toBe(true);
  expect(proof.signalBeforeAnimation).toBe("none");
  expect(proof.signalBeforeContent).toBe("none");
  expect(proof.ctaLogoSrc).toBeNull();
  expect(proof.footerLogoSrc).toBe("/brand/silverstone-ai-logo-footer.png");
  if (proof.coarsePointer) {
    expect(proof.hoverStatus).toBeNull();
  } else {
    expect(proof.hoverStatus).toBe("mousemove");
    expect(typeof proof.hoverX).toBe("number");
    expect(typeof proof.hoverY).toBe("number");
  }

  const headerColorAtTop = await page
    .locator("header[data-site-header]")
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect.poll(async () => (await scrollMetrics(page)).y).toBeGreaterThan(0);
  const headerColorAfterScroll = await page
    .locator("header[data-site-header]")
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(headerColorAtTop).toBe("rgb(255, 255, 255)");
  expect(headerColorAfterScroll).toBe("rgb(255, 255, 255)");

  await page.getByRole("button", { name: "Return to intro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-homepage-state", "intro", {
    timeout: 8_000,
  });
  await expect(page.locator("header[data-site-header]")).toHaveCount(0);
  await expectIntroFooterParked(page);
  await expectIntroBodyParked(page);
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
    test.setTimeout(45_000);
    test.skip(
      testInfo.project.name !== "desktop-chromium",
      "Viewport matrix sets exact sizes and only needs one browser project.",
    );
    await page.setViewportSize(viewport);
    await waitForIntro(page);
    await page.getByRole("button", { name: "Explore the system" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-homepage-state", "body", {
      timeout: 10_000,
    });
    await waitForBodyParticles(page);

    const proof = await systemViewportProof(page);
    expect(proof.pJSDomLength).toBe(1);
    expect(proof.nativeCanvasCount).toBe(1);
    expect(proof.hasSystemImage).toBe(false);
    expect(proof.hasPremiumSystemImage).toBe(true);
    expect(proof.signalMetrics).toBe(4);
    expect(proof.signalRows).toBe(3);
    expect(proof.sectionHeight).not.toBeNull();
    expect(proof.sectionBottomDelta ?? 999).toBeLessThanOrEqual(1.5);
    expect(proof.sectionContentOverflow ?? 999).toBeLessThanOrEqual(1.5);
    expect(proof.trustTopDelta ?? 999).toBeLessThanOrEqual(1.5);
    expect(proof.trustWidth ?? 0).toBeGreaterThanOrEqual(proof.viewportWidth - 2);
  });
}
