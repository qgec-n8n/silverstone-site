// FILE: scripts/assert-ui-spec.js
/**
 * UI Spec Grader — Requested Edits 1–8
 *
 * This script enforces the repo's proof-marker + structural contracts so Codex cannot claim completion
 * without implementing the requested changes.
 *
 * It is intentionally strict. If you change marker strings, you MUST update:
 * - codex/REQUESTED_EDITS_SPEC.md
 * - codex/MAINTENANCE.md
 * - this file
 */

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");

function readFile(relPath) {
  const fullPath = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required file: ${relPath}`);
  }
  return fs.readFileSync(fullPath, "utf8");
}

function fail(msg) {
  throw new Error(`UI SPEC FAILED: ${msg}`);
}

function assert(cond, msg) {
  if (!cond) fail(msg);
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getContext(haystack, needle, radius = 900) {
  const idx = haystack.indexOf(needle);
  if (idx === -1) return "";
  const start = Math.max(0, idx - radius);
  const end = Math.min(haystack.length, idx + needle.length + radius);
  return haystack.slice(start, end);
}

function assertMarker(haystack, marker, where) {
  assert(haystack.includes(marker), `Missing proof marker "${marker}" in ${where}`);
}

function assertMarkerContext(haystack, marker, where, requiredRegexList) {
  const ctx = getContext(haystack, marker, 1400);
  assert(ctx.length > 0, `Could not extract context for marker "${marker}" in ${where}`);
  for (const { re, desc } of requiredRegexList) {
    assert(re.test(ctx), `Marker "${marker}" in ${where} missing expected context: ${desc}`);
  }
}

function findSourceTags(html, srcSubstring) {
  // Finds <source ...> tags that include srcSubstring in the tag text.
  const re = new RegExp(`<source\\b[^>]*${escapeRegExp(srcSubstring)}[^>]*>`, "gi");
  return html.match(re) || [];
}

function ensureNoDesktopWebpSource(html, baseName) {
  const tags = findSourceTags(html, `${baseName}.webp`);
  for (const tag of tags) {
    const isWebp = /type\s*=\s*["']image\/webp["']/i.test(tag);
    const isDesktop = /min-width\s*:\s*769px/i.test(tag);
    if (isWebp && isDesktop) {
      fail(
        `services.html must not use desktop webp source for "${baseName}.webp" (Edit 3). Found: ${tag}`
      );
    }
  }
}

function ensureHasMobileWebpSource(html, baseName) {
  const tags = findSourceTags(html, `${baseName}_Mobile.webp`);
  const ok = tags.some((tag) => /image\/webp/i.test(tag) && /max-width\s*:\s*768px/i.test(tag));
  assert(ok, `services.html missing mobile webp <source> for "${baseName}_Mobile.webp"`);
}

function ensureHasDesktopJpegSource(html, baseName) {
  const tags = findSourceTags(html, `${baseName}.jpeg`);
  const ok = tags.some((tag) => /min-width\s*:\s*769px/i.test(tag));
  assert(ok, `services.html missing desktop jpeg <source> for "${baseName}.jpeg"`);
}

function ensureIndexSentenceHasMutedClass(indexHtml, sentence) {
  // Find the nearest <p ...> ... </p> that contains the sentence and ensure the opening tag has subtitle-muted.
  const idx = indexHtml.indexOf(sentence);
  assert(idx !== -1, `index.html missing target sentence: ${sentence}`);

  const startP = indexHtml.lastIndexOf("<p", idx);
  const endOpen = indexHtml.indexOf(">", startP);
  assert(startP !== -1 && endOpen !== -1, `Could not locate <p> opening tag for sentence: ${sentence}`);

  const openTag = indexHtml.slice(startP, endOpen + 1);
  assert(
    /subtitle-muted/.test(openTag),
    `Target sentence must be inside a <p> (or wrapper) with class "subtitle-muted". Found: ${openTag}`
  );
}

function parseCuratedImagesFromGallerySource(gallerySource) {
  const start = gallerySource.indexOf("const CURATED_IMAGES");
  assert(start !== -1, `src/js/gallery.js missing "const CURATED_IMAGES"`);
  const openBracket = gallerySource.indexOf("[", start);
  const closeBracket = gallerySource.indexOf("];", openBracket);
  assert(openBracket !== -1 && closeBracket !== -1, `Could not locate CURATED_IMAGES array boundaries`);

  const arrText = gallerySource.slice(openBracket + 1, closeBracket);

  const objMatches = arrText.match(/\{[^}]*\}/g) || [];
  assert(objMatches.length > 0, `Could not parse any CURATED_IMAGES entries`);

  const entries = objMatches
    .map((objText) => {
      const fileMatch = objText.match(/\bfile\s*:\s*['"]([^'"]+)['"]/);
      const typeMatch = objText.match(/\btype\s*:\s*['"]([^'"]+)['"]/);
      const titleMatch = objText.match(/\btitle\s*:\s*['"]([^'"]+)['"]/);
      if (!fileMatch || !typeMatch) return null;
      return {
        file: fileMatch[1],
        type: typeMatch[1],
        title: titleMatch ? titleMatch[1] : "",
      };
    })
    .filter(Boolean);

  assert(entries.length > 0, `Parsed CURATED_IMAGES but no valid {file,type} entries were found`);
  return entries;
}

function assertNoLegacyAspectFilenames(entries) {
  const legacy = entries.filter((e) => /(^|\/)(1-1|2-3|3-2)_/i.test(e.file) || /(1-1|2-3|3-2)/i.test(e.file));
  assert(legacy.length === 0, `Neural Grid still contains legacy filenames (1-1 / 2-3 / 3-2): ${legacy
    .map((e) => e.file)
    .join(", ")}`);
}

function assertNeuralGridReplacements(entries) {
  const allowedSquare = new Set([
    "services_lead_followup_mobile.jpg",
    "services_consulting_mobile.jpg",
    "services_data_integration_mobile.jpg",
    "services_workflow_automation_mobile.jpg",
  ]);

  const allowedLandscape = new Set([
    "services_data_integration.jpg",
    "services_workflow_automation.jpg",
    "services_consulting.jpg",
    "services_lead_followup.jpg",
  ]);

  const portraits = entries.filter((e) => e.type === "portrait");
  const squares = entries.filter((e) => e.type === "square");
  const landscapes = entries.filter((e) => e.type === "landscape");

  // Keep original grid density stable unless explicitly changed.
  assert(entries.length >= 12, `Neural Grid curated list unexpectedly small (${entries.length}).`);
  assert(squares.length > 0 && landscapes.length > 0 && portraits.length > 0, `Neural Grid must include square, landscape, and portrait tiles.`);

  for (const e of squares) {
    assert(allowedSquare.has(e.file), `Square tile file "${e.file}" is not an allowed services_*_mobile.jpg replacement.`);
  }
  for (const e of landscapes) {
    assert(allowedLandscape.has(e.file), `Landscape tile file "${e.file}" is not an allowed services_*.jpg replacement.`);
  }

  // Portrait rules: *_1_Mobile.jpeg OR *_2_Mobile.jpeg OR *_3_Mobile.jpeg, with distinct prefixes.
  const portraitRe = /_(1|2|3)_Mobile\.jpeg$/;
  for (const e of portraits) {
    assert(
      portraitRe.test(e.file),
      `Portrait tile file "${e.file}" must match *_1_Mobile.jpeg / *_2_Mobile.jpeg / *_3_Mobile.jpeg`
    );
  }

  const prefixes = portraits.map((e) => e.file.replace(/_(1|2|3)_Mobile\.jpeg$/, ""));
  const uniquePrefixes = new Set(prefixes);
  assert(
    uniquePrefixes.size === prefixes.length,
    `Portrait tile prefixes must be unique for variety. Duplicates found in: ${prefixes.join(", ")}`
  );
}

function run() {
  const builtCss = readFile("assets/css/styles.css");
  const indexHtml = readFile("index.html");
  const servicesHtml = readFile("services.html");
  const gallerySource = readFile("src/js/gallery.js");

  // ===== Proof markers =====
  assertMarker(builtCss, "SPEC: HERO_DESKTOP_COPY_CTA_TIGHT_CONTAINER_2025_12_30", "assets/css/styles.css");
  assertMarker(builtCss, "SPEC: HERO_MOBILE_HIDE_GREY_SUBHEADINGS_PRESERVE_LAYOUT_2025_12_30", "assets/css/styles.css");
  assertMarker(builtCss, "SPEC: ABOUT_DESKTOP_SILVERSTONE_22_28_COVER_FILL_NEON_WRAP_2025_12_30", "assets/css/styles.css");
  assertMarker(servicesHtml, "SPEC: SERVICES_DESKTOP_GENERAL_SERVICES_IMAGES_HD_2025_12_30", "services.html");
  assertMarker(builtCss, "SPEC: SERVICES_MOBILE_GENERAL_SERVICES_CARDS_PORTRAIT_2_3_2025_12_30", "assets/css/styles.css");
  assertMarker(gallerySource, "SPEC: SERVICES_NEURAL_GRID_REPLACE_SQUARE_LANDSCAPE_2025_12_30", "src/js/gallery.js");
  assertMarker(gallerySource, "SPEC: SERVICES_NEURAL_GRID_REPLACE_PORTRAIT_2025_12_30", "src/js/gallery.js");
  assertMarker(builtCss, "SPEC: INDEX_SUBTITLES_GREY_TARGETED_SENTENCES_2025_12_30", "assets/css/styles.css");

  // ===== Marker context sanity =====
  assertMarkerContext(builtCss, "SPEC: HERO_DESKTOP_COPY_CTA_TIGHT_CONTAINER_2025_12_30", "assets/css/styles.css", [
    { re: /@media\s*\(min-width:\s*769px\)/, desc: "desktop-only media query @media (min-width: 769px)" },
    { re: /\.hero\.title-band\s+\.content/, desc: "targets .hero.title-band .content" },
  ]);

  assertMarkerContext(builtCss, "SPEC: HERO_MOBILE_HIDE_GREY_SUBHEADINGS_PRESERVE_LAYOUT_2025_12_30", "assets/css/styles.css", [
    { re: /@media\s*\(max-width:\s*768px\)/, desc: "mobile-only media query @media (max-width: 768px)" },
    { re: /\.hero\.title-band\s+\.content\s+p/, desc: "targets hero subheading paragraph" },
    { re: /visibility\s*:\s*hidden/, desc: "uses visibility:hidden to avoid layout shift" },
  ]);

  assertMarkerContext(builtCss, "SPEC: ABOUT_DESKTOP_SILVERSTONE_22_28_COVER_FILL_NEON_WRAP_2025_12_30", "assets/css/styles.css", [
    { re: /@media\s*\(min-width:\s*769px\)/, desc: "desktop-only media query @media (min-width: 769px)" },
    { re: /page-about/i, desc: "scoped to .page-about" },
    { re: /object-fit\s*:\s*cover/i, desc: "forces object-fit: cover" },
  ]);

  assertMarkerContext(builtCss, "SPEC: SERVICES_MOBILE_GENERAL_SERVICES_CARDS_PORTRAIT_2_3_2025_12_30", "assets/css/styles.css", [
    { re: /@media\s*\(max-width:\s*768px\)/, desc: "mobile-only media query @media (max-width: 768px)" },
    { re: /general-services-card/, desc: "targets .general-services-card hook" },
    { re: /aspect-ratio\s*:\s*2\s*\/\s*3|aspect-ratio\s*:\s*2\s*\/\s*3/i, desc: "sets portrait aspect-ratio 2/3" },
  ]);

  // ===== Edit 3: Services desktop uses jpeg (no desktop webp) =====
  assert(
    servicesHtml.includes("general-services-card"),
    `services.html must include the "general-services-card" class hook for Edit 4`
  );

  const generalBases = ["General_Services_1", "General_Services_2A", "General_Services_2B", "General_Services_3"];
  for (const base of generalBases) {
    ensureHasMobileWebpSource(servicesHtml, base);
    ensureNoDesktopWebpSource(servicesHtml, base);
    ensureHasDesktopJpegSource(servicesHtml, base);
  }

  // ===== Edit 8: Index target sentences have subtitle-muted class =====
  ensureIndexSentenceHasMutedClass(
    indexHtml,
    "Four practical ways we help UK small businesses save time, respond faster, and keep customers moving - without ripping out the tools you already use."
  );
  ensureIndexSentenceHasMutedClass(
    indexHtml,
    "Clear setup + monthly support. Start with a flagship system, or pick a smaller module if you're fixing one leak first."
  );

  // ===== Edits 5–6: Neural Grid curated list compliance =====
  const entries = parseCuratedImagesFromGallerySource(gallerySource);
  assertNoLegacyAspectFilenames(entries);
  assertNeuralGridReplacements(entries);

  console.log("UI SPEC PASSED: Requested Edits 1–8");
}

run();
