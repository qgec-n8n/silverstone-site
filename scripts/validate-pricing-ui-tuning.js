// FILE: scripts/validate-pricing-ui-tuning.js
/**
 * Pricing UI tuning validator (strict by default in Codex workflows).
 *
 * This repo historically used this script to ensure pricing widget styling and
 * per-page scoping rules stay intact. It has been updated to align with the
 * current requested edits (theme update + per-digit price animation).
 *
 * Run:
 *   node scripts/validate-pricing-ui-tuning.js --strict
 */

const fs = require("fs");
const path = require("path");

const STRICT = process.argv.includes("--strict");

function fatal(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`✓ ${msg}`);
}

function readFileOrFatal(rel) {
  const abs = path.join(process.cwd(), rel);
  if (!fs.existsSync(abs)) fatal(`Missing file: ${rel}`);
  return fs.readFileSync(abs, "utf8");
}

// Source + built outputs we validate.
const SRC_CSS = "pricing-widget/src/pricing-widget.css";
const SRC_JSX = "pricing-widget/src/PricingWidget.jsx";
const BUILT_CSS = "assets/css/pricing-widget.css";
const BUILT_JS = "assets/js/pricing-widget.js";

const srcCss = readFileOrFatal(SRC_CSS);
const srcJsx = readFileOrFatal(SRC_JSX);
const builtCss = readFileOrFatal(BUILT_CSS);
const builtJs = readFileOrFatal(BUILT_JS);

// Theme marker: new marker required in strict mode (legacy marker accepted only in non-strict).
const NEW_THEME_MARKER = "SS_PRICING_SPEC: THEME_MATCH_BODY_SECTION_BACKGROUND_2025";
const LEGACY_THEME_MARKER = "SS_PRICING_SPEC: THEME_LIGHT_MODE_NEON";

if (STRICT) {
  if (!srcCss.includes(NEW_THEME_MARKER)) {
    fatal(`Missing required theme marker in ${SRC_CSS}: ${NEW_THEME_MARKER}`);
  }
  if (!builtCss.includes(NEW_THEME_MARKER)) {
    fatal(`Missing required theme marker in ${BUILT_CSS}: ${NEW_THEME_MARKER}`);
  }
} else {
  const hasAnyThemeMarker = srcCss.includes(NEW_THEME_MARKER) || srcCss.includes(LEGACY_THEME_MARKER);
  if (!hasAnyThemeMarker) fatal(`Missing theme marker in ${SRC_CSS}: expected ${NEW_THEME_MARKER} or ${LEGACY_THEME_MARKER}`);
}

ok("Theme marker present (strict: new marker required).");

// Background art requirement (requested edit #7)
const BG_IMAGE = "body-section-background-2025.webp";
if (!srcCss.includes(BG_IMAGE)) fatal(`Expected ${SRC_CSS} to reference ${BG_IMAGE} in widget background.`);
if (!builtCss.includes(BG_IMAGE)) fatal(`Expected ${BUILT_CSS} to reference ${BG_IMAGE} (rebuilt output).`);
ok("Background art reference present in source + built CSS.");

// Sparkles visibility marker (requested edit #7)
const SPARKLES_MARKER = "SS_PRICING_SPEC: SPARKLES_MORE_VISIBLE";
if (!srcCss.includes(SPARKLES_MARKER)) fatal(`Missing sparkles visibility marker in ${SRC_CSS}: ${SPARKLES_MARKER}`);
if (!srcJsx.includes(SPARKLES_MARKER)) fatal(`Missing sparkles visibility marker in ${SRC_JSX}: ${SPARKLES_MARKER}`);
if (!builtCss.includes(SPARKLES_MARKER)) fatal(`Missing sparkles marker in ${BUILT_CSS} (rebuilt output).`);
if (!builtJs.includes(SPARKLES_MARKER)) fatal(`Missing sparkles marker in ${BUILT_JS} (rebuilt output).`);
ok("Sparkles marker present in source + built outputs.");

// Per-digit price scroll (requested edit #8)
const PER_DIGIT_MARKER = "SS_PRICING_SPEC: PRICE_SCROLL_PER_DIGIT";
if (!srcCss.includes(PER_DIGIT_MARKER)) fatal(`Missing per-digit marker in ${SRC_CSS}: ${PER_DIGIT_MARKER}`);
if (!srcJsx.includes(PER_DIGIT_MARKER)) fatal(`Missing per-digit marker in ${SRC_JSX}: ${PER_DIGIT_MARKER}`);
if (!builtCss.includes(PER_DIGIT_MARKER)) fatal(`Missing per-digit marker in ${BUILT_CSS} (rebuilt output).`);
if (!builtJs.includes(PER_DIGIT_MARKER)) fatal(`Missing per-digit marker in ${BUILT_JS} (rebuilt output).`);
ok("Per-digit marker present in source + built outputs.");

// Ensure legacy whole-number roll is removed
const LEGACY_ROLL_MARKER = "SS_PRICING_SPEC: PRICE_SCROLL_ANIMATION";
if (srcCss.includes(LEGACY_ROLL_MARKER)) fatal(`Legacy marker must be removed from ${SRC_CSS}: ${LEGACY_ROLL_MARKER}`);
if (srcCss.includes("ss-pricing__price-roll")) fatal(`Legacy .ss-pricing__price-roll styles must be removed from ${SRC_CSS}.`);
if (srcJsx.includes("ss-pricing__price-roll")) fatal(`Legacy .ss-pricing__price-roll usage must be removed from ${SRC_JSX}.`);
ok("Legacy whole-number roll removed.");

// Token sanity: keep using site accent variables; avoid hard-coded dark theme tokens.
const REQUIRED_TOKENS = [
  "--ss-pricing-text",
  "--ss-pricing-muted",
  "var(--color-blue)",
  "var(--color-purple)",
];

REQUIRED_TOKENS.forEach((token) => {
  if (!srcCss.includes(token)) fatal(`Missing required token/reference in ${SRC_CSS}: ${token}`);
});

const DISALLOWED_TOKENS = [
  // dark-on-light legacy tokens we explicitly don't want to reintroduce
  "#0b0c10",
  "#111827",
  "#0f172a",
  "#0a0f1a",
  "#0b1220",
  "#0a0b10",
  "#101014",
];

DISALLOWED_TOKENS.forEach((token) => {
  if (srcCss.includes(token)) fatal(`Disallowed token found in ${SRC_CSS}: ${token}`);
  if (builtCss.includes(token)) fatal(`Disallowed token found in ${BUILT_CSS} (rebuilt output): ${token}`);
});

ok("Token sanity checks passed.");

// Ensure the widget still contains page-scoping attributes in built CSS (important for multi-page embedding).
const REQUIRED_SCOPING_ATTRIBUTES = [
  'data-ss-pricing-page="index.html"',
  'data-ss-pricing-page="services.html"',
  'data-ss-pricing-page="book.html"',
  'data-ss-pricing-page="contact.html"',
  'data-ss-pricing-page="about.html"',
  'data-ss-pricing-page="niches/',
];

REQUIRED_SCOPING_ATTRIBUTES.forEach((attr) => {
  if (!builtCss.includes(attr)) fatal(`Missing expected page scoping in ${BUILT_CSS}: ${attr}`);
});

ok("Page scoping attributes present in built CSS.");

console.log("✅ Pricing UI tuning validations passed.");
