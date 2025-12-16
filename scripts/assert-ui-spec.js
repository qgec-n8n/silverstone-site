// FILE: scripts/assert-ui-spec.js
"use strict";

/**
 * Static, deterministic checks for the CRITICAL UI contracts in ExecPlan.md.
 *
 * This script validates "proof-of-correctness" signals in source code:
 * - Panel direction transforms include both translateX(100%) and translateX(-100%)
 * - Timing variables exist and meet minimums (slow-but-not-overly-slow)
 * - Arrow direction strings for Services and Back are correct
 * - Overlay opacity variable exists and is light, defined once (no mobile override)
 * - Marquee not gated behind touch/scroll/IntersectionObserver and images not lazy-loaded
 * - SPEC markers exist for the additional page-polish requirements
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
  if (!strict) console.warn("[assert-ui-spec] WARNING: running without --strict; failures still set exit code.");

  // Required file presence (source surfaces)
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

  // ---- SPEC marker enforcement ----
  const specMarkers = [
    "SPEC: MOBILE_NAV_TIMINGS_TUNED",
    "SPEC: DESKTOP_NAV_SERVICES_FONT_PARITY",
    "SPEC: MOBILE_NAV_P1_SERVICES_FONT_PARITY",
    "SPEC: INDEX_SMALL_BIZ_KPI_BLUE_TITLES",
    "SPEC: INDEX_SMALL_BIZ_FOOTNOTE_GREY",
    "SPEC: INDEX_STREAMLINE_CARDS_CENTER_MOBILE",
    "SPEC: ABOUT_VALUES_CARDS_CENTER_MOBILE",
    "SPEC: ABOUT_WHAT_DRIVES_US_IMAGES_VISIBLE_MOBILE",
    "SPEC: SERVICES_CTA_KPI_TITLES_BLUE",
    "SPEC: SERVICES_CTA_KPI_BODY_LEFT_ALIGN",
    "SPEC: MARQUEE_NO_TOUCH_REQUIRED",
  ];

  const srcFiles = walkFiles("src", (p) => p.endsWith(".js") || p.endsWith(".css") || p.endsWith(".html"));
  const srcCombined = srcFiles.map((f) => readText(f)).join("\n");

  for (const marker of specMarkers) {
    if (!srcCombined.includes(marker)) fail(`Missing required SPEC marker: "${marker}" (must appear in src/ near the actual change).`);
    else pass(`Found marker: ${marker}`);
  }

  // ---- Overlay opacity contract ----
  const variablesCss = readText("src/css/base/variables.css");
  const overlayVarName = "body-section-overlay-opacity";
  const overlay = parseCssVarNumber(variablesCss, overlayVarName);

  if (overlay === null || Number.isNaN(overlay)) {
    fail(`CSS variable --${overlayVarName} not found in src/css/base/variables.css`);
  } else {
    // Target: 0.22–0.30; allow up to 0.35.
    if (overlay > 0.35) fail(`--${overlayVarName} too opaque (${overlay}); must be <= 0.35 (target 0.22–0.30).`);
    else if (overlay < 0.12) fail(`--${overlayVarName} unusually low (${overlay}); expected ~0.22–0.30.`);
    else pass(`Overlay opacity OK: --${overlayVarName}=${overlay}`);
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
    fail(`--${overlayVarName} must be defined exactly once across src/css (found ${overlayVarOccurrences}). Avoid mobile overrides.`);
  } else {
    pass(`Overlay variable defined exactly once across src/css`);
  }

  // ---- Mobile nav timing + direction + arrows ----
  const headerCss = readText("src/css/components/header.css");
  const navSlideMsVar = "mobile-nav-panel-slide-ms";
  const navStaggerMsVar = "mobile-nav-item-stagger-ms";
  const navRevealMsVar = "mobile-nav-item-reveal-ms";

  const slideMs = parseCssVarMs(headerCss, navSlideMsVar);
  const staggerMs = parseCssVarMs(headerCss, navStaggerMsVar);
  const revealMs = parseCssVarMs(headerCss, navRevealMsVar);

  // Updated minimums per user feedback: still slow, but not overly slow.
  if (slideMs === null) fail(`Missing CSS var --${navSlideMsVar} in src/css/components/header.css`);
  else if (slideMs < 1200) fail(`--${navSlideMsVar} too fast (${slideMs}ms). Must be >= 1200ms.`);
  else pass(`Nav slide duration OK: ${slideMs}ms`);

  if (staggerMs === null) fail(`Missing CSS var --${navStaggerMsVar} in src/css/components/header.css`);
  else if (staggerMs < 250) fail(`--${navStaggerMsVar} too fast (${staggerMs}ms). Must be >= 250ms per item.`);
  else pass(`Nav stagger delay OK: ${staggerMs}ms`);

  if (revealMs === null) fail(`Missing CSS var --${navRevealMsVar} in src/css/components/header.css`);
  else if (revealMs < 400) fail(`--${navRevealMsVar} too fast (${revealMs}ms). Must be >= 400ms.`);
  else pass(`Nav reveal duration OK: ${revealMs}ms`);

  // Direction contract: require both left and right offscreen transforms present
  if (!headerCss.includes("translateX(100%)")) fail(`header.css must include translateX(100%) for offscreen-right.`);
  else pass(`Found translateX(100%) for offscreen-right`);

  if (!headerCss.includes("translateX(-100%)")) fail(`header.css must include translateX(-100%) for offscreen-left.`);
  else pass(`Found translateX(-100%) for offscreen-left`);

  // Services button must not have a special font-size or bold override.
  const headerCssLower = headerCss.toLowerCase();
  if (hasRegex(headerCssLower, /services[\s\S]{0,160}font-size/)) {
    fail(`Detected a likely Services-specific font-size override in header.css. Services must match other buttons exactly.`);
  } else {
    pass(`No Services-specific font-size override detected in header.css`);
  }
  if (hasRegex(headerCssLower, /services[\s\S]{0,160}font-weight/)) {
    fail(`Detected a likely Services-specific font-weight override in header.css. Services must not be bold and must match others.`);
  } else {
    pass(`No Services-specific font-weight override detected in header.css`);
  }

  const headerNavJs = readText("src/js/header-nav.js");

  // Arrow contract: accept Unicode arrows or ASCII arrow sequences.
  const servicesOk = hasRegex(headerNavJs, /(?:←|<--)\s*Services/);
  const servicesWrong = hasRegex(headerNavJs, /Services\s*(?:→|-->|->)/);
  if (!servicesOk) fail(`Services must include LEFT arrow BEFORE label (e.g., "← Services" or "<-- Services").`);
  else pass(`Services arrow-before-label OK`);
  if (servicesWrong) fail(`Services appears to have RIGHT arrow after label. Must be LEFT arrow BEFORE "Services".`);

  const backOk = hasRegex(headerNavJs, /Back\s*(?:→|-->|->)/);
  const backWrong = hasRegex(headerNavJs, /(?:←|<--)\s*Back/);
  if (!backOk) fail(`Back must include RIGHT arrow AFTER label (e.g., "Back →" or "Back -->").`);
  else pass(`Back arrow-after-label OK`);
  if (backWrong) fail(`Back appears to have LEFT arrow before label. Must be RIGHT arrow AFTER "Back".`);

  // Minimizing banner re-enable delay must be exactly 2000ms after close from Panel 1.
  if (!hasRegex(headerNavJs, /MINIMIZE_REENABLE_DELAY_MS\s*=\s*2000/)) {
    fail(`Missing required constant: MINIMIZE_REENABLE_DELAY_MS = 2000 in src/js/header-nav.js`);
  } else {
    pass(`Found MINIMIZE_REENABLE_DELAY_MS = 2000`);
  }

  // ---- Marquee eager start + no-touch-required contract ----
  const marqueeJs = readText("src/js/marquee.js");
  const appJs = readText("src/js/app.js");
  const marqueeCombined = `${marqueeJs}\n${appJs}`;

  // No IntersectionObserver gating
  if (hasRegex(marqueeCombined, /IntersectionObserver/)) fail(`Marquee must not be gated behind IntersectionObserver; initialize on page load.`);
  else pass(`No IntersectionObserver gating detected for marquee`);

  // No scroll gating
  if (hasRegex(marqueeCombined, /addEventListener\(\s*['"]scroll['"]/)) fail(`Marquee must not be initialized/started via scroll handler.`);
  else pass(`No scroll-handler gating detected for marquee`);

  // No touch/pointer gating (heuristic)
  if (hasRegex(marqueeCombined, /(touchstart|pointerdown|touchend|touchmove)/i)) {
    fail(`Marquee appears to reference touch/pointer events in marquee init path. It must not require touch to display/start.`);
  } else {
    pass(`No touch/pointer gating detected for marquee`);
  }

  // Require eager lifecycle hook
  const hasDomContentLoaded = hasRegex(marqueeCombined, /DOMContentLoaded/);
  const mentionsMarqueeInit = hasRegex(marqueeCombined, /initMarquee|marquee/i);
  if (!mentionsMarqueeInit) fail(`Expected marquee initialization reference in app.js/marquee.js (initMarquee / marquee).`);
  else pass(`Marquee initialization appears referenced`);
  if (!hasDomContentLoaded) fail(`Expected marquee init hooked to page load (e.g., DOMContentLoaded).`);
  else pass(`Found DOMContentLoaded hook for marquee`);

  // Marquee CSS should not pause animations by default (heuristic)
  const marqueeCss = readText("src/css/features/marquee.css");
  if (hasRegex(marqueeCss, /animation-play-state\s*:\s*paused/i)) {
    fail(`Marquee CSS sets animation-play-state: paused. It must run by default without interaction.`);
  } else {
    pass(`No animation-play-state: paused found in marquee CSS`);
  }

  // Marquee images must not be lazy-loaded in HTML
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
  if (lazyMarqueeHits > 0) fail(`Found ${lazyMarqueeHits} HTML file(s) where marquee is present but images are lazy-loaded. Must load eagerly.`);
  else pass(`No marquee+lazy-loading conflicts found in HTML`);

  if (process.exitCode && process.exitCode !== 0) {
    console.error("[assert-ui-spec] One or more checks failed.");
    process.exit(process.exitCode);
  } else {
    console.log("[assert-ui-spec] All checks passed.");
  }
}

main();
