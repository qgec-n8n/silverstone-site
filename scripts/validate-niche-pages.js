#!/usr/bin/env node

/**
 * Validate niche pages creation status, wiring, and asset references.
 *
 * Usage:
 *   node scripts/validate-niche-pages.js
 *   node scripts/validate-niche-pages.js --strict
 *
 * Checks:
 * - Expected niche HTML files exist
 * - No template instruction text leaks into niche HTML
 * - Canonical/OG URL matches expected slug
 * - Each page references the expected .webp images (desktop + mobile) from its template
 * - Services dropdown links are wired correctly (root pages vs niche pages)
 * - sitemap.xml includes niche URLs
 */

const fs = require("fs");
const path = require("path");

const strict = process.argv.includes("--strict");

const repoRoot = process.cwd();

const rootPages = [
  "index.html",
  "about.html",
  "services.html",
  "book.html",
  "contact.html",
  "privacy-policy.html",
];

const niches = [
  {
    label: "Hospitality",
    slug: "hospitality",
    template: "niche_copy_templates/Hospitality_Template.md",
    html: "niches/hospitality.html",
  },
  {
    label: "Salons & Barbers",
    slug: "salons-barbers",
    template: "niche_copy_templates/Salons_Template.md",
    html: "niches/salons-barbers.html",
  },
  {
    label: "Trades & Field Services",
    slug: "trades-virtual-office",
    template: "niche_copy_templates/Trades_Template.md",
    html: "niches/trades-virtual-office.html",
  },
  {
    label: "eCommerce Brands",
    slug: "ecommerce",
    template: "niche_copy_templates/eCommerce_Template.md",
    html: "niches/ecommerce.html",
  },
  {
    label: "Physios & Chiropractors",
    slug: "physios-chiropractors",
    template: "niche_copy_templates/Physios_Template.md",
    html: "niches/physios-chiropractors.html",
  },
  {
    label: "Dentists",
    slug: "dentists",
    template: "niche_copy_templates/Dentists_Template.md",
    html: "niches/dentists.html",
  },
  {
    label: "Gyms & Fitness Studios",
    slug: "gyms-fitness-studios",
    template: "niche_copy_templates/Gyms_Template.md",
    html: "niches/gyms-fitness-studios.html",
  },
  {
    label: "Fitness Influencers & Online Coaches",
    slug: "fitness-coaches",
    template: "niche_copy_templates/OnlineCoaches_Template.md",
    html: "niches/fitness-coaches.html",
  },
];

function readIfExists(relPath) {
  const abs = path.join(repoRoot, relPath);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, "utf8");
}

function exists(relPath) {
  return fs.existsSync(path.join(repoRoot, relPath));
}

function extractTemplateImages(md) {
  // Normalize curly quotes
  const txt = md.replace(/[“”]/g, '"');
  const re = /Image:\s*"([^"]+)"[\s\S]*?\/\s*"([^"]+)"/g;
  const pairs = [];
  let m;
  while ((m = re.exec(txt)) !== null) {
    pairs.push([m[1].trim(), m[2].trim()]);
  }
  return pairs;
}

function toWebpName(filename) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".jpeg")) return filename.slice(0, -5) + ".webp";
  if (lower.endsWith(".jpg")) return filename.slice(0, -4) + ".webp";
  if (lower.endsWith(".png")) return filename.slice(0, -4) + ".webp";
  return filename + ".webp";
}

function expectIncludes(errors, content, needle, context) {
  if (!content.includes(needle)) {
    errors.push(`Missing "${needle}" (${context})`);
  }
}

function validateNoTemplateLeak(errors, html, relPath) {
  const leaks = [
    "Codex should generate",
    "[Codex should",
    "[Note:",
    "assets/images/socialmedia folder",
  ];
  for (const s of leaks) {
    if (html.includes(s)) {
      errors.push(`Template-instruction text leaked into ${relPath}: contains "${s}"`);
    }
  }
}

function bodyHasClass(html, className) {
  const re = new RegExp(`<body[^>]*class=(['"])[^\\1]*\\b${className}\\b[^\\1]*\\1`, "i");
  return re.test(html);
}

function buildHrefMaps() {
  // Root pages link into niches/
  const rootMap = new Map();
  rootMap.set("Estate Agents", "niches/estate-agents.html");
  for (const n of niches) rootMap.set(n.label, `niches/${n.slug}.html`);

  // Niche pages link to sibling files
  const nicheMap = new Map();
  nicheMap.set("Estate Agents", "estate-agents.html");
  for (const n of niches) nicheMap.set(n.label, `${n.slug}.html`);

  return { rootMap, nicheMap };
}

