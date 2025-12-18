# FILE: scripts/validate-site-ui-fixes.js
/**
 * Validator for the Site UI Fixes spec.
 *
 * Usage:
 *   node scripts/validate-site-ui-fixes.js
 *   node scripts/validate-site-ui-fixes.js --strict
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const STRICT = process.argv.includes("--strict");

function read(p) {
  return fs.readFileSync(path.join(process.cwd(), p), "utf8");
}
function exists(p) {
  return fs.existsSync(path.join(process.cwd(), p));
}

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function warn(msg) {
  if (STRICT) fail(msg);
  console.warn(`WARN: ${msg}`);
}

function assertIncludes(haystack, needle, msg) {
  if (!haystack.includes(needle)) fail(msg);
}

function assertRegex(text, re, msg) {
  if (!re.test(text)) fail(msg);
}

function listNichePages() {
  const dir = path.join(process.cwd(), "niches");
  if (!fs.existsSync(dir)) fail("Missing niches/ directory.");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => path.join("niches", f));
}

// --------- Checks ---------

function checkHeroShaderVariants() {
  const mainPages = ["index.html", "about.html", "services.html", "book.html", "contact.html"];
  for (const p of mainPages) {
    if (!exists(p)) fail(`Missing ${p}`);
    const html = read(p);
    assertIncludes(html, 'id="hero-shader-canvas"', `${p}: missing #hero-shader-canvas`);
    if (!html.includes('data-variant="blue"')) {
      fail(`${p}: hero shader must be BLUE (expected data-variant="blue")`);
    }
  }

  for (const p of listNichePages()) {
    const html = read(p);
    assertIncludes(html, 'id="hero-shader-canvas"', `${p}: missing #hero-shader-canvas`);
    if (!html.includes('data-variant="purple"')) {
      fail(`${p}: hero shader must be PURPLE (expected data-variant="purple")`);
    }
  }
}

function checkSpacingTokensAndUsage() {
  const variables = read("src/css/base/variables.css");
  assertIncludes(variables, "--section-pad-y-desktop", "variables.css: missing --section-pad-y-desktop");
  assertIncludes(variables, "--section-pad-y-mobile", "variables.css: missing --section-pad-y-mobile");
  assertIncludes(variables, "--section-pad-y-tight", "variables.css: missing --section-pad-y-tight");

  const layout = read("src/css/base/layout.css");
  assertRegex(
    layout,
    /\.section\s*\{[\s\S]*padding\s*:\s*var\(--section-pad-y-desktop\)\s+0\s*;[\s\S]*\}/m,
    "layout.css: .section must use padding: var(--section-pad-y-desktop) 0;"
  );
  assertIncludes(layout, ".section.tight-bottom", "layout.css: missing .section.tight-bottom utility");
  assertIncludes(layout, ".section.tight-top", "layout.css: missing .section.tight-top utility");
  assertRegex(
    layout,
    /\.section\.tight-bottom\s*\{[\s\S]*padding-bottom\s*:\s*var\(--section-pad-y-tight\)\s*;/m,
    "layout.css: .section.tight-bottom must use var(--section-pad-y-tight)"
  );
  assertRegex(
    layout,
    /\.section\.tight-top\s*\{[\s\S]*padding-top\s*:\s*var\(--section-pad-y-tight\)\s*;/m,
    "layout.css: .section.tight-top must use var(--section-pad-y-tight)"
  );

  const typography = read("src/css/base/typography.css");
  // Require mobile section padding to be tied to the token, not a hardcoded number.
  assertRegex(
    typography,
    /@media\s*\(max-width:\s*768px\)[\s\S]*\.section\s*\{[\s\S]*padding\s*:\s*var\(--section-pad-y-mobile\)\s+0\s*;/m,
    "typography.css: mobile .section padding must use var(--section-pad-y-mobile) 0;"
  );
}

function checkTightBoundaryClasses() {
  // Services boundaries: apply tight-bottom on 2,3,4,5,8,9 and tight-top on 3,4,5,6,9,10 (section numbers include hero=1)
  const services = read("services.html");
  const servicesSections = services.match(/<section\b[^>]*>/g) || [];
  if (servicesSections.length < 10) {
    fail(`services.html: expected >= 10 <section> blocks, found ${servicesSections.length}`);
  }

  function secHas(idx1based, cls) {
    const tag = servicesSections[idx1based - 1];
    return tag && tag.includes(cls);
  }

  const sTightBottom = [2, 3, 4, 5, 8, 9];
  const sTightTop = [3, 4, 5, 6, 9, 10];

  for (const n of sTightBottom) {
    if (!secHas(n, "tight-bottom")) fail(`services.html: section #${n} must include class 'tight-bottom'`);
  }
  for (const n of sTightTop) {
    if (!secHas(n, "tight-top")) fail(`services.html: section #${n} must include class 'tight-top'`);
  }

  // Niche boundaries: tight-bottom on 2,3,4,5,8 and tight-top on 3,4,5,6,9
  for (const p of listNichePages()) {
    const html = read(p);
    const secs = html.match(/<section\b[^>]*>/g) || [];
    if (secs.length < 9) fail(`${p}: expected >= 9 <section> blocks, found ${secs.length}`);

    function nHas(idx1based, cls) {
      const tag = secs[idx1based - 1];
      return tag && tag.includes(cls);
    }

    const nTightBottom = [2, 3, 4, 5, 8];
    const nTightTop = [3, 4, 5, 6, 9];

    for (const n of nTightBottom) {
      if (!nHas(n, "tight-bottom")) fail(`${p}: section #${n} must include class 'tight-bottom'`);
    }
    for (const n of nTightTop) {
      if (!nHas(n, "tight-top")) fail(`${p}: section #${n} must include class 'tight-top'`);
    }
  }
}

function checkDesktopServicesHoverCorridor() {
  const headerCss = read("src/css/components/header.css");
  // Require a hover-bridge pseudo element for the gap
  assertRegex(
    headerCss,
    /\.services-menu::before\s*\{[\s\S]*content\s*:\s*["']{0,1}["']{0,1}\s*;[\s\S]*top\s*:\s*-/m,
    "header.css: must implement .services-menu::before hover bridge with negative top"
  );

  const headerJs = read("src/js/header-nav.js");
  // Require hover open handlers (desktop only) on services dropdown
  const hasHoverOpen =
    headerJs.includes("pointerenter") ||
    headerJs.includes("mouseenter");

  if (!hasHoverOpen) {
    fail("header-nav.js: must implement desktop hover open behavior (pointerenter/mouseenter)");
  }

  // Require explicit wording/marker so we know Codex implemented corridor logic intentionally
  if (!headerJs.includes("hover corridor") && !headerJs.includes("hover-bridge") && !headerJs.includes("hover corridor".toUpperCase())) {
    warn("header-nav.js: missing explicit 'hover corridor' marker comment (recommended for maintainability)");
  }
}

function checkMobileMarqueeAlwaysLoaded() {
  const marqueeJs = read("src/js/marquee.js");
  const marqueeCss = read("src/css/features/marquee.css");

  // Require generated manifest markers OR generator check to succeed
  if (!marqueeJs.includes("BEGIN GENERATED MARQUEE BASES") || !marqueeJs.includes("END GENERATED MARQUEE BASES")) {
    fail("marquee.js: missing generated manifest markers (BEGIN/END GENERATED MARQUEE BASES)");
  }

  // Ensure generator check passes
  try {
    execSync("node scripts/generate-marquee-manifest.js --check", { stdio: "pipe" });
  } catch (e) {
    fail("Marquee manifest does not match assets/images/socialmedia. Run: node scripts/generate-marquee-manifest.js");
  }

  // Must have a shuffle step
  if (!marqueeJs.toLowerCase().includes("fisher") && !marqueeJs.toLowerCase().includes("shuffle")) {
    fail("marquee.js: must shuffle marquee images (Fisher–Yates or equivalent), not rely on a fixed grouped order");
  }

  // Mobile ready gate: require decode/preload gating + CSS play-state gate
  if (!marqueeJs.includes(".decode(") && !marqueeJs.includes("decode()")) {
    fail("marquee.js: must decode/preload marquee images on mobile before starting animation (expected img.decode usage)");
  }
  if (!marqueeJs.includes("marquee-ready")) {
    fail("marquee.js: must add a 'marquee-ready' (or equivalent) class/state after mobile preload completes");
  }
  if (!marqueeCss.includes("animation-play-state")) {
    fail("marquee.css: must gate marquee animation-play-state for the mobile preload/ready flow");
  }
  if (!marqueeCss.includes("marquee-ready")) {
    fail("marquee.css: must include a .marquee-ready selector to enable animation once images are ready");
  }
}

function checkServicesCoreBundleHeading() {
  const services = read("services.html");
  const idx = services.toLowerCase().indexOf("core bundle bullets");
  if (idx === -1) fail("services.html: could not find 'Core bundle bullets' text");

  // Enforce two-line span pattern in proximity to the heading
  const slice = services.slice(Math.max(0, idx - 600), idx + 1200);

  if (!slice.includes("Core Bundle Bullets:")) {
    fail("services.html: must contain exact line: 'Core Bundle Bullets:'");
  }
  if (!slice.includes("(applies across packs)")) {
    fail("services.html: must contain exact line: '(applies across packs)'");
  }

  // Must reuse the same inline style approach used by 'General Service Lines' (display:block + var(--color-primary)/var(--color-white))
  if (!slice.includes("display: block") && !slice.includes("display:block")) {
    fail("services.html: Core Bundle Bullets heading must use the same display:block line-break technique as General Service Lines");
  }
  if (!slice.includes("var(--color-primary)")) {
    fail("services.html: Core Bundle Bullets line 1 must reuse var(--color-primary) token (blue heading token used elsewhere)");
  }
  if (!slice.includes("var(--color-white)")) {
    fail("services.html: Core Bundle Bullets line 2 must reuse var(--color-white) token (white subtext token used elsewhere)");
  }
}

function main() {
  console.log(`validate-site-ui-fixes.js (${STRICT ? "strict" : "non-strict"})`);

  // Core checks aligned to the user’s new emphasis
  checkDesktopServicesHoverCorridor();
  checkSpacingTokensAndUsage();
  checkTightBoundaryClasses();
  checkMobileMarqueeAlwaysLoaded();

  // Remaining important spec checks
  checkHeroShaderVariants();
  checkServicesCoreBundleHeading();

  console.log("OK: site UI fixes validation passed.");
}

main();
