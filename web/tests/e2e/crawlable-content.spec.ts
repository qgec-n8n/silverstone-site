import { expect, test, type Page } from "@playwright/test";

import { PUBLISHED_BLOG_POSTS } from "../../src/data/blog-posts";

/**
 * Every route must ship its content to a crawler without anyone clicking
 * anything — and must not change its own head or heading structure the moment
 * it hydrates.
 *
 * The loader/intro gate is a visual layer, not a content switch. It used to be
 * both: the homepage mounted its body only after the explore click, and every
 * other gated route wrapped its body in `aria-hidden="true"` plus a
 * `display: none`. A crawler measures the text a page actually renders, so
 * both techniques erased the entire page — the live site reported 200-550
 * characters per route while shipping 2,500-16,000, and the homepage rendered
 * zero visible links.
 *
 * Three halves of the contract, each of which has already been broken once:
 *
 *  1. The SERVED bytes carry the content — asserted against the raw HTTP
 *     response, not the hydrated DOM. `document.body.innerText` cannot tell a
 *     prerendered page from one the client assembled after load, so on its own
 *     it would pass a build that shipped an empty shell.
 *  2. HYDRATION DOES NOT REWRITE the page's identity: same `<title>`, same
 *     single H1. A third-party script silently rewriting `<title>` on every
 *     route went unnoticed until it was found by hand; this catches the next one.
 *  3. The intro is still exactly one non-scrollable screen.
 */

/** SEO tooling flags anything under 1.5K characters as a thin page. */
const THIN_PAGE_FLOOR = 1_500;

const marketingRoutes = [
  "/",
  "/about",
  "/blog",
  "/book",
  "/contact",
  "/how-we-work",
  "/industry",
  "/industry/aesthetic-clinics",
  "/industry/dentists",
  "/industry/ecommerce",
  "/industry/estate-agents",
  "/industry/fitness-coaches",
  "/industry/gyms-fitness-studios",
  "/industry/hospitality",
  "/industry/physios-chiropractors",
  "/industry/salons-barbers",
  "/industry/trades",
  "/pricing",
  "/services",
  "/services/ai-automation",
  "/services/ai-consulting",
  "/services/ai-receptionists",
  "/services/ai-voice-agents",
  "/services/app-development",
  "/services/content-creation",
  "/services/web-design-development",
] as const;

const articleRoutes = PUBLISHED_BLOG_POSTS.map((post) => `/blog/${post.slug}`);

/** Every indexable URL. Articles were previously untested here entirely. */
const servedRoutes = [...marketingRoutes, ...articleRoutes];

/**
 * Hydration is the expensive check, so it runs on the marketing routes plus a
 * representative article — the 34 articles share one template, and all 34 are
 * still covered by the raw-HTML contract above.
 */
const hydratedRoutes = [...marketingRoutes, articleRoutes[0]].filter(
  (path): path is string => Boolean(path),
);

