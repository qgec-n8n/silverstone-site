#!/usr/bin/env node
"use strict";

/**
 * Build the embeddable pricing widget bundle:
 * - Generates pricing copy JSON from PRICING_COPY_MAP.md
 * - Bundles a React widget entrypoint into assets/js/ss-pricing-widget.iife.js
 *
 * Assumptions:
 * - Codex will create a widget entry file (example):
 *     pricing-widget/index.tsx
 * - Codex will add deps: react, react-dom, esbuild
 *
 * Usage:
 *   node scripts/build-pricing-widget.js
 *   node scripts/build-pricing-widget.js --strict
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const STRICT = process.argv.includes("--strict");

const ENTRY = path.join(REPO_ROOT, "pricing-widget", "index.tsx");
const OUTDIR = path.join(REPO_ROOT, "assets", "js");
const OUTFILE = path.join(OUTDIR, "ss-pricing-widget.iife.js");

function fail(msg) {
  console.error(`[build-pricing-widget] ERROR: ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`[build-pricing-widget] ${msg}`);
}

function run(nodeArgs, opts = {}) {
  const r = spawnSync(process.execPath, nodeArgs, { cwd: REPO_ROOT, stdio: "inherit", ...opts });
  return r.status === 0;
}

function ensureOutdir() {
  fs.mkdirSync(OUTDIR, { recursive: true });
}

function main() {
  // 1) Generate pricing copy JSON
  if (!run([path.join(REPO_ROOT, "scripts", "pricing-copy-map-to-json.js")])) {
    fail("Failed to generate pricing copy JSON.");
    if (STRICT) process.exit(1);
    return;
  }
  ok("Generated pricing copy JSON.");

  // 2) Preconditions for bundling
  if (!fs.existsSync(ENTRY)) {
    fail(`Missing widget entrypoint: ${path.relative(REPO_ROOT, ENTRY)}`);
    if (STRICT) process.exit(1);
    return;
  }

  let esbuild;
  try {
    esbuild = require("esbuild");
  } catch (e) {
    fail("Missing dependency: esbuild (add it to devDependencies).");
    if (STRICT) process.exit(1);
    return;
  }

  ensureOutdir();

  // 3) Bundle
  ok(`Bundling widget -> ${path.relative(REPO_ROOT, OUTFILE)}`);
  esbuild
    .build({
      entryPoints: [ENTRY],
      outfile: OUTFILE,
      bundle: true,
      format: "iife",
      globalName: "SS_PRICING_WIDGET",
      platform: "browser",
      target: ["es2018"],
      sourcemap: true,
      minify: true,
      define: {
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
      loader: {
        ".ts": "ts",
        ".tsx": "tsx",
        ".json": "json",
      },
    })
    .then(() => {
      ok("Widget bundle built successfully.");
      if (!fs.existsSync(OUTFILE)) {
        fail("Bundle step completed but output file missing.");
        if (STRICT) process.exit(1);
      }
    })
    .catch((err) => {
      fail(`esbuild failed: ${err && err.message ? err.message : String(err)}`);
      if (STRICT) process.exit(1);
    });
}

main();
