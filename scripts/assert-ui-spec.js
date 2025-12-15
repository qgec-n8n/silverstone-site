// FILE: scripts/assert-ui-spec.js
"use strict";

/**
 * Static, deterministic checks for the CRITICAL UI contracts in ExecPlan.md.
 * This script intentionally validates "proof-of-correctness" signals in source code:
 * - Menu panel directions encoded as translateX(-100%/100%) usage
 * - Extremely slow timing variables (ms) exist and meet minimums
 * - Arrow direction strings for Services and Back are correct
 * - Overlay opacity variable exists and is light
 * - Marquee is not gated behind IntersectionObserver/scroll and marquee images are not lazy-loaded
 *
 * Usage:
 *   node scripts/assert-ui-spec.js --strict
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");

function readText(relPath) {
  const abs = path.join(REPO_ROOT, relPath);
  return fs.readFileSync(abs, "utf8");
}

function exists(relPath) {
  const abs = path.join(REPO_ROOT, relPath);
  return fs.existsSync(abs);
}

function walkFiles(dirRel, predicate) {
  const absDir = path.join(REPO_ROOT, dirRel);
  const out = [];
  (function walk(abs) {
    for (const ent of fs.readdirSync(abs, { withFileTypes: true })) {
      const p = path.join(abs, ent.name);
      if (ent.isDirectory()) walk(p);
      else {
        const rel = path.relative(REPO_ROOT, p).replace(/\\/g, "/");
        if (!predicate || predicate(rel)) out.push(rel);
      }
    }
  })(absDir);
  return out;
}

function fail(msg) {
  console.error(`[assert-ui-spec] FAIL: ${msg}`);
  process.exitCode = 1;
}

function pass(msg) {
  console.log(`[assert-ui-spec] OK: ${msg}`);
}

function parseCssVarNumber(cssText, varName) {
  const re = new RegExp(`--${varName}\\s*:\\s*([0-9]+(?:\\.[0-9]+)?)\\s*;`);
  const m = cssText.match(re);
  if (!m) return null;
  return Number(m[1]);
}

function parseCssVarMs(cssText, varName) {
  // Accept: --name: 1800ms;
  const re = new RegExp(`--${varName}\\s*:\\s*([0-9]+)\\s*ms\\s*;`);
  const m = cssText.match(re);
  if (!m) return null;
  return Number(m[1]);
}

function hasRegex(text, regex) {
  return regex.test(text);
}

function main() {
  const strict = process.argv.includes("--strict");

  if (!strict) {
    console.warn("[assert-ui-spec] WARNING: running without --strict; results still set exit code on failures.");
  }

  // Required file presence (source of truth surfaces)
  const required = [
    "src/js/header-nav.js",
    "src/css/components/header.css",
    "src/css/base/variables.css",
    "src/js/marquee.js",
    "src/js/app.js",
    "src/css/features/marquee.css",
    "src/css/features/parallax.css",
    "src/css/components/faq.css",
  ];

  for (const f of required) {
    if (!exists(f)) fail(`Missing required file: ${f}`);
    else pass(`Found ${f}`);
  }

  // ---- Overlay opacity contract ----
  const variablesCss = exists("src/css/base/variables.css") ? readText("src/css/base/variables.css") : "";
  const overlayVarName = "body-section-overlay-opacity";
  const overlay = parseCssVarNumber(variablesCss, overlayVarName);

  if (overlay === null || Number.isNaN(overlay)) {
    fail(`CSS variable --${overlayVarName} not found in src/css/base/variables.css`);
  } else {
    // Target: 0.22–0.30; allow up to 0.35 to avoid over-failing on tiny adjustments.
    if (overlay > 0.35) fail(`--${overlayVarName} too opaque (${overlay}); must be <= 0.35 (target 0.22–0.30).`);
    else if (overlay < 0.12) fail(`--${overlayVarName} unusually low (${overlay}); expected ~0.22–0.30.`);
    else pass(`Overlay opacity looks reasonable: --${overlayVarName}=${overlay}`);
  }

  // Ensure overlay var is defined exactly once across src/css (no mobile override)
  const cssFiles = walkFiles("src/css", (p) => p.endsWith(".css"));
  let overlayVarOccurrences = 0;
  for (const f of cssFiles) {
    const txt = readText(f);
    const re = new RegExp(`--${overlayVarName}\\s*:`, "g");
    const matches = txt.match(re);
    if (matches) overlayVarOccurrences += matches.length;
  }
  if (overlayVarOccurrences !== 1) {
    fail(`--${overlayVarName} should be defined exactly once across src/css (found ${overlayVarOccurrences}). Avoid mobile overrides.`);
  } else {
    pass(`Overlay variable defined exactly once across src/css`);
  }

  // ---- Mobile nav timing + direction + arrows ----
  const headerCss = exists("src/css/components/header.css") ? readText("src/css/components/header.css") : "";
  const navSlideMsVar = "mobile-nav-panel-slide-ms";
  const navStaggerMsVar = "mobile-nav-item-stagger-ms";
  const navRevealMsVar = "mobile-nav-item-reveal-ms";

  const slideMs = parseCssVarMs(headerCss, navSlideMsVar);
  const staggerMs = parseCssVarMs(headerCss, navStaggerMsVar);
  const revealMs = parseCssVarMs(headerCss, navRevealMsVar);

  if (slideMs === null) fail(`Missing CSS var --${navSlideMsVar} in src/css/components/header.css`);
  else if (slideMs < 1800) fail(`--${navSlideMsVar} too fast (${slideMs}ms). Must be >= 1800ms (EXTREMELY SLOW).`);
  else pass(`Nav slide duration OK: ${slideMs}ms`);

  if (staggerMs === null) fail(`Missing CSS var --${navStaggerMsVar} in src/css/components/header.css`);
  else if (staggerMs < 500) fail(`--${navStaggerMsVar} too fast (${staggerMs}ms). Must be >= 500ms per item (EXTREMELY SLOW).`);
  else pass(`Nav stagger delay OK: ${staggerMs}ms`);

  if (revealMs === null) fail(`Missing CSS var --${navRevealMsVar} in src/css/components/header.css`);
  else if (revealMs < 600) fail(`--${navRevealMsVar} too fast (${revealMs}ms). Must be >= 600ms.`);
  else pass(`Nav reveal duration OK: ${revealMs}ms`);

  // Direction contract: require both left and right offscreen transforms present
  if (!headerCss.includes("translateX(100%)")) {
    fail(`src/css/components/header.css must include translateX(100%) to represent offscreen-right state.`);
  } else {
    pass(`Found translateX(100%) for offscreen-right`);
  }
  if (!headerCss.includes("translateX(-100%)")) {
    fail(`src/css/components/header.css must include translateX(-100%) to represent offscreen-left state.`);
  } else {
    pass(`Found translateX(-100%) for offscreen-left`);
  }

  // Services button must not override font-size (common bug: Services appears smaller)
  // This is a heuristic guardrail: forbid "services" + "font-size" in header.css.
  if (hasRegex(headerCss.toLowerCase(), /services[\s\S]{0,120}font-size/)) {
    fail(`Detected a likely Services-specific font-size override in src/css/components/header.css. Services font must match other buttons exactly.`);
  } else {
    pass(`No Services-specific font-size override detected in header.css`);
  }

  const headerNavJs = exists("src/js/header-nav.js") ? readText("src/js/header-nav.js") : "";

  // Arrow contract: allow either Unicode arrows or ASCII arrows, but enforce direction + placement.
  const servicesOk = hasRegex(headerNavJs, /(?:←|<--)\s*Services/);
  const servicesWrong = hasRegex(headerNavJs, /Services\s*(?:→|-->|->)/);

  if (!servicesOk) fail(`Services button must include a LEFT arrow BEFORE the word (e.g., "← Services" or "<-- Services").`);
  else pass(`Services arrow-before-label contract satisfied`);
  if (servicesWrong) fail(`Services button appears to have a RIGHT arrow after the label. It must be LEFT arrow BEFORE "Services".`);

  const backOk = hasRegex(headerNavJs, /Back\s*(?:→|-->|->)/);
  const backWrong = hasRegex(headerNavJs, /(?:←|<--)\s*Back/);

  if (!backOk) fail(`Back button must include a RIGHT arrow AFTER the word (e.g., "Back →" or "Back -->").`);
  else pass(`Back arrow-after-label contract satisfied`);
  if (backWrong) fail(`Back button appears to have a LEFT arrow before the label. It must be RIGHT arrow AFTER "Back".`);

  // Minimizing banner re-enable delay must be exactly 2000ms after close from Panel 1.
  if (!hasRegex(headerNavJs, /MINIMIZE_REENABLE_DELAY_MS\s*=\s*2000/)) {
    fail(`Missing required constant: MINIMIZE_REENABLE_DELAY_MS = 2000 in src/js/header-nav.js`);
  } else {
    pass(`Found MINIMIZE_REENABLE_DELAY_MS = 2000`);
  }

  // ---- Marquee eager start contract ----
  const marqueeJs = exists("src/js/marquee.js") ? readText("src/js/marquee.js") : "";
  const appJs = exists("src/js/app.js") ? readText("src/js/app.js") : "";

  // Do not gate marquee behind IntersectionObserver or scroll triggers.
  const marqueeCombined = `${marqueeJs}\n${appJs}`;
  if (hasRegex(marqueeCombined, /IntersectionObserver/)) {
    fail(`Marquee must not be gated behind IntersectionObserver. Initialize on page load.`);
  } else {
    pass(`No IntersectionObserver gating detected for marquee`);
  }
  if (hasRegex(marqueeCombined, /addEventListener\(\s*['"]scroll['"]/)) {
    fail(`Marquee must not be initialized/started via scroll handler. It must start on page load.`);
  } else {
    pass(`No scroll-handler gating detected for marquee`);
  }

  // Require some page-load lifecycle hook presence.
  // We accept either: DOMContentLoaded or immediate invocation from app.js.
  const hasDomContentLoaded = hasRegex(marqueeCombined, /DOMContentLoaded/);
  const mentionsMarqueeInit = hasRegex(marqueeCombined, /initMarquee|marquee/i);

  if (!mentionsMarqueeInit) {
    fail(`Expected marquee initialization to be referenced in src/js/app.js and/or src/js/marquee.js (initMarquee / marquee).`);
  } else {
    pass(`Marquee initialization appears referenced`);
  }
  if (!hasDomContentLoaded) {
    fail(`Expected marquee init to be hooked to page load (e.g., DOMContentLoaded). Add an eager page-load init path.`);
  } else {
    pass(`Found DOMContentLoaded hook for eager initialization`);
  }

  // Marquee images must not be lazy-loaded.
  const htmlFiles = walkFiles(".", (p) => p.endsWith(".html") && !p.startsWith("node_modules/"));
  let lazyMarqueeHits = 0;
  for (const f of htmlFiles) {
    const txt = readText(f);
    const hasMarquee = /marquee/i.test(txt);
    const hasLazy = /loading\s*=\s*["']lazy["']/i.test(txt);
    if (hasMarquee && hasLazy) {
      lazyMarqueeHits += 1;
      console.error(`[assert-ui-spec] Marquee file has lazy-loaded images: ${f}`);
    }
  }
  if (lazyMarqueeHits > 0) {
    fail(`Found ${lazyMarqueeHits} HTML file(s) where marquee is present but images are lazy-loaded. Marquee images must load eagerly.`);
  } else {
    pass(`No marquee+lazy-loading conflicts found in HTML`);
  }

  if (process.exitCode && process.exitCode !== 0) {
    console.error("[assert-ui-spec] One or more CRITICAL checks failed.");
    process.exit(process.exitCode);
  } else {
    console.log("[assert-ui-spec] All checks passed.");
  }
}

main();
