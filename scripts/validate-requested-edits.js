// FILE: scripts/validate-requested-edits.js

/**
 * Validator for the "Requested Website Edits (1–8)" Spec.
 *
 * This script is intentionally conservative: it validates for
 * presence/absence of exact phrases, required marker comments,
 * and key structural constraints that make the changes deterministic.
 *
 * Run:
 *   node scripts/validate-requested-edits.js --strict
 */

const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const strict = process.argv.includes("--strict");

let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`✗ ${message}`);
}

function ok(message) {
  console.log(`✓ ${message}`);
}

function read(relPath) {
  const abs = path.join(projectRoot, relPath);
  if (!fs.existsSync(abs)) {
    fail(`Missing file: ${relPath}`);
    return "";
  }
  return fs.readFileSync(abs, "utf8");
}

function assertIncludes(haystack, needle, message) {
  if (!haystack.includes(needle)) {
    fail(message ?? `Expected to find: ${needle}`);
  }
}

function assertNotIncludes(haystack, needle, message) {
  if (haystack.includes(needle)) {
    fail(message ?? `Expected NOT to find: ${needle}`);
  }
}

function assertRegex(haystack, regex, message) {
  if (!regex.test(haystack)) {
    fail(message ?? `Expected to match: ${regex}`);
  }
}

function assertNear(haystack, phrase, nearbyNeedle, radius, label) {
  const idx = haystack.indexOf(phrase);
  if (idx === -1) {
    fail(`Missing phrase (${label}): ${phrase}`);
    return;
  }
  const start = Math.max(0, idx - radius);
  const end = Math.min(haystack.length, idx + phrase.length + radius);
  const windowText = haystack.slice(start, end);
  if (!windowText.includes(nearbyNeedle)) {
    fail(`Expected "${label}" phrase to be near "${nearbyNeedle}" (within ±${radius} chars)`);
  }
}

function listNichePages() {
  const nichesDir = path.join(projectRoot, "niches");
  if (!fs.existsSync(nichesDir)) {
    fail("Missing niches/ directory");
    return [];
  }
  return fs
    .readdirSync(nichesDir)
    .filter((name) => name.endsWith(".html"))
    .map((name) => path.join("niches", name));
}

/* ------------------------------------------------------------ */
/* Edit 1 — Counter slowdown (about + index)                      */
/* ------------------------------------------------------------ */

function validateCounterSlowdown() {
  const statsSrc = read("src/js/stats.js");

  assertIncludes(
    statsSrc,
    "SS_STATS_SPEC: COUNTER_ANIMATION_ABOUT_INDEX_ONLY",
    "stats.js must keep the original scoping marker for .stats[data-counter=\"on\"]."
  );

  assertIncludes(
    statsSrc,
    "SS_STATS_SPEC: COUNTER_DURATION_SLOWDOWN_2600MS",
    "stats.js must include marker SS_STATS_SPEC: COUNTER_DURATION_SLOWDOWN_2600MS."
  );

  assertRegex(
    statsSrc,
    /\bconst\s+durationMs\s*=\s*2600\s*;/,
    "stats.js must set `const durationMs = 2600;` (explicit slowdown)."
  );

  const indexHtml = read("index.html");
  const aboutHtml = read("about.html");

  assertRegex(
    indexHtml,
    /<div class="stats"[^>]*data-counter="on"[\s\S]*?class="number"[\s\S]*?data-target="/,
    "index.html must contain a .stats[data-counter=\"on\"] section with .number[data-target] counters."
  );

  assertRegex(
    aboutHtml,
    /<div class="stats"[^>]*data-counter="on"[\s\S]*?class="number"[\s\S]*?data-target="/,
    "about.html must contain a .stats[data-counter=\"on\"] section with .number[data-target] counters."
  );

  const appJs = read("assets/js/app.js");
  assertIncludes(
    appJs,
    "SS_STATS_SPEC: COUNTER_DURATION_SLOWDOWN_2600MS",
    "assets/js/app.js must be rebuilt and include the counter slowdown marker."
  );

  ok("Edit 1 — Counter slowdown markers and duration validated.");
}

