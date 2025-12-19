// FILE: scripts/validate-requested-edits.js
"use strict";

/**
 * Deterministic validator for Requested Website Edits (1–8).
 *
 * Usage:
 *   node scripts/validate-requested-edits.js --strict
 *
 * This is intentionally static (no browser) and relies on:
 * - exact copy checks where specified
 * - selector/attribute existence checks
 * - required marker comments in source + built assets
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.join(__dirname, "..");

function fatal(message) {
  console.error(`\n❌ Requested-edits validation failed: ${message}\n`);
  process.exit(1);
}

function readText(relPath) {
  const abs = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(abs)) fatal(`File not found: ${relPath}`);
  return fs.readFileSync(abs, "utf8");
}

function exists(relPath) {
  return fs.existsSync(path.join(REPO_ROOT, relPath));
}

function assertIncludes(haystack, needle, ctx) {
  if (!haystack.includes(needle)) fatal(`${ctx}: expected to include ${JSON.stringify(needle)}`);
}

function assertNotIncludes(haystack, needle, ctx) {
  if (haystack.includes(needle)) fatal(`${ctx}: must not include ${JSON.stringify(needle)}`);
}

function assertRegex(haystack, regex, ctx, label) {
  if (!regex.test(haystack)) fatal(`${ctx}: missing expected pattern (${label}): ${regex}`);
}

function listNichePages() {
  const dir = path.join(REPO_ROOT, "niches");
  if (!fs.existsSync(dir)) fatal("Missing niches/ directory");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => `niches/${f}`);
}

function parseSecondsFromRule(text, regex, ctx, label) {
  const m = text.match(regex);
  if (!m) fatal(`${ctx}: could not find ${label} using ${regex}`);
  const seconds = Number(m[1]);
  if (!Number.isFinite(seconds)) fatal(`${ctx}: ${label} seconds not numeric`);
  return seconds;
}

function validateAbout() {
  const ctx = "about.html";
  const html = readText("about.html");

  assertIncludes(html, "Experience by the Numbers", ctx);

  // Edit 1: card replacement
  assertNotIncludes(html, "Years Combined Experience", ctx);
  assertIncludes(html, "Minute Automation Audit", ctx);
  assertIncludes(html, 'data-target="30"', ctx);

  // Edit 3: counter gating only on about + index
  assertRegex(
    html,
    /class="[^"]*\bstats\b[^"]*"[^>]*data-counter="on"|data-counter="on"[^>]*class="[^"]*\bstats\b[^"]*"/,
    ctx,
    'stats container has data-counter="on"'
  );
}

function validateIndexStatsSection() {
  const ctx = "index.html";
  const html = readText("index.html");

  // Old block must be removed
  assertNotIncludes(html, "Proof in Numbers", ctx);

  // New copy (exact title + sentence)
  assertIncludes(html, "No hype. Just measurable wins.", ctx);
  assertIncludes(
    html,
    "If you’re sceptical about AI, start with the basics: we build simple automation that answers calls, follows up leads and chases admin in the background, so small teams can win back time, reduce no-shows and respond instantly — even outside office hours.",
    ctx
  );

  // Must use stats styling + counter opt-in
  assertRegex(
    html,
    /class="[^"]*\bstats\b[^"]*"[^>]*data-counter="on"|data-counter="on"[^>]*class="[^"]*\bstats\b[^"]*"/,
    ctx,
    'stats container has data-counter="on"'
  );
  assertRegex(html, /class="[^"]*\bneon-card\b[^"]*\bstat\b[^"]*"/, ctx, "stat card class includes neon-card and stat");

  // Targets
  ["525600", "780", "100", "80"].forEach((n) => assertIncludes(html, `data-target="${n}"`, ctx));

  // Labels
  [
    "Minutes of Always-On Coverage",
    "Potential Hours Reclaimed Per Year",
    "Times Better Contact Odds in 5 Minutes",
    "Callers Lost to Voicemail",
  ].forEach((label) => assertIncludes(html, label, ctx));
}

function validateNichesNoCounters() {
  const pages = listNichePages();
  pages.forEach((p) => {
    const html = readText(p);
    const ctx = p;
    assertNotIncludes(html, 'data-counter="on"', ctx);
    assertRegex(
      html,
      /class="[^"]*\bstats\b[^"]*"[^>]*data-counter="off"|data-counter="off"[^>]*class="[^"]*\bstats\b[^"]*"/,
      ctx,
      'niche stats container has data-counter="off"'
    );
  });
}

function validateStatsJs() {
  const ctx = "src/js/stats.js";
  const js = readText(ctx);

  assertIncludes(js, "SS_STATS_SPEC: COUNTER_ANIMATION_ABOUT_INDEX_ONLY", ctx);
  // Must explicitly gate to data-counter="on"
  assertRegex(js, /\[data-counter=["']on["']\]|data-counter\s*===[\s\S]*["']on["']|dataset\.counter[\s\S]*on/, ctx, "gating to data-counter=on");
  // Must support reduced motion
  assertRegex(js, /prefers-reduced-motion|matchMedia\(.+reduce/, ctx, "reduced motion handling");

  // Built JS must include marker (ensures rebuild happened)
  if (!exists("assets/js/app.js")) fatal("Missing built asset: assets/js/app.js (run node scripts/build-js.js)");
  const built = readText("assets/js/app.js");
  assertIncludes(built, "SS_STATS_SPEC: COUNTER_ANIMATION_ABOUT_INDEX_ONLY", "assets/js/app.js");
}

function validateParallaxJsNicheMobileParity() {
  const ctx = "src/js/parallax.js";
  const js = readText(ctx);

  // Marker (Edit 8)
  assertIncludes(js, "SS_PARALLAX_SPEC: NICHE_MOBILE_BG_PARITY", ctx);

  // Must reference the background file name
  assertIncludes(js, "body-section-background-2025.webp", ctx);
  assertIncludes(js, "body_section_parallax", ctx);

  // Must not use the fragile document-relative asset path (breaks on /niches/*)
  assertNotIncludes(js, "assets/images/body_section_parallax/body-section-background-2025.webp", ctx);

  // Must use robust URL resolution and script-based base
  assertRegex(js, /new\s+URL\(/, ctx, "URL constructor usage");
  assertRegex(js, /currentScript|document\.scripts/, ctx, "script-based base URL resolution");

  // Image file must exist
  if (!exists("assets/images/body_section_parallax/body-section-background-2025.webp")) {
    fatal("Missing image asset: assets/images/body_section_parallax/body-section-background-2025.webp");
  }

  // Built JS must include marker (ensures rebuild happened)
  const built = readText("assets/js/app.js");
  assertIncludes(built, "SS_PARALLAX_SPEC: NICHE_MOBILE_BG_PARITY", "assets/js/app.js");
}

function validateMarqueeSpeeds() {
  const ctx = "src/css/features/marquee.css";
  const css = readText(ctx);

  assertIncludes(css, "SS_MARQUEE_SPEC: SPEEDS_SLOWER_SINGLE_DOUBLE", ctx);

  const single = parseSecondsFromRule(
    css,
    /\.single-marquee\s+\.marquee-track[\s\S]*?animation:\s*marquee-scroll-left\s+([0-9]+)s\s+linear\s+infinite\s*;/,
    ctx,
    "single marquee duration"
  );
  if (single !== 120) fatal(`${ctx}: single marquee duration must be 120s, got ${single}s`);

  const fast = parseSecondsFromRule(
    css,
    /\.double-marquee\s+\.marquee-track\.fast\s*\{\s*animation-duration:\s*([0-9]+)s\s*;\s*\}/,
    ctx,
    "double marquee fast duration"
  );
  const slow = parseSecondsFromRule(
    css,
    /\.double-marquee\s+\.marquee-track\.slow\s*\{\s*animation-duration:\s*([0-9]+)s\s*;\s*\}/,
    ctx,
    "double marquee slow duration"
  );
  if (fast !== 90) fatal(`${ctx}: double marquee fast duration must be 90s, got ${fast}s`);
  if (slow !== 150) fatal(`${ctx}: double marquee slow duration must be 150s, got ${slow}s`);
  if (!(fast < slow)) fatal(`${ctx}: expected fast (${fast}s) < slow (${slow}s)`);

  // Built CSS must include marker + durations (ensures rebuild happened)
  if (!exists("assets/css/styles.css")) fatal("Missing built asset: assets/css/styles.css (run node build-css.js)");
  const built = readText("assets/css/styles.css");
  assertIncludes(built, "SS_MARQUEE_SPEC: SPEEDS_SLOWER_SINGLE_DOUBLE", "assets/css/styles.css");
  assertIncludes(built, "animation-duration: 90s", "assets/css/styles.css");
  assertIncludes(built, "animation-duration: 150s", "assets/css/styles.css");
  assertIncludes(built, "marquee-scroll-left 120s", "assets/css/styles.css");
}

function validatePricingIndexSection2ScrollAndHeightMatch() {
  const cssPath = "pricing-widget/src/pricing-widget.css";
  const jsPath = "pricing-widget/src/embed.jsx";
  const builtCssPath = "assets/css/pricing-widget.css";
  const builtJsPath = "assets/js/pricing-widget.js";

  if (!exists(cssPath)) fatal(`Missing ${cssPath}`);
  if (!exists(jsPath)) fatal(`Missing ${jsPath}`);

  const css = readText(cssPath);
  const js = readText(jsPath);

  assertIncludes(css, "SS_PRICING_SPEC: INDEX_SECTION2_INTERNAL_SCROLL", cssPath);
  assertIncludes(js, "SS_PRICING_SPEC: INDEX_SECTION2_HEIGHT_MATCH", jsPath);

  // Must scope to index.html section 2
  assertIncludes(css, 'data-ss-pricing-page="index.html"', cssPath);
  assertIncludes(css, 'data-ss-pricing-section="2"', cssPath);
  assertRegex(
    css,
    /index\.html"\]\[data-ss-pricing-section="2"\][\s\S]*?\.ss-pricing__includes-body[\s\S]*?overflow-y:\s*auto\s*;/,
    cssPath,
    "index section2 includes-body overflow-y:auto"
  );
  assertRegex(
    css,
    /index\.html"\]\[data-ss-pricing-section="2"\][\s\S]*?height:\s*var\(--ss-pricing-match-height,\s*auto\)\s*;/,
    cssPath,
    "index section2 card height var"
  );

  // Height match JS must reference index.html
  assertIncludes(js, 'data-ss-pricing-page="index.html"', jsPath);
  assertIncludes(js, "--ss-pricing-match-height", jsPath);

  // Built assets must exist + include index rules (ensures rebuild happened)
  if (!exists(builtCssPath)) fatal(`Missing built asset: ${builtCssPath} (build pricing widget)`);
  if (!exists(builtJsPath)) fatal(`Missing built asset: ${builtJsPath} (build pricing widget)`);

  const builtCss = readText(builtCssPath);
  assertIncludes(builtCss, "SS_PRICING_SPEC: INDEX_SECTION2_INTERNAL_SCROLL", builtCssPath);
  assertIncludes(builtCss, 'data-ss-pricing-page="index.html"', builtCssPath);
}

function validatePricingPriceScrollAnimation() {
  const jsxPath = "pricing-widget/src/PricingWidget.jsx";
  const cssPath = "pricing-widget/src/pricing-widget.css";
  const builtCssPath = "assets/css/pricing-widget.css";
  const builtJsPath = "assets/js/pricing-widget.js";

  if (!exists(jsxPath)) fatal(`Missing ${jsxPath}`);
  if (!exists(cssPath)) fatal(`Missing ${cssPath}`);

  const jsx = readText(jsxPath);
  const css = readText(cssPath);

  assertIncludes(jsx, "SS_PRICING_SPEC: PRICE_SCROLL_ANIMATION", jsxPath);
  assertIncludes(css, "SS_PRICING_SPEC: PRICE_SCROLL_ANIMATION", cssPath);

  // Expected classnames for the scroll/roll implementation
  ["ss-pricing__price-roll", "ss-pricing__price-roll-track", "ss-pricing__price-roll-item"].forEach((cls) => {
    assertIncludes(jsx + "\n" + css, cls, "pricing-widget (source)");
  });

  // Built assets must include marker (ensures rebuild happened)
  if (!exists(builtCssPath)) fatal(`Missing built asset: ${builtCssPath} (build pricing widget)`);
  if (!exists(builtJsPath)) fatal(`Missing built asset: ${builtJsPath} (build pricing widget)`);

  const builtCss = readText(builtCssPath);
  const builtJs = readText(builtJsPath);

  assertIncludes(builtCss, "SS_PRICING_SPEC: PRICE_SCROLL_ANIMATION", builtCssPath);
  assertIncludes(builtJs, "SS_PRICING_SPEC: PRICE_SCROLL_ANIMATION", builtJsPath);
}

function main() {
  const strict = process.argv.includes("--strict");
  if (!strict) {
    console.warn("⚠️  Running without --strict is not supported for this validator; use --strict.");
    process.exit(1);
  }

  validateAbout();
  validateIndexStatsSection();
  validateNichesNoCounters();
  validateStatsJs();
  validateParallaxJsNicheMobileParity();
  validateMarqueeSpeeds();
  validatePricingIndexSection2ScrollAndHeightMatch();
  validatePricingPriceScrollAnimation();

  console.log("✅ Requested Edits (1–8) validated successfully.");
}

main();
