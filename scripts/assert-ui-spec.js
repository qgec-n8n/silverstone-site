// FILE: scripts/assert-ui-spec.js
/**
 * Assert that required SPEC / SS_* proof markers exist in *site source code*.
 *
 * Important:
 * - We intentionally scan only production code locations (not codex/ docs, not scripts/).
 * - Avoid scanning node_modules (can be huge). We scan only known source roots + known HTML pages.
 *
 * Run:
 *   node scripts/assert-ui-spec.js --strict
 */

const fs = require("fs");
const path = require("path");

const STRICT = process.argv.includes("--strict");
const ROOT = process.cwd();

function rel(p) {
  return path.join(ROOT, p);
}

function walk(dirAbs, filterFn) {
  const out = [];
  (function rec(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(current, e.name);
      if (e.isDirectory()) rec(p);
      else if (e.isFile()) {
        const relPath = path.relative(ROOT, p).replace(/\\/g, "/");
        if (filterFn(relPath)) out.push(relPath);
      }
    }
  })(dirAbs);
  return out;
}

function read(p) {
  return fs.readFileSync(rel(p), "utf8");
}

// Scan targets: production sources + known HTML pages
const rootPages = ["index.html", "services.html", "about.html", "book.html", "contact.html"]
  .filter((p) => fs.existsSync(rel(p)));

const scanFiles = [
  ...walk(rel("src"), (p) => p.endsWith(".css") || p.endsWith(".js")),
  ...walk(rel("pricing-widget/src"), (p) => p.endsWith(".css") || p.endsWith(".js")),
  ...rootPages,
  ...walk(rel("niches"), (p) => p.endsWith(".html")),
];

// Required markers for Requested Edits 1–12
// Keep this list in sync with codex/REQUESTED_EDITS_SPEC.md.
const REQUIRED = [
  { marker: "SS_PRICING_SPEC: LIGHT_MODE_WASHOUT_TUNING_2025_12", scopeHint: "pricing-widget/src/**" },
  { marker: "SS_PRICING_SPEC: LIGHT_MODE_BG_VIBRANCY_BOOST_2025_12", scopeHint: "pricing-widget/src/**" },

  { marker: "SPEC: SERVICES_IMAGE_NEON_BORDER_MATCH_NICHES_2025_12", scopeHint: "src/css/pages/services.css" },
  { marker: "SPEC: SERVICE_IMAGES_CONTAIN_NO_CROP_2025_12", scopeHint: "src/css/components/cards.css" },

  { marker: "SPEC: GLOBAL_SECTION_SUBTITLE_GREY_2025_12", scopeHint: "src/css/base/layout.css (or variables used by it)" },

  { marker: "SPEC: HERO_SUBTITLE_NONWHITE_2025_12", scopeHint: "src/css/components/hero.css" },
  { marker: "SPEC: HERO_TEXT_LEGIBILITY_GLASS_PANEL_2025_12", scopeHint: "src/css/components/hero.css" },
  { marker: "SPEC: HERO_CTA_GAP_2025_12", scopeHint: "src/css/components/hero.css" },
  { marker: "SPEC: MOBILE_HERO_LAYOUT_TUNING_2025_12", scopeHint: "src/css/components/hero.css" },

  { marker: "SPEC: CALENDLY_EARLY_LOAD_2025_12", scopeHint: "book.html" },

  { marker: "SPEC: ABOUT_STATS_UPDATED_2025_12", scopeHint: "about.html" },

  { marker: "SPEC: INDEX_NO_HYPE_STATS_COPY_UPDATED_2025_12", scopeHint: "index.html" },
  { marker: "SPEC: INDEX_SERVICES_IMAGE_GRID_2025_12", scopeHint: "index.html" },
  { marker: "SPEC: INDEX_SERVICES_IMAGE_LIGHTBOX_2025_12", scopeHint: "src/js/** (lightbox wiring)" },

  { marker: "SPEC: MOBILE_MENU_BANNER_TWO_STEP_2025_12", scopeHint: "src/js/header-nav.js" },
];

// Build a marker -> hits map
const hits = new Map();
for (const f of scanFiles) {
  const txt = read(f);
  for (const { marker } of REQUIRED) {
    if (txt.includes(marker)) {
      if (!hits.has(marker)) hits.set(marker, []);
      hits.get(marker).push(f);
    }
  }
}

const errors = [];

for (const { marker, scopeHint } of REQUIRED) {
  const foundIn = hits.get(marker) || [];
  if (foundIn.length === 0) {
    errors.push(`Missing required marker: "${marker}" (expected in ${scopeHint})`);
  } else {
    const display = foundIn.slice(0, 5).join(", ");
    console.log(`✓ ${marker}  (found in: ${display}${foundIn.length > 5 ? ", ..." : ""})`);
  }
}

if (errors.length) {
  console.error("\nUI spec marker assertion FAILED:");
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}

console.log("\n✅ UI spec marker assertion passed.");
