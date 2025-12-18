// FILE: scripts/generate-marquee-images.js

/**
 * Generates (or checks) the MARQUEE_IMAGES list in src/js/marquee.js based on
 * assets/images/socialmedia.
 *
 * Rules:
 * - Include each creative once (avoid duplicate file formats).
 * - Prefer .webp, then .jpg, then .jpeg, then .png.
 * - Prefer non-_Mobile rendition; if none exists, fall back to _Mobile.
 * - Interleave aspect buckets by filename prefix:
 *     1-1_*, 2-3_*, 3-2_*, other
 *
 * Usage:
 *   node scripts/generate-marquee-images.js         # writes updates if needed
 *   node scripts/generate-marquee-images.js --check # exits non-zero if out-of-date
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SOCIAL_DIR = path.join(ROOT, "assets", "images", "socialmedia");
const TARGET_FILE = path.join(ROOT, "src", "js", "marquee.js");

const EXT_PRIORITY = [".webp", ".jpg", ".jpeg", ".png"];

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`✅ ${msg}`);
}

function warn(msg) {
  console.warn(`⚠️  ${msg}`);
}

function normalizeKey(filenameNoExt) {
  // Treat *_Mobile as a rendition of the same creative.
  return filenameNoExt.replace(/_Mobile$/i, "");
}

function stripExt(filename) {
  return filename.replace(/\.[^.]+$/, "");
}

function extOf(filename) {
  const m = filename.match(/\.[^.]+$/);
  return m ? m[0].toLowerCase() : "";
}

function isImageFile(filename) {
  const ext = extOf(filename);
  return EXT_PRIORITY.includes(ext);
}

function chooseBestFile(filesForKey) {
  // Prefer non-mobile if present.
  const nonMobile = filesForKey.filter((f) => !stripExt(f).toLowerCase().endsWith("_mobile"));
  const mobile = filesForKey.filter((f) => stripExt(f).toLowerCase().endsWith("_mobile"));

  const candidateSet = nonMobile.length ? nonMobile : mobile;
  if (!candidateSet.length) return null;

  // Prefer extension by priority.
  for (const ext of EXT_PRIORITY) {
    const match = candidateSet.find((f) => extOf(f) === ext);
    if (match) return match;
  }
  return candidateSet[0];
}

function bucketFor(filename) {
  const base = normalizeKey(stripExt(filename));
  if (base.startsWith("1-1_")) return "1-1";
  if (base.startsWith("2-3_")) return "2-3";
  if (base.startsWith("3-2_")) return "3-2";
  return "other";
}

function interleaveBuckets(buckets) {
  const order = ["1-1", "2-3", "3-2", "other"];
  const queues = {};
  for (const k of order) queues[k] = buckets[k] ? [...buckets[k]] : [];

  const total = order.reduce((sum, k) => sum + queues[k].length, 0);
  const out = [];

  let cursor = 0;
  let lastBucket = null;

  while (out.length < total) {
    let pushed = false;

    // Try up to order.length times to find a bucket to pull from.
    for (let attempt = 0; attempt < order.length; attempt++) {
      const key = order[cursor % order.length];
      cursor++;

      if (!queues[key].length) continue;

      // Avoid same-bucket repeats when other buckets are available.
      if (key === lastBucket) {
        const hasOther = order.some((k) => k !== key && queues[k].length);
        if (hasOther) continue;
      }

      out.push(queues[key].shift());
      lastBucket = key;
      pushed = true;
      break;
    }

    if (!pushed) {
      // Fallback: pull from any non-empty bucket.
      const anyKey = order.find((k) => queues[k].length);
      if (!anyKey) break;
      out.push(queues[anyKey].shift());
      lastBucket = anyKey;
    }
  }

  return out;
}

function computeExpectedList() {
  if (!fs.existsSync(SOCIAL_DIR) || !fs.statSync(SOCIAL_DIR).isDirectory()) {
    fail(`Missing directory: assets/images/socialmedia`);
  }

  const files = fs.readdirSync(SOCIAL_DIR).filter(isImageFile);

  if (!files.length) {
    fail(`No images found in assets/images/socialmedia`);
  }

  // Group by normalized creative key.
  const byKey = new Map();
  for (const file of files) {
    const base = stripExt(file);
    const key = normalizeKey(base);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(file);
  }

  // Choose best representative per key.
  const chosen = [];
  for (const [key, filesForKey] of byKey.entries()) {
    const picked = chooseBestFile(filesForKey);
    if (!picked) continue;
    chosen.push(picked);
  }

  // Sort deterministically before bucketing.
  chosen.sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));

  // Bucket and interleave.
  const buckets = { "1-1": [], "2-3": [], "3-2": [], other: [] };
  for (const file of chosen) {
    buckets[bucketFor(file)].push(file);
  }

  // Sort within each bucket for determinism.
  for (const k of Object.keys(buckets)) {
    buckets[k].sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));
  }

  return interleaveBuckets(buckets);
}

function readCurrentList(marqueeJs) {
  const re = /const\s+MARQUEE_IMAGES\s*=\s*\[\s*([\s\S]*?)\s*\];/m;
  const m = marqueeJs.match(re);
  if (!m) {
    fail(`Could not locate "const MARQUEE_IMAGES = [ ... ];" in src/js/marquee.js`);
  }
  const body = m[1];
  const items = [];
  const itemRe = /['"]([^'"]+)['"]/g;
  let im;
  while ((im = itemRe.exec(body))) {
    items.push(im[1]);
  }
  return { items, match: m[0] };
}

function formatList(items) {
  const lines = items.map((f) => `  '${f}',`);
  return `const MARQUEE_IMAGES = [\n${lines.join("\n")}\n];`;
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes("--check");

  if (!fs.existsSync(TARGET_FILE)) {
    fail(`Missing file: src/js/marquee.js`);
  }

  const expected = computeExpectedList();

  const marqueeJs = fs.readFileSync(TARGET_FILE, "utf8");
  const { items: currentItems } = readCurrentList(marqueeJs);

  if (arraysEqual(currentItems, expected)) {
    ok(`MARQUEE_IMAGES is up-to-date (${expected.length} images).`);
    process.exit(0);
  }

  // If check-only, report differences.
  if (checkOnly) {
    const expectedSet = new Set(expected);
    const currentSet = new Set(currentItems);

    const missing = expected.filter((x) => !currentSet.has(x));
    const extra = currentItems.filter((x) => !expectedSet.has(x));

    warn(`MARQUEE_IMAGES is out-of-date.`);
    warn(`Expected ${expected.length} images, found ${currentItems.length}.`);

    if (missing.length) {
      console.error(`\nMissing (${missing.length}):`);
      for (const f of missing.slice(0, 50)) console.error(`  - ${f}`);
      if (missing.length > 50) console.error(`  ... (${missing.length - 50} more)`);
    }

    if (extra.length) {
      console.error(`\nExtra (${extra.length}):`);
      for (const f of extra.slice(0, 50)) console.error(`  - ${f}`);
      if (extra.length > 50) console.error(`  ... (${extra.length - 50} more)`);
    }

    console.error(`\nRun without --check to regenerate the list.`);
    process.exit(1);
  }

  // Write mode: replace the MARQUEE_IMAGES block.
  const reBlock = /const\s+MARQUEE_IMAGES\s*=\s*\[\s*[\s\S]*?\s*\];/m;
  const replacement = formatList(expected);
  const updated = marqueeJs.replace(reBlock, replacement);

  fs.writeFileSync(TARGET_FILE, updated, "utf8");
  ok(`Regenerated MARQUEE_IMAGES in src/js/marquee.js (${expected.length} images).`);
}

main();
