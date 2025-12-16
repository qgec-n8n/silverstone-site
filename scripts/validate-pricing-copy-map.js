# FILE: scripts/validate-pricing-copy-map.js
#!/usr/bin/env node
"use strict";

/**
 * Strict validation for PRICING_COPY_MAP.md parsing coverage and UI-critical invariants.
 *
 * Usage:
 *   node scripts/validate-pricing-copy-map.js
 *   node scripts/validate-pricing-copy-map.js --strict
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const STRICT = process.argv.includes("--strict");

const EXPECTED_PAGES = [
  "services.html",
  "niches/estate-agents.html",
  "niches/hospitality.html",
  "niches/salons-barbers.html",
  "niches/trades-virtual-office.html",
  "niches/ecommerce.html",
  "niches/physios-chiropractors.html",
  "niches/dentists.html",
  "niches/gyms-fitness-studios.html",
  "niches/fitness-coaches.html",
];

const GENERATED = path.join(REPO_ROOT, "codex", "_generated", "pricing-copy.json");

function fail(msg) {
  console.error(`[validate-pricing-copy-map] FAIL: ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`[validate-pricing-copy-map] OK: ${msg}`);
}

function runGenerator() {
  const r = spawnSync(process.execPath, [path.join(REPO_ROOT, "scripts", "pricing-copy-map-to-json.js")], {
    cwd: REPO_ROOT,
    stdio: "inherit",
  });
  if (r.status !== 0) {
    fail(`Generator failed (pricing-copy-map-to-json.js).`);
    if (STRICT) process.exit(1);
  }
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function hasCurrency(s) {
  return typeof s === "string" && /[£$€]/.test(s);
}

function main() {
  runGenerator();

  if (!fs.existsSync(GENERATED)) {
    fail(`Missing generated file: ${path.relative(REPO_ROOT, GENERATED)}`);
    process.exit(1);
  }
  ok(`Found generated file: ${path.relative(REPO_ROOT, GENERATED)}`);

  const data = readJson(GENERATED);
  const keys = Object.keys(data);

  // Required page coverage
  for (const k of EXPECTED_PAGES) {
    if (!data[k]) fail(`Missing page key in generated data: "${k}"`);
  }
  if (EXPECTED_PAGES.every((k) => data[k])) ok(`All required page keys present (${EXPECTED_PAGES.length})`);

  // No unexpected keys in strict mode (except non-page sections accidentally parsed)
  if (STRICT) {
    const unexpected = keys.filter((k) => !EXPECTED_PAGES.includes(k));
    if (unexpected.length) fail(`Unexpected page keys present: ${unexpected.join(", ")}`);
    else ok(`No unexpected page keys present`);
  }

  // Per-page invariants
  for (const pageKey of EXPECTED_PAGES) {
    const p = data[pageKey];
    if (!p) continue;

    const row1Plans = (p.row1 && p.row1.plans) || [];
    const row2Groups = (p.row2 && p.row2.groups) || [];

    if (row1Plans.length !== 3) fail(`${pageKey}: Row 1 must have exactly 3 plans (found ${row1Plans.length})`);
    if (row2Groups.length !== 3) fail(`${pageKey}: Row 2 must have exactly 3 groups (found ${row2Groups.length})`);

    // Row 1 plan field checks
    row1Plans.forEach((pl, idx) => {
      const n = idx + 1;
      if (!pl.name) fail(`${pageKey}: Row1 plan ${n} missing name`);
      if (!pl.setupFee || !hasCurrency(pl.setupFee)) fail(`${pageKey}: Row1 plan ${n} setupFee missing or lacks currency`);
      if (!pl.monthlyRetainer || !hasCurrency(pl.monthlyRetainer)) fail(`${pageKey}: Row1 plan ${n} monthlyRetainer missing or lacks currency`);
      if (!pl.bestFor) fail(`${pageKey}: Row1 plan ${n} missing bestFor`);
      if (!Array.isArray(pl.includes) || pl.includes.length < 3) fail(`${pageKey}: Row1 plan ${n} includes must have >= 3 items`);
    });

    // Badge rule: only plan 2, and must be "Most popular"
    const b1 = row1Plans[0] && row1Plans[0].badge;
    const b2 = row1Plans[1] && row1Plans[1].badge;
    const b3 = row1Plans[2] && row1Plans[2].badge;

    if (b1) fail(`${pageKey}: Only Row1 plan 2 may have a badge (plan 1 has "${b1}")`);
    if (b3) fail(`${pageKey}: Only Row1 plan 2 may have a badge (plan 3 has "${b3}")`);
    if (!b2) fail(`${pageKey}: Row1 plan 2 must have badge "Most popular"`);
    if (b2 && b2.trim().toLowerCase() !== "most popular") fail(`${pageKey}: Row1 plan 2 badge must be exactly "Most popular" (found "${b2}")`);

    // Row 2 group checks
    row2Groups.forEach((g, idx) => {
      const n = idx + 1;
      if (!g.label) fail(`${pageKey}: Row2 group ${n} missing label`);
      if (!g.oneLiner) fail(`${pageKey}: Row2 group ${n} missing oneLiner`);
      if (!g.plansIncludedRaw || !g.plansIncludedRaw.trim()) fail(`${pageKey}: Row2 group ${n} plansIncludedRaw is empty`);
    });
  }

  if (process.exitCode) {
    if (STRICT) process.exit(1);
    console.warn("[validate-pricing-copy-map] Completed with failures (non-strict mode).");
  } else {
    ok("All validations passed.");
  }
}

main();
