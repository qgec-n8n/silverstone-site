#!/usr/bin/env node

/**
 * Validate structural invariants for services.html after overhaul.
 *
 * This is intentionally dependency-free (no DOM parser) and uses conservative checks.
 * It is not a visual test; it is a guardrail to prevent common regressions.
 *
 * Usage:
 *   node scripts/validate-services-page.js --strict
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.join(__dirname, "..");
const SERVICES = path.join(REPO_ROOT, "services.html");

function readFile(p) {
  return fs.readFileSync(p, "utf8");
}

function fail(msg) {
  console.error(`[validate-services-page] FAIL: ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`[validate-services-page] OK: ${msg}`);
}

function has(haystack, needle) {
  return haystack.indexOf(needle) !== -1;
}

function extractSectionClasses(html) {
  const re = /<section\b[^>]*class\s*=\s*"([^"]+)"[^>]*>/gi;
  const classes = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    classes.push(m[1]);
  }
  return classes;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const strict = args.has("--strict");

  if (!fs.existsSync(SERVICES)) {
    fail(`Missing file: ${path.relative(REPO_ROOT, SERVICES)}`);
    process.exit(1);
  }

  const html = readFile(SERVICES);

  // Body class must remain page-services (controls marquee behavior).
  if (!/class\s*=\s*"[^"]*\bpage-services\b[^"]*"/i.test(html)) {
    fail(`Body is missing required class "page-services"`);
  } else {
    ok(`Body has class "page-services"`);
  }

  // General link must point to services.html somewhere in nav.
  if (!has(html, '>General<') || !/href\s*=\s*"services\.html"/i.test(html)) {
    fail(`Nav does not appear to include General -> services.html`);
  } else {
    ok(`Nav appears to include General -> services.html`);
  }

  // Must not include single marquee markup.
  if (/single-marquee/i.test(html)) {
    fail(`Found "single-marquee" markup; services must not include Single Marquee`);
  } else {
    ok(`No "single-marquee" markup detected`);
  }

  // Innovation Gallery + marquee slot must exist (locked block).
  const innovationRequired = ["id=\"innovation-gallery\"", "id=\"neural-grid\"", "id=\"innovation-marquee-slot\""];
  for (const token of innovationRequired) {
    if (!has(html, token)) {
      fail(`Missing required Innovation Gallery token: ${token}`);
    }
  }
  if (innovationRequired.every((t) => has(html, t))) {
    ok(`Innovation Gallery + Double Marquee slot tokens are present`);
  }

  // Final CTA must remain (locked block) — validate by unique headline substring.
  if (!has(html, "Start with a simple automation audit")) {
    fail(`Missing Final CTA headline (locked block): "Start with a simple automation audit"`);
  } else {
    ok(`Final CTA headline detected`);
  }

  // WebP-first picture sources must exist for the six images.
  const requiredWebps = [
    "assets/images/socialmedia/General_Services_1.webp",
    "assets/images/socialmedia/General_Services_1_Mobile.webp",
    "assets/images/socialmedia/General_Services_2.webp",
    "assets/images/socialmedia/General_Services_2_Mobile.webp",
    "assets/images/socialmedia/General_Services_3.webp",
    "assets/images/socialmedia/General_Services_3_Mobile.webp",
  ];
  for (const src of requiredWebps) {
    if (!has(html, src)) fail(`Missing WebP reference in services.html: ${src}`);
  }
  if (requiredWebps.every((s) => has(html, s))) {
    ok(`All required WebP references are present in services.html`);
  }

  // Rough structural expectation: first section is hero title-band; final CTA section exists.
  const sectionClasses = extractSectionClasses(html);
  if (!sectionClasses.length) {
    fail(`No <section class="..."> tags detected`);
  } else {
    const first = sectionClasses[0];
    if (!/\bhero\b/.test(first) || !/\btitle-band\b/.test(first)) {
      fail(`First section does not look like the expected hero.title-band (found: "${first}")`);
    } else {
      ok(`First section looks like hero.title-band`);
    }
    const hasBrandGradient = sectionClasses.some((c) => /\bbrand-gradient\b/.test(c));
    if (!hasBrandGradient) fail(`No brand-gradient section found (expected final CTA section)`);
    else ok(`brand-gradient section found`);
  }

  // Strict: ensure there are at least 10 sections (estate-style structure + innovation + CTA).
  if (strict) {
    if (sectionClasses.length < 10) {
      fail(`Expected at least 10 <section> blocks after overhaul; found ${sectionClasses.length}`);
    } else {
      ok(`Section count looks plausible (${sectionClasses.length})`);
    }
  }

  if (process.exitCode) {
    process.exit(1);
  }
}

main();