/* ------------------------------------------------------------ */
/* Edit 2 — index.html copy removal + page-home class            */
/* ------------------------------------------------------------ */

function validateIndexCopyAndClass() {
  const indexHtml = read("index.html");

  const sentence1 =
    "These figures are indicative industry benchmarks for automation, not guaranteed Silverstone results.";
  const sentence2 = "We’ll help you understand what’s realistic for your business.";

  assertNotIncludes(indexHtml, sentence1, "index.html must remove the first disclaimer sentence.");
  assertNotIncludes(indexHtml, sentence2, "index.html must remove the second disclaimer sentence.");

  assertRegex(
    indexHtml,
    /<body[^>]*\bpage-home\b/,
    "index.html must add body class `page-home`."
  );

  ok("Edit 2 — Index copy removal + page-home class validated.");
}

/* ------------------------------------------------------------ */
/* Edit 3 — about.html body class                                */
/* ------------------------------------------------------------ */

function validateAboutBodyClass() {
  const aboutHtml = read("about.html");
  assertRegex(
    aboutHtml,
    /<body[^>]*\bpage-about\b/,
    "about.html must add body class `page-about`."
  );
  ok("Edit 3 — About body class validated.");
}

/* ------------------------------------------------------------ */
/* Edits 2–5 — Grey→white system via silver variable override    */
/* ------------------------------------------------------------ */

function validateGreyToWhiteSystem() {
  const variablesCss = read("src/css/base/variables.css");
  assertIncludes(
    variablesCss,
    "SS_TEXT_SPEC: SILVER_ORIGINAL_TOKEN",
    "variables.css must include marker SS_TEXT_SPEC: SILVER_ORIGINAL_TOKEN."
  );
  assertRegex(
    variablesCss,
    /--color-silver-original\s*:\s*#c0c0c0\s*;/,
    "variables.css must define `--color-silver-original: #c0c0c0;`."
  );

  const layoutCss = read("src/css/base/layout.css");
  assertIncludes(
    layoutCss,
    "SS_TEXT_SPEC: SILVER_TO_WHITE_NON_CTA_SECTIONS",
    "layout.css must include marker SS_TEXT_SPEC: SILVER_TO_WHITE_NON_CTA_SECTIONS."
  );

  const requiredScopes = [
    ".page-home .section:not(.brand-gradient)",
    ".page-about .section:not(.brand-gradient)",
    ".page-services .section:not(.brand-gradient)",
    ".page-niche .section:not(.brand-gradient)",
    ".page-book .section:not(.brand-gradient)",
  ];

  requiredScopes.forEach((scope) => {
    assertIncludes(
      layoutCss,
      scope,
      `layout.css must scope the silver→white override to: ${scope}`
    );
  });

  assertIncludes(
    layoutCss,
    "--color-silver: var(--color-white)",
    "layout.css must override --color-silver to var(--color-white) inside the scoped selectors."
  );

  assertIncludes(
    layoutCss,
    "SS_TEXT_SPEC: KEEP_GREY_EXCEPTIONS",
    "layout.css must include marker SS_TEXT_SPEC: KEEP_GREY_EXCEPTIONS."
  );

  assertIncludes(
    layoutCss,
    ".page-home .proof-card .tagline",
    "layout.css must keep index proof-card taglines grey via a page-home scoped rule."
  );
  assertIncludes(
    layoutCss,
    "var(--color-silver-original)",
    "layout.css must use var(--color-silver-original) for grey keep rules."
  );

  assertIncludes(
    layoutCss,
    ".page-services .service-content p",
    "layout.css must include a services exception rule for .service-content p."
  );
  assertIncludes(
    layoutCss,
    ".page-niche .service-content p",
    "layout.css must include a niches exception rule for .service-content p."
  );

  const builtCss = read("assets/css/styles.css");
  assertIncludes(
    builtCss,
    "SS_TEXT_SPEC: SILVER_TO_WHITE_NON_CTA_SECTIONS",
    "assets/css/styles.css must be rebuilt and include the silver→white marker."
  );

  ok("Edits 2–5 — Grey→white system markers and scopes validated.");
}

