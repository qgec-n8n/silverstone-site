// FILE: scripts/validate-requested-edits.js
/**
 * Validates Requested Edits 1–6 with lightweight static checks.
 *
 * IMPORTANT:
 * - This is NOT a visual test runner.
 * - It enforces "proof anchors" + structural invariants that correlate strongly with the requested UI outcomes.
 * - Manual QA is still required (see codex/MANUAL_QA_CHECKLIST.md).
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const STRICT = process.argv.includes("--strict");

function fail(msg) {
  console.error(`[validate-requested-edits] ❌ ${msg}`);
  process.exit(1);
}

function warn(msg) {
  console.warn(`[validate-requested-edits] ⚠️ ${msg}`);
}

function readText(relPath) {
  const p = path.join(ROOT, relPath);
  if (!fs.existsSync(p)) fail(`Missing expected file: ${relPath}`);
  return fs.readFileSync(p, "utf8");
}

function listHtmlFiles() {
  const core = ["index.html", "about.html", "services.html", "book.html", "contact.html"];
  const nichesDir = path.join(ROOT, "niches");
  const niche = fs.existsSync(nichesDir)
    ? fs
        .readdirSync(nichesDir)
        .filter((f) => f.toLowerCase().endsWith(".html"))
        .map((f) => path.join("niches", f))
    : [];
  return [...core, ...niche];
}

function extractCssBlock(cssText, selector) {
  const idx = cssText.indexOf(selector);
  if (idx < 0) return null;
  const braceStart = cssText.indexOf("{", idx);
  if (braceStart < 0) return null;

  let i = braceStart + 1;
  let depth = 1;
  while (i < cssText.length && depth > 0) {
    const ch = cssText[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    i++;
  }
  if (depth !== 0) return null;
  return cssText.slice(braceStart + 1, i - 1);
}

function checkHeroGlassPanelRemoved() {
  const heroCss = readText("src/css/components/hero.css");

  // Marker presence (proof anchor) — enforced strictly.
  if (!heroCss.includes("SPEC: HERO_NO_GLASS_PANEL_2025_12")) {
    fail("Missing proof marker: SPEC: HERO_NO_GLASS_PANEL_2025_12 (expected in src/css/components/hero.css).");
  }

  const block = extractCssBlock(heroCss, ".hero.title-band .content");
  if (!block) {
    fail('Could not find CSS block for selector ".hero.title-band .content" in src/css/components/hero.css');
  }

  const forbidden = ["backdrop-filter", "-webkit-backdrop-filter"];
  for (const term of forbidden) {
    if (block.includes(term)) {
      fail(`Hero content still contains "${term}" — the glass/blur panel must be removed.`);
    }
  }

  // Background, border, and box-shadow indicate a container visually sitting behind text.
  // We allow explicit transparent/none backgrounds, but not tinted panels.
  const backgroundLine = block.match(/\bbackground\s*:\s*([^;]+);/i);
  if (backgroundLine) {
    const val = backgroundLine[1].trim().toLowerCase();
    const allowed = ["none", "transparent"];
    if (!allowed.some((a) => val.startsWith(a))) {
      fail(
        `Hero content still has a non-transparent background ("${backgroundLine[0].trim()}"). Remove the panel background.`
      );
    }
  }

  if (/\bborder\s*:/i.test(block)) {
    fail('Hero content still sets "border:" — remove the container framing behind hero copy.');
  }

  if (/\bbox-shadow\s*:/i.test(block)) {
    fail('Hero content still sets "box-shadow:" — remove the container shadow behind hero copy.');
  }
}

function checkIndexButtonNowrap() {
  const indexHtml = readText("index.html");
  const buttonsCss = readText("src/css/components/buttons.css");

  // Marker can live in either index.html or buttons.css; we validate at least one location.
  const marker = "SPEC: INDEX_STREAMLINE_WORKFLOWS_NOWRAP_2025_12";
  if (!indexHtml.includes(marker) && !buttonsCss.includes(marker)) {
    fail(`Missing proof marker: ${marker} (place near the nowrap implementation).`);
  }

  // Find the anchor containing the Streamline workflows label and ensure it includes class "btn-nowrap".
  const re = /<a\b([^>]*\bclass=["'][^"']*[^"']*["'][^>]*)>\s*Streamline workflows\s*<\/a>/i;
  const m = indexHtml.match(re);
  if (!m) {
    warn('Could not locate the "Streamline workflows" button anchor in index.html (text match failed).');
    if (STRICT) fail("Strict mode: expected to find the Streamline workflows button in index.html.");
    return;
  }

  const attrs = m[1];
  if (!/\bbtn-nowrap\b/i.test(attrs)) {
    fail(
      'The "Streamline workflows" button must include a "btn-nowrap" class so it can be forced onto one line.'
    );
  }

  // Ensure CSS defines .btn-nowrap with white-space: nowrap;
  if (!/\.btn-nowrap\b[\s\S]*?\bwhite-space\s*:\s*nowrap\s*;/m.test(buttonsCss)) {
    fail('src/css/components/buttons.css must define ".btn-nowrap { white-space: nowrap; }"');
  }
}

function checkSectionSubtitlesGrey() {
  const layoutCss = readText("src/css/base/layout.css");

  if (!layoutCss.includes("SPEC: SECTION_SUBTITLES_GREY_GLOBAL_2025_12")) {
    fail(
      "Missing proof marker: SPEC: SECTION_SUBTITLES_GREY_GLOBAL_2025_12 (expected in src/css/base/layout.css)."
    );
  }

  const block = extractCssBlock(layoutCss, ".section-subtitle");
  if (!block) fail('Could not find CSS block for selector ".section-subtitle" in src/css/base/layout.css');

  // Require that section subtitles reference the original silver token (so they don't turn white via variable overrides).
  // We accept either direct var(--color-silver-original) usage, or a dedicated subtitle token that equals it.
  const ok =
    /var\(\s*--color-silver-original\s*\)/.test(block) ||
    /var\(\s*--color-subtitle\s*\)/.test(block);

  if (!ok) {
    fail(
      'The ".section-subtitle" color must be based on the original grey token (e.g., var(--color-silver-original)) so subtitles stay grey on all pages.'
    );
  }

  // Scan HTML for inline "section-subtitle" color forcing white (or var(--color-silver) which may be overridden to white).
  const files = listHtmlFiles();
  for (const rel of files) {
    const html = readText(rel);

    // Grab all start tags with class section-subtitle
    const tagRe = /<p\b[^>]*\bclass=["'][^"']*\bsection-subtitle\b[^"']*["'][^>]*>/gi;
    const tags = html.match(tagRe) || [];
    for (const tag of tags) {
      const styleMatch = tag.match(/\bstyle=["']([^"']+)["']/i);
      if (!styleMatch) continue;
      const style = styleMatch[1].toLowerCase();

      if (style.includes("color: var(--color-white)") || style.includes("color:#fff") || style.includes("color: #fff")) {
        fail(`${rel}: section-subtitle has inline white color. Remove inline white forcing so it becomes grey.`);
      }

      if (style.includes("color: var(--color-silver)")) {
        fail(
          `${rel}: section-subtitle uses inline color: var(--color-silver). This can resolve to white due to page overrides. Remove the inline color or use var(--color-silver-original).`
        );
      }
    }
  }
}

function checkServiceAndNicheImagesFillCardNoHeightCrop() {
  const cardsCss = readText("src/css/components/cards.css");

  if (!cardsCss.includes("SPEC: SERVICES_NICHES_IMAGES_FILL_CARD_NO_HEIGHT_CROP_2025_12")) {
    fail(
      "Missing proof marker: SPEC: SERVICES_NICHES_IMAGES_FILL_CARD_NO_HEIGHT_CROP_2025_12 (expected in src/css/components/cards.css)."
    );
  }

  // We expect a page-scoped rule targeting .service-img (services + niche pages) to fill height and allow width overflow.
  // Requirements for the rule (heuristics):
  // - height: 100%
  // - width: auto
  // - max-width: none  (so horizontal overflow can occur -> width crop)
  // - left: 50% + translateX(-50%) OR equivalent centering
  const ruleRe = /\.page-(services|niche)[\s\S]{0,500}\.service-img[\s\S]{0,500}\{/m;
  if (!ruleRe.test(cardsCss)) {
    fail(
      "Expected cards.css to contain a .page-services/.page-niche rule for .service-img to enforce fill-card behavior."
    );
  }

  // Property checks (not tied to exact formatting)
  const mustHave = ["height: 100%", "width: auto", "max-width: none"];
  for (const prop of mustHave) {
    if (!cardsCss.toLowerCase().includes(prop)) {
      fail(`Expected cards.css to include "${prop}" as part of the services/niche image fill rules.`);
    }
  }

  const hasCentering =
    cardsCss.includes("left: 50%") && /translateX\(\s*-50%\s*\)/.test(cardsCss);
  if (!hasCentering) {
    warn(
      "Could not detect horizontal centering via left:50% + translateX(-50%) in cards.css. If you used a different centering method (e.g., flex), ensure width-only cropping still occurs."
    );
    if (STRICT) {
      fail(
        "Strict mode: expected a detectable centering approach (left:50% + translateX(-50%)) for width-only cropping."
      );
    }
  }
}

function checkAboutImagesCopyVisibleNoCrop() {
  const aboutCss = readText("src/css/pages/about.css");
  const cardsCss = readText("src/css/components/cards.css");

  const marker = "SPEC: ABOUT_IMAGES_COPY_VISIBLE_NO_CROP_2025_12";
  if (!aboutCss.includes(marker) && !cardsCss.includes(marker)) {
    fail(`Missing proof marker: ${marker} (place near about image-fit rule).`);
  }

  // About page must not crop the top copy: ensure about-scoped images use object-fit: contain
  // and object-position includes "top" (either "top" or "0%").
  const combined = `${aboutCss}\n${cardsCss}`.toLowerCase();
  const aboutRuleMentionsContain =
    combined.includes(".page-about") &&
    combined.includes("object-fit: contain");

  if (!aboutRuleMentionsContain) {
    fail(
      "Expected an about-scoped rule ensuring about images use object-fit: contain (no cropping)."
    );
  }

  const aboutRuleMentionsTop =
    combined.includes(".page-about") &&
    (combined.includes("object-position: top") || combined.includes("object-position: 50% 0%") || combined.includes("object-position: center top"));

  if (!aboutRuleMentionsTop) {
    warn(
      "Could not detect an explicit about-scoped object-position: top. If the about images contain copy near the top, explicitly pin object-position to top to keep it visible."
    );
    if (STRICT) {
      fail("Strict mode: expected about images to explicitly use object-position: top (top-safe).");
    }
  }
}

function main() {
  checkHeroGlassPanelRemoved();
  checkIndexButtonNowrap();
  checkSectionSubtitlesGrey();
  checkServiceAndNicheImagesFillCardNoHeightCrop();
  checkAboutImagesCopyVisibleNoCrop();

  console.log("[validate-requested-edits] ✅ Requested Edits 1–6 checks passed.");
}

main();