function validateMenuLinks(errors, html, relPath, hrefMap) {
  for (const [label, href] of hrefMap.entries()) {
    // We check for href occurrence; robust enough for static markup.
    if (!html.includes(`href="${href}"`)) {
      errors.push(`Menu link missing or incorrect in ${relPath}: expected href="${href}" for "${label}"`);
    }
  }
}

function main() {
  const errors = [];
  const warnings = [];

  const { rootMap, nicheMap } = buildHrefMaps();

  // Validate root pages menu wiring (only if pages exist)
  for (const p of rootPages) {
    const html = readIfExists(p);
    if (!html) {
      warnings.push(`Root page missing (skipped): ${p}`);
      continue;
    }
    validateMenuLinks(errors, html, p, rootMap);
  }

  // Validate each niche page exists and matches its template images + metadata.
  for (const n of niches) {
    const tpl = readIfExists(n.template);
    if (!tpl) {
      errors.push(`Missing template file: ${n.template}`);
      continue;
    }

    const html = readIfExists(n.html);
    if (!html) {
      const msg = `Missing niche page: ${n.html}`;
      if (strict) errors.push(msg);
      else warnings.push(msg);
      continue;
    }

    validateNoTemplateLeak(errors, html, n.html);

    // Canonical + OG URL checks
    const expectedUrl = `https://silverstone-ai.com/niches/${n.slug}`;
    expectIncludes(errors, html, `rel="canonical" href="${expectedUrl}"`, `${n.html} canonical`);
    expectIncludes(errors, html, `property="og:url" content="${expectedUrl}"`, `${n.html} og:url`);

    // Body class should include page-niche
    if (!bodyHasClass(html, "page-niche")) {
      errors.push(`Body class missing page-niche in ${n.html}`);
    }

    // Template image checks: require webp references + file existence
    const pairs = extractTemplateImages(tpl);
    if (pairs.length !== 3) {
      warnings.push(`Unexpected number of image pairs in ${n.template}: ${pairs.length} (expected 3)`);
    }

    for (const [desktopJpeg, mobileJpeg] of pairs) {
      const desktopWebp = toWebpName(desktopJpeg);
      const mobileWebp = toWebpName(mobileJpeg);

      const webpDesktopPath = `../assets/images/socialmedia/${desktopWebp}`;
      const webpMobilePath = `../assets/images/socialmedia/${mobileWebp}`;

      if (!html.includes(webpDesktopPath)) {
        errors.push(`Missing desktop webp reference in ${n.html}: ${webpDesktopPath}`);
      }
      if (!html.includes(webpMobilePath)) {
        errors.push(`Missing mobile webp reference in ${n.html}: ${webpMobilePath}`);
      }

      // Ensure output files exist in repo
      const diskDesktopWebp = `assets/images/socialmedia/${desktopWebp}`;
      const diskMobileWebp = `assets/images/socialmedia/${mobileWebp}`;
      if (!exists(diskDesktopWebp)) {
        errors.push(`Missing .webp asset on disk: ${diskDesktopWebp}`);
      }
      if (!exists(diskMobileWebp)) {
        errors.push(`Missing .webp asset on disk: ${diskMobileWebp}`);
      }
    }

    // Menu wiring inside niche page should link to sibling niche pages
    validateMenuLinks(errors, html, n.html, nicheMap);
  }

  // Sitemap includes niche URLs
  const sitemap = readIfExists("sitemap.xml");
  if (!sitemap) {
    errors.push("Missing sitemap.xml");
  } else {
    for (const n of niches) {
      const expectedLoc = `<loc>https://silverstone-ai.com/niches/${n.slug}</loc>`;
      if (!sitemap.includes(expectedLoc)) {
        const msg = `sitemap.xml missing entry: ${expectedLoc}`;
        if (strict) errors.push(msg);
        else warnings.push(msg);
      }
    }
    // Also include estate agents niche in sitemap if desired (informational)
    if (!sitemap.includes("<loc>https://silverstone-ai.com/niches/estate-agents</loc>")) {
      warnings.push("sitemap.xml does not include Estate Agents niche URL (optional but recommended).");
    }
  }

  // Report
  const header = strict ? "[validate-niche-pages] STRICT" : "[validate-niche-pages] SOFT";
  console.log(`\n${header} validation results\n`);

  if (warnings.length) {
    console.log("Warnings:");
    for (const w of warnings) console.log(`- ${w}`);
    console.log("");
  }

  if (errors.length) {
    console.log("Errors:");
    for (const e of errors) console.log(`- ${e}`);
    console.log("");

    if (strict) {
      console.log(`[validate-niche-pages] FAIL (${errors.length} errors)`);
      process.exit(1);
    }
    console.log(`[validate-niche-pages] SOFT FAIL (${errors.length} errors)`);
    process.exit(0);
  }

  console.log("[validate-niche-pages] PASS");
  process.exit(0);
}

main();
