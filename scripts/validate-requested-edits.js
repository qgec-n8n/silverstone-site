// FILE: scripts/validate-requested-edits.js
// Validates Requested Edits (1–7) from codex/REQUESTED_EDITS_SPEC.md.
//
// This script is intentionally deterministic:
// - marker comments confirm the intended codepaths were modified
// - targeted string/regex checks prevent subtle regressions

const fs = require("fs");
const path = require("path");

const FILES = {
  indexHtml: path.join("index.html"),
  servicesHtml: path.join("services.html"),
  homeCss: path.join("src", "css", "pages", "home.css"),
  servicesCss: path.join("src", "css", "pages", "services.css"),
  typographyCss: path.join("src", "css", "base", "typography.css"),
  outCss: path.join("assets", "css", "styles.css"),
};

const MARKERS = {
  homeCss: ["SS_HOME_SPEC: SERVICES_TITLES_BLUE_TAGLINES_GREY"],
  typographyCss: ["SS_SERVICES_SPEC: MOBILE_IMAGE_OUTSIDE_TEXT_CARD_MATCH_NICHE_PATTERN"],
  servicesCss: ["SS_SERVICES_SPEC: MOBILE_IMAGE_TOP_PATTERN"],
};

const HOME_CARD_TITLES = [
  "AI Consulting & Readiness",
  "Automated Lead Follow-Up",
  "Workflow Automation & Reporting",
  "Systems & Data Integration",
];

const HOME_TAGLINES = [
  "Get clear on what to automate first - and what to leave alone.",
  "Stop enquiries going cold with fast, personal follow-up.",
  "Remove manual admin and get visibility across your ops.",
  "Connect your tools so data flows without copy-paste.",
];