function stripTags(html: string) {
  return html
    .replaceAll(/<(script|style|template)\b[^>]*>[\S\s]*?<\/\1>/gi, " ")
    .replaceAll(/<[^>]+>/g, " ")
    .replaceAll(/&[#\w]+;/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();
}

function mainOf(html: string) {
  return /<main\b[^>]*>([\S\s]*?)<\/main>/i.exec(html)?.[1] ?? "";
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

/** `document.title` is decoded; the served bytes are not. Compare like with like. */
function decodeEntities(value: string) {
  return value.replaceAll(/&(#x?[\da-f]+|\w+);/gi, (match, body: string) => {
    if (body.startsWith("#")) {
      const code = body.startsWith("#x")
        ? Number.parseInt(body.slice(2), 16)
        : Number.parseInt(body.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

function titleOf(html: string) {
  const raw = /<title[^>]*>([\S\s]*?)<\/title>/i.exec(html)?.[1]?.trim();
  return raw === undefined ? null : decodeEntities(raw);
}

/**
 * `innerText` is the closest thing the platform has to "what a crawler
 * extracts": it is layout-driven, so it drops `display: none` and
 * `visibility: hidden` subtrees exactly the way an extractor does, while
 * keeping content that is merely clipped or transparent.
 */
async function renderedText(page: Page) {
  return page.evaluate(() => {
    // Everything here is scoped to <main>, including the polled length: while
    // the loader is up React has not mounted <main> yet, and falling back to
    // `body` would let the poll succeed on the loader's own copy and measure a
    // page that does not exist yet.
    const main = document.querySelector("main");
    return {
      text: main ? main.innerText.trim().length : 0,
      // Scoped to <main>: the footer alone ships ~24 links and 638 characters,
      // so a document-wide count passes even on a page with no body at all.
      mainLinks: document.querySelectorAll("main a[href]").length,
      h1Total: document.querySelectorAll("h1").length,
      h1InMain: document.querySelectorAll("main h1").length,
      title: document.title,
      ariaHiddenBodies: document.querySelectorAll(
        '[class*="experience__body"][aria-hidden="true"], .ss-hv2__body[aria-hidden="true"], footer.ss-footer[aria-hidden="true"]',
      ).length,
      hiddenBodies: [
        ...document.querySelectorAll(
          '[class*="experience__body"], .ss-hv2__body, footer.ss-footer',
        ),
      ].filter((node) => {
        const style = getComputedStyle(node);
        return style.display === "none" || style.visibility === "hidden";
      }).length,
    };
  });
}

for (const path of servedRoutes) {
  test(`served HTML carries the page: ${path}`, async ({ request }) => {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);

    const html = await response.text();
    const main = mainOf(html);

    expect(main, `${path} has no <main>`).not.toBe("");
    expect(stripTags(main).length, path).toBeGreaterThan(THIN_PAGE_FLOOR);
    // Counted in the bytes, not the DOM: the build's own gate counts these too,
    // but only here do we prove the served document agrees with it.
    expect([...main.matchAll(/<h1\b/gi)].length, `${path} <main> h1 count`).toBe(1);
    expect(titleOf(html), `${path} <title>`).toBeTruthy();
  });
}

for (const path of hydratedRoutes) {
  test(`crawlable without interaction: ${path}`, async ({ page, request }) => {
    const servedHtml = await (await request.get(path)).text();
    const servedTitle = titleOf(servedHtml);

    await page.goto(path, { waitUntil: "domcontentloaded" });

    // Deliberately no click, no scroll — this is the crawler's view.
    //
    // Poll for the settled view and then assert on THAT SAME snapshot. Polling
    // one field and re-reading the page for the rest is a race: the poll can
    // succeed against the prerendered subtree in the instant before React
    // replaces it, and the second read then measures a half-mounted tree.
    let proof = await renderedText(page);
    await expect
      .poll(
        async () => {
          proof = await renderedText(page);
          return proof.text > THIN_PAGE_FLOOR && proof.mainLinks > 3;
        },
        { timeout: 20_000 },
      )
      .toBe(true);

    expect(proof.ariaHiddenBodies, path).toBe(0);
    expect(proof.hiddenBodies, path).toBe(0);

    // Hydration must not add a second H1. The route intro splash used to render
    // one (prerendered 1, hydrated 2 on every gated non-home route) and the
    // build gate could not see it, because the gate reads prerendered HTML.
    expect(proof.h1Total, `${path} hydrated h1 count`).toBe(1);
    expect(proof.h1InMain, `${path} hydrated h1 in <main>`).toBe(1);

    // Hydration must not rewrite the page's identity either.
    expect(proof.title, `${path} hydrated <title>`).toBe(servedTitle);
  });
}

/**
 * The other half of the contract. Making the body extractable must not make it
 * reachable: a gated route is still a single screen the visitor cannot scroll
 * past until they open it.
 */
for (const path of ["/", "/services/ai-voice-agents", "/industry/dentists"]) {
  test(`gated intro is still one non-scrollable screen: ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect
      .poll(
        async () =>
          page.evaluate(() =>
            document.documentElement.getAttribute("data-scroll-lock"),
          ),
        { timeout: 20_000 },
      )
      .toBe("on");

    const metrics = await page.evaluate(() => {
      window.scrollTo(0, 5_000);
      return {
        scrollHeight: document.documentElement.scrollHeight,
        viewport: window.innerHeight,
        scrollY: window.scrollY,
      };
    });

    expect(metrics.scrollY).toBe(0);
    // One screen, allowing a couple of pixels of sub-pixel rounding.
    expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.viewport + 4);
  });
}
