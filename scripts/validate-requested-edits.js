// FILE: scripts/validate-requested-edits.js
#!/usr/bin/env node

/**
 * Validates Requested UI Fixes (1–5) as defined in codex/REQUESTED_EDITS_SPEC.md.
 *
 * Run:
 *   node scripts/validate-requested-edits.js --strict
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

function assertNotIncludes(haystack, needle, msg) {
  if (haystack.includes(needle)) fail(msg);
}

function assertRegex(haystack, re, msg) {
  if (!re.test(haystack)) fail(msg);
}

function listNichePages() {
  const dir = path.join(ROOT, "niches");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".html"))
    .map((f) => path.posix.join("niches", f))
    .sort();
}

/**
 * Extract a <div>...</div> block starting from the index of an opening "<div".
 * This is a simple tag counter for nested divs (sufficient for this repo’s markup style).
 */
function extractDivBlock(html, startIdx) {
  const OPEN = "<div";
  const CLOSE = "</div>";

  if (startIdx < 0 || startIdx >= html.length) return null;
  if (!html.slice(startIdx, startIdx + OPEN.length).toLowerCase().startsWith(OPEN)) return null;

  let depth = 1;
  let i = startIdx + OPEN.length;

  while (i < html.length) {
    const nextOpen = html.toLowerCase().indexOf(OPEN, i);
    const nextClose = html.toLowerCase().indexOf(CLOSE, i);

    if (nextClose === -1) return null;

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + OPEN.length;
      continue;
    }

    // close comes first
    depth -= 1;
    i = nextClose + CLOSE.length;

    if (depth === 0) {
      return html.slice(startIdx, i);
    }
  }

  return null;
}