/* ------------------------------------------------------------ */
/* Edit 6 — contact.html specific phrases must be white          */
/* ------------------------------------------------------------ */

function validateContactPhrasesWhite() {
  const contactHtml = read("contact.html");

  const phrase1 =
    "Share a quick overview of your situation. We’ll come back with suggestions or next steps – no spam, no pressure to commit.";
  assertIncludes(contactHtml, phrase1, "contact.html must contain the overview phrase (copy must match).");
  assertNear(contactHtml, phrase1, "color: var(--color-white)", 400, "overview");

  const addressAnchor = "Address: 4 Deacon Street";
  assertIncludes(contactHtml, addressAnchor, "contact.html must contain the address block.");
  assertIncludes(contactHtml, "SE17 1GE, London, UK", "contact.html address block must include the postcode line.");
  assertIncludes(contactHtml, "info@silverstone-ai.com", "contact.html address block must include the email text.");
  assertIncludes(
    contactHtml,
    "mailto:info@silverstone-ai.com",
    "contact.html address block must link the email via mailto:info@silverstone-ai.com."
  );
  assertNear(contactHtml, addressAnchor, "color: var(--color-white)", 500, "address");

  const social1 =
    "Immerse yourself in the Silverstone experience across our curated social channels—crafted for leaders who expect design-led intelligence, cinematic storytelling, and premium service cues at every touchpoint.";
  const social2 =
    "Follow us for prototype reveals, executive insights, and a first look at the intelligent automations shaping tomorrow’s operations.";

  assertIncludes(contactHtml, social1, "contact.html must contain the social callout paragraph (copy must match).");
  assertIncludes(contactHtml, social2, "contact.html must contain the social note paragraph (copy must match).");

  const contactCss = read("src/css/pages/contact.css");
  assertIncludes(
    contactCss,
    "SS_CONTACT_SPEC: SOCIAL_COPY_WHITE",
    "contact.css must include marker SS_CONTACT_SPEC: SOCIAL_COPY_WHITE."
  );
  assertRegex(
    contactCss,
    /\.contact-social-callout\s+p\s*\{[\s\S]*color:\s*var\(--color-white\)\s*;[\s\S]*\}/,
    "contact.css must set .contact-social-callout p to color: var(--color-white)."
  );

  const builtCss = read("assets/css/styles.css");
  assertIncludes(
    builtCss,
    "SS_CONTACT_SPEC: SOCIAL_COPY_WHITE",
    "assets/css/styles.css must be rebuilt and include the contact marker."
  );

  ok("Edit 6 — Contact phrase whitening validated.");
}

/* ------------------------------------------------------------ */
/* Edits 7–8 — Pricing widget theme + per-digit price animation  */
/* ------------------------------------------------------------ */

