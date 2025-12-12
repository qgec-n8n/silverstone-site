# FILE: scripts/convert-template-images-to-webp.js
#!/usr/bin/env node

/**
 * Convert niche template JPEG images (desktop + mobile) into WebP assets.
 *
 * Source-of-truth:
 *   niche_copy_templates/*_Template.md
 *
 * Expected locations:
 *   Source JPEGs: assets/images/socialmedia/<name>.jpeg
 *   Output WebPs: assets/images/socialmedia/<name>.webp
 *
 * Idempotent behavior:
 * - Skips conversion if output .webp exists AND is newer than source.
 *
 * Failure behavior:
 * - If any referenced JPEG is missing, prints an error and exits non-zero.
 *
 * Usage:
 *   node scripts/convert-template-images-to-webp.js
 *   node scripts/convert-template-images-to-webp.js --strict
 *
 * Notes:
 * - This script intentionally targets ONLY template-referenced images.
 * - It does not recurse through all images to avoid slow runs.
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const args = new Set(process.argv.slice(2));
const strict = args.has("--strict");

const repoRoot = process.cwd();
const templateDir = path.join(repoRoot, "niche_copy_templates");
const imageDir = path.join(repoRoot, "assets", "images", "socialmedia");

function exists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function statMtimeMs(p) {
  return fs.statSync(p).mtimeMs;
}

function listTemplateFiles() {
  if (!exists(templateDir)) {
    throw new Error(`Missing directory: ${templateDir}`);
  }
  return fs
    .readdirSync(templateDir)
    .filter((f) => f.endsWith("_Template.md"))
    .map((f) => path.join(templateDir, f));
}

/**
 * Extract image pairs from template Markdown.
 * Matches patterns like:
 *   Image: “Foo_1.jpeg” ... / “Foo_1_Mobile.jpeg” ...
 */
function extractImagePairs(markdownText) {
  // Normalize curly quotes to straight quotes for easier parsing.
  const txt = markdownText.replace(/[“”]/g, '"');

  const pairs = [];
  const re = /Image:\s*"([^"]+)"[\s\S]*?\/\s*"([^"]+)"/g;
  let match;
  while ((match = re.exec(txt)) !== null) {
    const desktop = match[1].trim();
    const mobile = match[2].trim();
    pairs.push([desktop, mobile]);
  }
  return pairs;
}

function toWebpName(filename) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".jpeg")) return filename.slice(0, -5) + "webp";
  if (lower.endsWith(".jpg")) return filename.slice(0, -3) + "webp";
  if (lower.endsWith(".png")) return filename.slice(0, -3) + "webp";
  return filename + ".webp";
}

async function convertOne(srcPath, outPath) {
  // Reasonable default quality for marketing imagery.
  await sharp(srcPath)
    .webp({ quality: 80 })
    .toFile(outPath);
}

async function main() {
  const templateFiles = listTemplateFiles();

  const referenced = new Set();
  const missing = [];
  const planned = [];

  for (const tplPath of templateFiles) {
    const md = fs.readFileSync(tplPath, "utf8");
    const pairs = extractImagePairs(md);

    for (const [desktop, mobile] of pairs) {
      referenced.add(desktop);
      referenced.add(mobile);
    }
  }

  for (const jpegName of Array.from(referenced).sort()) {
    const src = path.join(imageDir, jpegName);
    if (!exists(src)) {
      missing.push(jpegName);
      continue;
    }

    const outName = toWebpName(jpegName);
    const out = path.join(imageDir, outName);

    const shouldConvert =
      !exists(out) || statMtimeMs(out) < statMtimeMs(src);

    planned.push({ jpegName, src, outName, out, shouldConvert });
  }

  if (missing.length > 0) {
    console.error("\n[convert-template-images-to-webp] Missing source images:");
    for (const m of missing) console.error(`- ${m}`);
    console.error(
      "\nAdd these files to assets/images/socialmedia/ before continuing."
    );
    process.exit(1);
  }

  const toConvert = planned.filter((p) => p.shouldConvert);

  console.log(
    `[convert-template-images-to-webp] Referenced images: ${planned.length}`
  );
  console.log(
    `[convert-template-images-to-webp] Conversions needed: ${toConvert.length}`
  );

  // Concurrency limiter (keeps memory stable).
  const concurrency = 4;
  let idx = 0;

  async function worker() {
    while (idx < toConvert.length) {
      const current = toConvert[idx++];
      console.log(`- Converting ${current.jpegName} -> ${current.outName}`);
      await convertOne(current.src, current.out);
    }
  }

  const workers = [];
  for (let i = 0; i < concurrency; i++) workers.push(worker());
  await Promise.all(workers);

  console.log("[convert-template-images-to-webp] Done.");

  if (strict) {
    // Strict post-check: ensure every referenced webp exists.
    const missingWebp = [];
    for (const p of planned) {
      if (!exists(p.out)) missingWebp.push(p.outName);
    }
    if (missingWebp.length) {
      console.error("\n[convert-template-images-to-webp] Missing output .webp files:");
      for (const m of missingWebp) console.error(`- ${m}`);
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error("[convert-template-images-to-webp] Fatal error:", err);
  process.exit(1);
});