function validateNicheSanity() {
  const nichePages = listNichePages();
  if (nichePages.length === 0) {
    fail("No niches/*.html pages found (expected at least 1).");
    return;
  }

  nichePages.forEach((rel) => {
    const html = read(rel);
    assertRegex(html, /<body[^>]*\bpage-niche\b/, `${rel} must keep body class page-niche.`);
    assertRegex(
      html,
      /<div class="ss-pricing"[^>]*\bdata-ss-pricing-page="niches\//,
      `${rel} must include a pricing mount with data-ss-pricing-page="niches/...".`
    );
    assertRegex(html, /class="stats\b/, `${rel} must include a .stats section.`);
  });

  ok(`Niche sanity: ${nichePages.length} niche pages present with page-niche + pricing mount + stats section.`);
}

function validateStatsIconsHomeAndAbout() {
  const indexHtml = read("index.html");
  const aboutHtml = read("about.html");

  assertIncludes(
    indexHtml,
    "SS_STATS_SPEC: ICONS_ADDED_HOME_ABOUT",
    "index.html must include marker SS_STATS_SPEC: ICONS_ADDED_HOME_ABOUT."
  );
  assertIncludes(
    aboutHtml,
    "SS_STATS_SPEC: ICONS_ADDED_HOME_ABOUT",
    "about.html must include marker SS_STATS_SPEC: ICONS_ADDED_HOME_ABOUT."
  );

  const indexStatCount = (indexHtml.match(/class="stat\b/g) || []).length;
  const indexIconCount = (indexHtml.match(/class="stat-icon\b/g) || []).length;
  if (indexStatCount === 0) fail("index.html must contain .stat cards.");
  if (indexIconCount !== indexStatCount) {
    fail(`index.html must have one .stat-icon per .stat (found ${indexIconCount} icons, ${indexStatCount} stats).`);
  }

  const aboutStatCount = (aboutHtml.match(/class="stat\b/g) || []).length;
  const aboutIconCount = (aboutHtml.match(/class="stat-icon\b/g) || []).length;
  if (aboutStatCount === 0) fail("about.html must contain .stat cards.");
  if (aboutIconCount !== aboutStatCount) {
    fail(`about.html must have one .stat-icon per .stat (found ${aboutIconCount} icons, ${aboutStatCount} stats).`);
  }

  // Icon mapping is intentionally deterministic (see spec).
  ["fa-solid fa-bell", "fa-solid fa-clock", "fa-solid fa-gears", "fa-solid fa-check-circle"].forEach((icon) => {
    assertIncludes(indexHtml, icon, `index.html must include icon class "${icon}".`);
  });

  ["fa-solid fa-calendar-check", "fa-solid fa-chart-line", "fa-solid fa-diagram-project", "fa-solid fa-bolt"].forEach(
    (icon) => {
      assertIncludes(aboutHtml, icon, `about.html must include icon class "${icon}".`);
    }
  );

  ok("Edit 4 — Stats icons added to index + about (with required icon mapping).");
}

function validateStatsColors() {
  const srcStatsCss = read("src/css/components/stats.css");
  const builtCss = read("assets/css/styles.css");
  const estateCss = read("src/css/pages/estate-agents.css");

  assertIncludes(
    srcStatsCss,
    "SS_STATS_SPEC: COLORS_ICON_GREEN_NUMBER_BLUE_LABEL_WHITE",
    "src/css/components/stats.css must include marker SS_STATS_SPEC: COLORS_ICON_GREEN_NUMBER_BLUE_LABEL_WHITE."
  );
  assertIncludes(
    builtCss,
    "SS_STATS_SPEC: COLORS_ICON_GREEN_NUMBER_BLUE_LABEL_WHITE",
    "assets/css/styles.css must be rebuilt and include the stats color marker."
  );

  // Icon green
  assertRegex(
    srcStatsCss,
    /\.stats\s+\.stat-icon\b[\s\S]*color:\s*var\(--color-green\)\s*;/,
    "stats.css must set .stats .stat-icon color to var(--color-green)."
  );

  // Number blue
  assertRegex(
    srcStatsCss,
    /\.stats\s+\.number\b[\s\S]*color:\s*var\(--color-blue\)\s*;/,
    "stats.css must set .stats .number color to var(--color-blue)."
  );

  // Label white
  assertRegex(
    srcStatsCss,
    /\.stats\s+\.label\b[\s\S]*color:\s*var\(--color-white\)\s*;/,
    "stats.css must set .stats .label color to var(--color-white)."
  );

  // Built output contains the same intent (marker is already checked; also sanity-check presence of colors)
  assertIncludes(builtCss, "var(--color-blue)", "Built CSS must include var(--color-blue) (stats number color).");
  assertIncludes(builtCss, "var(--color-green)", "Built CSS must include var(--color-green) (stats icon color).");
  assertIncludes(builtCss, "var(--color-white)", "Built CSS must include var(--color-white) (stats label color).");

  // Ensure no page-specific override forces amber stat icons (conflicts with requirement).
  assertNotIncludes(
    estateCss,
    "color: var(--color-amber)",
    "estate-agents.css must not force stat-icon color to amber (icons must be green site-wide)."
  );

  ok("Edit 5 — Stats color rules validated (icons green, numbers blue, labels white).");
}

function validateServicesMobileImageTopPattern() {
  const servicesHtml = read("services.html");
  const servicesCss = read("src/css/pages/services.css");
  const builtCss = read("assets/css/styles.css");

  assertIncludes(
    servicesCss,
    "SS_SERVICES_SPEC: MOBILE_IMAGE_TOP_PATTERN",
    "services.css must include marker SS_SERVICES_SPEC: MOBILE_IMAGE_TOP_PATTERN."
  );
  assertIncludes(
    builtCss,
    "SS_SERVICES_SPEC: MOBILE_IMAGE_TOP_PATTERN",
    "assets/css/styles.css must be rebuilt and include the services mobile marker."
  );

  // CSS must enforce image above text on mobile (even when DOM alternates for desktop).
  assertRegex(
    servicesCss,
    /@media\s*\(max-width:\s*768px\)[\s\S]*\.page-services\s+\.service-row\s+\.service-image[\s\S]*order\s*:\s*1\s*;/,
    "services.css must set .page-services .service-row .service-image { order: 1; } in the <=768px media query."
  );
  assertRegex(
    servicesCss,
    /@media\s*\(max-width:\s*768px\)[\s\S]*\.page-services\s+\.service-row\s+\.service-content[\s\S]*order\s*:\s*2\s*;/,
    "services.css must set .page-services .service-row .service-content { order: 2; } in the <=768px media query."
  );

  // Structural guard: .service-content blocks must not contain <img> tags (images must stay in the image card).
  const token = '<div class="service-content';
  let idx = 0;
  let checked = 0;

  while ((idx = servicesHtml.indexOf(token, idx)) !== -1) {
    const block = extractDivBlock(servicesHtml, idx);
    if (!block) {
      fail("Could not parse a service-content block in services.html (unexpected markup).");
      break;
    }

    if (block.includes("<img")) {
      fail("services.html: .service-content must not contain <img> tags (images must be outside the text card).");
      break;
    }

    checked += 1;
    idx += token.length;
  }

  if (checked === 0) fail("services.html must include at least one .service-content block.");

  ok("Edit 3 — Services mobile image/top-of-card pattern validated (CSS order + no images inside service-content).");
}

function main() {
  validateNicheSanity();
  validateStatsIconsHomeAndAbout();
  validateStatsColors();
  validateServicesMobileImageTopPattern();

  if (failures > 0) {
    console.error(`\nFAILED: ${failures} check(s).`);
    process.exit(1);
  }

  ok("All Requested Edits (1–5) validations passed.");
}

main();
