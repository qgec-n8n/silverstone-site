#!/usr/bin/env node
"use strict";

/**
 * Validate that each target page:
 * - has exactly one pricing mount container with correct data-ss-pricing-page
 * - no longer contains the placeholder sentence prefix
 * - still contains hero shader invariants (#hero-shader-canvas and .hero.title-band)
 *
 * Usage:
 *   node scripts/validate-pricing-embed-markup.js
 *   node scripts/validate-pricing-embed-markup.js --strict
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const STRICT = process.argv.includes("--strict");

const TARGETS = [
  { file: "services.html", key: "services.html" },
  { file: "niches/estate-agents.html", key: "niches/estate-agents.html" },
  { file: "niches/hospitality.html", key: "niches/hospitality.html" },
  { file: "niches/salons-barbers.html", key: "niches/salons-barbers.html" },
  { file: "niches/trades-virtual-office.html", key: "niches/trades-virtual-office.html" },
  { file: "niches/ecommerce.html", key: "niches/ecommerce.html" },
  { file: "niches/physios-chiropractors.html", key: "niches/physios-chiropractors.html" },
  { file: "niches/dentists.html", key: "niches/dentists.html" },
  { file: "niches/gyms-fitness-studios.html", key: "niches/gyms-fitness-studios.html" },
  { file: "niches/fitness-coaches.html", key: "niches/fitness-coaches.html" },
];

const PLACEHOLDER_PREFIX = "Transparent pricing tables will appear here soon.";

function read(rel) {
  return fs.readFileSync(path.join(REPO_ROOT, rel), "utf8");
}

function fail(msg) {
  console.error(`[validate-pricing-embed-markup] FAIL: ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`[validate-pricing-embed-markup] OK: ${msg}`);
}

function countMounts(html, key) {
  // Must match: class="ss-pricing-mount" and data-ss-pricing-page="KEY"
  const re = new RegExp(`class\\s*=\\s*"(?:[^"]*\\s)?ss-pricing-mount(?:\\s[^"]*)?"[^>]*data-ss-pricing-page\\s*=\\s*"${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "g");
  const m = html.match(re);
  return m ? m.length : 0;
}

function hasHeroCanvas(html) {
  return /<canvas[^>]+id\s*=\s*"hero-shader-canvas"/i.test(html);
}

function hasHeroTitleBand(html) {
  // Conservative: find a section/div with both hero and title-band in class list.
  return /class\s*=\s*"[^"]*\bhero\b[^"]*\btitle-band\b[^"]*"/i.test(html);
}

function main() {
  for (const t of TARGETS) {
    const abs = path.join(REPO_ROOT, t.file);
    if (!fs.existsSync(abs)) {
      fail(`Missing target page: ${t.file}`);
      continue;
    }

    const html = read(t.file);

    // Placeholder removed
    if (html.includes(PLACEHOLDER_PREFIX)) {
      fail(`${t.file}: Placeholder prefix still present`);
    } else {
      ok(`${t.file}: Placeholder removed`);
    }

    // Mount exists exactly once
    const mounts = countMounts(html, t.key);
    if (mounts !== 1) {
      fail(`${t.file}: Expected exactly 1 mount with data-ss-pricing-page="${t.key}" (found ${mounts})`);
    } else {
      ok(`${t.file}: Found mount with correct page key`);
    }

    // Hero shader invariants
    if (!hasHeroCanvas(html)) fail(`${t.file}: Missing #hero-shader-canvas`);
    else ok(`${t.file}: Has #hero-shader-canvas`);

    if (!hasHeroTitleBand(html)) fail(`${t.file}: Missing .hero.title-band (class list must contain both)`);
    else ok(`${t.file}: Has .hero.title-band`);
  }

  if (process.exitCode) {
    if (STRICT) process.exit(1);
    console.warn("[validate-pricing-embed-markup] Completed with failures (non-strict mode).");
  } else {
    ok("All validations passed.");
  }
}

main();
