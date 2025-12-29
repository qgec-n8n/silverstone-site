// FILE: scripts/validate-homepage-index-sections.js
/**
 * Homepage (index.html) structural validator.
 *
 * Purpose:
 * - Catch regressions on index-specific requirements (Edits #10 and #11).
 * - Keep checks lightweight and deterministic (string/regex based).
 *
 * Run:
 *   node scripts/validate-homepage-index-sections.js --strict
 */

const fs = require("fs");

const STRICT = process.argv.includes("--strict");
const errors = [];
const warnings = [];

function err(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

function read(p) {
  return fs.readFileSync(p, "utf8");
}

function mustContain(file, needle, msg) {
  const txt = read(file);
  if (!txt.includes(needle)) err(`${msg} (missing "${needle}" in ${file})`);
}

function sectionById(html, id) {
  const re = new RegExp(`<section[^>]*id=["']${id}["'][\\s\\S]*?<\\/section>`, "i");
  const m = html.match(re);
  return m ? m[0] : null;
}

const file = "index.html";
const html = read(file);

// Required proof markers (index-local)
mustContain(file, "SPEC: INDEX_NO_HYPE_STATS_COPY_UPDATED_2025_12", "Missing Edit #10 proof marker");
mustContain(file, "SPEC: INDEX_SERVICES_IMAGE_GRID_2025_12", "Missing Edit #11 proof marker");

// ---- Stats section checks (Edit #10) ----
mustContain(file, "100% of all calls, emails and texts answered", "Edit #10: missing updated 100% stat copy");
mustContain(file, "10x Lead Conversion Rate", "Edit #10: missing updated 10x stat copy");

if (html.includes("100 Times Better Contact Odds in 5 Minutes")) err("Edit #10: old 100-times stat copy still present");
if (html.includes("80 Callers Lost to Voicemail")) err("Edit #10: old voicemail stat copy still present");

// Ensure numeric-only animation config is present
if (!/data-target\s*=\s*["']100["'][^>]*data-plus\s*=\s*["']%["']/.test(html)) {
  err("Edit #10: expected data-target=\"100\" with data-plus=\"%\"");
}
if (!/data-target\s*=\s*["']10["'][^>]*data-plus\s*=\s*["']x["']/.test(html)) {
  err("Edit #10: expected data-target=\"10\" with data-plus=\"x\"");
}

// ---- Our Services section checks (Edit #11) ----
const servicesSection = sectionById(html, "what-we-automate");
if (!servicesSection) {
  err("Edit #11: could not locate section id=\"what-we-automate\"");
} else {
  const desktop = [
    "services_consulting.jpg",
    "services_lead_followup.jpg",
    "services_workflow_automation.jpg",
    "services_data_integration.jpg",
  ];
  const mobile = [
    "services_consulting_mobile.jpg",
    "services_lead_followup_mobile.jpg",
    "services_workflow_automation_mobile.jpg",
    "services_data_integration_mobile.jpg",
  ];

  for (const img of desktop) if (!servicesSection.includes(img)) err(`Edit #11: missing desktop image ${img} in what-we-automate`);
  for (const img of mobile) if (!servicesSection.includes(img)) err(`Edit #11: missing mobile image ${img} in what-we-automate`);

  // Buttons
  const btnCount = (servicesSection.match(/class\s*=\s*["'][^"']*\bbtn\b[^"']*["']/g) || []).length;
  if (btnCount < 4) err(`Edit #11: expected 4+ buttons in what-we-automate; found ${btnCount}`);

  // Ensure old cards are gone
  const oldMarkers = ["feature-card", "card-ai-consulting", "card-lead-followup", "card-workflow-automation", "card-data-integration"];
  for (const m of oldMarkers) if (servicesSection.includes(m)) err(`Edit #11: old card marker still present in what-we-automate: ${m}`);

  // Click-to-expand affordance heuristic
  const hasHook =
    servicesSection.includes("lightbox") ||
    servicesSection.includes("data-") ||
    servicesSection.includes("expand") ||
    servicesSection.includes("click") ||
    servicesSection.includes("tap");
  if (!hasHook) warn("Edit #11: no obvious click-to-expand affordance detected in markup (manual QA must confirm).");
}

// ---- Hero CTA container check (Edit #6 support) ----
if (!html.includes('class="cta-buttons"')) {
  warn("Index: .cta-buttons container not found; CTA spacing may rely on ad-hoc margins.");
}

// Report
if (warnings.length) {
  console.warn("\nWarnings:");
  for (const w of warnings) console.warn(`- ${w}`);
}

if (errors.length) {
  console.error("\nHomepage validation FAILED:");
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
} else {
  console.log("✅ Homepage index sections validation passed.");
}
