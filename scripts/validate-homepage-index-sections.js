// FILE: scripts/validate-homepage-index-sections.js

/**
 * Validate homepage (index.html) Services + Pricing sections match the
 * approved spec in codex/HOMEPAGE_INDEX_SECTIONS_SPEC.md.
 *
 * Usage:
 *   node scripts/validate-homepage-index-sections.js
 *   node scripts/validate-homepage-index-sections.js --services-only
 *   node scripts/validate-homepage-index-sections.js --pricing-only
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function readText(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Missing file: ${relPath}`);
  }
  return fs.readFileSync(abs, "utf8");
}

function fail(msg) {
  console.error(`❌ ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`✅ ${msg}`);
}

function parseArgs(argv) {
  const args = { servicesOnly: false, pricingOnly: false };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--services-only") args.servicesOnly = true;
    else if (a === "--pricing-only") args.pricingOnly = true;
    else throw new Error(`Unknown arg: ${a}`);
  }
  if (args.servicesOnly && args.pricingOnly) {
    throw new Error("Use only one of --services-only or --pricing-only");
  }
  return args;
}

function extractCard(html, cardClass) {
  const re = new RegExp(
    `<div\\s+class="[^"]*\\b${cardClass}\\b[^"]*"[^>]*>[\\s\\S]*?<\\/div>`,
    "i"
  );
  const m = html.match(re);
  return m ? m[0] : null;
}

function validateServices(html) {
  const expected = {
    sectionTitle: "What we automate",
    sectionSubtitle:
      "Four practical ways we help UK small businesses save time, respond faster, and keep customers moving - without ripping out the tools you already use.",
    cards: [
      {
        cls: "card-ai-consulting",
        title: "AI Consulting & Readiness",
        tagline: "Get clear on what to automate first - and what to leave alone.",
        bullets: [
          "Find the highest-ROI quick wins",
          "Choose the right tools (and avoid expensive detours)",
          "Leave with a simple, prioritised roadmap",
        ],
        cta: "Book the audit",
      },
      {
        cls: "card-marketing",
        title: "Automated Lead Follow-Up",
        tagline: "Stop enquiries going cold with fast, personal follow-up.",
        bullets: [
          "Instant replies across forms, email and messaging",
          "Qualification questions that route leads correctly",
          "Follow-ups that turn interest into booked calls",
        ],
        cta: "Automate follow-up",
      },
      {
        cls: "card-workflow",
        title: "Workflow Automation & Reporting",
        tagline: "Remove manual admin and get visibility across your ops.",
        bullets: [
          "Automate repetitive tasks and handoffs",
          "Live dashboards from your existing data",
          "Reduce errors with consistent processes",
        ],
        cta: "Remove busywork",
      },
      {
        cls: "card-systems",
        title: "Systems & Data Integration",
        tagline: "Connect your tools so data flows without copy-paste.",
        bullets: [
          "Link CRM, booking, email and payments",
          "Create a single source of truth across systems",
          "Keep data clean for better decisions",
        ],
        cta: "Connect your stack",
      },
    ],
  };

  if (!html.includes(expected.sectionTitle)) {
    fail(`Services: missing section title "${expected.sectionTitle}"`);
  } else ok(`Services: section title present`);

  if (!html.includes(expected.sectionSubtitle)) {
    fail(`Services: missing section subtitle (exact match required)`);
  } else ok(`Services: section subtitle present`);

  for (const card of expected.cards) {
    const chunk = extractCard(html, card.cls);
    if (!chunk) {
      fail(`Services: missing card with class "${card.cls}"`);
      continue;
    }

    if (!chunk.includes(card.title)) fail(`Services: ${card.cls} missing title "${card.title}"`);
    else ok(`Services: ${card.cls} title OK`);

    if (!chunk.includes(card.tagline)) fail(`Services: ${card.cls} missing tagline "${card.tagline}"`);
    else ok(`Services: ${card.cls} tagline OK`);

    for (const b of card.bullets) {
      if (!chunk.includes(b)) fail(`Services: ${card.cls} missing bullet "${b}"`);
    }
    ok(`Services: ${card.cls} bullets OK`);

    if (!chunk.includes(card.cta)) fail(`Services: ${card.cls} missing CTA label "${card.cta}"`);
    else ok(`Services: ${card.cls} CTA OK`);
  }
}

function extractPricingSection(html) {
  const startIdx = html.indexOf('<section id="pricing"');
  if (startIdx === -1) return null;
  const endIdx = html.indexOf("</section>", startIdx);
  if (endIdx === -1) return null;
  return html.slice(startIdx, endIdx + "</section>".length);
}

function validatePricing(html, mode) {
  // Asset includes (root paths)
  if (!html.includes("assets/css/pricing-widget.css")) {
    fail(`Pricing: missing CSS include "assets/css/pricing-widget.css"`);
  } else ok(`Pricing: CSS include present`);

  if (!html.includes("assets/js/pricing-widget.js")) {
    fail(`Pricing: missing JS include "assets/js/pricing-widget.js"`);
  } else ok(`Pricing: JS include present`);

  // Pricing section + mounts
  const section = extractPricingSection(html);
  if (!section) {
    fail(`Pricing: missing <section id="pricing"> block`);
    return;
  }
  ok(`Pricing: section#pricing present`);

  const requiredTitle = "Transparent pricing, built as packs";
  const requiredSubtitle =
    "Clear setup + monthly support. Start with a flagship system, or pick a smaller module if you're fixing one leak first.";

  if (!section.includes(requiredTitle)) {
    fail(`Pricing: missing heading "${requiredTitle}" inside section#pricing`);
  } else ok(`Pricing: heading OK`);

  if (!section.includes(requiredSubtitle)) {
    fail(`Pricing: missing subtitle (exact match required) inside section#pricing`);
  } else ok(`Pricing: subtitle OK`);

  const mount1 = 'data-ss-pricing-page="index.html" data-ss-pricing-section="1"';
  const mount2 = 'data-ss-pricing-page="index.html" data-ss-pricing-section="2"';

  if (!section.includes(mount1)) fail(`Pricing: missing mount for section 1 with pageKey index.html`);
  else ok(`Pricing: mount section 1 OK`);

  if (!section.includes(mount2)) fail(`Pricing: missing mount for section 2 with pageKey index.html`);
  else ok(`Pricing: mount section 2 OK`);

  // Ensure old homepage pricing blocks were removed
  if (html.includes("Transparent, Affordable Pricing")) {
    fail(`Pricing: old heading "Transparent, Affordable Pricing" is still present (should be removed)`);
  } else ok(`Pricing: old heading removed`);

  if (html.includes("Popular Solutions")) {
    fail(`Pricing: old "Popular Solutions" block is still present (should be removed)`);
  } else ok(`Pricing: "Popular Solutions" removed`);

  if (html.includes('class="pricing-grid"') || html.includes("pricing-grid")) {
    fail(`Pricing: old pricing-grid markup appears to still be present (should be removed)`);
  } else ok(`Pricing: old pricing grid removed`);

  // Full-mode cross-file checks (skip in pricing-only mode)
  if (mode === "pricing-only") return;

  const pricingMd = readText("PRICING_COPY_MAP.md");
  if (!pricingMd.includes("## index.html")) {
    fail(`Pricing data: PRICING_COPY_MAP.md missing "## index.html" page block`);
  } else ok(`Pricing data: PRICING_COPY_MAP.md index.html block present`);

  const pricingJson = readText("pricing-widget/src/pricing-copy-map.json");
  if (!pricingJson.includes('"index.html"')) {
    fail(`Pricing data: pricing-widget/src/pricing-copy-map.json missing "index.html" key`);
  } else ok(`Pricing data: pricing-widget/src/pricing-copy-map.json index.html key present`);

  const constants = readText("scripts/pricing.constants.js");
  if (!constants.includes("'index.html'") && !constants.includes('"index.html"')) {
    fail(`Pricing data: scripts/pricing.constants.js missing index.html in TARGET_PAGES`);
  } else ok(`Pricing data: scripts/pricing.constants.js includes index.html`);
}

function main() {
  const args = parseArgs(process.argv);
  const html = readText("index.html");

  const mode = args.servicesOnly ? "services-only" : args.pricingOnly ? "pricing-only" : "full";

  if (mode !== "pricing-only") validateServices(html);
  if (mode !== "services-only") validatePricing(html, mode);

  if (process.exitCode) {
    console.error(`\nHomepage validation FAILED (${mode}).`);
    process.exit(1);
  } else {
    console.log(`\nHomepage validation PASSED (${mode}).`);
  }
}

try {
  main();
} catch (err) {
  console.error(`❌ ${String(err.message || err)}`);
  process.exit(1);
}
