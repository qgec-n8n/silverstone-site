/**
 * One-off (re-runnable) optimiser for the raster art under `public/`.
 *
 * The approved art was committed straight from its export: 2528x1696 stills at
 * 5-7 MB each, with the "_Mobile"/"-mobile" crops just as heavy, so phones were
 * downloading ~6.7 MB per page. Ahrefs flagged 39 of them (159.8 MB) and the
 * homepage measured 8.65 MB of transfer.
 *
 * For every raster image referenced from `src/`, this writes:
 *   - a `.webp` sibling, which `<picture>` offers first
 *   - a re-encoded original-format file at the same path, as the fallback
 *
 * Desktop stills keep their native pixel dimensions, because `route-art.ts`
 * declares 2528x1696 on the `<img>` and that attribute pair is what reserves
 * the layout box — changing the ratio would reintroduce CLS. The mobile crops
 * carry no declared dimensions (they are served through `<source>`), so they
 * are additionally capped to MOBILE_MAX_WIDTH.
 *
 * Originals are recoverable from git history; run with `--dry` to preview.
 *
 *   node scripts/optimize-images.mjs [--dry]
 */
import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const PUBLIC = path.join(ROOT, "public");
const DRY = process.argv.includes("--dry");

const MOBILE_MAX_WIDTH = 1080;
const WEBP_QUALITY = 78;
const JPEG_QUALITY = 80;
const RASTER = new Set([".png", ".jpg", ".jpeg"]);

/** Every referenced `/…` image path found in the application source. */
async function referencedImages() {
  const found = new Set();
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (!/\.(ts|tsx|css|json)$/.test(entry.name)) continue;
      const text = await readFile(full, "utf8");
      for (const match of text.matchAll(
        /["'`(](\/[A-Za-z0-9/_.-]+\.(?:png|jpe?g))["'`)]/g,
      )) {
        found.add(match[1]);
      }
    }
  };
  await walk(SRC);
  return [...found].sort();
}

const isMobile = (file) => /[-_]mobile\.[a-z]+$/i.test(file);

async function main() {
  const refs = await referencedImages();
  let before = 0;
  let after = 0;
  let webpTotal = 0;
  let processed = 0;
  const skipped = [];

  for (const ref of refs) {
    const file = path.join(PUBLIC, ref);
    let original;
    try {
      original = await stat(file);
    } catch {
      skipped.push(`${ref} (not found on disk)`);
      continue;
    }
    const ext = path.extname(file).toLowerCase();
    if (!RASTER.has(ext)) continue;

    const input = await readFile(file);
    const base = sharp(input, { failOn: "none" });
    const meta = await base.metadata();

    const resize =
      isMobile(file) && (meta.width ?? 0) > MOBILE_MAX_WIDTH
        ? { width: MOBILE_MAX_WIDTH, withoutEnlargement: true }
        : null;

    const pipeline = () => {
      const next = sharp(input, { failOn: "none" }).rotate();
      return resize ? next.resize(resize) : next;
    };

    const webp = await pipeline().webp({ quality: WEBP_QUALITY, effort: 5 }).toBuffer();
    const fallback =
      ext === ".png"
        ? await pipeline().png({ compressionLevel: 9, palette: true }).toBuffer()
        : await pipeline().jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();

    before += original.size;
    // Never let the "optimised" fallback be larger than what shipped before.
    const keptFallback = fallback.length < original.size ? fallback : input;
    after += keptFallback.length;
    webpTotal += webp.length;
    processed += 1;

    if (!DRY) {
      await writeFile(file, keptFallback);
      await writeFile(file.replace(/\.[a-z]+$/i, ".webp"), webp);
    }

    const note = resize ? ` resized→${MOBILE_MAX_WIDTH}w` : "";
    console.log(
      `${(original.size / 1048576).toFixed(2)}MB → ` +
        `${(keptFallback.length / 1048576).toFixed(2)}MB fallback / ` +
        `${(webp.length / 1048576).toFixed(2)}MB webp${note}  ${ref}`,
    );
  }

  console.log(
    `\n${DRY ? "[dry run] " : ""}${processed} images\n` +
      `  before            ${(before / 1048576).toFixed(1)} MB\n` +
      `  fallback after    ${(after / 1048576).toFixed(1)} MB\n` +
      `  webp (served)     ${(webpTotal / 1048576).toFixed(1)} MB` +
      `  — ${(100 - (webpTotal / before) * 100).toFixed(1)}% smaller`,
  );
  if (skipped.length > 0) {
    console.log(`\nskipped:\n  ${skipped.join("\n  ")}`);
  }
}

await main();
