// FILE: scripts/validate-requested-edits.js
/**
 * Requested Edits 1–12 validator
 *
 * This script is intentionally pragmatic: it validates the presence of proof markers,
 * critical copy requirements, critical wiring expectations, and required asset references.
 *
 * Run via:
 *   node scripts/validate-requested-edits.js --strict
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const STRICT = process.argv.includes("--strict");

const errors = [];
const warnings = [];

function rel(p) {
  return path.join(ROOT, p);
}

const fileCache = new Map();

function readText(p) {
  const abs = rel(p);
  if (fileCache.has(abs)) return fileCache.get(abs);
  const txt = fs.readFileSync(abs, "utf8");
  fileCache.set(abs, txt);
  return txt;
}

function exists(p) {
  return fs.existsSync(rel(p));
}

function err(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function mustExist(p, msg) {
  if (!exists(p)) err(`${msg} (missing: ${p})`);
}

function mustContain(p, needle, msg) {
  const txt = readText(p);
  if (!txt.includes(needle)) err(`${msg} (missing "${needle}" in ${p})`);
}

function mustNotContain(p, needle, msg) {
  const txt = readText(p);
  if (txt.includes(needle)) err(`${msg} (found "${needle}" in ${p})`);
}

function mustMatch(p, re, msg) {
  const txt = readText(p);
  if (!re.test(txt)) err(`${msg} (pattern not found in ${p}: ${re})`);
}

function findInDir(dirRel, predicate) {
  const absDir = rel(dirRel);
  const out = [];
  (function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(current, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile()) {
        const relPath = path.relative(ROOT, p).replace(/\\/g, "/");
        const txt = fs.readFileSync(p, "utf8");
        if (predicate(relPath, txt)) out.push(relPath);
      }
    }
  })(absDir);
  return out;
}

function sectionById(html, id) {
  const re = new RegExp(`<section[^>]*id=["']${id}["'][\\s\\S]*?<\\/section>`, "i");
  const m = html.match(re);
  return m ? m[0] : null;
}

// ------------------------------------------------------------
// Proof markers (must exist)
// ------------------------------------------------------------
mustContain("pricing-widget/src/pricing-widget.css", "SS_PRICING_SPEC: LIGHT_MODE_BG_VIBRANCY_BOOST_2025_12",
  "Edit #1: pricing vibrancy proof marker required");

mustContain("src/css/base/layout.css", "SPEC: GLOBAL_SECTION_SUBTITLE_GREY_2025_12",
  "Edit #3: global section subtitle grey proof marker required");

mustContain("src/css/components/hero.css", "SPEC: HERO_SUBTITLE_NONWHITE_2025_12",
  "Edit #4: hero subtitle non-white proof marker required");
mustContain("src/css/components/hero.css", "SPEC: HERO_TEXT_LEGIBILITY_GLASS_PANEL_2025_12",
  "Edit #5: hero legibility panel proof marker required");
mustContain("src/css/components/hero.css", "SPEC: HERO_CTA_GAP_2025_12",
  "Edit #6: hero CTA gap proof marker required");
mustContain("src/css/components/hero.css", "SPEC: MOBILE_HERO_LAYOUT_TUNING_2025_12",
  "Edit #12b/12c: mobile hero layout tuning proof marker required");

mustContain("src/css/pages/services.css", "SPEC: SERVICES_IMAGE_NEON_BORDER_MATCH_NICHES_2025_12",
  "Edit #2: services image neon border parity proof marker required");

mustContain("src/css/components/cards.css", "SPEC: SERVICE_IMAGES_CONTAIN_NO_CROP_2025_12",
  "Edit #7: service images contain/no-crop proof marker required");

mustContain("book.html", "SPEC: CALENDLY_EARLY_LOAD_2025_12",
  "Edit #8: Calendly early-load proof marker required");

mustContain("about.html", "SPEC: ABOUT_STATS_UPDATED_2025_12",
  "Edit #9: about stats update proof marker required");

mustContain("index.html", "SPEC: INDEX_NO_HYPE_STATS_COPY_UPDATED_2025_12",
  "Edit #10: index stats copy update proof marker required");

mustContain("index.html", "SPEC: INDEX_SERVICES_IMAGE_GRID_2025_12",
  "Edit #11: index services image grid proof marker required");

// JS marker can live in any src/js file
{
  const marker = "SPEC: INDEX_SERVICES_IMAGE_LIGHTBOX_2025_12";
  const hits = findInDir("src/js", (_p, txt) => txt.includes(marker));
  if (hits.length === 0) err(`Edit #11f: missing JS proof marker "${marker}" in src/js/**`);
}

mustContain("src/js/header-nav.js", "SPEC: MOBILE_MENU_BANNER_TWO_STEP_2025_12",
  "Edit #12a: mobile menu banner two-step proof marker required");

// ------------------------------------------------------------
// Asset existence checks (prevents broken images)
// ------------------------------------------------------------

// Edit #2 images
[
  "assets/images/socialmedia/General_Services_1.webp",
  "assets/images/socialmedia/General_Services_2A.webp",
  "assets/images/socialmedia/General_Services_2B.webp",
  "assets/images/socialmedia/General_Services_3.webp",
].forEach((p) => mustExist(p, "Edit #2: required services image asset must exist"));

// Edit #11 images (desktop + mobile)
[
  "assets/images/socialmedia/services_consulting.jpg",
  "assets/images/socialmedia/services_lead_followup.jpg",
  "assets/images/socialmedia/services_workflow_automation.jpg",
  "assets/images/socialmedia/services_data_integration.jpg",
  "assets/images/socialmedia/services_consulting_mobile.jpg",
  "assets/images/socialmedia/services_lead_followup_mobile.jpg",
  "assets/images/socialmedia/services_workflow_automation_mobile.jpg",
  "assets/images/socialmedia/services_data_integration_mobile.jpg",
].forEach((p) => mustExist(p, "Edit #11: required index services tile image must exist"));

// ------------------------------------------------------------
// Edit #9: about stats exact values
// ------------------------------------------------------------
{
  const about = readText("about.html");

  mustContain("about.html", "Clients Served", "Edit #9: about stats must include label 'Clients Served'");
  mustContain("about.html", "Automations Delivered", "Edit #9: about stats must include label 'Automations Delivered'");
  mustContain("about.html", "Hours Saved", "Edit #9: about stats must include label 'Hours Saved'");
  mustContain("about.html", "Industries Served", "Edit #9: about stats must include label 'Industries Served'");

  mustMatch("about.html", /data-target\s*=\s*["']17["']/, "Edit #9: about must include data-target=\"17\"");
  mustMatch("about.html", /data-target\s*=\s*["']18["']/, "Edit #9: about must include data-target=\"18\"");
  mustMatch("about.html", /data-target\s*=\s*["']2300["'][\s\S]*data-plus\s*=\s*["']\+["']/, "Edit #9: about must include data-target=\"2300\" with data-plus=\"+\"");
  mustMatch("about.html", /data-target\s*=\s*["']9["']/, "Edit #9: about must include data-target=\"9\"");

  if (about.includes("Minute Automation Audit") || about.includes("AI Audit")) {
    err("Edit #9: about must remove the '30 minute AI Audit' stat copy");
  }
}

// ------------------------------------------------------------
// Edit #10: index stats copy + numeric-only animation via data-plus
// ------------------------------------------------------------
{
  const idx = readText("index.html");

  mustContain("index.html", "100% of all calls, emails and texts answered",
    "Edit #10: index must include the updated 100% stat sentence");
  mustContain("index.html", "10x Lead Conversion Rate",
    "Edit #10: index must include the updated 10x stat sentence");

  mustNotContain("index.html", "100 Times Better Contact Odds in 5 Minutes",
    "Edit #10: old 100-times stat copy must be removed");
  mustNotContain("index.html", "80 Callers Lost to Voicemail",
    "Edit #10: old voicemail stat copy must be removed");

  mustMatch("index.html", /data-target\s*=\s*["']100["'][^>]*data-plus\s*=\s*["']%["']/,
    "Edit #10: numeric-only animation requires data-target=\"100\" with data-plus=\"%\"");
  mustMatch("index.html", /data-target\s*=\s*["']10["'][^>]*data-plus\s*=\s*["']x["']/,
    "Edit #10: numeric-only animation requires data-target=\"10\" with data-plus=\"x\"");
}

// ------------------------------------------------------------
// Edit #11: index services cards -> images, with mobile variants and buttons
// ------------------------------------------------------------
{
  const idx = readText("index.html");
  const section = sectionById(idx, "what-we-automate");
  if (!section) {
    err("Edit #11: could not locate <section id=\"what-we-automate\"> in index.html");
  } else {
    const requiredDesktop = [
      "services_consulting.jpg",
      "services_lead_followup.jpg",
      "services_workflow_automation.jpg",
      "services_data_integration.jpg",
    ];
    const requiredMobile = [
      "services_consulting_mobile.jpg",
      "services_lead_followup_mobile.jpg",
      "services_workflow_automation_mobile.jpg",
      "services_data_integration_mobile.jpg",
    ];

    for (const img of requiredDesktop) {
      if (!section.includes(img)) err(`Edit #11: what-we-automate section missing desktop image reference: ${img}`);
    }
    for (const img of requiredMobile) {
      if (!section.includes(img)) err(`Edit #11: what-we-automate section missing mobile image reference: ${img}`);
    }

    // Old card class names must be removed
    const oldCardClasses = [
      "card-ai-consulting",
      "card-lead-followup",
      "card-workflow-automation",
      "card-data-integration",
      "feature-card",
    ];
    for (const cls of oldCardClasses) {
      if (section.includes(cls)) err(`Edit #11: what-we-automate section still contains old card marker/class: ${cls}`);
    }

    // Require 4+ buttons (user asked for a button per image)
    const btnCount = (section.match(/class\s*=\s*["'][^"']*\bbtn\b[^"']*["']/g) || []).length;
    if (btnCount < 4) err(`Edit #11: expected at least 4 buttons in what-we-automate section; found ${btnCount}`);

    // Encourage (but do not strictly enforce) obvious click affordance hooks
    const hasClickAffordanceHint =
      section.includes("lightbox") ||
      section.includes("expand") ||
      section.includes("click") ||
      section.includes("tap");
    if (!hasClickAffordanceHint) {
      warn("Edit #11: did not detect any obvious click-to-expand hint text/class in what-we-automate section (manual QA must confirm affordance).");
    }
  }
}

// ------------------------------------------------------------
// Edit #6: normalize index hero CTAs into .cta-buttons container
// ------------------------------------------------------------
{
  const idx = readText("index.html");
  if (!idx.includes('class="cta-buttons"')) {
    err("Edit #6: index hero CTAs must use a .cta-buttons container for consistent spacing.");
  }
}

// ------------------------------------------------------------
// Edit #7: ensure service-image uses contain (no crop) in shared CSS
// ------------------------------------------------------------
{
  // We check for object-fit: contain in the service-image img rule.
  // (Exact selector can vary slightly, but 'service-image' + 'object-fit: contain' should be present.)
  const cards = readText("src/css/components/cards.css");
  if (!/service-image[\s\S]{0,120}object-fit\s*:\s*contain/i.test(cards)) {
    err("Edit #7: cards.css must set service-image images to object-fit: contain (no crop).");
  }
}

// ------------------------------------------------------------
// Edit #4: hero subtitle must not be hardcoded white in title-band rule
// ------------------------------------------------------------
{
  const hero = readText("src/css/components/hero.css");
  if (/\.hero\.title-band\s+\.content\s+p\s*\{[^}]*color\s*:\s*#fff/i.test(hero)) {
    err("Edit #4: hero title-band subtitle rule must not set color: #fff (must be non-white).");
  }
}

// ------------------------------------------------------------
// Edit #12a: mobile menu indicator click must not open the panel; backdrop must not close
// ------------------------------------------------------------
{
  const nav = readText("src/js/header-nav.js");
  const idx = nav.indexOf("headerIndicator.addEventListener");
  if (idx === -1) {
    err("Edit #12a: could not find headerIndicator.addEventListener in src/js/header-nav.js");
  } else {
    const slice = nav.slice(idx, idx + 700);
    if (slice.includes("openMobileNav")) {
      err("Edit #12a: header indicator click handler must NOT call openMobileNav (first tap expands only).");
    }
  }

  if (nav.includes("mobileBackdrop.addEventListener('click'") || nav.includes('mobileBackdrop.addEventListener("click"')) {
    err("Edit #12a: mobile backdrop must not have a click-to-close handler (only back button closes).");
  }
}

// ------------------------------------------------------------
// Edit #8: Calendly early-load heuristics (must be in <head>)
// ------------------------------------------------------------
{
  const book = readText("book.html");
  const headMatch = book.match(/<head[\s\S]*?<\/head>/i);
  if (!headMatch) {
    err("Edit #8: could not extract <head> from book.html");
  } else {
    const head = headMatch[0];
        const hasCalendlyRefInHead = /calendly[\s\S]*widget\.js/i.test(head);
    if (!hasCalendlyRefInHead) {
      // Script might still be at bottom; but requirement is faster load, so we expect early-load work.
      err("Edit #8: expected Calendly widget.js to be referenced or preloaded in <head> (to improve scroll-time load).");
    } else {
      const hasPreload = /<link[^>]*rel\s*=\s*["']preload["'][^>]*as\s*=\s*["']script["'][^>]*calendly[^>]*widget\.js/i.test(head);
      const hasDeferScript = /<script[^>]*calendly[^>]*widget\.js[^>]*defer/i.test(head);
      if (!hasPreload && !hasDeferScript) {
        err("Edit #8: Calendly should be preloaded and/or loaded via <script defer> in <head> to reduce buffering.");
      }
    }
  }
}

// ------------------------------------------------------------
// Report
// ------------------------------------------------------------
if (warnings.length) {
  console.warn("\nWarnings:");
  for (const w of warnings) console.warn(`- ${w}`);
}

if (errors.length) {
  console.error("\nRequested Edits validation FAILED:");
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
} else {
  console.log("✅ Requested Edits validation passed.");
}
