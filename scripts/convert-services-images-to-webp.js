#!/usr/bin/env node

/**
 * Convert the Services overhaul JPEGs (desktop + mobile) into high-quality WebP.
 *
 * Why this exists:
 * - Services_Overhaul_Copy.md references specific JPEGs for image sections.
 * - The HTML must prefer WebP sources, but keep JPEG fallbacks.
 *
 * Behavior:
 * - Idempotent: skips conversion if output exists and is newer than source.
 * - --check: verifies required WebPs exist (no conversion), exits non-zero if missing.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const REPO_ROOT = path.join(__dirname, "..");
const IMG_DIR = path.join(REPO_ROOT, "assets", "images", "socialmedia");

// Required JPEGs for Services overhaul image sections (case sensitive).
// Section 3.5 is split into TWO cards, requiring 2A and 2B sets.
const REQUIRED_JPEGS = [
  "General_Services_1.jpeg",
  "General_Services_1_Mobile.jpeg",

  "General_Services_2A.jpeg",
  "General_Services_2A_Mobile.jpeg",

  "General_Services_2B.jpeg",
  "General_Services_2B_Mobile.jpeg",

  "General_Services_3.jpeg",
  "General_Services_3_Mobile.jpeg",
];

function exists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function mtimeMs(p) {
  return fs.statSync(p).mtimeMs;
}

function toWebpName(jpegName) {
  if (!jpegName.toLowerCase().endsWith(".jpeg")) {
    throw new Error(`Expected .jpeg filename, got: ${jpegName}`);
  }
  return jpegName.slice(0, -5) + ".webp";
}

async function convertOne(jpegName) {
  const src = path.join(IMG_DIR, jpegName);
  const outName = toWebpName(jpegName);
  const out = path.join(IMG_DIR, outName);

  if (!exists(src)) {
    throw new Error(`Missing source JPEG: ${path.relative(REPO_ROOT, src)}`);
  }

  if (exists(out) && mtimeMs(out) >= mtimeMs(src)) {
    return { jpegName, outName, status: "skipped (up-to-date)" };
  }

  const input = sharp(src, { failOn: "none" });
  const meta = await input.metadata();

  // High-quality WebP. Preserve original resolution (no resize).
  await input
    .webp({
      quality: 95,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(out);

  const outMeta = await sharp(out, { failOn: "none" }).metadata();

  // Safety: ensure we did not downscale.
  if (
    typeof meta.width === "number" &&
    typeof meta.height === "number" &&
    typeof outMeta.width === "number" &&
    typeof outMeta.height === "number"
  ) {
    if (outMeta.width !== meta.width || outMeta.height !== meta.height) {
      throw new Error(
        `WebP dimension mismatch for ${jpegName}: ${meta.width}x${meta.height} -> ${outMeta.width}x${outMeta.height}`
      );
    }
  }

  return { jpegName, outName, status: "converted" };
}

async function checkOnly() {
  const missing = [];
  for (const jpegName of REQUIRED_JPEGS) {
    const webpName = toWebpName(jpegName);
    const out = path.join(IMG_DIR, webpName);
    if (!exists(out)) missing.push(webpName);
  }

  if (missing.length) {
    console.error("[convert-services-images-to-webp] Missing required WebP files:");
    for (const m of missing) console.error(`- assets/images/socialmedia/${m}`);
    process.exit(1);
  }

  console.log("[convert-services-images-to-webp] OK: all required WebPs exist.");
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const check = args.has("--check");

  if (check) {
    await checkOnly();
    return;
  }

  console.log(
    `[convert-services-images-to-webp] Image directory: ${path.relative(REPO_ROOT, IMG_DIR)}`
  );

  const results = [];
  for (const jpegName of REQUIRED_JPEGS) {
    results.push(await convertOne(jpegName));
  }

  console.log("[convert-services-images-to-webp] Results:");
  for (const r of results) {
    console.log(`- ${r.jpegName} -> ${r.outName}: ${r.status}`);
  }

  // Final verification
  await checkOnly();
}

main().catch((err) => {
  console.error("[convert-services-images-to-webp] Fatal error:", err);
  process.exit(1);
});