const SERVICES_REQUIRED_HEADINGS = [
  "Where revenue (and time) quietly leaks away.",
  "Start small. Ship fast. Expand when it is working",
  "General Service Lines:",
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

function assertContains(filePath, content, needle) {
  if (!content.includes(needle)) {
    throw new Error(`Expected to find in ${filePath}: "${needle}"`);
  }
}

function assertNotContains(filePath, content, needle, hint = "") {
  if (content.includes(needle)) {
    const extra = hint ? ` ${hint}` : "";
    throw new Error(`Unexpected content found in ${filePath}: "${needle}".${extra}`);
  }
}

function validateIndexNoExtraBr(indexHtml) {
  // Exact current problem is: "...copy-paste.<br />" which creates an extra blank line.
  assertNotContains(
    FILES.indexHtml,
    indexHtml,
    "Connect your tools so data flows without copy-paste.<br",
    "Remove the extra <br /> in the Systems & Data Integration card."
  );
}

function validateHomeCopyIsUnchanged(indexHtml) {
  HOME_CARD_TITLES.forEach((t) => assertContains(FILES.indexHtml, indexHtml, t));
  HOME_TAGLINES.forEach((t) => assertContains(FILES.indexHtml, indexHtml, t));
}

function validateHomeCssColors(homeCss, outCss, strict) {
  if (strict) {
    MARKERS.homeCss.forEach((m) => {
      assertMarkerPresent(FILES.homeCss, m, homeCss);
      assertMarkerPresent(FILES.outCss, m, outCss);
    });
  }

  // Titles must be blue for home packages grid cards.
  const expectedTitleRule =
    /\.page-home\s+\.packages-grid\s+\.neon-card\s+h3\s*\{[^}]*color:\s*var\(--color-blue\)\s*;?/s;
  if (!expectedTitleRule.test(homeCss)) {
    throw new Error(
      `Expected home card titles to be blue in ${FILES.homeCss} (selector ".page-home .packages-grid .neon-card h3").`
    );
  }

  // Taglines must remain grey.
  const expectedTaglineRule =
    /\.page-home\s+\.packages-grid\s+\.tagline\s*\{[^}]*color:\s*var\(--color-silver\)\s*;?/s;
  if (!expectedTaglineRule.test(homeCss)) {
    throw new Error(
      `Expected home card taglines to be grey in ${FILES.homeCss} (selector ".page-home .packages-grid .tagline").`
    );
  }

  // Ensure the old green rule for this selector is not still present.
  const oldGreenRule =
    /\.page-home\s+\.packages-grid\s+\.neon-card\s+h3\s*\{[^}]*color:\s*var\(--color-green\)/s;
  if (oldGreenRule.test(homeCss)) {
    throw new Error(`Home card titles are still green in ${FILES.homeCss}; they must be blue.`);
  }
}

function validateServicesCopyIsUnchanged(servicesHtml) {
  SERVICES_REQUIRED_HEADINGS.forEach((h) => assertContains(FILES.servicesHtml, servicesHtml, h));
}

function validateServiceContentNoImages(servicesHtml) {
  // Ensure no <img> inside .service-content blocks (card must be text-only).
  const blocks = servicesHtml.match(/<div class="service-content[\s\S]*?<\/div>\s*<\/div>/g);
  if (!blocks || blocks.length === 0) {
    throw new Error(`Could not find any ".service-content" blocks in ${FILES.servicesHtml}.`);
  }
  blocks.forEach((block, i) => {
    if (/<img\s/i.test(block)) {
      throw new Error(
        `Found <img> inside a .service-content block (#${i + 1}) in ${FILES.servicesHtml}. Images must be outside the card.`
      );
    }
  });
}

function validateServicesMobileImageOrderMarker(servicesCss, outCss, strict) {
  if (strict) {
    MARKERS.servicesCss.forEach((m) => {
      assertMarkerPresent(FILES.servicesCss, m, servicesCss);
      assertMarkerPresent(FILES.outCss, m, outCss);
    });
  }
}

function validateServicesMobileNoMergedCard(typographyCss, outCss, strict) {
  const marker = MARKERS.typographyCss[0];

  if (strict) {
    assertMarkerPresent(FILES.typographyCss, marker, typographyCss);
    assertMarkerPresent(FILES.outCss, marker, outCss);
  }

  // The buggy mobile layout came from a dedicated section labeled "Services mobile cards".
  assertNotContains(
    FILES.typographyCss,
    typographyCss,
    "Services mobile cards",
    "This block must be removed/disabled so services matches the estate-agents pattern."
  );

  // Also ensure we didn't keep the specific problematic rules.
  const forbiddenRules = [
    /\.page-services\s+\.service-row\s*\{\s*display:\s*flex\s*!important/s,
    /\.page-services\s+\.service-row\s*\{\s*[^}]*background:\s*linear-gradient/s,
    /\.page-services\s+\.service-row\s+\.service-content\s+h3\s*\{\s*[^}]*color:\s*#f8fafc/s,
    /\.page-services\s+\.service-row\s+\.service-content\.neon-card\s*\{\s*[^}]*background:\s*transparent\s*!important/s,
  ];

  forbiddenRules.forEach((re) => {
    if (re.test(typographyCss)) {
      throw new Error(
        `Detected leftover mobile card-merge styling in ${FILES.typographyCss} matching regex: ${re}`
      );
    }
  });

  // Built CSS should not contain the old signature either.
  const outForbidden = [
    /Services mobile cards/s,
    /\.page-services\s+\.service-row\s*\{\s*display:\s*flex\s*!important/s,
    /\.page-services\s+\.service-row\s+\.service-content\s+h3\s*\{\s*[^}]*color:\s*#f8fafc/s,
  ];

  outForbidden.forEach((re) => {
    if (re.test(outCss)) {
      throw new Error(
        `Detected leftover mobile card-merge styling in ${FILES.outCss} matching regex: ${re}`
      );
    }
  });
}

function main() {
  const strict = process.argv.includes("--strict");

  const indexHtml = readFileOrDie(FILES.indexHtml);
  const servicesHtml = readFileOrDie(FILES.servicesHtml);
  const homeCss = readFileOrDie(FILES.homeCss);
  const servicesCss = readFileOrDie(FILES.servicesCss);
  const typographyCss = readFileOrDie(FILES.typographyCss);
  const outCss = readFileOrDie(FILES.outCss);

  validateIndexNoExtraBr(indexHtml);
  validateHomeCopyIsUnchanged(indexHtml);
  validateHomeCssColors(homeCss, outCss, strict);

  validateServicesCopyIsUnchanged(servicesHtml);
  validateServiceContentNoImages(servicesHtml);
  validateServicesMobileImageOrderMarker(servicesCss, outCss, strict);
  validateServicesMobileNoMergedCard(typographyCss, outCss, strict);

  console.log("✅ Requested edits validation passed.");
}

if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error("❌ Requested edits validation failed.");
    console.error(err && err.message ? err.message : err);
    process.exit(1);
  }
}
