// FILE: scripts/validate-pricing-ui-tuning.js
"use strict";

/**
 * Validate that pricing UI tuning requirements are implemented (theme + scroll + badge clearance)
 * without relying on a visual browser run.
 *
 * This validator has two modes:
 * - Default (non-strict): reports warnings but exits 0 (useful during incremental work).
 * - Strict (--strict): missing requirements fail the run with exit code 1 (use at the end).
 *
 * Usage:
 *   node scripts/validate-pricing-ui-tuning.js
 *   node scripts/validate-pricing-ui-tuning.js --strict
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.join(__dirname, "..");

const PATHS = {
  sourceCss: "pricing-widget/src/pricing-widget.css",
  builtCss: "assets/css/pricing-widget.css",
  embedJs: "pricing-widget/src/embed.jsx",
  widgetJsx: "pricing-widget/src/PricingWidget.jsx",
};

const REQUIRED_CSS_MARKERS = [
  "SS_PRICING_SPEC: THEME_LIGHT_MODE_NEON",
  "SS_PRICING_SPEC: SERVICES_SECTION2_INTERNAL_SCROLL",
  "SS_PRICING_SPEC: NICHES_SECTION1_BADGE_TITLE_CLEARANCE",
];

const REQUIRED_JS_MARKER = "SS_PRICING_SPEC: SERVICES_SECTION2_HEIGHT_MATCH";

const REQUIRED_CSS_TOKENS = [
  "--ss-pricing-bg",
  "--ss-pricing-surface",
  "--ss-pricing-text",
  "--ss-pricing-muted",
  "--ss-pricing-border",
  "--ss-pricing-accent",
  "--ss-pricing-accent-2",
  "--ss-pricing-accent-pink",
];

const FORBIDDEN_DARK_TOKENS = [
  "#090a12",
  "#0d0f1b",
  "#0b0c16",
  "#0f111d",
  "#15182a",
  "#111525",
  "#1a1f35",
  "#0a0b16",
];

function exists(relPath) {
  return fs.existsSync(path.join(REPO_ROOT, relPath));
}

function read(relPath) {
  return fs.readFileSync(path.join(REPO_ROOT, relPath), "utf8");
}

function logOk(msg) {
  console.log(`✅ ${msg}`);
}

function logWarn(msg) {
  console.warn(`⚠️  ${msg}`);
}

function logFail(msg) {
  console.error(`❌ ${msg}`);
  process.exitCode = 1;
}

function requireFile(relPath, strict) {
  if (!exists(relPath)) {
    const msg = `Missing required file: ${relPath}`;
    if (strict) logFail(msg);
    else logWarn(msg);
    return false;
  }
  return true;
}

function requireIncludes(text, needle, ctx, strict) {
  if (!text.includes(needle)) {
    const msg = `${ctx}: missing required string: ${JSON.stringify(needle)}`;
    if (strict) logFail(msg);
    else logWarn(msg);
    return false;
  }
  logOk(`${ctx}: found ${JSON.stringify(needle)}`);
  return true;
}

function forbidIncludes(text, needle, ctx, strict) {
  if (text.includes(needle)) {
    const msg = `${ctx}: still contains forbidden legacy dark token: ${JSON.stringify(needle)}`;
    if (strict) logFail(msg);
    else logWarn(msg);
    return false;
  }
  return true;
}

function main() {
  const strict = process.argv.includes("--strict");

  console.log("Pricing UI tuning validation");
  console.log(`Mode: ${strict ? "STRICT" : "non-strict"}`);
  console.log("");

  const haveSourceCss = requireFile(PATHS.sourceCss, strict);
  const haveBuiltCss = requireFile(PATHS.builtCss, strict);

  // JS marker can live in either embed.jsx or PricingWidget.jsx.
  const haveEmbedJs = requireFile(PATHS.embedJs, strict);
  const haveWidgetJsx = requireFile(PATHS.widgetJsx, strict);

  if (!haveSourceCss) {
    console.log("");
    console.log("Done (source CSS missing).");
    process.exit(process.exitCode ? 1 : 0);
  }

  const sourceCss = read(PATHS.sourceCss);

  // ---- Theme marker + tokens ----
  for (const marker of REQUIRED_CSS_MARKERS) {
    requireIncludes(sourceCss, marker, PATHS.sourceCss, strict);
  }

  for (const token of REQUIRED_CSS_TOKENS) {
    requireIncludes(sourceCss, token, PATHS.sourceCss, strict);
  }

  // Ensure we are actually deriving accents from site palette variables.
  requireIncludes(sourceCss, "var(--color-blue", PATHS.sourceCss, strict);
  requireIncludes(sourceCss, "var(--color-purple", PATHS.sourceCss, strict);

  // Encourage removal of legacy dark palette tokens.
  for (const token of FORBIDDEN_DARK_TOKENS) {
    forbidIncludes(sourceCss, token, PATHS.sourceCss, strict);
  }

  // ---- Services Section 2 scroll scoping ----
  // We don't parse full CSS; we assert the scoping attributes exist and overflow is referenced.
  requireIncludes(sourceCss, 'data-ss-pricing-page="services.html"', PATHS.sourceCss, strict);
  requireIncludes(sourceCss, 'data-ss-pricing-section="2"', PATHS.sourceCss, strict);

  const hasOverflowHint = /overflow-y\s*:\s*(auto|scroll)\s*;|overflow\s*:\s*(auto|scroll)\s*;/.test(sourceCss);
  if (!hasOverflowHint) {
    const msg = `${PATHS.sourceCss}: expected an overflow rule (overflow-y: auto/scroll) for the services section 2 internal-scroll requirement.`;
    if (strict) logFail(msg);
    else logWarn(msg);
  } else {
    logOk(`${PATHS.sourceCss}: detected overflow rule for internal scrolling`);
  }

  // ---- Niche Section 1 badge/title clearance scoping ----
  requireIncludes(sourceCss, 'data-ss-pricing-page^="niches/"', PATHS.sourceCss, strict);
  requireIncludes(sourceCss, 'data-ss-pricing-section="1"', PATHS.sourceCss, strict);
  requireIncludes(sourceCss, "ss-pricing__card-title", PATHS.sourceCss, strict);

  // ---- JS height-match marker ----
  let jsMarkerFound = false;
  if (haveEmbedJs) {
    const embedJs = read(PATHS.embedJs);
    if (embedJs.includes(REQUIRED_JS_MARKER)) {
      logOk(`${PATHS.embedJs}: found ${JSON.stringify(REQUIRED_JS_MARKER)}`);
      jsMarkerFound = true;
    }
  }
  if (!jsMarkerFound && haveWidgetJsx) {
    const widgetJsx = read(PATHS.widgetJsx);
    if (widgetJsx.includes(REQUIRED_JS_MARKER)) {
      logOk(`${PATHS.widgetJsx}: found ${JSON.stringify(REQUIRED_JS_MARKER)}`);
      jsMarkerFound = true;
    }
  }
  if (!jsMarkerFound) {
    const msg = `Missing required JS marker "${REQUIRED_JS_MARKER}" in either ${PATHS.embedJs} or ${PATHS.widgetJsx}`;
    if (strict) logFail(msg);
    else logWarn(msg);
  }

  // ---- Built CSS presence / propagation check ----
  if (haveBuiltCss) {
    const builtCss = read(PATHS.builtCss);
    // At minimum, ensure the marker(s) propagate to the built file (copy step).
    requireIncludes(builtCss, "SS_PRICING_SPEC: THEME_LIGHT_MODE_NEON", PATHS.builtCss, strict);
  } else {
    logWarn(`Built CSS missing at ${PATHS.builtCss}; rebuild widget to generate it.`);
  }

  console.log("");
  if (process.exitCode) {
    console.log("Pricing UI tuning validation FAILED.");
    process.exit(1);
  } else {
    console.log("Pricing UI tuning validation PASSED.");
  }
}

main();
