// FILE: scripts/validate-pricing-ui-tuning.js
// Validates pricing widget requirements for Requested Edits (1–3) plus key regressions.
// Deterministic checks use marker comments + exact/regex matches.

const fs = require("fs");
const path = require("path");

const FILES = {
  srcCss: path.join("pricing-widget", "src", "pricing-widget.css"),
  outCss: path.join("assets", "css", "pricing-widget.css"),
  srcJsx: path.join("pricing-widget", "src", "PricingWidget.jsx"),
  outJs: path.join("assets", "js", "pricing-widget.js"),
};

// CSS markers must exist in both source and built CSS.
// JSX markers are checked only in source (bundling may strip comments).
const REQUIRED_CSS_MARKERS = [
  // Requested Edits 1–3
  "SS_PRICING_SPEC: LIGHT_MODE_BG_BODYSECTION_INSPIRED_NOT_IDENTICAL",
  "SS_PRICING_SPEC: SPARKLES_HIGH_VISIBILITY_LIGHT_MODE",
  "SS_PRICING_SPEC: TOGGLE_TRACK_WHITE_LIGHT_MODE",
  "SS_PRICING_SPEC: NICHES_SECTION1_FEATURED_CARD_PREMIUM_HIGHLIGHT",

  // Regression guardrails (already present in repo; keep them from regressing)
  "SS_PRICING_SPEC: CTA_BOOK_CALL_PREMIUM_LIGHT_MODE",
  "SS_PRICING_SPEC: GBP_SYMBOL_BASELINE_ALIGN",
];

const REQUIRED_JSX_MARKERS = [
  "SS_PRICING_SPEC: SPARKLES_HIGH_VISIBILITY_LIGHT_MODE",
];

function readFileOrDie(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    const msg = err && err.message ? err.message : String(err);
    throw new Error(`Could not read ${filePath}: ${msg}`);
  }
}

function assertMarkerPresent(filePath, marker, content) {
  if (!content.includes(marker)) {
    throw new Error(`Missing required marker in ${filePath}: "${marker}"`);
  }
}

function snippetAround(content, marker, radius = 900) {
  const idx = content.indexOf(marker);
  if (idx === -1) return "";
  const start = Math.max(0, idx - radius);
  const end = Math.min(content.length, idx + marker.length + radius);
  return content.slice(start, end);
}

function validateLightModeBgMoreVibrant(css) {
  const marker = "SS_PRICING_SPEC: LIGHT_MODE_BG_BODYSECTION_INSPIRED_NOT_IDENTICAL";
  const snippet = snippetAround(css, marker, 2000);

  // Ensure the background image is still part of the layer stack.
  if (!snippet.includes("body-section-background-2025.webp")) {
    throw new Error("Light-mode pricing background no longer references body-section-background-2025.webp near the marker.");
  }

  // Enforce the exact alpha targets from codex/REQUESTED_EDITS_SPEC.md.
  const required = [
    /rgba\(\s*0,\s*174,\s*239,\s*0\.30\s*\)/,
    /rgba\(\s*0,\s*174,\s*239,\s*0\.17\s*\)/,
    /rgba\(\s*255,\s*79,\s*216,\s*0\.26\s*\)/,
    /rgba\(\s*255,\s*79,\s*216,\s*0\.15\s*\)/,
  ];

  required.forEach((re) => {
    if (!re.test(snippet)) {
      throw new Error(`Expected updated light-mode background value missing near marker: ${re}`);
    }
  });
}

