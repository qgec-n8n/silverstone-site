#!/usr/bin/env node
// FILE: scripts/validate-pricing-ui-tuning.js

/**
 * Validates pricing widget requirements for Requested Edits (1–2).
 *
 * Run:
 *   node scripts/validate-pricing-ui-tuning.js --strict
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const strict = process.argv.includes("--strict");

let failures = 0;

function fail(msg) {
  failures += 1;
  console.error(`❌ ${msg}`);
  if (strict) process.exit(1);
}

function ok(msg) {
  console.log(`✅ ${msg}`);
}

function read(relPath) {
  const p = path.join(ROOT, relPath);
  if (!fs.existsSync(p)) fail(`Missing file: ${relPath}`);
  return fs.readFileSync(p, "utf8");
}

function assertIncludes(haystack, needle, msg) {
  if (!haystack.includes(needle)) fail(msg);
}

function assertRegex(haystack, re, msg) {
  if (!re.test(haystack)) fail(msg);
}

/**
 * Ensures a needle appears within N characters of a marker.
 * Used to keep checks reasonably scoped to the intended block.
 */
function assertNear(haystack, marker, needle, windowSize, msg) {
  const idx = haystack.indexOf(marker);
  if (idx === -1) {
    fail(`Missing marker: ${marker}`);
    return;
  }
  const start = Math.max(0, idx - windowSize);
  const end = Math.min(haystack.length, idx + windowSize);
  const slice = haystack.slice(start, end);
  if (!slice.includes(needle)) fail(msg);
}

function validatePoundAlignment(srcCss, builtCss) {
  const marker = "SS_PRICING_SPEC: GBP_SYMBOL_BASELINE_ALIGN";

  assertIncludes(
    srcCss,
    marker,
    "pricing-widget/src/pricing-widget.css must include marker SS_PRICING_SPEC: GBP_SYMBOL_BASELINE_ALIGN."
  );
  assertIncludes(
    builtCss,
    marker,
    "assets/css/pricing-widget.css must include GBP alignment marker (ensure pricing widget was rebuilt)."
  );

  // Baseline alignment intent checks
  assertRegex(
    srcCss,
    /\.ss-pricing__price-digits\s*\{[\s\S]*align-items:\s*baseline\s*;[\s\S]*\}/,
    "pricing-widget.css must set .ss-pricing__price-digits { align-items: baseline; }."
  );
  assertRegex(
    srcCss,
    /\.ss-pricing__price-prefix\s*\{[\s\S]*line-height:\s*1[;\s][\s\S]*\}/,
    "pricing-widget.css must set an explicit line-height on .ss-pricing__price-prefix (expected 1)."
  );

  ok("Edit 1 — GBP symbol baseline alignment validated.");
}

function validateLightModeBackgroundAndCTA(srcCss, builtCss) {
  const bgMarker = "SS_PRICING_SPEC: LIGHT_MODE_BG_BODYSECTION_INSPIRED_NOT_IDENTICAL";
  const ctaMarker = "SS_PRICING_SPEC: CTA_BOOK_CALL_PREMIUM_LIGHT_MODE";

  assertIncludes(
    srcCss,
    bgMarker,
    "pricing-widget/src/pricing-widget.css must include marker SS_PRICING_SPEC: LIGHT_MODE_BG_BODYSECTION_INSPIRED_NOT_IDENTICAL."
  );
  assertIncludes(
    builtCss,
    bgMarker,
    "assets/css/pricing-widget.css must include the light-mode background marker (ensure rebuild)."
  );

  // Page scoping must be explicit
  ["data-ss-pricing-page=\"index.html\"", "data-ss-pricing-page=\"services.html\"", "data-ss-pricing-page=\"niches/"].forEach(
    (needle) => {
      assertIncludes(
        srcCss,
        needle,
        `pricing-widget.css must scope the light-mode theme to pages via selector containing ${needle}.`
      );
    }
  );

  // Light-mode hint: require a white/bright overlay somewhere near the marker.
  assertNear(
    srcCss,
    bgMarker,
    "rgba(255, 255, 255",
    2500,
    "Light-mode pricing background should include a bright/white overlay layer (expected rgba(255, 255, 255, ...)) near the background marker."
  );

  // CTA styling marker + basic intent
  assertIncludes(
    srcCss,
    ctaMarker,
    "pricing-widget/src/pricing-widget.css must include marker SS_PRICING_SPEC: CTA_BOOK_CALL_PREMIUM_LIGHT_MODE."
  );
  assertIncludes(
    builtCss,
    ctaMarker,
    "assets/css/pricing-widget.css must include CTA marker (ensure pricing widget was rebuilt)."
  );

  assertNear(
    srcCss,
    ctaMarker,
    "linear-gradient",
    2200,
    "CTA should use a premium gradient (expected linear-gradient near CTA marker)."
  );

  ok("Edit 2 — Light-mode background (page-scoped) + premium CTA validated.");
}

function validateSparklesVisibility(srcCss, srcJsx, builtCss, builtJs) {
  const marker = "SS_PRICING_SPEC: SPARKLES_HIGH_VISIBILITY_LIGHT_MODE";

  assertIncludes(
    srcCss,
    marker,
    "pricing-widget/src/pricing-widget.css must include marker SS_PRICING_SPEC: SPARKLES_HIGH_VISIBILITY_LIGHT_MODE."
  );
  assertIncludes(
    srcJsx,
    marker,
    "pricing-widget/src/PricingWidget.jsx must include marker SS_PRICING_SPEC: SPARKLES_HIGH_VISIBILITY_LIGHT_MODE."
  );
  assertIncludes(
    builtCss,
    marker,
    "assets/css/pricing-widget.css must include sparkles visibility marker (ensure rebuild)."
  );
  assertIncludes(
    builtJs,
    marker,
    "assets/js/pricing-widget.js must include sparkles visibility marker (ensure rebuild)."
  );

  // Guard against accidental CTA copy change (must remain exactly).
  assertIncludes(
    srcJsx,
    'const BOOK_CTA = "Book a Call";',
    'PricingWidget.jsx must keep BOOK_CTA text exactly "Book a Call".'
  );

  ok("Sparkles visibility + CTA copy guard validated.");
}

function main() {
  const srcCss = read("pricing-widget/src/pricing-widget.css");
  const srcJsx = read("pricing-widget/src/PricingWidget.jsx");
  const builtCss = read("assets/css/pricing-widget.css");
  const builtJs = read("assets/js/pricing-widget.js");

  validatePoundAlignment(srcCss, builtCss);
  validateLightModeBackgroundAndCTA(srcCss, builtCss);
  validateSparklesVisibility(srcCss, srcJsx, builtCss, builtJs);

  if (failures > 0) {
    console.error(`\nFAILED: ${failures} check(s).`);
    process.exit(1);
  }

  ok("All pricing UI validations passed.");
}

main();