function validatePricingWidgetThemeAndDigits() {
  const pricingCss = read("pricing-widget/src/pricing-widget.css");
  const pricingJsx = read("pricing-widget/src/PricingWidget.jsx");

  assertIncludes(
    pricingCss,
    "SS_PRICING_SPEC: THEME_MATCH_BODY_SECTION_BACKGROUND_2025",
    "pricing-widget.css must include marker SS_PRICING_SPEC: THEME_MATCH_BODY_SECTION_BACKGROUND_2025."
  );

  assertIncludes(
    pricingCss,
    "body-section-background-2025.webp",
    "pricing-widget.css must reference body-section-background-2025.webp in the background/theme."
  );

  assertNotIncludes(
    pricingCss,
    "--ss-pricing-text: #0b0c10",
    "pricing-widget.css must not keep the old dark text token (--ss-pricing-text: #0b0c10)."
  );

  assertRegex(
    pricingCss,
    /--ss-pricing-text\s*:\s*var\(--color-white\)|--ss-pricing-text\s*:\s*#fff/i,
    "pricing-widget.css must set --ss-pricing-text to white (var(--color-white) or #fff)."
  );

  assertIncludes(
    pricingCss,
    "SS_PRICING_SPEC: SPARKLES_MORE_VISIBLE",
    "pricing-widget.css must include marker SS_PRICING_SPEC: SPARKLES_MORE_VISIBLE."
  );

  assertIncludes(
    pricingJsx,
    "SS_PRICING_SPEC: SPARKLES_MORE_VISIBLE",
    "PricingWidget.jsx must include marker SS_PRICING_SPEC: SPARKLES_MORE_VISIBLE (sparkles logic change)."
  );

  assertIncludes(
    pricingCss,
    "SS_PRICING_SPEC: PRICE_SCROLL_PER_DIGIT",
    "pricing-widget.css must include marker SS_PRICING_SPEC: PRICE_SCROLL_PER_DIGIT."
  );

  assertIncludes(
    pricingJsx,
    "SS_PRICING_SPEC: PRICE_SCROLL_PER_DIGIT",
    "PricingWidget.jsx must include marker SS_PRICING_SPEC: PRICE_SCROLL_PER_DIGIT."
  );

  assertNotIncludes(
    pricingCss,
    "SS_PRICING_SPEC: PRICE_SCROLL_ANIMATION",
    "pricing-widget.css must remove the old whole-number roll marker SS_PRICING_SPEC: PRICE_SCROLL_ANIMATION."
  );

  assertNotIncludes(
    pricingCss,
    "ss-pricing__price-roll",
    "pricing-widget.css must not contain the old .ss-pricing__price-roll styles."
  );

  assertNotIncludes(
    pricingJsx,
    "ss-pricing__price-roll",
    "PricingWidget.jsx must not reference .ss-pricing__price-roll (whole-number roll removed)."
  );

  // Built outputs must be regenerated.
  const builtCss = read("assets/css/pricing-widget.css");
  const builtJs = read("assets/js/pricing-widget.js");

  assertIncludes(
    builtCss,
    "SS_PRICING_SPEC: THEME_MATCH_BODY_SECTION_BACKGROUND_2025",
    "assets/css/pricing-widget.css must be rebuilt and include THEME_MATCH marker."
  );
  assertIncludes(
    builtCss,
    "body-section-background-2025.webp",
    "assets/css/pricing-widget.css must include the background image reference."
  );
  assertIncludes(
    builtCss,
    "SS_PRICING_SPEC: PRICE_SCROLL_PER_DIGIT",
    "assets/css/pricing-widget.css must include per-digit marker."
  );

  assertIncludes(
    builtJs,
    "SS_PRICING_SPEC: PRICE_SCROLL_PER_DIGIT",
    "assets/js/pricing-widget.js must be rebuilt and include per-digit marker."
  );

  ok("Edits 7–8 — Pricing widget theme + per-digit animation validated.");
}

/* ------------------------------------------------------------ */
/* Main                                                         */
/* ------------------------------------------------------------ */

function main() {
  // Sanity: niches exist and remain classed as page-niche.
  const nichePages = listNichePages();
  if (nichePages.length === 0) {
    fail("No niches/*.html pages found (expected at least 1).");
  } else {
    nichePages.forEach((rel) => {
      const html = read(rel);
      assertRegex(html, /<body[^>]*\bpage-niche\b/, `${rel} must keep body class page-niche.`);
      assertRegex(
        html,
        /<div class="ss-pricing"[^>]*data-ss-pricing-page="niches\//,
        `${rel} should include ss-pricing mounts with data-ss-pricing-page="niches/..."`
      );
    });
    ok(`Found and sanity-checked ${nichePages.length} niche pages.`);
  }

  validateCounterSlowdown();
  validateIndexCopyAndClass();
  validateAboutBodyClass();
  validateGreyToWhiteSystem();
  validateContactPhrasesWhite();
  validatePricingWidgetThemeAndDigits();

  if (failures > 0) {
    console.error(`\nFAILED: ${failures} check(s).`);
    process.exit(1);
  }

  if (!strict) {
    ok("All checks passed.");
  } else {
    ok("All strict checks passed.");
  }
}

main();