function validateSparklesBoost(css, srcJsx) {
  const marker = "SS_PRICING_SPEC: SPARKLES_HIGH_VISIBILITY_LIGHT_MODE";

  const cssSnippet = snippetAround(css, marker, 1400);
  if (!/\.ss-pricing__sparkles/.test(cssSnippet)) {
    throw new Error("Sparkles marker not located near .ss-pricing__sparkles styles.");
  }
  if (!/filter:\s*drop-shadow\(/.test(cssSnippet)) {
    throw new Error("Expected sparkles filter to include drop-shadow() for clarity.");
  }

  const jsxSnippet = snippetAround(srcJsx, marker, 1600);
  // Enforce the explicit numeric boosts expected by the spec.
  // (These exact baselines should be present after implementation.)
  if (!/const\s+COUNT\s*=\s*26\s*;/.test(jsxSnippet)) {
    throw new Error("Expected sparkle particle COUNT to be set to 26 near the sparkles marker in PricingWidget.jsx.");
  }
  if (!/const\s+r\s*=\s*1\.1\s*\+/.test(jsxSnippet)) {
    throw new Error("Expected sparkle radius baseline 'const r = 1.1 +' near the sparkles marker in PricingWidget.jsx.");
  }
  if (!/const\s+a\s*=\s*0\.55\s*\+/.test(jsxSnippet)) {
    throw new Error("Expected sparkle alpha baseline 'const a = 0.55 +' near the sparkles marker in PricingWidget.jsx.");
  }
}

function validateToggleTrackWhite(css) {
  const marker = "SS_PRICING_SPEC: TOGGLE_TRACK_WHITE_LIGHT_MODE";
  const snippet = snippetAround(css, marker, 1600);

  // Must be page-scoped and target the toggle track.
  if (!/ss-pricing__toggle/.test(snippet)) {
    throw new Error("Toggle track marker not located near .ss-pricing__toggle rule.");
  }
  if (!/data-ss-pricing-page/.test(snippet)) {
    throw new Error("Toggle track white styling must be scoped via data-ss-pricing-page selectors.");
  }

  // Enforce the intended "white track" implementation.
  if (!/background:\s*rgba\(\s*255,\s*255,\s*255,\s*0\.92\s*\)/.test(snippet)) {
    throw new Error("Expected toggle track background rgba(255, 255, 255, 0.92) near the toggle marker.");
  }
}

function validateNicheSection1FeaturedCard(css) {
  const marker = "SS_PRICING_SPEC: NICHES_SECTION1_FEATURED_CARD_PREMIUM_HIGHLIGHT";
  const snippet = snippetAround(css, marker, 2200);

  if (!/data-ss-pricing-page\^\=\"niches\//.test(snippet)) {
    throw new Error("Featured-card premium highlight must be scoped to niche pages (data-ss-pricing-page^=\"niches/\").");
  }
  if (!/data-ss-pricing-section\=\"1\"/.test(snippet)) {
    throw new Error("Featured-card premium highlight must be scoped to section 1 (data-ss-pricing-section=\"1\").");
  }
  if (!/\.ss-pricing__card\.is-featured/.test(snippet)) {
    throw new Error("Expected premium highlight rule to target .ss-pricing__card.is-featured.");
  }
  if (!/transform:\s*translateY\(\s*-6px\s*\)/.test(snippet)) {
    throw new Error("Expected featured card to be raised with transform: translateY(-6px).");
  }
  if (!/box-shadow:\s*[^;]+;/.test(snippet)) {
    throw new Error("Expected featured card premium highlight to include a stronger box-shadow.");
  }
}

function validateOutJsContainsCanvas(outJs) {
  // Sanity check: built JS should still include canvas logic (sparkles).
  if (!outJs.includes("canvas")) {
    throw new Error("Built pricing widget JS does not appear to contain canvas logic (expected for sparkles).");
  }
}

function main() {
  const strict = process.argv.includes("--strict");

  const srcCss = readFileOrDie(FILES.srcCss);
  const outCss = readFileOrDie(FILES.outCss);
  const srcJsx = readFileOrDie(FILES.srcJsx);
  const outJs = readFileOrDie(FILES.outJs);

  if (strict) {
    REQUIRED_CSS_MARKERS.forEach((m) => {
      assertMarkerPresent(FILES.srcCss, m, srcCss);
      assertMarkerPresent(FILES.outCss, m, outCss);
    });
    REQUIRED_JSX_MARKERS.forEach((m) => {
      assertMarkerPresent(FILES.srcJsx, m, srcJsx);
    });
  }

  // Validate against built CSS so we catch “forgot to rebuild”.
  validateLightModeBgMoreVibrant(outCss);
  validateSparklesBoost(outCss, srcJsx);
  validateToggleTrackWhite(outCss);
  validateNicheSection1FeaturedCard(outCss);
  validateOutJsContainsCanvas(outJs);

  console.log("✅ Pricing UI tuning validation passed.");
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error("❌ Pricing UI tuning validation failed.");
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  }
}
